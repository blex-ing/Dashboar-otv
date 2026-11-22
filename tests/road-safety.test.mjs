import test from 'node:test';
import assert from 'node:assert/strict';
import {roadSafetyCase} from '../shared/road-safety-e35.ts';

test('road-safety case preserves all ten distinct 2025 visual records',()=>{
 assert.equal(roadSafetyCase.photos.length,10);
 assert.deepEqual(roadSafetyCase.photos.map(photo=>photo.id),Array.from({length:10},(_,i)=>'F'+String(i+1).padStart(2,'0')));
 for(const photo of roadSafetyCase.photos){
  assert.ok(photo.observed&&photo.verify&&photo.source&&photo.date);
  assert.match(photo.source,/Google Maps|Street View/);
  assert.match(photo.date,/2025/);
 }
});

test('seven risks are hypotheses requiring field checks, not measured indexes',()=>{
 assert.equal(roadSafetyCase.risks.length,7);
 assert.deepEqual(roadSafetyCase.risks.map(risk=>risk.id),Array.from({length:7},(_,i)=>'R'+String(i+1).padStart(2,'0')));
 for(const risk of roadSafetyCase.risks) {
  assert.ok(risk.check&&risk.description);
  for(const ref of risk.photoIds) assert.ok(roadSafetyCase.photos.some(photo=>photo.id===ref));
 }
});

test('fatal October 2026 event is reported as vehicle collision, not verified pedestrian atropello',()=>{
 const event=roadSafetyCase.incidents.find(i=>i.id==='I-2026-10-30');
 assert.ok(event);
 assert.equal(event.date,'2026-10-30');
 assert.equal(event.type,'colision_vehiculos');
 assert.equal(event.fatalities,3);
 assert.equal(event.injured,1);
 assert.equal(event.exactJunctionConfirmed,false);
 assert.equal(event.sources.length,2);
 assert.ok(event.sources.every(source=>source.startsWith('https://')));
 assert.doesNotMatch(event.summary,/atropell/i);
});

test('unverified user report cannot become confirmed incident or aggregate count',()=>{
 const report=roadSafetyCase.incidents.find(i=>i.id==='T-2026-11-23');
 assert.ok(report);
 assert.equal(report.status,'testimonio_pendiente');
 assert.equal(report.fatalities,null);
 assert.equal(report.exactJunctionConfirmed,false);
});

test('no fabricated measured road geometry, speeds or accident totals',()=>{
 assert.ok(roadSafetyCase.checklist.length>=7);
 assert.equal(roadSafetyCase.location.approximate,true);
 assert.match(roadSafetyCase.disclaimer,/no equivale|no constituye/i);
});
