// Static detector with the same routed stylesheets the running editor serves.
// It does not import, edit, save, publish, or request /api/state.
import { readFile, writeFile, mkdir, mkdtemp } from 'node:fs/promises';
import { resolve, dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Usage: node tools/check-content-editor-design.mjs [--url http://127.0.0.1:4322/] [--output directory]\nScans a source snapshot and every routed stylesheet; leaves evidence in the output directory.\nRequires the pinned, verified Impeccable Windows x64 engine. Exit 0: no primary findings; 2: findings; other: incomplete.\nThis static check does not replace rendered viewport, keyboard, or screen-reader tests.');
  process.exit(0);
}
for (let index = 0; index < args.length; index += 2) {
  if (!['--url', '--output'].includes(args[index]) || !args[index + 1] || args[index + 1].startsWith('--')) {
    throw new Error('Expected --url URL or --output directory. Use --help for usage.');
  }
}
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const origin = new URL(option('--url', 'http://127.0.0.1:4322/'));
if (!['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname) || origin.protocol !== 'http:') {
  throw new Error('Use a local Content Studio HTTP URL.');
}
const output = resolve(option('--output', join(root, 'tools/.content-drafts/design-checks')));
await mkdir(output, { recursive: true });
const snapshot = await mkdtemp(join(output, 'source-snapshot-'));
const sourcePath = join(root, 'tools/content-studio.html');
const source = await readFile(sourcePath, 'utf8');
const styles = [];
let html = source;
for (const match of source.matchAll(/<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) {
  const route = match[1], url = new URL(route, origin);
  if (url.origin !== origin.origin) throw new Error(`External stylesheet needs explicit handling: ${route}`);
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Could not read ${route}: HTTP ${response.status}`);
  const css = await response.text();
  const filename = `style-${styles.length}-${basename(url.pathname)}`;
  await writeFile(join(snapshot, filename), css);
  html = html.replace(match[0], match[0].replace(route, `./${filename}`));
  styles.push({ route, snapshotFile: filename, sha256: createHash('sha256').update(css).digest('hex') });
}
if (!styles.length) throw new Error('No stylesheet links found; refusing an incomplete scan.');
await writeFile(join(snapshot, 'content-studio.html'), html);
// Preserve the project's advisory context instead of suppressing design-system findings.
await writeFile(join(snapshot, 'DESIGN.md'), await readFile(join(root, 'DESIGN.md')));
const engine = process.env.IMPECCABLE_BIN || resolve(root, '../.tool-cache/impeccable/bin/0.1.5/impeccable.exe');
const expectedHash = '477e544fc8880a5e82e427490cb9a5f5adab480c0e02966d33fd50772b531c71';
if (createHash('sha256').update(await readFile(engine)).digest('hex') !== expectedHash) throw new Error('Unexpected engine checksum.');
const run = spawnSync(engine, ['detect', '--json', join(snapshot, 'content-studio.html')], { cwd: root, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, windowsHide: true });
await writeFile(join(output, 'impeccable-static.log'), run.stderr || run.error?.message || '');
if (![0, 2].includes(run.status)) throw new Error(`Detector failed (${run.status}); see impeccable-static.log. This is not a completed scan.`);
const findings = JSON.parse(run.stdout);
await writeFile(join(output, 'impeccable-static.json'), JSON.stringify(findings, null, 2));
const group = key => findings.reduce((counts, finding) => ({ ...counts, [finding[key]]: (counts[finding[key]] || 0) + 1 }), {});
const summary = {
  engine: '0.1.5', mode: 'static HTML and routed CSS; not a rendered-browser or screen-reader audit',
  source: sourcePath, sourceSha256: createHash('sha256').update(source).digest('hex'),
  scannedAt: new Date().toISOString(), origin: origin.origin, snapshot, styles,
  exitCode: run.status, total: findings.length, primary: findings.filter(f => !f.advisory && f.severity !== 'advisory').length,
  bySeverity: group('severity'), byRule: group('antipattern'),
};
await writeFile(join(output, 'impeccable-summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
process.exitCode = run.status;
