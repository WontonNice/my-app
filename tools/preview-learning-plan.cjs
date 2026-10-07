// Local, isolated QA server: never connects to Supabase or real students.
const path = require('node:path');
const http = require('node:http');
const esbuild = require('esbuild');
(async () => {
  const result = await esbuild.build({ entryPoints: [path.resolve(__dirname, 'learning-plan-preview.tsx')], bundle: true, write: false, outdir: path.resolve(__dirname, '.learning-plan-preview'), format: 'esm', jsx: 'automatic', loader: { '.woff': 'file', '.woff2': 'file', '.ttf': 'file' }, define: { 'import.meta.env': '{}' } });
  const files = new Map(result.outputFiles.map(file => ['/' + path.basename(file.path), file.contents]));
  http.createServer((request, response) => {
    const url = request.url.split('?')[0], file = files.get(url);
    response.setHeader('Content-Type', file ? url.endsWith('.js') ? 'text/javascript' : 'text/css' : 'text/html');
    response.end(file || '<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Learning plan · isolated QA</title><link rel="stylesheet" href="/learning-plan-preview.css"><div id="root"></div><script type="module" src="/learning-plan-preview.js"></script></html>');
  }).listen(4324, '127.0.0.1', () => console.log('Learning plan QA: http://127.0.0.1:4324'));
})();
