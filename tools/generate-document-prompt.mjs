import { readFile, writeFile } from 'node:fs/promises';
import contract from './document-import.cjs';
const topics = JSON.parse(await readFile(new URL('./content-topics.json', import.meta.url), 'utf8'));
const server = await readFile(new URL('./content-studio.mjs', import.meta.url), 'utf8');
const math = JSON.parse(server.match(/const mathTopics = (\[[\s\S]*?\]);/)[1].replace(/,\s*]/g, ']'));
const taxonomy = { reading: topics.slice(0, 8), revising_editing_a: topics.slice(8), math };
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
