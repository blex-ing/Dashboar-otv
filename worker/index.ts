import { demoCatalog } from '../shared/catalog.ts';
interface Env { ASSETS: { fetch(request: Request): Promise<Response> } }
export default {
 async fetch(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/')) {
   const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
   if (url.pathname === '/api/health' && request.method === 'GET') return Response.json({ status: 'ok', version: '0.3.0', voting: 'disabled' }, {headers});
   if (url.pathname === '/api/public/catalog' && request.method === 'GET') return Response.json(demoCatalog,{headers});
   if (url.pathname === '/api/votes') return Response.json({error:'VOTING_NOT_ENABLED',message:'La votación todavía no está habilitada.'},{status:503,headers});
   return Response.json({error:'NOT_FOUND'},{status:404,headers});
  }
  const asset = await env.ASSETS.fetch(request);
  const response = new Response(asset.body, asset);
  response.headers.set('X-Content-Type-Options','nosniff');
  response.headers.set('Referrer-Policy','strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  return response;
 }
};
