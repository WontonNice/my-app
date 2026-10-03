const path = require('node:path');
const http = require('node:http');
const esbuild = require('esbuild');
const { execFileSync } = require('node:child_process');
(async () => {
  const options = { entryPoints: [path.resolve(__dirname, 'student-analytics-preview.tsx')], bundle: true, write: false, outdir: path.resolve(__dirname, '.student-analytics-preview'), format: 'esm', jsx: 'automatic', loader: { '.woff': 'file', '.woff2': 'file', '.ttf': 'file' }, define: { 'import.meta.env': '{}' } };
  const built = await esbuild.build(options);
  const original = execFileSync('git', ['show', 'HEAD:client/src/pages/TeacherDashboardPage.tsx'], { cwd: path.resolve(__dirname, '..'), encoding: 'utf8' });
  const legacy = await esbuild.build({ ...options, entryNames: 'student-analytics-legacy', plugins: [{ name: 'original-dashboard-for-qa', setup(build) {
    build.onLoad({ filter: /TeacherDashboardPage\.tsx$/ }, args => ({ contents: original.replace('function StudentDetail(', 'export function StudentDetail('), loader: 'tsx', resolveDir: path.dirname(args.path) }));
  } }] });
  const files = new Map([...built.outputFiles, ...legacy.outputFiles].map(file => ['/' + path.basename(file.path), file.contents]));
  const server = http.createServer((request, response) => {
    const url = request.url.split('?')[0];
    const file = files.get(url);
    response.setHeader('Content-Type', file ? url.endsWith('.js') ? 'text/javascript' : url.endsWith('.css') ? 'text/css' : 'application/octet-stream' : 'text/html');
    const entry = url === '/legacy' ? 'student-analytics-legacy' : 'student-analytics-preview';
    response.end(file || `<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Student analytics · isolated QA</title><link rel="stylesheet" href="/${entry}.css"><div id="root"></div><script type="module" src="/${entry}.js"></script></html>`);
  });
  server.listen(4323, '127.0.0.1', () => console.log('Student analytics QA at http://127.0.0.1:4323'));
})();
