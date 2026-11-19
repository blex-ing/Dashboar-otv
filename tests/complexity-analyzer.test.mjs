import assert from 'node:assert/strict';
import test from 'node:test';
import { ComplexityAnalyzer, compareComplexityBaseline, complexitySummary } from '../web/scripts/complexity-analyzer.mjs';

test('AST complexity separates cyclomatic decisions from cognitive nesting',()=>{
 const source=`
  export function flat(a:boolean,b:boolean) { if (a && b) return 1; return 0; }
  export function nested(items:number[]) {
   for (const item of items) {
    if (item > 0) { while (item > 2) break; }
   }
  }
 `;
 const result=new ComplexityAnalyzer().analyze('fixture.ts',source);
 const flat=result.functions.find(item=>item.name==='flat');
 const nested=result.functions.find(item=>item.name==='nested');
 assert.deepEqual({cyclomatic:flat.cyclomatic,cognitive:flat.cognitive,maxNesting:flat.maxNesting},{cyclomatic:3,cognitive:2,maxNesting:1});
 assert.deepEqual({cyclomatic:nested.cyclomatic,cognitive:nested.cognitive,maxNesting:nested.maxNesting},{cyclomatic:4,cognitive:7,maxNesting:3});
});

test('baseline comparison reports exact regressions without arbitrary percentages',()=>{
 const summary={maxCyclomatic:19,maxCognitive:20,functionsAboveCyclomatic10:5};
 const result=compareComplexityBaseline(summary,{maxCyclomatic:18,maxCognitive:21,functionsAboveCyclomatic10:5});
 assert.equal(result.passed,false);
 assert.deepEqual(result.regressions,[{metric:'maxCyclomatic',baseline:18,observed:19}]);
});

test('nested callbacks are measured independently and class metrics aggregate methods',()=>{
 const source=`class Example { run(values:number[]) { return values.filter(value => value > 0); } stop() {} }`;
 const result=new ComplexityAnalyzer().analyze('fixture.ts',source);
 assert.equal(result.functions.length,3);
 assert.equal(result.classes[0].methods,2);
 assert.equal(result.classes[0].cyclomatic,2);
 const summary=complexitySummary([result]);
 assert.equal(summary.functionCount,3);
 assert.equal(summary.classCount,1);
 assert.equal(summary.functions.length,3);
 assert.equal(summary.classMetrics.length,1);
});
