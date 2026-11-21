/**
 * Evidence-led electoral directory. This is NOT the fictional catalog used by
 * ObservatoryService. Keep all candidates equally represented and do not
 * publish unreviewed claims, policy scores or support figures here.
 */
export interface ElectoralSource {
  id: string;
  title: string;
  publisher: string;
  publishedOn: string;
  url: string;
  kind: 'official-directory' | 'journalism';
}
export interface ElectoralCandidate {
  id: string;
  name: string;
  organisation: string;
  sourceIds: readonly string[];
  programmeStatus: 'pending-primary-review';
}
export const otavaloElection = {
  id: 'otavalo-alcaldia-2026',
  place: 'Otavalo, Imbabura, Ecuador',
  office: 'Alcaldía de Otavalo',
  electionDate: '2026-11-29',
  term: '2027–2031',
  reviewedOn: '2026-11-21',
  sources: [
    {
      id: 'cne-voto-informado',
      title: 'Voto Informado — candidaturas y planes de trabajo',
      publisher: 'Consejo Nacional Electoral de Ecuador',
      publishedOn: '2026-10-31',
      url: 'https://votoinformado.cne.gob.ec/',
      kind: 'official-directory'
    },
    {
      id: 'la-hora-2026-11-06',
      title: 'Seis candidatos buscan llegar a la Alcaldía de Otavalo',
      publisher: 'La Hora',
      publishedOn: '2026-11-06',
      url: 'https://www.lahora.com.ec/imbaburacarchi/elecciones-seccionales-2026-seis-candidatos-buscan-llegar-a-la-alcaldia-de-otavalo-20261106-0030.html',
      kind: 'journalism'
    },
    {
      id: 'el-norte-2026-11-19',
      title: 'Seis aspirantes a la alcaldía de Otavalo',
      publisher: 'Diario El Norte',
      publishedOn: '2026-11-19',
      url: 'https://elnorte.ec/seis-aspirantes-a-la-alcaldia-de-otavalo/',
      kind: 'journalism'
    }
  ] satisfies ElectoralSource[],
  /** Alphabetical order: NEVER rank people by party, coverage or unverified popularity. */
  candidates: [
    {id:'franklin-hermosa', name:'Franklin Hermosa', organisation:'Alianza Futuro', sourceIds:['la-hora-2026-11-06','el-norte-2026-11-19'],programmeStatus:'pending-primary-review'},
    {id:'jorge-luis-morocho', name:'Jorge Luis Morocho', organisation:'Todos Somos Uno', sourceIds:['la-hora-2026-11-06','el-norte-2026-11-19'],programmeStatus:'pending-primary-review'},
    {id:'juan-carlos-lema', name:'Juan Carlos Lema Conejo', organisation:'Somos Libres en Unidad', sourceIds:['la-hora-2026-11-06','el-norte-2026-11-19'],programmeStatus:'pending-primary-review'},
    {id:'karen-guerron', name:'Karen Daniela Guerrón Valencia', organisation:'Acción Democrática Nacional (ADN)', sourceIds:['la-hora-2026-11-06','el-norte-2026-11-19'],programmeStatus:'pending-primary-review'},
    {id:'lourdes-alta-lima', name:'Lourdes Marisol Alta Lima', organisation:'Avanza–Minga', sourceIds:['la-hora-2026-11-06','el-norte-2026-11-19'],programmeStatus:'pending-primary-review'},
    {id:'tupac-amaru-anrango', name:'Tupac Amaru Anrango', organisation:'Pachakutik', sourceIds:['la-hora-2026-11-06','el-norte-2026-11-19'],programmeStatus:'pending-primary-review'}
  ] satisfies ElectoralCandidate[]
} as const;
