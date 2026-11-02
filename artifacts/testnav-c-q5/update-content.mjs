import fs from 'node:fs';
const file = 'client/src/content/exams/passageSets/excerpt-from-growing-peppers-on-the-iss-is-just-the-start-of-space-farming-2026-2027-form-c.ts';
const text = fs.readFileSync(file, 'utf8');
const old = JSON.parse(text.match(/"selectionHtml": ("(?:[^"\\]|\\.)*")/)[1]).replaceAll(' data-no-break="true"', '');
const sourceHtml = JSON.parse(fs.readFileSync('artifacts/testnav-c-q5/source.json')).itemBodyHtml;
const noBreakText = new Set([...sourceHtml.matchAll(/<span class="nobreak">([\s\S]*?)<\/span>/g)].map(match => match[1]));
const updated = old.replace(/<span>([\s\S]*?)<\/span>/g, (markup, text) => noBreakText.has(text) ? `<span data-no-break="true">${text}</span>` : markup);
if (updated.replaceAll(' data-no-break="true"', '') !== old) throw Error('Unexpected content change');
// The source prompt has two paragraphs; an emptied interaction wrapper was left behind by import.
for (const target of [file, 'client/src/content/exams/tests/2026-2027-form-c.ts', 'server/data/exam-content.json', 'server/data/assessments.json']) {
  const source = fs.readFileSync(target, 'utf8');
  const occurrences = source.split(JSON.stringify(old)).length - 1;
  const next = source.replaceAll(JSON.stringify(old), JSON.stringify(updated)).replace(/("promptHtml"\s*:\s*)("(?:[^"\\]|\\.)*")/g, (field, prefix, value) => {
    const html = JSON.parse(value);
    return html.includes('food-growing experiment?') ? prefix + JSON.stringify(html.replace(/<div>\s*<\/div>\s*$/, '')) : field;
  });
  if (next !== source) fs.writeFileSync(target, next);
  console.log(target, occurrences, 'matching selection fields updated');
}
