import {test} from 'node:test';
import assert from 'node:assert/strict';
import {demoCatalog,ObservatoryService,CandidateDirectory} from '../shared/catalog.ts';
import worker from '../worker/index.ts';
test('catalog relationships and counts stay consistent for every locality',()=>{
 const service=new ObservatoryService(demoCatalog);
 for(const locality of demoCatalog.territories){
  const t=service.territory(locality.id);assert.ok(t);
  assert.equal(t.editionId,'laboratorio');
  assert.equal(new Set(t.candidates.map(c=>c.id)).size,t.candidates.length);
  assert.equal(new Set(t.claims.map(c=>c.id)).size,t.claims.length);
  for(const c of t.claims){assert.ok(new CandidateDirectory(t.candidates).find(c.candidateId));for(const id of c.sourceIds)assert.ok(t.sources.find(s=>s.id===id));}
  const sum=service.summary(t);assert.equal(sum.proposals,9);assert.equal(sum.claims,12);
  assert.equal(service.claims(t,'ana','supported').length,1);
  assert.equal(service.claims(t,'','','','realizaron').length,3);
  assert.equal(service.claims(t,'','','','no-existe').length,0);
  assert.equal(service.ranking(t)[0].id,'ana');assert.equal(service.share(t,t.candidates[0]),48);
  const zero={...t,candidates:t.candidates.map(c=>({...c,votes:0}))};assert.equal(service.share(zero,zero.candidates[0]),0);
 }
 assert.equal(service.territory('missing'),undefined);
});
test('public API exposes only demo catalog while writes remain closed',async()=>{
 const env={ASSETS:{fetch:()=>{throw new Error('API fell through')}}};
 const r=await worker.fetch(new Request('https://test/api/public/catalog'),env);assert.equal(r.status,200);assert.equal((await r.json()).mode,'demo');
 assert.equal((await worker.fetch(new Request('https://test/api/public/catalog',{method:'POST'}),env)).status,404);
 assert.equal((await worker.fetch(new Request('https://test/api/votes',{method:'POST'}),env)).status,503);
});

test('editions isolate candidates, claims and support totals',()=>{
 const clone=structuredClone(demoCatalog);
 const otavalo=clone.territories[0];
 const second=structuredClone(otavalo.editions[0]);
 second.id='segunda';second.label='Otra edición ficticia';
 second.candidates[0].votes=7;
 second.candidates[1].votes=0;
 second.candidates[2].votes=0;
 second.claims=second.claims.slice(0,1);
 second.sources=second.sources.slice(0,1);
 second.claims[0].sourceIds=['acta-demo'];
 otavalo.editions.push(second);
 const service=new ObservatoryService(clone);
 const original=service.territory('otavalo','laboratorio');
 const newer=service.territory('otavalo','segunda');
 assert.equal(service.summary(original).votes,2675);
 assert.equal(service.summary(newer).votes,7);
 assert.equal(service.summary(original).claims,12);
 assert.equal(service.summary(newer).claims,1);
 assert.equal(service.territory('ibarra','segunda'),undefined);
 assert.equal(service.territory('otavalo','invalid'),undefined);
 assert.equal(service.territory('otavalo').editionId,'laboratorio');
 assert.equal(original.candidates[0].votes,1284);
});

test('Worker applies security headers to HTML, assets, API and error responses',async()=>{
 const seen=[];
 const env={ASSETS:{fetch:async request=>{
  seen.push(new URL(request.url).pathname);
  return new Response('demo',{headers:{'Content-Type':'text/html'}});
 }}};
 for(const path of ['/', '/assets/main-ABCD1234.js','/api/health','/api/missing']){
  const response=await worker.fetch(new Request('https://example.test'+path),env);
  assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  assert.match(response.headers.get('content-security-policy'), /object-src 'none'/);
  assert.equal(response.headers.get('x-frame-options'),'DENY');
  assert.equal(response.headers.get('x-content-type-options'),'nosniff');
  assert.equal(response.headers.get('referrer-policy'),'strict-origin-when-cross-origin');
  assert.match(response.headers.get('strict-transport-security'), /max-age=31536000/);
  assert.equal(response.headers.get('access-control-allow-origin'),null);
 }
 assert.deepEqual(seen,['/','/assets/main-ABCD1234.js']);
});

test('Worker sets conservative HTML/API cache and immutable hash asset cache',async()=>{
 const env={ASSETS:{fetch:async request=>{
  const p=new URL(request.url).pathname;
  return p==='/missing' ? new Response('missing',{status:404}) : new Response('asset',{status:200});
 }}};
 const request=p=>worker.fetch(new Request('https://example.test'+p),env);
 assert.equal((await request('/')).headers.get('cache-control'),'no-cache');
 assert.equal((await request('/assets/main-ABCD1234.js')).headers.get('cache-control'),'public, max-age=31536000, immutable');
 assert.equal((await request('/assets/main.js')).headers.get('cache-control'),'no-cache');
 assert.equal((await request('/missing')).headers.get('cache-control'),'no-store');
 assert.equal((await request('/api/public/catalog')).headers.get('cache-control'),'no-store');
 assert.equal((await request('/api/health')).headers.get('cache-control'),'no-store');
 assert.equal((await request('/api/votes')).headers.get('cache-control'),'no-store');
});

test('Worker rejects API writes with explicit method policy and leaves voting disabled',async()=>{
 const env={ASSETS:{fetch:()=>{throw new Error('API fell through')}}};
 for(const path of ['/api/health','/api/public/catalog']){
  const blocked=await worker.fetch(new Request('https://example.test'+path,{method:'POST'}),env);
  assert.equal(blocked.status,405);
  assert.equal(blocked.headers.get('allow'),'GET, HEAD');
  assert.equal((await blocked.json()).error,'METHOD_NOT_ALLOWED');
  const head=await worker.fetch(new Request('https://example.test'+path,{method:'HEAD'}),env);
  assert.equal(head.status,200);
  assert.equal(await head.text(),'');
 }
 for(const method of ['GET','HEAD','POST','OPTIONS']){
  const result=await worker.fetch(new Request('https://example.test/api/votes',{method}),env);
  assert.equal(result.status,503);
  assert.equal(result.headers.get('cache-control'),'no-store');
 }
 const unknown=await worker.fetch(new Request('https://example.test/api/private',{method:'POST'}),env);
 assert.equal(unknown.status,404);
});

test('No HTTP Strict Transport Security is sent over an insecure local origin',async()=>{
 const env={ASSETS:{fetch:async()=>new Response('ok')}};
 const r=await worker.fetch(new Request('http://localhost/'),env);
 assert.equal(r.headers.get('strict-transport-security'),null);
});
