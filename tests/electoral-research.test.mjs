import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const evidence=JSON.parse(readFileSync(fileURLToPath(new URL('../documentacion/investigaciones/OTAVALO_2026_EVIDENCIAS.json',import.meta.url)),'utf8'));

test('electoral source manifest is internally consistent and remains research-only',()=>{
 assert.equal(evidence.schemaVersion,1);
 assert.equal(evidence.scope,'otavalo-alcaldia-2026');
 assert.equal(evidence.publicationStatus,'research-only-not-comparator-ready');
 assert.equal(evidence.coveragePolicy.comparisonsEnabled,false);
 assert.equal(evidence.coveragePolicy.realVotesEnabled,false);
 assert.equal(evidence.coveragePolicy.zeroScoresForMissing,false);
 assert.equal(evidence.candidates.length,6);
 const ids=evidence.candidates.map(c=>c.id);
 assert.equal(new Set(ids).size,6);
 const sources=new Map(evidence.sources.map(s=>[s.id,s]));
 assert.equal(sources.size,evidence.sources.length);
 for(const s of evidence.sources) assert.equal(new URL(s.url).protocol,'https:');
 for(const p of evidence.proposals) {
  assert.ok(ids.includes(p.candidateId),p.id);
  assert.equal(sources.get(p.sourceId)?.type,'primary-candidate-plan');
  assert.equal(sources.get(p.sourceId)?.candidateId,p.candidateId);
  assert.ok(Number.isInteger(p.documentPage)&&p.documentPage>0);
  assert.ok(p.section?.length>0&&p.summary?.length>0);
  assert.equal(p.classification,'campaign-proposal');
  assert.equal(p.publicationStatus,'hold-until-image-and-editorial-review');
  assert.equal(p.visualPageConfirmed,false);
  assert.notEqual(p.feasibility,'verified');
 }
 assert.equal(evidence.proposals.length,7);
 assert.equal(new Set(evidence.proposals.map(p=>p.id)).size,evidence.proposals.length);
});

test('missing plans never masquerade as zero proposals or official verified records',()=>{
 const located=evidence.candidates.filter(c=>c.primaryPlanSourceId!==null);
 assert.equal(located.length,1);
 assert.equal(located[0].id,'lourdes-alta-lima');
 for(const c of evidence.candidates){
  if(c.primaryPlanSourceId===null){
   assert.equal(c.primaryPlanStatus,'not-retrieved');
   assert.equal(c.proposalCountWithTextLocation,0);
   assert.equal(c.officialListConfirmed,false);
  }else{
   assert.equal(c.officialListConfirmed,true);
   assert.equal(c.proposalCountWithTextLocation,evidence.proposals.filter(p=>p.candidateId===c.id).length);
  }
 }
 assert.equal(evidence.externalFilesAnalyzed,0);
 assert.equal(evidence.externalFilesHashed,0);
 for(const s of evidence.sources) assert.equal(s.sha256,null);
});
