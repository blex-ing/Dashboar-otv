import {useState} from 'react';
import {roadSafetyCase} from '../../../shared/road-safety-e35';
import {PageHeading} from '../observatory/common';

type Tab = 'resumen'|'fotografias'|'riesgos'|'siniestros'|'campo';
const tabs: [Tab,string][] = [['resumen','Resumen'],['fotografias','Fotografías (10)'],['riesgos','Riesgos (7)'],['siniestros','Siniestros y fuentes'],['campo','Inspección de campo']];
const categories = ['Todas','Plano','Semáforos','Vehículos','Peatones','Calzada'];

function RoadScheme(){
 return <div className="road-safety-scheme" aria-label="Croquis conceptual no a escala, no representa la geometría exacta">
  <svg role="img" aria-labelledby="road-scheme-title road-scheme-desc" viewBox="0 0 600 276">
   <title id="road-scheme-title">Diagrama conceptual del cruce de la Panamericana E35 y su acceso local</title>
   <desc id="road-scheme-desc">Calzada principal horizontal con mediana, conexión local, semáforos y puente peatonal esquemático. Las posiciones no son mediciones.</desc>
   <rect width="600" height="276" rx="15" fill="#0b1827"/>
   <rect x="0" y="84" width="600" height="116" fill="#293a4b"/>
   <rect x="272" y="0" width="58" height="276" fill="#314456"/>
   <rect x="0" y="139" width="272" height="7" fill="#182536"/>
   <rect x="330" y="139" width="270" height="7" fill="#182536"/>
   <path d="M0 104 H270 M330 104 H600 M0 181 H270 M330 181 H600" stroke="#bad8dc" strokeDasharray="28 14" strokeWidth="2"/>
   <rect x="255" y="17" width="90" height="29" rx="6" fill="#143831" stroke="#5ae0cf"/>
   <text x="300" y="36" textAnchor="middle" fontSize="12" fill="#b6fff2">ACCESO LOCAL</text>
   <rect x="245" y="82" width="109" height="115" rx="7" fill="none" stroke="#72b6ff" strokeDasharray="5 7" strokeWidth="3"/>
   <circle cx="255" cy="78" r="9" fill="#111e2d" stroke="#a9b4c2"/><circle cx="255" cy="78" r="4" fill="#efb454"/>
   <circle cx="344" cy="205" r="9" fill="#111e2d" stroke="#a9b4c2"/><circle cx="344" cy="205" r="4" fill="#efb454"/>
   <path d="M82 74 V210" stroke="#62e2cf" strokeWidth="9" opacity=".9"/>
   <rect x="59" y="73" width="46" height="26" rx="7" fill="#143831" stroke="#62e2cf"/>
   <text x="82" y="91" fontSize="11" textAnchor="middle" fill="#d6fff5">PUENTE</text>
   <text x="178" y="130" textAnchor="middle" fontSize="14" fill="#f2f5f8">E35</text>
   <text x="460" y="165" textAnchor="middle" fontSize="14" fill="#f2f5f8">PANAMERICANA</text>
   <text x="300" y="255" textAnchor="middle" fontSize="12" fill="#92a6bc">CROQUIS ORIENTATIVO · SIN ESCALA</text>
  </svg>
  <p className="subtle">Esquema explicativo; la posición de carriles, puente y semáforos es simbólica. <a href={roadSafetyCase.location.mapsUrl} target="_blank" rel="noopener noreferrer">Contrastar en Google Maps ↗</a></p>
 </div>;
}

