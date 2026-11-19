import type { CatalogData, CivicCandidate, Locality, TerritoryEdition } from './catalog';

const MAX_CATALOG_CHARS = 1_000_000;
const MAX_TERRITORIES = 100;
const MAX_EDITIONS = 100;
const MAX_CANDIDATES = 200;
const MAX_CLAIMS = 10_000;
const MAX_SOURCES = 10_000;
const MAX_INTERVIEWS = 200;

type RecordValue = Record<string, unknown>;
const record = (value: unknown): value is RecordValue =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown, max = 4_000): value is string =>
  typeof value === 'string' && value.length > 0 && value.length <= max;
const identifier = (value: unknown): value is string =>
  text(value, 120) && /^[\p{L}\p{N}_-]+$/u.test(value);
const boundedArray = (value: unknown, limit: number): value is unknown[] =>
  Array.isArray(value) && value.length <= limit;
const nonNegative = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;
const finitePositive = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;
const validDate = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(value));
const unique = (values: unknown[]): boolean => new Set(values).size === values.length;
const validUrl = (value: unknown): boolean => {
  if (value === undefined) return true;
  if (!text(value, 2048)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

function candidate(value: unknown): value is CivicCandidate {
  if (!record(value) || !identifier(value.id) || !text(value.name, 250) ||
      !text(value.description) || !text(value.group, 250) ||
      !text(value.initials, 12) || !identifier(value.color) || !nonNegative(value.votes) ||
      !boundedArray(value.proposals, 500)) return false;
  return value.proposals.every(p => record(p) && text(p.topic, 250) &&
    text(p.title, 500) && text(p.summary, 8_000) &&
    (p.deadline === undefined || text(p.deadline, 250)));
}

function edition(value: unknown): value is TerritoryEdition {
  if (!record(value) || !identifier(value.id) || !text(value.label, 500) ||
      !boundedArray(value.candidates, MAX_CANDIDATES) ||
      !boundedArray(value.claims, MAX_CLAIMS) || !boundedArray(value.sources, MAX_SOURCES) ||
      !boundedArray(value.interviews, MAX_INTERVIEWS)) return false;

  if (!value.candidates.every(candidate) ||
      !unique(value.candidates.map(c => (c as CivicCandidate).id))) return false;
  const candidateIds = new Set(value.candidates.map(c => (c as CivicCandidate).id));

  if (!value.sources.every(s => record(s) && identifier(s.id) && text(s.title, 500) &&
      text(s.publisher, 500) && validDate(s.date) && text(s.excerpt, 8_000) &&
      validUrl(s.url)) || !unique(value.sources.map(s => (s as RecordValue).id))) return false;
  const sourceIds = new Set(value.sources.map(s => (s as RecordValue).id));

  if (!value.claims.every(c => record(c) && identifier(c.id) &&
      identifier(c.candidateId) && candidateIds.has(c.candidateId) &&
      text(c.topic, 250) && text(c.quote, 8_000) &&
      nonNegative(c.seconds) && Number.isInteger(c.seconds) &&
      ['supported', 'context', 'contradicted', 'pending'].includes(String(c.verdict)) &&
      text(c.explanation, 8_000) && validDate(c.reviewedAt) &&
      boundedArray(c.sourceIds, 100) &&
      c.sourceIds.every(id => identifier(id) && sourceIds.has(id)) &&
      unique(c.sourceIds)) || !unique(value.claims.map(c => (c as RecordValue).id))) return false;

  if (!value.interviews.every(i => record(i) && identifier(i.candidateId) &&
      candidateIds.has(i.candidateId) && text(i.title, 500) &&
      finitePositive(i.duration) && Number.isInteger(i.duration) &&
      (i.youtubeId === null || (text(i.youtubeId, 50) && /^[\w-]+$/.test(i.youtubeId))) &&
      boundedArray(i.chapters, 500) &&
      i.chapters.every(ch => record(ch) && nonNegative(ch.seconds) &&
        Number.isInteger(ch.seconds) && ch.seconds <= (i.duration as number) && text(ch.title, 500))) ||
      !unique(value.interviews.map(i => (i as RecordValue).candidateId))) return false;

  const durations = new Map(value.interviews.map(i => {
    const entry = i as {candidateId: string; duration: number};
    return [entry.candidateId, entry.duration];
  }));
  return value.claims.every(c => {
    const claim = c as {candidateId: string; seconds: number};
    const duration = durations.get(claim.candidateId);
    return duration !== undefined && claim.seconds <= duration;
  });
}

function locality(value: unknown): value is Locality {
  return record(value) && identifier(value.id) && text(value.name, 250) &&
    text(value.region, 250) && text(value.country, 250) &&
    boundedArray(value.editions, MAX_EDITIONS) && value.editions.length > 0 &&
    value.editions.every(edition) &&
    unique(value.editions.map(e => (e as TerritoryEdition).id));
}

/** The API is untrusted even when its TypeScript source shares the same interfaces. */
export function parseCatalog(value: unknown): CatalogData {
  if (!record(value) || value.mode !== 'demo' ||
      !boundedArray(value.territories, MAX_TERRITORIES) ||
      value.territories.length === 0 ||
      !value.territories.every(locality) ||
      !unique(value.territories.map(t => (t as Locality).id))) {
    throw new Error('INVALID_CATALOG');
  }
  return value as unknown as CatalogData;
}

/** Cap response size before parsing to protect memory and render on unbounded inputs. */
export async function fetchCatalog(signal: AbortSignal): Promise<CatalogData> {
  const response = await fetch('/api/public/catalog', {signal});
  if (!response.ok) throw new Error('CATALOG_UNAVAILABLE');
  const headerLength = Number(response.headers.get('content-length'));
  if (headerLength > MAX_CATALOG_CHARS) throw new Error('CATALOG_TOO_LARGE');
  const reader = response.body?.getReader();
  if (!reader) throw new Error('INVALID_CATALOG');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_CATALOG_CHARS) {
        await reader.cancel();
        throw new Error('CATALOG_TOO_LARGE');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return parseCatalog(JSON.parse(new TextDecoder('utf-8', {fatal:true}).decode(bytes)));
}
