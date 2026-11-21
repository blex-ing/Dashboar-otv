import test from 'node:test';
import assert from 'node:assert/strict';
import { otavaloElection } from '../web/src/elections/otavalo-2026.ts';

test('Otavalo electoral directory identifies exactly six distinct candidates',()=>{
  const candidates=otavaloElection.candidates;
  assert.equal(otavaloElection.electionDate,'2026-11-29');
  assert.equal(otavaloElection.id,'otavalo-alcaldia-2026');
  assert.equal(candidates.length,6);
  assert.equal(new Set(candidates.map(c=>c.id)).size,6);
  assert.equal(new Set(candidates.map(c=>c.name)).size,6);
  assert.deepEqual(candidates.map(c=>c.name),[...candidates.map(c=>c.name)].sort((a,b)=>a.localeCompare(b,'es')));
});

test('Every published electoral identity has equal documented coverage and no unreviewed proposals',()=>{
  const ids=new Set(otavaloElection.sources.map(s=>s.id));
  assert.equal(ids.size,otavaloElection.sources.length);
  const primary=otavaloElection.sources.find(s=>s.id==='cne-voto-informado');
  assert.ok(primary);
  assert.equal(primary.kind,'official-directory');
  for(const candidate of otavaloElection.candidates){
    assert.equal(candidate.programmeStatus,'pending-primary-review');
    assert.equal(candidate.sourceIds.length,2);
    assert.ok(candidate.sourceIds.every(id=>ids.has(id)));
    assert.ok(candidate.sourceIds.every(id=>otavaloElection.sources.find(s=>s.id===id)?.kind==='journalism'));
    assert.equal('votes' in candidate,false);
    assert.equal('proposals' in candidate,false);
    assert.equal('verdicts' in candidate,false);
  }
  for(const source of otavaloElection.sources){
    const url=new URL(source.url);
    assert.equal(url.protocol,'https:');
    assert.ok(source.publishedOn<=otavaloElection.reviewedOn);
  }
});
