import {useState} from 'react';
import type {EvidenceAlbum,EvidencePhoto} from './evidence-data';
import {loadAlbumLocally,saveAlbumLocally,clearAlbumLocally,parseImportedAlbum,compressEvidenceImage} from './evidence-data';

const blank=():EvidenceAlbum=>({extras:[],overlays:{}});
function mergeAlbums(current:EvidenceAlbum,imported:EvidenceAlbum):EvidenceAlbum{
 const byId=new Map(current.extras.map(p=>[p.id,p]));
 for(const photo of imported.extras)if(!byId.has(photo.id))byId.set(photo.id,photo);
 return {extras:[...byId.values()].slice(0,60),overlays:{...current.overlays,...imported.overlays}};
}
export function useEvidenceAlbum(onChecklistImported:(ids:string[])=>void){
 const [album,setAlbum]=useState<EvidenceAlbum>(blank);
 const [saveEnabled,setSaveEnabled]=useState(false);
 const [notice,setNotice]=useState('');
 async function persist(updated:EvidenceAlbum){
  if(saveEnabled)try{await saveAlbumLocally(updated);}catch{setNotice('No se pudo conservar en este dispositivo. Exporta el JSON como respaldo.');}
 }
 async function importFile(file:File){
  try{
   const imported=parseImportedAlbum(await file.text());
   const updated=mergeAlbums(album,imported);
   setAlbum(updated);
   if(Object.keys(imported.checklist??{}).length)onChecklistImported(Object.keys(imported.checklist??{}).filter(id=>imported.checklist?.[id]));
   await persist(updated);
   setNotice('Importación completada: '+Object.keys(imported.overlays).length+' imágenes del catálogo y '+imported.extras.length+' nuevas fotografías. No se enviaron al servidor.');
  }catch(e){setNotice('No se pudo importar el expediente: '+(e instanceof Error?e.message:'Formato inválido'));}
 }
 async function addPhoto(file:File,info:Pick<EvidencePhoto,'title'|'observed'|'verify'|'category'|'date'>){
  try{
   if(!info.title.trim()||!info.observed.trim()){setNotice('Introduce un título y una observación.');return false;}
   const src=await compressEvidenceImage(file);
   const id='N'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
   const item:EvidencePhoto={...info,id,src,title:info.title.trim().slice(0,120),observed:info.observed.trim().slice(0,1000),verify:info.verify.trim().slice(0,1000),source:'Fotografía incorporada por el visitante · sin revisión',origin:'local'};
   const updated={...album,extras:[...album.extras,item].slice(-60)};
   setAlbum(updated);await persist(updated);
   setNotice('Imagen '+id+' incorporada solo a tu navegador. Exporta el expediente para respaldarla.');
   return true;
  }catch(e){setNotice('No se pudo procesar la imagen: '+(e instanceof Error?e.message:'Error de imagen'));return false;}
 }
 async function enableLocalSave(enabled:boolean){
  setSaveEnabled(enabled);
  if(!enabled){setNotice('Guardado automático desactivado. Puedes borrar las fotos guardadas con el control correspondiente.');return;}
  try{
   const old=await loadAlbumLocally();
   const updated=old?mergeAlbums(old,album):album;
   setAlbum(updated);await saveAlbumLocally(updated);
   setNotice('Guardado privado activado en este navegador. No se envían fotografías al servidor.');
  }catch{setSaveEnabled(false);setNotice('El dispositivo no admite guardar fotografías aquí. Utiliza Exportar JSON.');}
 }
 async function clearUserPhotos(){
  if(!window.confirm('¿Eliminar las fotos importadas y añadidas de este navegador? No afecta a los JSON exportados.'))return;
  setAlbum(blank());
  try{await clearAlbumLocally();setNotice('Imágenes locales eliminadas. Las fichas originales se mantienen.');}
  catch{setNotice('Las imágenes se han quitado de esta sesión, pero no se pudo limpiar el almacenamiento del dispositivo.');}
 }
 return {album,notice,saveEnabled,importFile,addPhoto,enableLocalSave,clearUserPhotos};
}