function PhotoCards(){
 const [category,setCategory]=useState('Todas');
 const filtered=roadSafetyCase.photos.filter(p=>category==='Todas'||p.category===category);
 return <section className="road-safety-content" aria-label="Archivo de observaciones de las diez capturas">
  <div className="road-safety-section-intro"><h2>Archivo fotográfico · observaciones de 2025</h2><p>Se han catalogado las diez imágenes originales aportadas por el usuario. Cada entrada distingue lo que se observa de lo que falta comprobar presencialmente.</p></div>
  <div className="road-safety-controls"><label>Filtrar fotografías <select value={category} onChange={event=>setCategory(event.target.value)}>{categories.map(value=><option value={value} key={value}>{value}</option>)}</select></label><span role="status">{filtered.length} de {roadSafetyCase.photos.length} evidencias</span></div>
  <div className="road-safety-grid">{filtered.map(photo=><article className="panel road-safety-photo" data-evidence-id={photo.id} key={photo.id}>
   <div className="road-safety-photo-symbol" aria-hidden="true"><span>{photo.id}</span><strong>{photo.category==='Semáforos'?'🚦':photo.category==='Peatones'?'🚶':photo.category==='Vehículos'?'🚌':photo.category==='Calzada'?'🛣':'🗺'}</strong><small>CAPTURA CATALOGADA</small></div>
   <span className="tiny">{photo.category.toUpperCase()} · {photo.date}</span>
   <h3>{photo.title}</h3><p><strong>Observación:</strong> {photo.observed}</p>
   <details><summary>Qué hay que comprobar</summary><p>{photo.verify}</p></details>
   <p className="road-safety-source">{photo.id} · {photo.source}</p>
  </article>)}</div>
  <aside className="panel road-safety-note"><strong>Derechos y procedencia de las imágenes</strong><p>{roadSafetyCase.imagesPolicy}</p><a href={roadSafetyCase.location.mapsUrl} target="_blank" rel="noopener noreferrer">Ver las imágenes en Google Maps ↗</a></aside>
 </section>;
}

function RiskCards(){
 return <section className="road-safety-content"><div className="road-safety-section-intro"><h2>Siete líneas de investigación, no siete riesgos medidos</h2><p>La prioridad es el orden de inspección recomendado para recabar pruebas, no una clasificación técnica de probabilidad de accidentes.</p></div>
 <div className="road-safety-grid">{roadSafetyCase.risks.map(risk=><article className="panel road-safety-risk" data-risk-id={risk.id} key={risk.id}>
  <div className="road-safety-meta"><span className="tiny">{risk.id} · LÍNEA DE ESTUDIO</span><span className="road-safety-priority">Revisión: {risk.priority}</span></div>
  <h3>{risk.title}</h3><p>{risk.description}</p><div className="road-safety-check"><strong>Comprobación necesaria</strong><p>{risk.check}</p></div>
  <span className="road-safety-source">Evidencias: {risk.photoIds.length?risk.photoIds.join(', '):'fotografía adicional pendiente'}</span>
 </article>)}</div></section>;
}

function IncidentTimeline(){
 return <section className="road-safety-content"><div className="road-safety-section-intro"><h2>Siniestros documentados y avisos pendientes</h2><p>Un antecedente periodístico no equivale a un informe de investigación de tránsito. Las cifras aquí indicadas NO constituyen la siniestralidad total de la intersección.</p></div>
 <div className="road-safety-timeline">{roadSafetyCase.incidents.map(incident=><article className="panel road-safety-event" key={incident.id}>
  <p className="eyebrow">{incident.displayDate} · {incident.status==='testimonio_pendiente'?'TESTIMONIO PENDIENTE':incident.status==='prensa_historica'?'ANTECEDENTE HISTÓRICO':'DOCUMENTADO EN PRENSA'}</p>
  <h3>{incident.title}</h3><p>{incident.summary}</p>
  {incident.fatalities!==null&&<p className="road-safety-incident-count"><strong>{incident.fatalities} fallecidos · {incident.injured} herido</strong> · Reporte periodístico de la zona; sin georreferencia oficial del punto exacto.</p>}
  <p className="subtle">Ubicación exacta del semáforo: {incident.exactJunctionConfirmed?'referida en la noticia; sin pericia causal':'no confirmada'}.</p>
  {incident.sources.length>0?<div className="road-safety-sources">{incident.sources.map((source,i)=><a key={source} href={source} target="_blank" rel="noopener noreferrer">Consultar fuente {i+1} ↗</a>)}</div>:<p className="subtle">Sin fuente independiente identificada. Se requiere parte oficial o noticia verificable.</p>}
 </article>)}</div>
 <div className="panel road-safety-note"><h3>Documentación prioritaria a solicitar</h3><p>Partes oficiales de tránsito y croquis; ubicación concreta del choque de octubre de 2026; fases semafóricas, velocidades reales, aforos, datos sobre atropellos y evaluación de accesibilidad de la pasarela.</p></div>
 </section>;
}

