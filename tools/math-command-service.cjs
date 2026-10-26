// Reuse the exact catalog and management service used by the authenticated app.
// Content Studio keeps its existing same-origin/edit-token boundary.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const previous = require.extensions['.ts'];
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
try {
  module.exports = {
    ...require(path.join(__dirname,'../server/src/lib/mathCommandCatalogStore.ts')),
    ...require(path.join(__dirname,'../server/src/lib/mathCommandCatalogService.ts')),
  };
} finally { if(previous)require.extensions['.ts']=previous;else delete require.extensions['.ts']; }
