// Verification only: compare existing suites with the pre-task skill-assignment behavior.
// Source files remain untouched. Other in-progress workspace changes are preserved.
const fs = require('node:fs');
const original = fs.readFileSync;
fs.readFileSync = function(file, ...options) {
  const result = original.call(this, file, ...options);
  if (String(file).replaceAll('\\', '/').endsWith('/server/src/shared/practiceCatalog.ts')) {
    const source = String(result).replace("{...item,...(item.titleMode==='custom'?{}:{title:skill.label,titleMode:'skill' as const}),skilled:skill.id,category:skill.category", "{...item,title:skill.label,titleMode:'skill',skilled:skill.id,category:skill.category");
    return typeof result === 'string' ? source : Buffer.from(source);
  }
  return result;
};
