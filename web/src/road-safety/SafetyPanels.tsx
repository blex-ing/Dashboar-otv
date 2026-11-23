import {roadSafetyCase} from '../../../shared/road-safety-e35';
import {roadSafetySupplement} from '../../../shared/road-safety-supplement';
import {downloadEvidenceJson} from './evidence-data';

const groups=['Todos','Intersección','Peatones','Vehículos','Calzada','Entorno'];
export function SafetyRisks({filter,onFilter,onOpenEvidence}:{filter:string;onFilter:(value:string)=>void;onOpenEvidence:(id:string)=>void}){
 const group=(id:string)=>roadSafetySupplement.topics.find(item=>item.id===id);
 const risks=roadSafetyCase.risks.filter(r=>filter==='Todos'||group(r.id)?.group===filter);
 return <section className="road-safety-content">
  <div className="safety-heading-row"><div><p className="eyebrow">HIPÓTESIS Y CONTROL DE EVIDENCIA</p><h2>Matriz preliminar de riesgos</h2><p>Prioridad de investigación, no probabilidad de accidentes ni incumplimiento demostrado.</p></div>
   <label>Filtrar riesgos<select aria-label="Filtrar riesgos" value={filter} onChange={event=>onFilter(event.target.value)}>{groups.map(g=><option key={g}>{g}</option>)}</select></label>
  </div>
  <div className="safety-risk-grid">{risks.map(risk=><article className="safety-risk-card" key={risk.id} data-risk-id={risk.id}>
   <div className="safety-risk-top"><span className="eyebrow">{risk.id} · {group(risk.id)?.group}</span><span className="safety-priority">{risk.priority}</span></div>
   <h3>{risk.title}</h3><p className="safety-risk-status">{group(risk.id)?.status}</p><p>{risk.description}</p>
   <div className="safety-risk-next"><strong>Comprobación requerida</strong><p>{risk.check}</p></div>
   <button className="safety-text-action" type="button" onClick={()=>onOpenEvidence(risk.photoIds[0]??'F10')}>Ver evidencias relacionadas ({risk.photoIds.length}) →</button>
  </article>)}</div>
  <p className="safety-legal-note">«Alta» y «Media» son prioridades de estudio, no niveles de probabilidad. Faltan partes oficiales, aforos, velocidades, visibilidad nocturna y análisis de accesibilidad.</p>
 </section>;
}
export function SafetyField({checked,onChecked}:{checked:string[];onChecked:(ids:string[])=>void}){
 const checks=roadSafetyCase.checklist;const done=checked.length;
 return <section className="road-safety-content">
  <div className="safety-heading-row"><div><p className="eyebrow">VALIDACIÓN EN TERRENO</p><h2>Qué falta comprobar</h2><p>Lista de tareas para pasar de observaciones fotográficas a una investigación verificable.</p></div></div>
  <div className="safety-field-grid">
   <section className="safety-field-panel">
    <div className="safety-progress-caption"><h3>Plan de inspección</h3><strong>{done} / {checks.length}</strong></div>
    <div className="safety-progress-track" role="progressbar" aria-label="Progreso de inspección" aria-valuemin={0} aria-valuemax={checks.length} aria-valuenow={done}><div style={{width:(100*done/checks.length)+'%'}}/></div>
    <div className="safety-task-list">{checks.map((item,index)=><label className="safety-task" key={item.id}>
     <input type="checkbox" checked={checked.includes(item.id)} onChange={event=>onChecked(event.target.checked?[...checked,item.id]:checked.filter(id=>id!==item.id))}/>
     <span>{item.title}<small>{roadSafetySupplement.fieldGroups[index]}</small></span>
    </label>)}</div>
    <div className="safety-action-row"><button className="safety-secondary-action" type="button" onClick={()=>onChecked([])}>Reiniciar comprobaciones</button>
     <button className="safety-secondary-action" type="button" onClick={()=>downloadEvidenceJson({location:roadSafetyCase.location,checklist:checks.map(c=>({...c,done:checked.includes(c.id)})),exportedAt:new Date().toISOString()},'E35_Inspeccion_Campo.json')}>Exportar lista JSON</button></div>
   </section>
   <aside className="safety-field-panel">
    <h3>Protocolo de observación seguro</h3>
    <ol className="safety-observations">{roadSafetySupplement.fieldProtocol.map((item,index)=><li key={item.title}><span className="safety-round-number">{String(index+1).padStart(2,'0')}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div></li>)}</ol>
    <p className="safety-warning">No fotografiar desde la calzada ni distraer a quien conduce. Solicita permisos y apoyo técnico antes de hacer mediciones de tránsito.</p>
    <p className="safety-small">La lista funciona sin almacenamiento automático. Puedes exportarla para conservar el avance e importarla explícitamente más adelante.</p>
   </aside>
  </div>
 </section>;
}
export function SafetySources(){
 return <section className="road-safety-content">
  <div className="safety-heading-row"><div><p className="eyebrow">TRAZABILIDAD</p><h2>Fuentes y límites del estudio</h2><p>Referencias de la demo y la actualización de octubre de 2026. No son una base oficial exhaustiva de siniestros.</p></div></div>
  <div className="safety-source-grid">{roadSafetySupplement.sources.map((source,index)=><article className="safety-source-card" key={source.url}>
    <p className="eyebrow">FUENTE {String(index+1).padStart(2,'0')} · {source.date}</p><h3>{source.title}</h3>
    <p><strong>{source.institution}</strong> — {source.notes}</p>
    <a href={source.url} target="_blank" rel="noopener noreferrer">Consultar fuente original ↗</a>
   </article>)}</div>
  <div className="safety-heading-row"><div><h2>Antecedentes y actualización del cruce</h2><p>Los testimonios pendientes no se suman a los incidentes confirmados.</p></div></div>
  <ol className="safety-incident-list">{roadSafetyCase.incidents.map(incident=><li className="safety-source-card" key={incident.id}>
    <time className="eyebrow" dateTime={incident.date}>{incident.displayDate}</time><h3>{incident.title}</h3><p>{incident.summary}</p>
    <p className="safety-small"><strong>Estado:</strong> {incident.status==='testimonio_pendiente'?'Aviso ciudadano por corroborar':incident.status==='prensa_historica'?'Antecedente de prensa':'Noticia periodística'}. Cruce exacto: {incident.exactJunctionConfirmed?'referido en la noticia, pendiente de parte oficial':'no confirmado con parte oficial'}.</p>
    {incident.sources.length>0&&<div className="safety-sources-inline">{incident.sources.map((link,index)=><a href={link} key={link} target="_blank" rel="noopener noreferrer">Noticia {index+1} ↗</a>)}</div>}
   </li>)}</ol>
  <aside className="safety-field-panel"><h3>Estado de validez</h3><p><strong>Observaciones visuales:</strong> vía, semáforos, puente, transporte y fisuras visibles en capturas de 2025.</p><p><strong>Antecedentes:</strong> 2007, 2023 y 2026, según las noticias identificadas.</p><p><strong>Sin verificar:</strong> aforos, tiempos semafóricos, velocidades, cumplimiento normativo, ubicación precisa de accidentes y funcionamiento actual.</p></aside>
 </section>;
}
