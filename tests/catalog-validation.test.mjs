import { test } from 'node:test';
import assert from 'node:assert/strict';
import { demoCatalog } from '../shared/catalog.ts';
import { fetchCatalog, parseCatalog } from '../shared/catalog-validation.ts';

const fixture = () => structuredClone(demoCatalog);

test('accepts complete demo catalog and keeps both territories isolated', () => {
  const data = parseCatalog(fixture());
  assert.equal(data.territories.length, 2);
  assert.notEqual(data.territories[0].id, data.territories[1].id);
});

test('rejects malformed root, invalid territory or duplicate locality', () => {
  for (const input of [null, {}, {mode:'live', territories:[]},
    {mode:'demo', territories:[]}, {mode:'demo', territories:[null]}]) {
    assert.throws(() => parseCatalog(input), /INVALID_CATALOG/);
  }
  const duplicated = fixture();
  duplicated.territories.push(structuredClone(duplicated.territories[0]));
  assert.throws(() => parseCatalog(duplicated), /INVALID_CATALOG/);
});

test('rejects missing nested properties, broken references, invalid numeric values and unsafe URLs', () => {
  const transforms = [
    d => { delete d.territories[0].editions[0].candidates[0].proposals; },
    d => { d.territories[0].editions[0].candidates[0].votes = -1; },
    d => { d.territories[0].editions[0].candidates[0].votes = NaN; },
    d => { d.territories[0].editions[0].claims[0].candidateId = 'missing'; },
    d => { d.territories[0].editions[0].claims[0].sourceIds = ['missing']; },
    d => { d.territories[0].editions[0].claims[0].verdict = 'unrecognized'; },
    d => { d.territories[0].editions[0].claims[0].seconds = 100_000; },
    d => { d.territories[0].editions[0].interviews[0].chapters[0].seconds = 100_000; },
    d => { d.territories[0].editions[0].sources[0].url = 'javascript:alert(1)'; },
    d => { d.territories[0].editions[0].interviews[0].youtubeId = 'bad?query'; },
    d => { d.territories[0].editions[0].claims[0].sourceIds = ['acta-demo','acta-demo']; },
  ];
  for (const mutate of transforms) {
    const broken = fixture();
    mutate(broken);
    assert.throws(() => parseCatalog(broken), /INVALID_CATALOG/);
  }
});

test('bounds number of territories and rejects deeply nested invalid item', () => {
  const many = fixture();
  many.territories = Array.from({length:101}, (_, i) => ({
    ...structuredClone(many.territories[0]), id:'place-'+i
  }));
  assert.throws(() => parseCatalog(many), /INVALID_CATALOG/);
});

test('refuses oversized responses before JSON parsing', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response('x'.repeat(1_000_001));
  try {
    await assert.rejects(fetchCatalog(new AbortController().signal), /CATALOG_TOO_LARGE/);
  } finally {
    globalThis.fetch = original;
  }
});

test('fetches and validates a well-formed payload', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => Response.json(fixture());
  try {
    const result = await fetchCatalog(new AbortController().signal);
    assert.equal(result.mode, 'demo');
  } finally {
    globalThis.fetch = original;
  }
});

test('rejects duplicate edition identifiers and edition cross references',()=>{
 const same=fixture();
 same.territories[0].editions.push(structuredClone(same.territories[0].editions[0]));
 assert.throws(()=>parseCatalog(same),/INVALID_CATALOG/);
 const cross=fixture();
 const copy=structuredClone(cross.territories[0].editions[0]);
 copy.id='otra';copy.label='Otra edición';
 copy.candidates=copy.candidates.slice(0,1);
 cross.territories[0].editions.push(copy);
 assert.throws(()=>parseCatalog(cross),/INVALID_CATALOG/);
});
test('accepts two independent valid editions in one locality',()=>{
 const d=fixture();
 const copy=structuredClone(d.territories[0].editions[0]);
 copy.id='otra'; copy.label='Otra edición ficticia';
 copy.candidates[0].votes=0;
 d.territories[0].editions.push(copy);
 assert.equal(parseCatalog(d).territories[0].editions.length,2);
});

test('adversarial schema bounds and referential integrity fail closed',()=>{
 const cases=[
  d=>{d.territories[0].editions=[];},
  d=>{d.territories[0].editions=Array.from({length:101},(_,i)=>({...structuredClone(d.territories[0].editions[0]),id:'edition-'+i}));},
  d=>{const edition=d.territories[0].editions[0];edition.candidates=Array.from({length:201},(_,i)=>({...structuredClone(edition.candidates[0]),id:'person-'+i}));},
  d=>{const ed=d.territories[0].editions[0];ed.claims[0].id=ed.claims[1].id;},
  d=>{const ed=d.territories[0].editions[0];ed.sources[0].id=ed.sources[1].id;},
  d=>{const ed=d.territories[0].editions[0];ed.interviews[0].candidateId=ed.interviews[1].candidateId;},
  d=>{d.territories[0].editions[0].claims[0].seconds=-1;},
  d=>{d.territories[0].editions[0].interviews[0].duration=Infinity;},
  d=>{d.territories[0].editions[0].candidates[0].id='invalid/id';},
  d=>{d.territories[0].editions[0].sources[0].date='nonsense';},
  d=>{d.territories[0].editions[0].claims[0].sourceIds=null;},
  d=>{d.territories[0].editions[0].candidates[0].description='x'.repeat(4_001);},
 ];
 for (const [i,mutate] of cases.entries()){
  const bad=fixture();mutate(bad);
  assert.throws(()=>parseCatalog(bad),/INVALID_CATALOG/,`case ${i}`);
 }
});

test('fetch failure, malformed JSON, and aborted requests do not produce a trusted catalog',async()=>{
 const original=globalThis.fetch;
 try {
  for(const response of [
   new Response('not-json',{headers:{'content-type':'application/json'}}),
   new Response('{}',{status:200}),
   new Response('down',{status:503}),
  ]){
   globalThis.fetch=async()=>response.clone();
   await assert.rejects(fetchCatalog(new AbortController().signal));
  }
  const controller=new AbortController();
  controller.abort();
  globalThis.fetch=async(_url,{signal})=>{if(signal.aborted)throw new DOMException('Aborted','AbortError');};
  await assert.rejects(fetchCatalog(controller.signal),{name:'AbortError'});
 }finally{globalThis.fetch=original;}
});
