import ts from 'typescript';
import { gzipSync } from 'node:zlib';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { demoCatalog, ObservatoryService } from '../../shared/catalog.ts';
import { parseCatalog } from '../../shared/catalog-validation.ts';

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

function complexity(node) {
  let score=1;
  function walk(item) {
    // Decision count approximates McCabe; do not present it as cognitive complexity.
    if(ts.isIfStatement(item)||ts.isForStatement(item)||ts.isForInStatement(item)||
      ts.isForOfStatement(item)||ts.isWhileStatement(item)||ts.isDoStatement(item)||
      ts.isConditionalExpression(item)||ts.isCatchClause(item)||
      (ts.isCaseClause(item))) score++;
    if(ts.isBinaryExpression(item)&&[
      ts.SyntaxKind.AmpersandAmpersandToken,ts.SyntaxKind.BarBarToken,
      ts.SyntaxKind.QuestionQuestionToken
    ].includes(item.operatorToken.kind)) score++;
    ts.forEachChild(item,walk);
  }
  ts.forEachChild(node,walk);
  return score;
}

const measurements=[];
for(const file of (await Promise.all(srcRoots.map(filesIn))).flat().sort()) {
  const abs=path.join(root,file);
  const code=await readFile(abs,'utf8');
  const tree=ts.createSourceFile(file,code,ts.ScriptTarget.Latest,true);
  function visit(n) {
    if(ts.isFunctionDeclaration(n)||ts.isMethodDeclaration(n)||
      ts.isConstructorDeclaration(n)||ts.isArrowFunction(n)||ts.isFunctionExpression(n)) {
      const location=tree.getLineAndCharacterOfPosition(n.getStart(tree));
      measurements.push({file:file.replaceAll('\\','/'),line:location.line+1,
        name:n.name?.getText(tree)??'(anonymous)',cyclomaticEstimate:complexity(n)});
    }
    ts.forEachChild(n,visit);
  }
  visit(tree);
}
measurements.sort((a,b)=>b.cyclomaticEstimate-a.cyclomaticEstimate||a.file.localeCompare(b.file));

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
  complexity:'Approximate per-function McCabe score from TypeScript AST: 1 + branches/loops/catches/case/ternaries/logical operators. Nested functions are independently counted AND also visited by enclosing functions; compare trend only, not precise complexity.',
  gzip:'gzipSync default on generated web/dist JS/CSS; not actual HTTP transfer size.',
  benchmark:'300 iterations, 30 warmups, single process, in-memory synthetic catalog; median and p95 wall-clock ms; no end-user latency measurement.'
 },
 functionsAnalyzed:measurements.length,
 highestComplexity:measurements.slice(0,15),
 bundle:dist,
 bundleGzipTotalBytes:dist.reduce((sum,x)=>sum+x.gzipBytes,0),
 benchmark
};
console.log(JSON.stringify(report,null,2));
