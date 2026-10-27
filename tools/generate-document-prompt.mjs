import { readFile, writeFile } from 'node:fs/promises';
import contract from './document-import.cjs';
const topics = JSON.parse(await readFile(new URL('./content-topics.json', import.meta.url), 'utf8'));
let sectionTopics = {};
try {sectionTopics=JSON.parse(await readFile(new URL('./content-topic-sections.json',import.meta.url),'utf8'));} catch(error) {if(error.code!=='ENOENT')throw error;}
const mathCategories = JSON.parse(await readFile(new URL('./math-topics.json', import.meta.url), 'utf8')).categories;
const taxonomy = { reading: sectionTopics.reading || topics.slice(0, 8), revising_editing_a: sectionTopics.revising_editing_a || topics.slice(8), math: mathCategories.map(category => category.label), mathSpecificTopics: Object.fromEntries(mathCategories.map(category => [category.label, category.topics])) };
const artifacts = {
  'DOCUMENT_EXTRACTION_PROMPT.txt': contract.prompt(taxonomy) + '\n',
  'document-import-contract.json': JSON.stringify({ ...contract.schema, taxonomy }, null, 2) + '\n',
};
for (const [name, content] of Object.entries(artifacts)) {
  const target = new URL(name, import.meta.url);
  if (process.argv.includes('--check')) {
    if (await readFile(target, 'utf8') !== content) throw new Error(`${name} is stale. Run node tools/generate-document-prompt.mjs.`);
  } else await writeFile(target, content);
}
