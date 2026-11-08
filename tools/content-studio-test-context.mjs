import assert from 'node:assert/strict';
import { resolve, sep, join } from 'node:path';
import { readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import persistence from './practice-catalog-service.cjs';

/** Run file-authoring fixtures without opening the user's database connection. */
export function isolateStudioPersistence(t) {
  const fixtureRoot = resolve(fileURLToPath(new URL('./.content-drafts', import.meta.url)));
  const original = persistence.withSharedMathContext;
  persistence.withSharedMathContext = async (root, operation) => {
    assert.ok(resolve(root).startsWith(fixtureRoot + sep), 'Offline persistence is restricted to isolated editor fixtures.');
    return operation();
  };
  t.after(() => { persistence.withSharedMathContext = original; });
}

/** Retain the real form required by studentMaterials and every passage/bank record. */
export async function focusStudioFixture(root) {
  const fixtureRoot = resolve(fileURLToPath(new URL('./.content-drafts', import.meta.url)));
  assert.ok(resolve(root).startsWith(fixtureRoot + sep), 'Fixture reduction cannot target the working project.');
  const examsRoot = join(root, 'client/src/content/exams');
  const testFile = 'formA2025_2026.ts';
  const testSource = await readFile(join(examsRoot, 'tests', testFile), 'utf8');
  const exportName = testSource.match(/export const (\w+)/)?.[1];
  const assessmentId = testSource.match(/assessmentId:\s*["']([^"']+)["']/)?.[1];
  const mathFile = testSource.match(/from ["']\.\.\/mathSets\/([^"']+)["']/)?.[1] + '.ts';
  assert.ok(exportName && assessmentId && mathFile !== 'undefined.ts');
  const registryPath = join(root, 'server/data/assessments.json');
  const assessments = JSON.parse(await readFile(registryPath, 'utf8')).filter(a => a.id === assessmentId);
  assert.equal(assessments.length, 1);
  const indexPath = join(examsRoot, 'index.ts');
  const index = (await readFile(indexPath, 'utf8')).split('\n').filter(line => {
    if (line.includes('from "./tests/')) return line.includes(`{ ${exportName} }`);
    if (/^\s*\[.*\.assessmentId\]:/.test(line)) return line.includes(`[${exportName}.assessmentId]`);
    return true;
  }).join('\n');
  await writeFile(indexPath, index);
  for (const [folder, keep] of [['tests', testFile], ['mathSets', mathFile]]) {
    const directory = join(examsRoot, folder);
    for (const file of await readdir(directory)) if (file.endsWith('.ts') && file !== keep) await rm(join(directory, file));
  }
  await writeFile(registryPath, JSON.stringify(assessments));
  await writeFile(join(root, 'server/data/activity-releases.json'), '{}\n');
  await writeFile(join(root, 'server/data/worksheets.json'), '[]\n');
}
