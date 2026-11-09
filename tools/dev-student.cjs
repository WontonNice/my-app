const net = require('node:net');
const path = require('node:path');

// A teacher terminal may already own the shared API. Never start a second
// server on its port; the health gate below also verifies it is the right API.
function isApiListening({ port = 8080, host = '127.0.0.1' } = {}) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port });
    socket.setTimeout(2000);
    socket.once('connect', () => { socket.destroy(); resolve(true); });
    socket.once('error', error => {
      socket.destroy();
      if (error.code === 'ECONNREFUSED') resolve(false);
      else reject(error);
    });
    socket.once('timeout', () => { socket.destroy(); reject(new Error('The local API port did not respond. Check the existing server before starting another one.')); });
  });
}

async function startStudentDev({ checkApi = isApiListening, run = require('concurrently'), log = console.log } = {}) {
  const existingApi = await checkApi();
  log(existingApi ? 'Using the existing local API.' : 'Starting the local API for the student app.');
  const commands = [
    ...(!existingApi ? [{ name: 'api', command: 'npm run dev:server' }] : []),
    { name: 'student', command: 'node tools/wait-for-api.cjs && npm run dev --workspace client -- --port 5174 --strictPort' },
  ];
  // concurrently manages the owned process trees on exit, including Windows.
  // A reused API is deliberately outside this group and is never stopped here.
  return run(commands, { cwd: path.resolve(__dirname, '..'), killOthersOn: ['failure', 'success'] }).result;
}

module.exports = { isApiListening, startStudentDev };

if (require.main === module) {
  startStudentDev().catch(error => {
    if (error instanceof Error) console.error(error.message);
    process.exitCode = 1;
  });
}