function FieldChecklist(){
 const [done,setDone]=useState<string[]>([]);
 return <section className="road-safety-content"><div className="road-safety-section-intro"><h2>Lista para la próxima inspección</h2><p>Lista de comprobación temporal. No se envía información al servidor ni se guardan elecciones en el navegador: al recargar se reinicia.</p><p role="status">{done.length} de {roadSafetyCase.checklist.length} tareas marcadas en esta sesión.</p></div>
 <div className="panel road-safety-checklist">{roadSafetyCase.checklist.map(item=><label key={item.id} className="road-safety-task"><input type="checkbox" checked={done.includes(item.id)} onChange={event=>setDone(previous=>event.target.checked?[...previous,item.id]:previous.filter(id=>id!==item.id))}/><span>{item.title}</span></label>)}</div>
 <p className="road-safety-alert">Recoger fotografías y vídeos solo desde zonas seguras. Nunca entrar a la calzada ni distraer a conductores para realizar el estudio.</p>
 </section>;
}

/** RF33–RF36. Documental de solo lectura, sin dependencia del catálogo electoral ni persistencia. */
export function RoadSafetyPage(){
 const [tab,setTab]=useState<Tab>('resumen');
 return <div className="road-safety-page">
  <PageHeading eyebrow="OBSERVATORIO CIUDADANO · SEGURIDAD VIAL · OTAVALO" title="Seguridad vial: E35 · Eugenio Espejo" text="Expediente visual preliminar del acceso a la parroquia Eugenio Espejo en la Panamericana, con fuentes contrastables y dudas explícitas."/>
  <div className="road-safety-hero panel">
   <div><p className="eyebrow">ESTUDIO DOCUMENTAL · ACTUALIZADO 23/11/2026</p><h2>Comprender el cruce antes de proponer cambios</h2><p>Fotografías de 2025, noticias históricas y un siniestro con víctimas mortales en octubre de 2026 justifican estudiar el punto. <strong>No es una valoración técnica definitiva.</strong></p>
   <a className="primary road-safety-maplink" href={roadSafetyCase.location.mapsUrl} target="_blank" rel="noopener noreferrer">Abrir ubicación en Google Maps ↗</a></div>
   <div className="road-safety-location"><span className="tiny">LOCALIZACIÓN APROXIMADA</span><strong>Otavalo, Imbabura · Ecuador</strong><span>0.2090241, −78.2503891</span></div>
  </div>
  <nav className="road-safety-tabs" aria-label="Apartados de seguridad vial">{tabs.map(([id,label])=><button key={id} type="button" aria-pressed={tab===id} onClick={()=>setTab(id)}>{label}</button>)}</nav>
  {tab==='resumen'&&<div className="road-safety-content">
   <div className="road-safety-stats"><div><strong>10</strong><span>Capturas de 2025</span></div><div><strong>7</strong><span>Cuestiones de estudio</span></div><div><strong>2026</strong><span>Siniestro mortal reciente en la zona</span></div><div><strong>Sin datos</strong><span>Aforos y fases oficiales</span></div></div>
   <RoadScheme/>
   <section className="panel road-safety-note"><h2>Qué sabemos y qué todavía no</h2><p>Las imágenes muestran una E35 de varios carriles, cruce semaforizado, paso lateral, puente peatonal, comercios, autobuses y pavimento con fisuras visibles. No permiten conocer el comportamiento del tráfico de 2026.</p><p>El 30/10/2026 hubo una <strong>colisión entre vehículos</strong> en el sector Eugenio Espejo, reportada con tres fallecidos y una persona herida. No hay prueba en este expediente de que fuera un atropello de peatones ni de que ocurriera exactamente sobre el semáforo.</p></section>
   <p className="subtle">{roadSafetyCase.disclaimer}</p>
  </div>}
  {tab==='fotografias'&&<PhotoCards/>}
  {tab==='riesgos'&&<RiskCards/>}
  {tab==='siniestros'&&<IncidentTimeline/>}
  {tab==='campo'&&<FieldChecklist/>}
 </div>;
}
