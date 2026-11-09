const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { once } = require('node:events');
const { waitForApi } = require('./wait-for-api.cjs');
const { isApiListening, startStudentDev } = require('./dev-student.cjs');

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

test('student startup reuses a listening API without taking ownership of its process', async t => {
  const { server } = await fixture(t, (_request, response) => response.end('{"ok":true,"status":"up"}'));
  const port = server.address().port;
  let launched;
  await startStudentDev({
    checkApi: () => isApiListening({ port }), log() {},
    run(commands, options) { launched = { commands, options }; return { result: Promise.resolve() }; },
  });
  assert.equal(launched.commands.length, 1, 'do not launch or stop the teacher-owned API');
  assert.match(launched.commands[0].command, /wait-for-api\.cjs && .*--port 5174 --strictPort/);
  assert.equal(server.listening, true);
});

test('student startup starts a missing API and health-gates the frontend in the same process group', async () => {
  const socket = createServer();
  socket.listen(0, '127.0.0.1');
  await once(socket, 'listening');
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  let launched;
  await startStudentDev({
    checkApi: () => isApiListening({ port }), log() {},
    run(commands, options) { launched = { commands, options }; return { result: Promise.resolve() }; },
  });
  assert.equal(launched.commands.filter(item => item.command === 'npm run dev:server').length, 1);
  assert.match(launched.commands.find(item => item.name === 'student').command, /^node tools\/wait-for-api\.cjs && /);
  assert.deepEqual(launched.options.killOthersOn, ['failure', 'success'], 'an owned API cannot leave an unusable frontend behind when it exits');
});

test('uncertain port ownership and process failures are reported, not swallowed', async () => {
  await assert.rejects(startStudentDev({ checkApi: async () => { throw Error('Port check failed'); }, run() { assert.fail('must not spawn'); } }), /Port check failed/);
  await assert.rejects(startStudentDev({ checkApi: async () => false, log() {}, run: () => ({ result: Promise.reject(new Error('API startup failed')) }) }), /API startup failed/);
});
