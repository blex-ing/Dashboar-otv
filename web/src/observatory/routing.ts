export type Page = 'inicio' | 'candidatos' | 'comparar' | 'verificar' | 'metodo' | 'fuentes';
export const pages: [Page,string,string][] = [['inicio','Dashboard','◈'],['candidatos','Candidaturas','◎'],['comparar','Comparar propuestas','⇄'],['verificar','Verificaciones','✓'],['metodo','Método','≡'],['fuentes','Fuentes','↗']];
export function readRoute() { const q=new URLSearchParams(location.search);return {page:(pages.some(([p])=>p===q.get('vista'))?q.get('vista'):'inicio') as Page,territory:q.get('lugar')??'otavalo',candidate:q.get('c')??'',claim:q.get('afirmacion')??''}; }
