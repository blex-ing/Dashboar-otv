import {roadSafetyCase} from '../../../shared/road-safety-e35';

export interface EvidencePhoto {
 id:string;title:string;category:string;date:string;observed:string;verify:string;source:string;
 src?:string;origin?:'initial'|'local';
}
export interface EvidenceAlbum {extras:EvidencePhoto[];overlays:Record<string,string>}
export interface ImportedAlbum extends EvidenceAlbum {checklist?:Record<string,boolean>}
export const initialEvidence:EvidencePhoto[]=roadSafetyCase.photos.map(p=>({...p,origin:'initial'}));
const allowedCategory=new Set(['Plano','Semáforos','Vehículos','Peatones','Calzada','Entorno']);
const storedDatabase='otv-e35-local-evidence-v1';
const maxImportBytes=16*1024*1024;
export const maxPhotoBytes=20*1024*1024;

function short(value:unknown,limit:number):string{
 return typeof value==='string'?value.trim().slice(0,limit):'';
}
/** Never turn untrusted imported URLs into network requests, HTML, or SVG. */
export function safeImageData(value:unknown):string|undefined{
 if(typeof value!=='string'||value.length>6*1024*1024||value.length<45)return;
 if(!/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value))return;
 return value;
}
function readImageEntry(value:unknown):Record<string,unknown>|null {
 return typeof value==='object'&&value!==null&&!Array.isArray(value)?value as Record<string,unknown>:null;
}
export function parseImportedAlbum(raw:string):ImportedAlbum{
 if(raw.length>maxImportBytes)throw new Error('Archivo JSON demasiado grande (máximo 16 MB)');
 const data:unknown=JSON.parse(raw);
 const obj=readImageEntry(data);
 if(!obj||!Array.isArray(obj.images))throw new Error('El JSON no contiene una lista de imágenes');
 if(obj.images.length>70)throw new Error('Demasiadas imágenes en el expediente');
 const overlays:Record<string,string>={};
 const extras:EvidencePhoto[]=[];
 const known=new Set(initialEvidence.map(p=>p.id));
 const ids=new Set<string>();
 for(const item of obj.images){
  const image=readImageEntry(item);if(!image)continue;
  const id=short(image.id,40),src=safeImageData(image.src);
  if(!src||!id||ids.has(id))continue;
  ids.add(id);
  if(known.has(id)){overlays[id]=src;continue;}
  if(!/^N[a-zA-Z0-9_-]{1,39}$/.test(id))continue;
  const title=short(image.name??image.title,120);
  const observed=short(image.observation??image.observed,1000);
  if(!title||!observed)continue;
  const category=short(image.category,24);
  extras.push({id,title,observed,category:allowedCategory.has(category)?category:'Entorno',date:short(image.period??image.date,90)||'Fecha no indicada',verify:short(image.verify,1000),source:'Imagen aportada localmente · sin verificación editorial',src,origin:'local'});
 }
 const checklist:Record<string,boolean>={};
 if(Array.isArray(obj.checklist))for(const row of obj.checklist){
  const c=readImageEntry(row);
  if(c&&/^C\d{1,2}$/.test(String(c.id))&&typeof c.done==='boolean')checklist[String(c.id)]=c.done;
 }
 return {extras,overlays,checklist};
}
export function evidenceExport(album:EvidenceAlbum,checked:string[]){
 return {
  project:'E35 Eugenio Espejo · expediente local de evidencias',
  location:roadSafetyCase.location,
  images:[...initialEvidence.map(p=>({...p,name:p.title,observation:p.observed,period:p.date,src:album.overlays[p.id]})),...album.extras.map(p=>({...p,name:p.title,observation:p.observed,period:p.date}))],
  checklist:roadSafetyCase.checklist.map(p=>({...p,done:checked.includes(p.id)})),
  exportedAt:new Date().toISOString()
 };
}
export function downloadEvidenceJson(value:unknown,filename:string):void{
 const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json;charset=utf-8'});
 const url=URL.createObjectURL(blob);
 const link=document.createElement('a');link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();
 window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export async function compressEvidenceImage(file:File):Promise<string>{
 if(file.size>maxPhotoBytes)throw new Error('La imagen supera 20 MB');
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Solo JPG, PNG o WebP');
 const bitmap=await createImageBitmap(file);
 try{
  const scale=Math.min(1,1500/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(bitmap.width*scale));
  canvas.height=Math.max(1,Math.round(bitmap.height*scale));
  const ctx=canvas.getContext('2d');
  if(!ctx)throw new Error('El navegador no permite procesar esta imagen');
  ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
  const src=canvas.toDataURL('image/jpeg',.84);
  const validated=safeImageData(src);
  if(!validated)throw new Error('Imagen procesada demasiado grande');
  return validated;
 }finally{bitmap.close();}
}
function openAlbumDb():Promise<IDBDatabase>{
 return new Promise((resolve,reject)=>{
  if(!('indexedDB' in window))return reject(new Error('IndexedDB no disponible'));
  const req=indexedDB.open(storedDatabase,1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('photos'))req.result.createObjectStore('photos');};
  req.onsuccess=()=>resolve(req.result);
  req.onerror=()=>reject(req.error??new Error('No fue posible abrir almacenamiento local'));
 });
}
export async function saveAlbumLocally(album:EvidenceAlbum):Promise<void>{
 const db=await openAlbumDb();
 try{
  await new Promise<void>((resolve,reject)=>{
   const tx=db.transaction('photos','readwrite');
   tx.objectStore('photos').put(album,'user-evidence');
   tx.oncomplete=()=>resolve();
   tx.onerror=()=>reject(tx.error??new Error('Falló guardar evidencia'));
  });
 }finally{db.close();}
}
export async function loadAlbumLocally():Promise<EvidenceAlbum|null>{
 const db=await openAlbumDb();
 try{
  return await new Promise((resolve,reject)=>{
   const tx=db.transaction('photos','readonly');
   const req=tx.objectStore('photos').get('user-evidence');
   req.onsuccess=()=>{
    if(!req.result)return resolve(null);
    const d=req.result as EvidenceAlbum;
    if(!d||!Array.isArray(d.extras)||typeof d.overlays!=='object'||!d.overlays)return resolve(null);
    resolve({extras:d.extras.filter(p=>!!safeImageData(p.src)).slice(0,60),overlays:Object.fromEntries(Object.entries(d.overlays).filter(([,src])=>!!safeImageData(src)))});
   };
   req.onerror=()=>reject(req.error??new Error('No se pudo recuperar el álbum'));
  });
 }finally{db.close();}
}
export async function clearAlbumLocally():Promise<void>{
 const db=await openAlbumDb();
 try{
  await new Promise<void>((resolve,reject)=>{
   const tx=db.transaction('photos','readwrite');
   tx.objectStore('photos').clear();
   tx.oncomplete=()=>resolve();
   tx.onerror=()=>reject(tx.error??new Error('No se pudo borrar el álbum'));
  });
 }finally{db.close();}
}
