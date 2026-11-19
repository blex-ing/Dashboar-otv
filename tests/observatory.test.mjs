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
