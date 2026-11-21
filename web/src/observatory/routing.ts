export type Page = 'inicio' | 'candidatos' | 'comparar' | 'verificar' | 'metodo' | 'fuentes' | 'aviso-legal' | 'privacidad' | 'cookies';
export const pages: [Page,string,string][] = [['inicio','Dashboard','◈'],['candidatos','Candidaturas','◎'],['comparar','Comparar propuestas','⇄'],['verificar','Verificaciones','✓'],['metodo','Método','≡'],['fuentes','Fuentes','↗']];
export const legalPages: Page[] = ['aviso-legal','privacidad','cookies'];
export interface Route {page: Page; territory: string; edition: string; candidate: string; claim: string}
export function readRoute(search = location.search): Route {
 const q = new URLSearchParams(search);
 const page = q.get('vista');
 return { page: [...pages.map(([p])=>p),...legalPages].includes(page as Page) ? page as Page : 'inicio',
  territory:q.get('lugar') ?? 'otavalo', edition:q.get('edicion') ?? '',
  candidate:q.get('c') ?? '', claim:q.get('afirmacion') ?? '' };
}
export function routeHref(route: Route): string {
 const query = new URLSearchParams({lugar:route.territory, vista:route.page});
 if (route.edition) query.set('edicion',route.edition);
 if (route.candidate) query.set('c',route.candidate);
 if (route.claim) query.set('afirmacion',route.claim);
 return `?${query}`;
}
