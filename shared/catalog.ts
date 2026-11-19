import type { Candidate } from './domain';
export type Verdict = 'supported' | 'context' | 'contradicted' | 'pending';
export interface Proposal { topic: string; title: string; summary: string; deadline?: string; }
export interface CandidateProfile extends Candidate { proposals: readonly Proposal[]; }
export interface CivicCandidate extends CandidateProfile { group: string; initials: string; color: string; votes: number; }
export interface EvidenceSource { id: string; title: string; publisher: string; date: string; excerpt: string; url?: string; }
export interface Claim { id: string; candidateId: string; topic: string; quote: string; seconds: number; verdict: Verdict; explanation: string; sourceIds: string[]; reviewedAt: string; }
export interface Interview { candidateId: string; title: string; duration: number; youtubeId: string | null; chapters: { seconds: number; title: string }[]; }
/** An edition owns every candidate, claim, source and interview in its own scope. */
export interface TerritoryEdition { id: string; label: string; candidates: CivicCandidate[]; claims: Claim[]; sources: EvidenceSource[]; interviews: Interview[]; }
export interface Locality { id: string; name: string; region: string; country: string; editions: TerritoryEdition[]; }
/** Selected, read-only view for the existing pages; never aggregate editions implicitly. */
export interface Territory extends Omit<Locality, 'editions'>, Omit<TerritoryEdition, 'id'> { editionId: string; edition: string; }
export interface CatalogData { mode: 'demo'; territories: Locality[]; }
export const verdicts: Record<Verdict, string> = { supported: 'Respaldado', context: 'Falta contexto', contradicted: 'Contradicho', pending: 'Sin evidencia' };
export class CandidateDirectory<T extends CandidateProfile = CandidateProfile> {
  private readonly profiles: readonly T[];
  constructor(profiles: readonly T[]) { this.profiles = profiles; }
  list(): readonly T[] { return this.profiles; }
  find(id: string): T | undefined { return this.profiles.find(p => p.id === id); }
}
export class ObservatoryService {
  readonly data: CatalogData;
  constructor(data: CatalogData) { this.data = data; }
  locality(id: string): Locality | undefined { return this.data.territories.find(t => t.id === id); }
  territory(id: string, editionId = ''): Territory | undefined {
    const locality = this.locality(id);
    if (!locality) return undefined;
    const edition = editionId ? locality.editions.find(e => e.id === editionId) : locality.editions[0];
    if (!edition) return undefined;
    return { id:locality.id, name:locality.name, region:locality.region, country:locality.country,
      editionId:edition.id, edition:edition.label,
      candidates:edition.candidates, claims:edition.claims, sources:edition.sources, interviews:edition.interviews };
  }
  candidate(t: Territory, id: string) { return new CandidateDirectory(t.candidates).find(id); }
  ranking(t: Territory): CivicCandidate[] { return [...t.candidates].sort((a,b) => b.votes-a.votes || a.name.localeCompare(b.name)); }
  share(t: Territory, candidate: CivicCandidate): number { const total = t.candidates.reduce((n,c)=>n+c.votes,0); return total ? candidate.votes / total * 100 : 0; }
  claims(t: Territory, candidateId = '', verdict = '', topic = '', query = ''): Claim[] {
    const needle = query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es');
    return t.claims.filter(c => (!candidateId || c.candidateId === candidateId) && (!verdict || c.verdict === verdict) && (!topic || c.topic === topic) && (!needle || `${c.quote} ${c.explanation} ${c.topic}`.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').includes(needle)));
  }
  summary(t: Territory) { return { candidates: t.candidates.length, proposals: t.candidates.reduce((n,c)=>n+c.proposals.length,0), claims:t.claims.length, sources:t.sources.length, votes:t.candidates.reduce((n,c)=>n+c.votes,0) }; }
}
const candidates: CivicCandidate[] = [
 {id:'ana',name:'Ana Rivera',initials:'AR',group:'Proyecto Agua y Comunidad',color:'cyan',votes:1284,description:'Candidatura ficticia centrada en servicios básicos, participación y transparencia.',proposals:[{topic:'Agua y ambiente',title:'Agua con seguimiento público',summary:'Publicar un calendario de mantenimiento y un registro de incidencias por sector.',deadline:'Primeros 100 días'},{topic:'Economía local',title:'Mercados con oportunidades',summary:'Crear talleres de venta digital para artesanos y pequeños comercios.',deadline:'Primer año'},{topic:'Transparencia',title:'Presupuesto a la vista',summary:'Publicar contratos y ejecución presupuestaria en un formato comprensible.',deadline:'Trimestral'}]},
 {id:'luis',name:'Luis Mendoza',initials:'LM',group:'Proyecto Ciudad en Movimiento',color:'purple',votes:856,description:'Candidatura ficticia centrada en movilidad, economía local y espacios públicos.',proposals:[{topic:'Agua y ambiente',title:'Mapa de puntos críticos',summary:'Priorizar intervenciones de drenaje a partir de inspecciones abiertas.',deadline:'Primer semestre'},{topic:'Economía local',title:'Rutas para el comercio',summary:'Conectar mercados y zonas productivas con rutas accesibles.',deadline:'Primer año'},{topic:'Transparencia',title:'Obras con expediente',summary:'Publicar avance, coste y responsables de cada obra municipal.',deadline:'Mensual'}]},
 {id:'carla',name:'Carla Torres',initials:'CT',group:'Proyecto Futuro Compartido',color:'blue',votes:535,description:'Candidatura ficticia centrada en educación, cultura y recuperación ambiental.',proposals:[{topic:'Agua y ambiente',title:'Cuidar las fuentes de agua',summary:'Diseñar jornadas comunitarias de restauración y seguimiento de cuencas.',deadline:'Primer año'},{topic:'Economía local',title:'Escuela de emprendimiento',summary:'Acompañar proyectos de jóvenes con formación y mentoría.',deadline:'Primer semestre'},{topic:'Transparencia',title:'Asambleas con seguimiento',summary:'Publicar actas y estado de los compromisos de cada asamblea.',deadline:'Mensual'}]}
];
function territory(id: string,name: string): Locality {
 const sources: EvidenceSource[] = [
 {id:'acta-demo',title:'Acta comunitaria de ejemplo',publisher:'Archivo de demostración OTV',date:'2026-11-01',excerpt:'Documento sintético: se celebraron 12 encuentros de trabajo. No describe una actuación real.'},
 {id:'presupuesto-demo',title:'Presupuesto de ejemplo',publisher:'Archivo de demostración OTV',date:'2026-11-02',excerpt:'Documento sintético: 40 unidades de un presupuesto total de 100 corresponden a mantenimiento. No es un presupuesto municipal.'},
 {id:'obras-demo',title:'Registro de obras de ejemplo',publisher:'Archivo de demostración OTV',date:'2026-11-03',excerpt:'Documento sintético: 8 proyectos registrados; 5 finalizados y 3 en ejecución. No representa obras reales.'}
 ];
 const claims: Claim[] = candidates.flatMap((c,i)=>[
 {id:`${c.id}-encuentros`,candidateId:c.id,topic:'Transparencia',quote:'Se realizaron doce encuentros de trabajo.',seconds:75+i*15,verdict:'supported' as Verdict,explanation:'En este ejercicio, el acta sintética registra 12 encuentros. La coincidencia ilustra cómo se documenta una afirmación respaldada.',sourceIds:['acta-demo'],reviewedAt:'2026-11-19'},
 {id:`${c.id}-presupuesto`,candidateId:c.id,topic:'Agua y ambiente',quote:'Casi la mitad del presupuesto es mantenimiento.',seconds:240+i*20,verdict:'context' as Verdict,explanation:'El ejemplo asigna 40 de cada 100 unidades a mantenimiento. Debe explicarse el periodo y la definición de mantenimiento antes de compararlo.',sourceIds:['presupuesto-demo'],reviewedAt:'2026-11-19'},
 {id:`${c.id}-obras`,candidateId:c.id,topic:'Economía local',quote:'Todos los proyectos registrados están terminados.',seconds:420+i*10,verdict:'contradicted' as Verdict,explanation:'El registro sintético muestra 5 proyectos finalizados y 3 en ejecución. El total no equivale a obras terminadas.',sourceIds:['obras-demo'],reviewedAt:'2026-11-19'},
 {id:`${c.id}-impacto`,candidateId:c.id,topic:'Economía local',quote:'La iniciativa duplicó las ventas de todos los comercios.',seconds:600+i*10,verdict:'pending' as Verdict,explanation:'No se ha incorporado un estudio de ventas al ejercicio. La ausencia de evidencia no demuestra que una afirmación sea falsa.',sourceIds:[],reviewedAt:'2026-11-19'}
 ]);
 return {id,name,region:'Imbabura',country:'Ecuador',editions:[{id:'laboratorio',label:'Laboratorio ciudadano · edición de demostración',candidates:candidates.map(c=>({...c,proposals:c.proposals.map(p=>({...p}))})),claims,sources,interviews:candidates.map(c=>({candidateId:c.id,title:`Conversación de ejemplo · ${c.name}`,duration:900,youtubeId:null,chapters:[{seconds:0,title:'Presentación'},{seconds:180,title:'Servicios y ambiente'},{seconds:400,title:'Economía local'},{seconds:580,title:'Participación y rendición de cuentas'}]}))}]};
}
export const demoCatalog: CatalogData = {mode:'demo',territories:[territory('otavalo','Otavalo'),territory('ibarra','Ibarra')]};
