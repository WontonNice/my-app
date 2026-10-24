// Local visual QA only: real AFK/controller/sync code with synthetic source DOM.
// All bank writes go to the disposable Content Studio on port 4324, never 4319.
const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const { join } = require('node:path');
const { createHash } = require('node:crypto');
const { fixture } = require('../extensions/shsatlab-ela-reader/automation-fixture.cjs');
const { create: createBulk } = require('../extensions/shsatlab-ela-reader/bulk.js');
const { create: createSync } = require('../extensions/shsatlab-ela-reader/editor-sync.js');
const { identity } = require('../extensions/shsatlab-ela-reader/queue.js');
const root = join(__dirname, '../extensions/shsatlab-ela-reader');
const memory = { elaQueue: [], elaSyncEnabled: false };
const storage = { get: async () => structuredClone(memory), set: async values => Object.assign(memory, structuredClone(values)) };
const sync = createSync({ storage, origin: 'http://127.0.0.1:4319', fetch: (path, options) => fetch('http://127.0.0.1:4324' + path, options), fingerprint: async question => createHash('sha256').update(identity(question) + question.explanation).digest('hex') });
const page = fixture({ onSave: async state => { memory.elaQueue = structuredClone(state.queue); memory.elaLatest = memory.elaQueue.at(-1); await sync.sync(); } });
const bulk = createBulk({ controller: page.controller, reader: page.reader, identity, getUrl: () => page.state.url, readJob: async () => memory.elaBulkJob, writeJob: job => storage.set({ elaBulkJob: job }) });
const bridge = `
const listeners=[]; let previous='';
async function call(path,body){const r=await fetch(path,body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return r.json();}
window.chrome={tabs:{query:async()=>[{id:1,url:'https://www.shsatlab.com/units/unit-1/practice'}],create:async()=>({id:2}),sendMessage:async(id,message)=>call(message.type==='NATHAN_START_ELA_BULK'?'/qa/start':'/qa/capture',message)},storage:{local:{get:async()=>call('/qa/state'),set:async values=>call('/qa/storage',values)},onChanged:{addListener:fn=>listeners.push(fn)}}};
setInterval(async()=>{const data=await call('/qa/state'),key=JSON.stringify(data);if(key!==previous){previous=key;for(const listener of listeners)listener({elaQueue:{newValue:data.elaQueue},elaBulkJob:{newValue:data.elaBulkJob},elaEditorSync:{newValue:data.elaEditorSync}},'local');}},300);
`;
const server = createServer(async (request, response) => {
  const send = (data, type = 'application/json') => { response.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' }); response.end(type === 'application/json' ? JSON.stringify(data) : data); };
  try {
    if (request.url === '/qa/state') return send(memory);
    if (request.url === '/qa-bridge.js') return send(bridge, 'text/javascript');
    if (request.method === 'POST') {
      let body = ''; for await (const chunk of request) body += chunk; const input = JSON.parse(body);
      if (request.url === '/qa/storage') { Object.assign(memory, input); return send({ ok: true }); }
      if (request.url === '/qa/start') return send({ job: await bulk.start({ count: input.count, delayMs: input.delayMs, allowSubmit: input.allowSubmit }) });
      if (request.url === '/qa/capture') return send(await page.controller.run(input));
      throw new Error('Unsupported preview action.');
    }
    const name = request.url === '/' ? 'popup.html' : request.url.slice(1);
    if (!['popup.html', 'popup.css', 'popup.js', 'reader.js', 'queue.js'].includes(name)) { response.writeHead(404); response.end(); return; }
    let source = await readFile(join(root, name), 'utf8');
    if (name === 'popup.html') source = source.replace('<body>', '<body><p style="background:#fff1ca;padding:8px;border-radius:6px">QA preview · synthetic questions · imports only to disposable editor port 4324</p>').replace('<script src="reader.js">', '<script src="/qa-bridge.js"></script><script src="reader.js">');
    send(source, name.endsWith('.html') ? 'text/html' : name.endsWith('.css') ? 'text/css' : 'text/javascript');
  } catch (error) { send({ error: error.message }); }
});
server.listen(4328, '127.0.0.1', () => console.log('AFK reader QA: http://127.0.0.1:4328 (requires disposable editor on 4324)'));
