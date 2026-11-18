import {test} from 'node:test';
import assert from 'node:assert/strict';
import {weightedScore} from '../shared/domain.ts';
import worker from '../worker/index.ts';
test('weighted score and incomplete evaluations',()=>{const tasks=[{id:'a',title:'A',weight:3},{id:'b',title:'B',weight:1}];assert.equal(weightedScore('c',tasks,[{candidateId:'c',taskId:'a',score:8},{candidateId:'c',taskId:'b',score:4}]),7);assert.equal(weightedScore('c',tasks,[]),null);assert.throws(()=>weightedScore('c',[tasks[0]],[{candidateId:'c',taskId:'a',score:11}]));});
test('voting stays closed and API never falls back to HTML',async()=>{const env={ASSETS:{fetch:()=>{throw new Error('API leaked to assets')}}};assert.equal((await worker.fetch(new Request('https://test/api/votes',{method:'POST'}),env)).status,503);assert.equal((await worker.fetch(new Request('https://test/api/missing'),env)).status,404);const response=await worker.fetch(new Request('https://test/api/health'),env);assert.equal(response.status,200);assert.equal((await response.json()).voting,'disabled');});
