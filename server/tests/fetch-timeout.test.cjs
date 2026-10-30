const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json') });
const { fetchWithTimeout } = require('../src/lib/fetchWithTimeout.ts');
let server, root;
before(async () => {
  server = http.createServer((request, response) => {
    if (request.url === '/headers') { response.writeHead(200, { 'Content-Type': 'application/json' }); response.flushHeaders(); return; }
    if (request.url === '/hang') return;
    if (request.url === '/empty') { response.writeHead(204); response.end(); return; }
    response.writeHead(200, { 'Content-Type': 'application/json', 'X-Test': 'preserved' });
    response.end('{"ok":true}');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  root = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); });

test('upstream deadline covers both stalled headers and stalled response bodies', async () => {
  for (const route of ['/hang', '/headers']) await assert.rejects(fetchWithTimeout(root + route, {}, 50), { name: 'AbortError' });
});
test('JSON, headers, and empty success responses survive the bounded fetch', async () => {
  const response = await fetchWithTimeout(root, {}, 1000);
  assert.equal(response.headers.get('X-Test'), 'preserved');
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal((await fetchWithTimeout(root + '/empty', {}, 1000)).status, 204);
});
test('upstream fetch honors caller cancellation', async () => {
  const controller = new AbortController();
  const pending = fetchWithTimeout(root + '/hang', { signal: controller.signal }, 1000);
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
});
