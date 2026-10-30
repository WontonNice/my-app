const {createRequire} = require('node:module');
const {join,dirname} = require('node:path');
// Tool entry points live outside client/. Resolve every React import through
// the client so a nested workspace install cannot bundle two hook dispatchers.
module.exports = root => {
  const clientRequire=createRequire(join(root,'client','package.json'));
  return Object.fromEntries(['react','react-dom'].map(name=>[name,dirname(clientRequire.resolve(name+'/package.json'))]));
};
