import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(webRoot, '..');
const requirementsPath = resolve(root, 'documentacion/REQUISITOS.md');
const matrixPath = resolve(root, 'documentacion/trazabilidad.json');
const allowedStatuses = new Set(['implemented', 'partial', 'policy', 'pending', 'blocked']);

const requirementsDocument = await readFile(requirementsPath, 'utf8');
const matrix = JSON.parse(await readFile(matrixPath, 'utf8'));
const declaredIds = new Set(requirementsDocument.match(/\b(?:RF|RNF)\d+[a-z]?\b/g) ?? []);
const mappedIds = new Set();
const errors = [];

for (const requirement of matrix.requirements ?? []) {
  if (mappedIds.has(requirement.id)) errors.push(`duplicate requirement: ${requirement.id}`);
  mappedIds.add(requirement.id);
  if (!allowedStatuses.has(requirement.status)) errors.push(`invalid status for ${requirement.id}`);
  if (!Array.isArray(requirement.evidence)) errors.push(`invalid evidence for ${requirement.id}`);
  if (['implemented', 'partial', 'policy'].includes(requirement.status) && !requirement.evidence?.length) {
    errors.push(`missing evidence for ${requirement.id}`);
  }
  for (const evidence of requirement.evidence ?? []) {
    try {
      const content = await readFile(resolve(root, evidence.file), 'utf8');
      if (evidence.contains && !content.includes(evidence.contains)) {
        errors.push(`evidence text missing for ${requirement.id}: ${evidence.file}`);
      }
    } catch {
      errors.push(`evidence file missing for ${requirement.id}: ${evidence.file}`);
    }
  }
}

for (const id of declaredIds) if (!mappedIds.has(id)) errors.push(`unmapped requirement: ${id}`);
for (const id of mappedIds) if (!declaredIds.has(id)) errors.push(`unknown requirement: ${id}`);

if (errors.length) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else {
  console.log(`Traceability valid: ${mappedIds.size} requirements, ${matrix.requirements.reduce((sum, item) => sum + item.evidence.length, 0)} evidence links.`);
}
