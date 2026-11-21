import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const config=readFileSync(resolve(root,'src/legal/legal-config.ts'),'utf8');
const app=readFileSync(resolve(root,'src/observatory/App.tsx'),'utf8');
const forbidden=[/localStorage\s*\./,/sessionStorage\s*\./,/document\.cookie\s*=/,/googletagmanager/i,/google-analytics/i,/facebook\.net\/.*fbevents/i];
const sourceFiles=['src/observatory/App.tsx','src/observatory/catalog-client.ts','src/candidates/CandidateProfiles.tsx'];
const violations=[];
for(const file of sourceFiles){
 const text=readFileSync(resolve(root,file),'utf8');
 for(const pattern of forbidden) if(pattern.test(text)) violations.push(`${file}: ${pattern}`);
}
for(const label of ['Aviso legal','Privacidad','Cookies']) if(!app.includes(`>${label}<`)) violations.push(`footer: missing ${label}`);
if(process.argv.includes('--release')){
 for(const field of ['controllerName','taxId','legalAddress','privacyEmail']){
  if(new RegExp(`${field}:\\s*''`).test(config)) violations.push(`legal identity: ${field} is empty`);
 }
 if(config.includes("version: '1.0-draft'")) violations.push('legal document version is still draft');
}
if(violations.length){console.error(violations.join('\n'));process.exit(1);}
console.log('Legal compliance guardrails: OK');
