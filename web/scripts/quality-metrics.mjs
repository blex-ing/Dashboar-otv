import { gzipSync } from 'node:zlib';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { demoCatalog, ObservatoryService } from '../../shared/catalog.ts';
import { parseCatalog } from '../../shared/catalog-validation.ts';
import { ComplexityAnalyzer, compareComplexityBaseline, complexitySummary } from './complexity-analyzer.mjs';

const root = path.resolve('..');
const srcRoots = ['shared', 'worker', 'web/src'];
const executableExtensions = new Set(['.ts', '.tsx', '.js', '.mjs']);
const choices = {repetitions:300, warmup:30};

async function filesIn(relative) {
  const abs=path.join(root,relative);
  const entries=await readdir(abs,{withFileTypes:true});
  const result=[];
  for(const item of entries) {
    const rel=path.join(relative,item.name);
    if(item.isDirectory()) result.push(...await filesIn(rel));
    else if(executableExtensions.has(path.extname(item.name))) result.push(rel);
  }
  return result;
}

const analyzer=new ComplexityAnalyzer();
const analyzedFiles=[];
for(const file of (await Promise.all(srcRoots.map(filesIn))).flat().sort()) {
  const code=await readFile(path.join(root,file),'utf8');
  analyzedFiles.push(analyzer.analyze(file.split(path.sep).join('/'),code));
}
const complexity=complexitySummary(analyzedFiles);
const baseline=JSON.parse(await readFile(path.join(root,'web/quality-baseline.json'),'utf8'));
const complexityComparison=compareComplexityBaseline(complexity,baseline.budgets);

async function sizeOfDist() {
 const assets=await filesIn('web/dist').catch(()=>[]);
 return Promise.all(assets.filter(f=>/\.(js|css)$/.test(f)).map(async f=>{
  const input=await readFile(path.join(root,f));
  return {file:f.replaceAll('\\','/'),bytes:input.byteLength,gzipBytes:gzipSync(input).byteLength};
 }));
}
const dist=(await sizeOfDist()).sort((a,b)=>b.gzipBytes-a.gzipBytes);

function sample(fn) {
 for(let i=0;i<choices.warmup;i++)fn();
 const ms=[];
 for(let i=0;i<choices.repetitions;i++) {
  const t=performance.now();fn();ms.push(performance.now()-t);
 }
 ms.sort((a,b)=>a-b);
 return {medianMs:ms[Math.floor(ms.length/2)],p95Ms:ms[Math.floor(ms.length*.95)]};
}
const catalog=structuredClone(demoCatalog);
const service=new ObservatoryService(catalog);
const benchmark={
  parseCatalog:sample(()=>parseCatalog(catalog)),
  summaryAndRanking:sample(()=>{
   for(const locality of catalog.territories) {
    const edition=service.territory(locality.id);
    service.summary(edition);
    service.ranking(edition);
    service.claims(edition,'','','','transparencia');
   }
  })
};
const report={
 generatedAt:new Date().toISOString(),
 environment:{node:process.version,platform:process.platform,arch:process.arch},
 methodology:{
  complexity:'TypeScript 6 AST. Cyclomatic: base 1 plus if/loops/catch/non-default case/conditional/logical operator. Cognitive: structural breaks plus current nesting, else and break/continue; one increment per uninterrupted logical-operator sequence. This is a documented project metric, not Sonar cognitive complexity.',
  gzip:'gzipSync default on generated web/dist JS/CSS; not actual HTTP transfer size.',
  benchmark:'300 iterations, 30 warmups, single process, in-memory synthetic catalog; median and p95 wall-clock ms; no end-user latency measurement.'
 },
 filesAnalyzed:analyzedFiles.length,
 complexity,
 complexityRegression:{
  baseline:{source:baseline.source,method:baseline.method,budgets:baseline.budgets},
  ...complexityComparison
 },
 bundle:dist,
 bundleGzipTotalBytes:dist.reduce((sum,x)=>sum+x.gzipBytes,0),
 benchmark
};
console.log(JSON.stringify(report,null,2));
if(process.argv.includes('--check-baseline')&&!complexityComparison.passed) {
 console.error('Complexity baseline regressions:',JSON.stringify(complexityComparison.regressions));
 process.exitCode=1;
}
