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
const originalIds=new Set(initialEvidence.map(photo=>photo.id));
interface ParsedImage {id:string;src:string;photo?:EvidencePhoto}
function validImportedImage(item:unknown):ParsedImage|null {
 const image=readImageEntry(item);
 if(!image)return null;
 const id=short(image.id,40),src=safeImageData(image.src);
 if(!id||!src)return null;
 if(originalIds.has(id))return {id,src};
 if(!/^N[a-zA-Z0-9_-]{1,39}$/.test(id))return null;
 const title=short(image.name??image.title,120);
 const observed=short(image.observation??image.observed,1000);
 if(!title||!observed)return null;
 const category=short(image.category,24);
 const photo:EvidencePhoto={
  id,src,title,observed,category:allowedCategory.has(category)?category:'Entorno',
  date:short(image.period??image.date,90)||'Fecha no indicada',
  verify:short(image.verify,1000),
  source:'Imagen aportada localmente · sin verificación editorial',origin:'local'
 };
 return {id,src,photo};
}
function parseChecklist(value:unknown):Record<string,boolean>{
 if(!Array.isArray(value))return {};
 const items=value.map(readImageEntry).filter((entry):entry is Record<string,unknown>=>entry!==null);
 const valid=items.filter(item=>/^C\d{1,2}$/.test(String(item.id))&&typeof item.done==='boolean');
 return Object.fromEntries(valid.map(item=>[String(item.id),item.done as boolean]));
}
function importedRoot(raw:string):Record<string,unknown>{
 if(raw.length>maxImportBytes)throw new Error('Archivo JSON demasiado grande (máximo 16 MB)');
 const obj=readImageEntry(JSON.parse(raw));
 if(!obj||!Array.isArray(obj.images))throw new Error('El JSON no contiene una lista de imágenes');
 if(obj.images.length>70)throw new Error('Demasiadas imágenes en el expediente');
 return obj;
}
export function parseImportedAlbum(raw:string):ImportedAlbum {
 const dataset=importedRoot(raw);
 const extras:EvidencePhoto[]=[],overlays:Record<string,string>={},seen=new Set<string>();
 for(const candidate of dataset.images as unknown[]){
  const image=validImportedImage(candidate);
  if(!image||seen.has(image.id))continue;
  seen.add(image.id);
  if(image.photo)extras.push(image.photo);
  else overlays[image.id]=image.src;
 }
 return {extras,overlays,checklist:parseChecklist(dataset.checklist)};
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
