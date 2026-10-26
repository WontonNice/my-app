// Disposable Content Studio: real writers and renderers, isolated content files.
// Run: node tools/preview-content-studio.mjs [--port=4320]
import { createServer } from 'node:http';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const toolsRoot = dirname(fileURLToPath(import.meta.url));
const sourceRoot = resolve(toolsRoot, '..');
const fixtureRoot = join(toolsRoot, '.content-drafts');
await mkdir(fixtureRoot, { recursive: true });
const resumeArgument=process.argv.find(argument=>argument.startsWith('--resume='));
const fixture = resumeArgument ? resolve(resumeArgument.slice('--resume='.length)) : await mkdtemp(join(fixtureRoot, 'qa-'));
if(dirname(fixture)!==fixtureRoot || !fixture.startsWith(join(fixtureRoot,'qa-')))throw new Error('Resume only an existing disposable qa-* directory under tools/.content-drafts.');
const modulePath = join(toolsRoot, `.content-studio-qa-${process.pid}.mjs`);
const baseline = process.argv.includes('--baseline');
await mkdir(join(fixture, 'tools'), { recursive: true });
await mkdir(join(fixture, 'server/data'), { recursive: true });
for (const path of resumeArgument ? [] : ['client/src/content', 'client/src/styles', 'client/src/lib/studentMaterials.ts', 'client/public', 'server/src/shared', 'server/data/assessments.json', 'tools/practice-topics.json', 'tools/content-topics.json', 'tools/math-topics.json', 'tools/content-studio-glossary.js']) {
  await mkdir(dirname(join(fixture, path)), { recursive: true });
  await cp(join(sourceRoot, path), join(fixture, path), { recursive: true });
}
if(!resumeArgument)await writeFile(join(fixture, 'server/data/question-bank.json'), JSON.stringify({ revision: 0, questions: [], sets: [] }));
if (baseline) {
  for (const name of (await readdir(toolsRoot)).filter(name => /^content-studio.*\.(html|js|css)$/.test(name) || name === 'document-import.cjs')) {
    let original;
    try { original = execFileSync('git', ['show', `HEAD:tools/${name}`], { cwd: sourceRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); }
    catch { continue; } // New UI-only assets are absent from the baseline.
    await writeFile(join(fixture, 'tools', name), original);
  }
}
let source = baseline ? execFileSync('git', ['show', 'HEAD:tools/content-studio.mjs'], { cwd: sourceRoot, encoding: 'utf8' }) : await readFile(join(toolsRoot, 'content-studio.mjs'), 'utf8');
source = source.replace('const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");', `const workspaceRoot = ${JSON.stringify(fixture)};\nconst sourceRoot = ${JSON.stringify(sourceRoot)};`);
for (const name of ['appStylesPath', 'katexDistRoot', 'mathliveRoot', ...(!baseline ? ['editorHtmlPath'] : [])]) {
  source = source.replace(new RegExp(`const ${name} = join\\(workspaceRoot,`), `const ${name} = join(sourceRoot,`);
}
if (!baseline) source = source.replace('readFile(join(workspaceRoot, "tools", url.pathname.slice(1))', 'readFile(join(sourceRoot, "tools", url.pathname.slice(1))');
if (!baseline) source = source.replaceAll("readFile(join(workspaceRoot, 'tools', url.pathname.slice(1))", "readFile(join(sourceRoot, 'tools', url.pathname.slice(1))")
  .replace("readFile(join(workspaceRoot, 'tools/content-studio-part-b.js')", "readFile(join(sourceRoot, 'tools/content-studio-part-b.js')");
source = source.replace('mathPreviewAsset(workspaceRoot, url.pathname)', 'mathPreviewAsset(sourceRoot, url.pathname)');
source = source.replace('mathCommandAsset(workspaceRoot, url.pathname)', 'mathCommandAsset(sourceRoot, url.pathname)');
source = source.split('if (process.argv.includes("--validate"))')[0] + '\nexport { handleRequest };\n';
await writeFile(modulePath, source);
let studio;
try { studio = await import(pathToFileURL(modulePath).href); }
finally { await rm(modulePath, { force: true }); }
let failNextSave = false;
const server = createServer((request, response) => {
  if (request.method === 'POST' && request.url === '/__qa/fail-next-save') {
    failNextSave = true; response.writeHead(200); response.end('The next content save will fail in this disposable fixture.'); return;
  }
  if (failNextSave && request.method === 'POST' && ['/api/document-drafts', '/api/passages', '/api/advanced-passages', '/api/math', '/api/math/import', '/api/standalone-items', '/api/tests'].includes(request.url)) {
    failNextSave = false; response.writeHead(503, { 'Content-Type': 'application/json' }); response.end(JSON.stringify({ message: 'Simulated save failure in the disposable QA workspace. Your draft is retained.' })); return;
  }
  studio.handleRequest(request, response);
});
const port = Number(process.argv.find(arg => arg.startsWith('--port='))?.slice(7) || 4320);
server.listen(port, '127.0.0.1', () => console.log(`Disposable Content Studio: http://127.0.0.1:${port}\nIsolated content: ${fixture}\nUI assets are read live from the repository. Production content is never written.`));
let closing = false;
async function close() {
  if (closing) return; closing = true;
  await new Promise(resolve => server.close(resolve));
  // Only the exact disposable directory created above may be removed.
  if (!resumeArgument && !process.argv.includes('--keep') && dirname(fixture) === fixtureRoot && fixture.startsWith(join(fixtureRoot, 'qa-'))) await rm(fixture, { recursive: true, force: true });
  process.exit(0);
}
process.on('SIGINT', close); process.on('SIGTERM', close);
