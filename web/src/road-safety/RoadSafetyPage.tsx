import './road-safety.css';
import {useState} from 'react';
import {roadSafetyCase} from '../../../shared/road-safety-e35';
import {roadSafetySupplement} from '../../../shared/road-safety-supplement';
import {SafetyDiagram} from './SafetyDiagram';
import {SafetyPhotos} from './SafetyPhotos';
import {SafetyRisks,SafetyField,SafetySources} from './SafetyPanels';
import {useEvidenceAlbum} from './useEvidenceAlbum';

type Tab='resumen'|'fotografias'|'riesgos'|'campo'|'fuentes';
const tabs:{id:Tab;label:string;accessible:string}[]=[
 {id:'resumen',label:'Resumen',accessible:'Resumen'},
 {id:'fotografias',label:'Evidencias',accessible:'Fotografías (10)'},
 {id:'riesgos',label:'Riesgos',accessible:'Riesgos (7)'},
 {id:'campo',label:'Trabajo de campo',accessible:'Inspección de campo'},
 {id:'fuentes',label:'Fuentes',accessible:'Siniestros y fuentes'}
];
const coords='0.2090241, -78.2503891';

function SafetyLocationCard(){
 const [copied,setCopied]=useState(false);
 async function copy(){
  try{await navigator.clipboard.writeText(coords);setCopied(true);}
  catch{window.prompt('Copia las coordenadas',coords);}
 }
 return <aside className="safety-location-card">
  <span className="safety-location-pin" aria-hidden="true">📍</span>
  <h2>Semáforo de Eugenio Espejo</h2>
  <p>Carretera Panamericana E35 · Cantón Otavalo · Imbabura, Ecuador</p>
  <div className="safety-coordinate-readout"><code>0.2090241, -78.2503891</code><small>Ubicación aproximada de Maps</small></div>
  <div className="safety-action-row"><a className="safety-secondary-action" href={roadSafetyCase.location.mapsUrl} target="_blank" rel="noopener noreferrer">Abrir ubicación ↗</a><button className="safety-secondary-action" type="button" onClick={()=>void copy()}>{copied?'Coordenadas copiadas':'Copiar coordenadas'}</button></div>
 </aside>;
}
function SafetyOverview({onTab,onRisk,photoUrl,count}:{onTab:(tab:Tab)=>void;onRisk:(id:string)=>void;photoUrl?:string;count:number}){
 return <div className="safety-overview">
  <section className="safety-hero" aria-labelledby="safety-main-title">
   <div><p className="eyebrow">EXPEDIENTE DE SEGURIDAD VIAL · ACTUALIZACIÓN 2026</p>
    <h1 id="safety-main-title" aria-label="Seguridad vial: E35 · Una vía rápida. Una comunidad a ambos lados.">Una vía rápida.<br/><span>Una comunidad a ambos lados.</span></h1>
    <p>Reconstrucción documental del cruce semaforizado de la Panamericana E35 en Eugenio Espejo. Primera fase: entender el estado visible antes de diseñar intervenciones.</p>
    <div className="safety-pill-row"><span className="safety-pill highlighted">● Estudio preliminar</span><span className="safety-pill">Street View · feb/mar 2025</span><span className="safety-pill">Actualidad 2026: por verificar</span></div>
    <div className="safety-action-row"><button type="button" className="primary safety-action" onClick={()=>onTab('fotografias')}>Explorar fotografías ↗</button><button className="safety-secondary-action" type="button" onClick={()=>onTab('riesgos')}>Ver hipótesis de riesgo</button></div>
   </div><SafetyLocationCard/>
  </section>
  <section className="safety-metrics" aria-label="Resumen documental"><div><strong>{count}</strong><span>Capturas reunidas</span></div><div><strong>{roadSafetyCase.risks.length}</strong><span>Aspectos a investigar</span></div><div><strong>4</strong><span>Fuentes de contexto (más 2 noticias de 2026)</span></div><div><strong>{roadSafetySupplement.technicalMeasurements}</strong><span>Mediciones técnicas realizadas</span></div></section>
  <div className="safety-heading-row"><div><h2>Estado visual identificado</h2><p>Observaciones directas realizadas a partir de las imágenes aportadas.</p></div><button type="button" className="safety-secondary-action" onClick={()=>onTab('fotografias')}>Abrir archivo fotográfico</button></div>
  <section className="safety-overview-two">
   <div className="safety-overview-photo">
    <div className="safety-overview-image">{photoUrl?<img src={photoUrl} alt="Captura F10 de la intersección importada desde el expediente del usuario"/>:<div className="safety-overview-photo-unavailable"><span>🚦</span><strong>Intersección E35 · imagen disponible en el expediente local</strong><p>Importa el JSON del paquete para visualizar aquí la fotografía F10 de Street View.</p></div>}
     <div className="safety-overview-caption"><strong>Intersección E35 · punto bajo estudio</strong><small>Captura de Street View · febrero de 2025 · F10</small></div></div>
    <div className="safety-pill-row safety-photo-tags"><span>🚦 Intersección semaforizada</span><span>🚶 Pasarela elevada</span><span>🚌 Transporte colectivo</span><span>🏘 Entorno habitado</span></div>
   </div>
   <aside className="safety-observation-panel"><h3>Cinco elementos visibles</h3><ol>{roadSafetySupplement.visibleObservations.map((item,index)=><li key={item.title} data-visible-observation><span className="safety-round-number">{index+1}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div></li>)}</ol></aside>
  </section>
  <div className="safety-heading-row"><div><h2>Lectura simplificada del espacio</h2><p>Esquema conceptual; no representa dimensiones, norte, fases ni movimientos autorizados.</p></div></div>
  <div className="safety-diagram-two"><SafetyDiagram/><aside className="safety-diagram-note">
   <p className="eyebrow">LECTURA DEL CRUCE</p><h3>Qué necesitamos comprender</h3><p>El posible riesgo no depende solo de tener semáforos. También importa cómo se aproximan los vehículos, cómo cruzan los vecinos y si la pasarela resulta una alternativa segura y accesible.</p>
   <div className="safety-risk-shortcuts">{[['R01','🚦 Visibilidad'],['R02','🚶 Peatones'],['R03','↪ Giros'],['R04','🌉 Pasarela']].map(([id,title])=><button key={id} type="button" onClick={()=>onRisk(id)}>{title}</button>)}</div>
   <p className="safety-warning">Las fotos son de 2025. Ningún punto se califica como incumplimiento normativo sin inspección y verificación técnica.</p>
  </aside></div>
  <p className="safety-legal-note"><strong>No es una valoración técnica definitiva.</strong> {roadSafetyCase.disclaimer} El choque del 30 de octubre de 2026 está documentado como colisión entre vehículos en la zona, no como atropello peatonal confirmado en el semáforo.</p>
 </div>;
}
/** RF33–41: integrated documentary module, scoped under OTV's existing routing and shell. */
export function RoadSafetyPage(){
 const [tab,setTab]=useState<Tab>('resumen');
 const [photoFilter,setPhotoFilter]=useState('Todas');
 const [riskFilter,setRiskFilter]=useState('Todos');
 const [openPhotoId,setOpenPhotoId]=useState<string|null>(null);
 const [checked,setChecked]=useState<string[]>([]);
 const evidence=useEvidenceAlbum(ids=>{if(ids.length)setChecked(ids);});
 function openRisk(id:string){
  const group=roadSafetySupplement.topics.find(r=>r.id===id)?.group;
  setRiskFilter(group??'Todos');setTab('riesgos');
 }
 function openRelated(id:string){
  setPhotoFilter('Todas');setOpenPhotoId(id);setTab('fotografias');
 }
 return <div className="road-safety-page safety-demo-page">
  <header className="safety-section-header"><div className="safety-section-brand"><span>E35</span><div><strong>OBSERVATORIO VIAL</strong><small>Eugenio Espejo · Otavalo</small></div></div><a href={roadSafetyCase.location.mapsUrl} target="_blank" rel="noopener noreferrer">↗ Ver en Maps</a></header>
  <nav className="safety-demo-tabs" aria-label="Apartados de seguridad vial">{tabs.map(item=><button type="button" key={item.id} aria-pressed={tab===item.id} aria-label={item.accessible} onClick={()=>{setTab(item.id);setOpenPhotoId(null);}}>{item.label}</button>)}</nav>
  {tab==='resumen'&&<SafetyOverview onTab={setTab} onRisk={openRisk} count={10+evidence.album.extras.length} photoUrl={evidence.album.overlays.F10}/>}
  {tab==='fotografias'&&<SafetyPhotos album={evidence.album} checked={checked} filter={photoFilter} onFilter={setPhotoFilter} openId={openPhotoId} onOpen={setOpenPhotoId} onImport={evidence.importFile} onAdd={evidence.addPhoto} saveEnabled={evidence.saveEnabled} onSaveEnabled={evidence.enableLocalSave} onClear={evidence.clearUserPhotos} notice={evidence.notice}/>}
  {tab==='riesgos'&&<SafetyRisks filter={riskFilter} onFilter={setRiskFilter} onOpenEvidence={openRelated}/>}
  {tab==='campo'&&<SafetyField checked={checked} onChecked={setChecked}/>}
  {tab==='fuentes'&&<SafetySources/>}
 </div>;
}
