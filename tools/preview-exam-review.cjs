const path = require('node:path');
const http = require('node:http');
const esbuild = require('esbuild');
(async () => {
  const output = path.resolve(__dirname, '.exam-review-preview');
  const built = await esbuild.build({ entryPoints: [path.resolve(__dirname, 'exam-review-preview.tsx')], bundle: true, write: false, outdir: output, format: 'esm', jsx: 'automatic', loader: { '.woff': 'file', '.woff2': 'file', '.ttf': 'file' }, define: { 'import.meta.env': '{}' } });
  const files = new Map(built.outputFiles.map(file => ['/' + path.basename(file.path), file.contents]));
  const server = http.createServer((request, response) => {
    const url = request.url.split('?')[0];
    const file = files.get(url);
    response.setHeader('Content-Type', file ? url.endsWith('.js') ? 'text/javascript' : url.endsWith('.css') ? 'text/css' : 'application/octet-stream' : 'text/html');
    response.end(file || '<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Exam review · isolated QA</title><link rel="stylesheet" href="/exam-review-preview.css"><style>body{margin:0;font-family:system-ui}*{box-sizing:border-box}</style><div id="root"></div><script type="module" src="/exam-review-preview.js"></script></html>');
  });
  server.listen(4321, '127.0.0.1', () => console.log('Isolated visual QA at http://127.0.0.1:4321/results/test-exam/corrections and /teacher'));
})();
