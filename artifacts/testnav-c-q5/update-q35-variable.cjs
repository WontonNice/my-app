const fs = require('node:fs');
const ts = require('typescript');
const id = 'official-shsat-2026-c-85';
for (const file of ['client/src/content/exams/mathSets/2026-2027-form-cMath.ts', 'client/src/content/exams/tests/2026-2027-form-c.ts']) {
  let text = fs.readFileSync(file, 'utf8');
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true), edits = [];
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const prop = node.properties.find(p => ts.isPropertyAssignment(p) && p.name.getText(ast).replaceAll('"', '') === 'id');
      if (prop && ts.isStringLiteral(prop.initializer) && prop.initializer.text === id) {
        const start = node.getStart(ast), raw = text.slice(start, node.end), question = JSON.parse(raw);
        question.entryVariable = 'b'; question.entryPrefixVariable = 'a';
        const indent = text.slice(text.lastIndexOf('\n', start) + 1, start).match(/^\s*/)[0];
        edits.push({start, end: node.end, text: raw.includes('\n') ? JSON.stringify(question, null, 2).replaceAll('\n', '\n' + indent) : JSON.stringify(question)});
        return;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  for (const edit of edits.sort((a,b) => b.start-a.start)) text = text.slice(0, edit.start) + edit.text + text.slice(edit.end);
  fs.writeFileSync(file, text);
  console.log(file, edits.length, 'question copies updated');
}
const cachePath = 'server/data/exam-content.json';
const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
let count = 0;
function update(value) {
  if (!value || typeof value !== 'object') return;
  if (value.id === id) { value.entryVariable = 'b'; value.entryPrefixVariable = 'a'; count++; }
  for (const child of Object.values(value)) update(child);
}
update(cache['2026-2027-form-c']);
fs.writeFileSync(cachePath, JSON.stringify(cache) + '\n');
console.log('cache:', count, 'question copies updated');
