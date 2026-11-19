import { demoCatalog } from '../../../shared/catalog';
import type { CatalogData } from '../../../shared/catalog';
import { fetchCatalog } from '../../../shared/catalog-validation';
export class CatalogClient {
 async load(signal: AbortSignal): Promise<{data:CatalogData; offline:boolean}> {
  try { const data=await fetchCatalog(signal);return {data,offline:false}; }
  catch(error) { if(signal.aborted)throw error;return {data:demoCatalog,offline:true}; }
 }
}
