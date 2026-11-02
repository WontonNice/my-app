// Read-only comparison: load the pre-change learning-plan implementation in memory.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = fs.readFileSync;
const sources = new Map(['server/src/shared/learningPlan.ts', 'server/src/routes/learningPlan.ts'].map(file => [
  path.resolve(root, file),
  cp.execFileSync('git', ['show', 'HEAD:' + file], { cwd: root, encoding: 'utf8', windowsHide: true }),
]));
fs.readFileSync = function(file, options) {
  const source = typeof file === 'string' ? sources.get(path.resolve(file)) : undefined;
  if (source !== undefined) return (typeof options === 'string' ? options : options?.encoding) ? source : Buffer.from(source);
  return read.apply(this, arguments);
};
