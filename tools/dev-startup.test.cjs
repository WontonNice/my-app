const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { once } = require('node:events');
const { waitForApi } = require('./wait-for-api.cjs');

async function fixture(t, handler) {
  const server = createServer(handler);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => {
    server.closeAllConnections();
    server.close(resolve);
  }));
  return { server, url: `http://127.0.0.1:${server.address().port}/health` };
}

test('frontend waits for a healthy API response, not merely an open port', async t => {
  let requests = 0;
  const { url } = await fixture(t, (request, response) => {
    assert.equal(request.url, '/health');
    requests++;
    response.setHeader('Content-Type', 'application/json');
    if (requests === 1) response.writeHead(503).end('{"ok":false}');
    else if (requests === 2) response.end('{"ok":true,"status":"starting"}');
    else response.end('{"ok":true,"status":"up"}');
  });
  await waitForApi({ url, pollMs: 5, timeoutMs: 2000 });
  assert.equal(requests, 3);
});

test('refused connections recover when the API starts listening later', async t => {
  const server = createServer((_request, response) => response.end('{"ok":true,"status":"up"}'));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  let ready = false;
  const waiting = waitForApi({ url: `http://127.0.0.1:${port}/health`, pollMs: 10, timeoutMs: 2000 }).then(() => { ready = true; });
  await new Promise(resolve => setTimeout(resolve, 50));
  assert.equal(ready, false, 'the frontend must not proceed before the API listens');
  server.listen(port, '127.0.0.1');
  t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
  await waiting;
  assert.equal(ready, true);
});

test('an unrelated HTML server or a stalled response cannot release the startup gate', async t => {
  for (const stalled of [false, true]) {
    await t.test(stalled ? 'stalled API' : 'HTML response', async t => {
      const { url } = await fixture(t, (_request, response) => {
        if (!stalled) response.end('<html>Not the API</html>');
      });
      await assert.rejects(waitForApi({ url, pollMs: 5, requestTimeoutMs: 20, timeoutMs: 100 }), /frontend was not started/);
    });
  }
});
