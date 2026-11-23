export interface LegalIdentity {
  controllerName: string;
  legalNature: string;
  country: string;
  taxStatus: string;
  addressStatus: string;
  privacyEmail: string;
  nonprofit: boolean;
}

export const legalIdentity: LegalIdentity = {
  controllerName: 'Ali Tio Tech',
  legalNature: 'Proyecto ciudadano sin personalidad jurídica societaria declarada',
  country: 'Ecuador',
  taxStatus: 'Sin NIF/CIF español; proyecto no constituido como sociedad',
  addressStatus: 'Domicilio particular no publicado; contacto efectivo por correo electrónico',
  privacyEmail: 'ali_tio@outlook.com',
  nonprofit: true
};

export const legalDocument = {
  version: '1.1',
  reviewedOn: '23 de noviembre de 2026',
  serviceName: 'Observatorio ciudadano OTV',
  hostingProvider: 'Cloudflare, Inc.'
} as const;

export const hasCompleteLegalIdentity = Object.entries(legalIdentity).every(([,value]) => typeof value === 'boolean' || value.trim().length > 0);
