export interface LegalIdentity {
  controllerName: string;
  taxId: string;
  legalAddress: string;
  privacyEmail: string;
}

// Public legal identification. Replace the empty fields with verified data
// before creating a release branch; CI rejects incomplete release builds.
export const legalIdentity: LegalIdentity = {
  controllerName: '',
  taxId: '',
  legalAddress: '',
  privacyEmail: ''
};

export const legalDocument = {
  version: '1.0-draft',
  reviewedOn: '21 de noviembre de 2026',
  serviceName: 'Observatorio ciudadano OTV',
  hostingProvider: 'Cloudflare, Inc.'
} as const;

export const hasCompleteLegalIdentity = Object.values(legalIdentity).every(value => value.trim().length > 0);
