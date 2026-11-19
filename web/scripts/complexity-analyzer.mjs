import ts from '@typescript/typescript6';

const functionKinds = new Set([
  ts.SyntaxKind.FunctionDeclaration,
  ts.SyntaxKind.FunctionExpression,
  ts.SyntaxKind.ArrowFunction,
  ts.SyntaxKind.MethodDeclaration,
  ts.SyntaxKind.GetAccessor,
  ts.SyntaxKind.SetAccessor,
  ts.SyntaxKind.Constructor,
]);

function isFunctionLike(node) {
  return functionKinds.has(node.kind);
}

function nodeName(node, sourceFile) {
  if (ts.isConstructorDeclaration(node)) return 'constructor';
  if (node.name) return node.name.getText(sourceFile);
  if (ts.isVariableDeclaration(node.parent)) return node.parent.name.getText(sourceFile);
  if (ts.isPropertyAssignment(node.parent)) return node.parent.name.getText(sourceFile);
  const {line,character}=sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return `<anonymous@${line+1}:${character+1}>`;
}

function isLogical(node) {
  return ts.isBinaryExpression(node) && [
    ts.SyntaxKind.AmpersandAmpersandToken,
    ts.SyntaxKind.BarBarToken,
    ts.SyntaxKind.QuestionQuestionToken,
  ].includes(node.operatorToken.kind);
}

function isSameLogicalSequence(node) {
  return isLogical(node.parent) && node.parent.operatorToken.kind === node.operatorToken.kind;
}

export class ComplexityAnalyzer {
  analyze(file,code) {
    const kind=file.endsWith('.tsx') ? ts.ScriptKind.TSX : file.endsWith('.jsx') ? ts.ScriptKind.JSX : ts.ScriptKind.TS;
    const sourceFile=ts.createSourceFile(file,code,ts.ScriptTarget.Latest,true,kind);
    const functions=[];
    const classes=[];

    const visit=node=>{
      if (isFunctionLike(node) && node.body) functions.push(this.#functionMetrics(file,sourceFile,node));
      if (ts.isClassDeclaration(node) || ts.isClassExpression(node)) classes.push(this.#classMetrics(file,sourceFile,node));
      ts.forEachChild(node,visit);
    };
    visit(sourceFile);
    return {file,functions,classes};
  }

  #functionMetrics(file,sourceFile,fn) {
    let cyclomatic=1;
    let cognitive=0;
    let maxNesting=0;

    const walk=(node,nesting=0)=>{
      if (node!==fn && isFunctionLike(node)) return;
      maxNesting=Math.max(maxNesting,nesting);

      if (ts.isIfStatement(node)) {
        cyclomatic+=1;cognitive+=1+nesting;
        walk(node.expression,nesting);
        walk(node.thenStatement,nesting+1);
        if (node.elseStatement) { cognitive+=1;walk(node.elseStatement,nesting+1); }
        return;
      }
      if (ts.isForStatement(node) || ts.isForInStatement(node) || ts.isForOfStatement(node) || ts.isWhileStatement(node) || ts.isDoStatement(node)) {
        cyclomatic+=1;cognitive+=1+nesting;
        ts.forEachChild(node,child=>walk(child,child===node.statement?nesting+1:nesting));
        return;
      }
      if (ts.isCatchClause(node)) {
        cyclomatic+=1;cognitive+=1+nesting;
        ts.forEachChild(node,child=>walk(child,child===node.block?nesting+1:nesting));
        return;
      }
      if (ts.isSwitchStatement(node)) {
        cognitive+=1+nesting;
        walk(node.expression,nesting);
        walk(node.caseBlock,nesting+1);
        return;
      }
      if (ts.isCaseClause(node)) cyclomatic+=1;
      if (ts.isConditionalExpression(node)) { cyclomatic+=1;cognitive+=1+nesting;nesting+=1; }
      if (isLogical(node)) {
        cyclomatic+=1;
        if (!isSameLogicalSequence(node)) cognitive+=1;
      }
      if (ts.isBreakStatement(node) || ts.isContinueStatement(node)) cognitive+=1;
      ts.forEachChild(node,child=>walk(child,nesting));
    };
    walk(fn.body);

    const start=sourceFile.getLineAndCharacterOfPosition(fn.getStart(sourceFile));
    const end=sourceFile.getLineAndCharacterOfPosition(fn.end);
    const name=nodeName(fn,sourceFile);
    return {
      id:`${file}:${name}@${start.line+1}:${start.character+1}`,
      name,
      line:start.line+1,
      column:start.character+1,
      endLine:end.line+1,
      cyclomatic,
      cognitive,
      maxNesting,
    };
  }

  #classMetrics(file,sourceFile,node) {
    const start=sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    const name=node.name?.getText(sourceFile)??`<anonymous@${start.line+1}:${start.character+1}>`;
    const methods=node.members.filter(member=>isFunctionLike(member)&&member.body).map(member=>this.#functionMetrics(file,sourceFile,member));
    return {
      id:`${file}:${name}@${start.line+1}:${start.character+1}`,
      name,
      line:start.line+1,
      methods:methods.length,
      cyclomatic:methods.reduce((sum,item)=>sum+item.cyclomatic,0),
      cognitive:methods.reduce((sum,item)=>sum+item.cognitive,0),
      maxMethodCyclomatic:Math.max(0,...methods.map(item=>item.cyclomatic)),
      maxMethodCognitive:Math.max(0,...methods.map(item=>item.cognitive)),
    };
  }
}

export function complexitySummary(files) {
  const functions=files.flatMap(file=>file.functions);
  const classes=files.flatMap(file=>file.classes);
  return {
    files:files.length,
    functionCount:functions.length,
    classCount:classes.length,
    totalCyclomatic:functions.reduce((sum,item)=>sum+item.cyclomatic,0),
    totalCognitive:functions.reduce((sum,item)=>sum+item.cognitive,0),
    maxCyclomatic:Math.max(0,...functions.map(item=>item.cyclomatic)),
    maxCognitive:Math.max(0,...functions.map(item=>item.cognitive)),
    functionsAboveCyclomatic10:functions.filter(item=>item.cyclomatic>10).length,
    functionsAboveCognitive15:functions.filter(item=>item.cognitive>15).length,
    functions:[...functions].sort((a,b)=>b.cyclomatic-a.cyclomatic||b.cognitive-a.cognitive||a.id.localeCompare(b.id)),
    classMetrics:[...classes].sort((a,b)=>b.cyclomatic-a.cyclomatic||a.id.localeCompare(b.id)),
  };
}

export function compareComplexityBaseline(summary,budgets) {
  const observed=Object.fromEntries(Object.keys(budgets).map(key=>[key,summary[key]]));
  const regressions=Object.entries(budgets)
    .filter(([key,budget])=>observed[key]>budget)
    .map(([key,budget])=>({metric:key,baseline:budget,observed:observed[key]}));
  return {observed,passed:regressions.length===0,regressions};
}
