// Loopback-only browser QA for the real popup/content scripts. No source account,
// extension installation, production bank, or student records are involved.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const extension = resolve('extensions/shsatlab-ela-reader');
const fixtures = resolve('tools/ela-capture-preview');
const server = createServer(async (request, response) => {
  const path = new URL(request.url, 'http://127.0.0.1').pathname;
  const file = path === '/' ? 'index.html' : path.slice(1);
  const allowed = new Set(['index.html', 'source.html', 'source.js', 'mock.js', 'popup.html', 'popup.css', 'popup.js', 'reader.js', 'queue.js', 'automation.js', 'content.js']);
  if (request.method !== 'GET' || !allowed.has(file)) { response.writeHead(404); response.end(); return; }
  try {
    let body = await readFile(resolve(['index.html', 'source.html', 'source.js', 'mock.js'].includes(file) ? fixtures : extension, file), 'utf8');
    if (file === 'popup.html') body = body.replace('<script src="reader.js">', '<script src="mock.js"></script><script src="reader.js">');
    // A synthetic fixture URL only, never used by the shipped extension.
    if (file === 'content.js') body = body.replace('getUrl: () => location.href', 'getUrl: () => "https://www.shsatlab.com/units/unit-1/practice?fixture=local"');
    response.writeHead(200, { 'Content-Type': file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html', 'Cache-Control': 'no-store' }); response.end(body);
  } catch { response.writeHead(500); response.end('Fixture unavailable'); }
});
server.listen(4329, '127.0.0.1', () => console.log('Synthetic ELA capture QA: http://127.0.0.1:4329/'));
process.on('SIGINT', () => server.close(() => process.exit()));
process.on('SIGTERM', () => server.close(() => process.exit()));
