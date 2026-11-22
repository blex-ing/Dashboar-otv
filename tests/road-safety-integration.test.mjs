import test from 'node:test';
import assert from 'node:assert/strict';
import {roadSafetyCase} from '../shared/road-safety-e35.ts';
import {roadSafetySupplement} from '../shared/road-safety-supplement.ts';

test('demo integration retains ten distinct original identifiers and seven documented risks',()=>{
 assert.equal(roadSafetyCase.photos.length,10);
 assert.equal(roadSafetyCase.risks.length,7);
 assert.equal(new Set(roadSafetyCase.photos.map(p=>p.id)).size,10);
 for(const risk of roadSafetyCase.risks){
  assert.ok(risk.photoIds.every(id=>roadSafetyCase.photos.some(photo=>photo.id===id)));
 }
});
test('original 2007/2023 and institutional sources remain linked alongside 2026 collision',()=>{
 const urls=roadSafetySupplement.sources.map(s=>s.url);
 assert.ok(urls.some(url=>url.includes('gobernacionimbabura.gob.ec')));
 assert.ok(urls.some(url=>url.includes('gadeugenioespejo.gob.ec')));
 assert.ok(urls.some(url=>url.includes('hoyenimbabura.com')));
 assert.ok(urls.some(url=>url.includes('lahora.com.ec')));
 assert.ok(urls.some(url=>url.includes('elnorte.ec')));
 assert.equal(roadSafetySupplement.visibleObservations.length,5);
});
test('statistics distinguish documented injuries from technical measurements not made',()=>{
 assert.equal(roadSafetySupplement.technicalMeasurements,0);
 const event=roadSafetyCase.incidents.find(i=>i.id==='I-2026-10-30');
 assert.equal(event?.fatalities,3);
 assert.equal(event?.type,'colision_vehiculos');
 assert.equal(event?.exactJunctionConfirmed,false);
});
