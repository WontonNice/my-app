import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Immutable original JSON receipt. Format/provenance never determines exam identity. */
export async function retainSourcePackage(root, input, metadata) {
  const raw = typeof input === 'string' ? input : JSON.stringify(input, null, 2);
  const id = createHash('sha256').update(raw).digest('hex');
  const directory = join(root, 'tools', '.content-drafts', 'source-packages', id);
  await mkdir(directory, {recursive:true});
  for (const [name, content] of Object.entries({
    'original.json': raw,
    'manifest.json': JSON.stringify({id, sha256:id, source:metadata, receivedAt:new Date().toISOString(), original:'original.json'}, null, 2),
  })) {
    try { await writeFile(join(directory,name),content,{encoding:'utf8',flag:'wx'}); }
    catch(error) { if(error.code !== 'EEXIST') throw error; }
  }
  if (await readFile(join(directory,'original.json'),'utf8') !== raw) throw new Error('The archived source does not match this import. Import stopped.');
  return id;
}
