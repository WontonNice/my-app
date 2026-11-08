const fs = require('node:fs');
const ts = require('typescript');

// Cache compiled code only, never evaluated modules or question data. Exporters
// still reload their module graphs and validate the current authored content.
function createTranspiler({ maxEntries = 512, compile = source => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText } = {}) {
  const entries = new Map();
  return (filename, source) => {
    const prior = entries.get(filename);
    if (prior?.source === source) {
      entries.delete(filename);
      entries.set(filename, prior);
      return prior.output;
    }
    const output = compile(source);
    entries.delete(filename);
    entries.set(filename, { source, output });
    if (entries.size > maxEntries) entries.delete(entries.keys().next().value);
    return output;
  };
}
const transpile = createTranspiler();
function compileContentModule(module, filename) {
  // Compare actual bytes, not timestamps: rapid edits and Git pulls must be seen.
  module._compile(transpile(filename, fs.readFileSync(filename, 'utf8')), filename);
}
module.exports = { createTranspiler, compileContentModule };
