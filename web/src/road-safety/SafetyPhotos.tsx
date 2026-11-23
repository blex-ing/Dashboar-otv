import {useEffect,useRef,useState} from 'react';
import {roadSafetyCase} from '../../../shared/road-safety-e35';
import {downloadEvidenceJson,evidenceExport,initialEvidence} from './evidence-data';
import type {EvidenceAlbum,EvidencePhoto} from './evidence-data';

const categoryNames=['Todas','Plano','Semáforos','Peatones','Vehículos','Calzada','Entorno'];
export interface PhotosProps {
 album:EvidenceAlbum;
 checked:string[];
 filter:string;onFilter:(next:string)=>void;
 openId:string|null;onOpen:(id:string|null)=>void;
 onImport:(file:File)=>Promise<void>;
 onAdd:(file:File,info:Pick<EvidencePhoto,'title'|'category'|'observed'|'verify'|'date'>)=>Promise<boolean>;
 saveEnabled:boolean;onSaveEnabled:(checked:boolean)=>Promise<void>;
 onClear:()=>Promise<void>;notice:string;
}
function PhotoPreview({photo,className=''}:{photo:EvidencePhoto;className?:string}){
 return photo.src
  ?<img className={className} src={photo.src} alt={'Evidencia '+photo.id+': '+photo.title} loading="lazy"/>
  :<div className={'safety-preview-placeholder '+className} role="img" aria-label={'La imagen '+photo.id+' no se publica por derechos de Street View'}>
    <span>📷</span><strong>{photo.id}</strong><small>Imagen no publicada · importar JSON local</small>
   </div>;
}
function PhotoDialog({photo,photos,onOpen}:{photo:EvidencePhoto;photos:EvidencePhoto[];onOpen:(id:string|null)=>void}){
 const ref=useRef<HTMLButtonElement>(null);
 const index=photos.findIndex(item=>item.id===photo.id);
 const previous=photos[(index+photos.length-1)%photos.length],next=photos[(index+1)%photos.length];
 useEffect(()=>{
  const prior=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';ref.current?.focus();
  return ()=>{document.body.style.overflow=previousOverflow;prior?.focus();};
 },[]);
 function keepFocus(event:React.KeyboardEvent<HTMLDivElement>){
  const controls=[...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
  if(!controls.length)return;
  const first=controls[0],last=controls[controls.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();return;}
  if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 }
 function onKeys(event:React.KeyboardEvent<HTMLDivElement>){
  if(event.key==='Escape'){event.preventDefault();onOpen(null);return;}
  if(event.key==='Tab'){keepFocus(event);return;}
  if(photos.length<2)return;
  if(event.key==='ArrowRight'){event.preventDefault();onOpen(next.id);return;}
  if(event.key==='ArrowLeft'){event.preventDefault();onOpen(previous.id);}
 }
 return <div className="safety-photo-overlay" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)onOpen(null);}}>
  <div className="safety-photo-modal" role="dialog" aria-modal="true" aria-label={photo.id+' · Archivo fotográfico'} onKeyDown={onKeys}>
   <header className="safety-photo-modal-head"><strong>{photo.id} · Archivo fotográfico</strong><button ref={ref} type="button" onClick={()=>onOpen(null)}>Cerrar visor ✕</button></header>
   <div className="safety-photo-modal-grid">
    <div className="safety-photo-modal-image"><PhotoPreview photo={photo}/></div>
    <div className="safety-photo-modal-info"><p className="eyebrow">{photo.category} · {photo.date}</p><h2>{photo.title}</h2>
     <h3>Observación</h3><p>{photo.observed}</p>
     <h3>Por comprobar</h3><p>{photo.verify||'Pendiente de concretar'}</p>
     <h3>Origen</h3><p>{photo.source}</p>
     {!photo.src&&<p>Para mostrar la captura original en privado, importa el archivo JSON incluido en tu expediente. No se publica como recurso del servidor.</p>}
     <div className="safety-photo-modal-actions"><button type="button" disabled={photos.length<2} onClick={()=>onOpen(previous.id)}>← Anterior</button><button type="button" disabled={photos.length<2} onClick={()=>onOpen(next.id)}>Siguiente →</button></div>
    </div>
   </div>
  </div>
 </div>;
}
interface EvidenceUploaderProps {
 onImport:PhotosProps['onImport'];onAdd:PhotosProps['onAdd'];onClear:PhotosProps['onClear'];
 saveEnabled:boolean;onSaveEnabled:PhotosProps['onSaveEnabled'];notice:string;
}
function EvidenceUploader({onImport,onAdd,onClear,saveEnabled,onSaveEnabled,notice}:EvidenceUploaderProps){
 const [file,setFile]=useState<File|null>(null);
 const [title,setTitle]=useState(''),[category,setCategory]=useState('Semáforos');
 const [observed,setObserved]=useState(''),[verify,setVerify]=useState(''),[date,setDate]=useState('');
 const [busy,setBusy]=useState(false);
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();if(!file)return;
  setBusy(true);
  try{const ok=await onAdd(file,{title,category,observed,verify,date:date||'Fecha no indicada'});if(ok){setFile(null);setTitle('');setObserved('');setVerify('');setDate('');(event.currentTarget as HTMLFormElement)?.reset();}}
  finally{setBusy(false);}
 }
 return <section className="safety-evidence-upload" aria-labelledby="safety-upload-title">
  <div className="safety-heading-row"><div><h2 id="safety-upload-title">Incorporar nuevas evidencias</h2><p>Fotos incorporadas únicamente desde el dispositivo de quien investiga. No hay envío a OTV.</p></div></div>
  <div className="safety-upload-grid">
   <form className="safety-form-panel" onSubmit={submit}>
    <label>Imagen (JPG, PNG, WebP)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={event=>setFile(event.target.files?.[0]??null)} required/></label>
    <label>Título descriptivo<input type="text" maxLength={120} value={title} onChange={event=>setTitle(event.target.value)} placeholder="Vista nocturna desde el oeste" required/></label>
    <label>Tema<select value={category} onChange={event=>setCategory(event.target.value)}>{categoryNames.filter(c=>c!=='Todas').map(c=><option key={c}>{c}</option>)}</select></label>
    <label>Fecha de captura<input type="date" value={date} onChange={event=>setDate(event.target.value)}/></label>
    <label className="safety-full">¿Qué se ve realmente?<textarea rows={3} value={observed} onChange={event=>setObserved(event.target.value)} maxLength={1000} required/></label>
    <label className="safety-full">¿Qué habría que verificar?<textarea rows={2} value={verify} onChange={event=>setVerify(event.target.value)} maxLength={1000}/></label>
    <button className="primary safety-action" type="submit" disabled={busy}>{busy?'Procesando imagen…':'Añadir foto a la demo'}</button>
   </form>
   <div className="safety-form-panel safety-import-panel">
    <h3>Importar y exportar</h3><p>En el ZIP original, extrae <code>datos/expediente_completo.json</code> e impórtalo aquí. Las imágenes F01–F10 se muestran solo en este navegador, sin publicarlas en Cloudflare.</p>
    <label>Importar expediente JSON<input type="file" accept=".json,application/json" aria-label="Importar expediente JSON" onChange={event=>{const selected=event.target.files?.[0];if(selected)void onImport(selected);event.target.value='';}}/></label>
    <label className="safety-private-switch"><input type="checkbox" checked={saveEnabled} onChange={event=>{void onSaveEnabled(event.target.checked);}}/> Guardar fotos en este dispositivo (IndexedDB, opcional)</label>
    <p className="safety-small">Solo al activar la opción se guardan imágenes en el navegador. Desactivarla detiene futuros guardados; «Borrar fotos locales» también borra las guardadas. La checklist no se guarda automáticamente.</p>
    <button className="safety-secondary-action" type="button" onClick={()=>void onClear()}>Borrar fotos locales</button>
    <p className="safety-import-status" role="status" aria-live="polite">{notice}</p>
   </div>
  </div>
 </section>;
}
export function SafetyPhotos(props:PhotosProps){
 const photos=[...initialEvidence.map(p=>({...p,src:props.album.overlays[p.id]})),...props.album.extras];
 const filtered=photos.filter(p=>props.filter==='Todas'||p.category===props.filter);
 const active=photos.find(p=>p.id===props.openId);
 const navigation=filtered.some(p=>p.id===props.openId)?filtered:photos;
 return <section className="road-safety-content safety-photos" aria-label="Archivo de evidencias">
  <div className="safety-heading-row"><div><p className="eyebrow">ARCHIVO DOCUMENTAL</p><h2>Fotografías del estado visible</h2><p>Diez fichas iniciales y las imágenes privadas que hayas importado. La procedencia y las comprobaciones siguen visibles.</p></div>
   <button className="safety-secondary-action" type="button" onClick={()=>downloadEvidenceJson(evidenceExport(props.album,props.checked),'E35_Eugenio_Espejo_Expediente.json')}>Exportar expediente JSON</button>
  </div>
  <div className="safety-photo-controls"><label>Filtrar fotografías <select value={props.filter} onChange={event=>props.onFilter(event.target.value)}>{categoryNames.map(c=><option key={c} value={c}>{c==='Todas'?'Todas las categorías':c}</option>)}</select></label><span role="status">{filtered.length} de <strong>{photos.length}</strong> evidencias</span></div>
  <div className="safety-photos-grid">{filtered.map(photo=><article data-evidence-id={photo.id} className="safety-photo-card" key={photo.id}>
   <button type="button" aria-label={'Abrir '+photo.id+' · '+photo.title} onClick={()=>props.onOpen(photo.id)}>
    <PhotoPreview photo={photo}/>
    <div className="safety-photo-summary"><span className="eyebrow">{photo.id}</span><h3>{photo.title}</h3><p>{photo.observed}</p><span className="safety-chip">{photo.category}</span> <span className="safety-chip">{photo.date}</span></div>
   </button>
  </article>)}</div>
  {!filtered.length&&<div className="panel">No hay fotografías en esta categoría.</div>}
  <p className="safety-legal-note">Las diez capturas originales proceden de Google Maps/Street View de febrero y marzo de 2025. Por el momento esta web no redistribuye las fotografías. Se pueden visualizar localmente mediante importación privada del JSON que ya tienes.</p>
  <EvidenceUploader onImport={props.onImport} onAdd={props.onAdd} onClear={props.onClear} saveEnabled={props.saveEnabled} onSaveEnabled={props.onSaveEnabled} notice={props.notice}/>
  {active&&<PhotoDialog photo={active} photos={navigation} onOpen={props.onOpen}/>}
 </section>;
}
