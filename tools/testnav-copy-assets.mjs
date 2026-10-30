import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=path.resolve(process.argv[2]),repo=path.resolve(process.argv[3]),target=path.join(repo,'client','public','exam-images');
const validation=JSON.parse(await fs.readFile(path.join(root,'validation.json'),'utf8'));
assert.equal(validation.passed,true,'Validate every package before copying assets');
let created=0,existing=0;const destinations=new Set();
await fs.mkdir(target,{recursive:true});
for(const form of ['A','B','C','D']) {
 const data=JSON.parse(await fs.readFile(path.join(root,`testnav-${form}`,'import.json'),'utf8'));
 for(const asset of data.source.assets) {
  assert.match(asset.destination,/^\/exam-images\/official-shsat-2026-[a-d]-[a-f0-9]{20}\.(svg|png|jpg|jpeg)$/);
  const destination=path.resolve(target,path.basename(asset.destination));assert.equal(path.dirname(destination),target);
  if(destinations.has(destination))continue;destinations.add(destination);
  const bytes=await fs.readFile(asset.localPath),hash=createHash('sha256').update(bytes).digest('hex');assert.equal(hash,asset.sha256);
  try{const old=await fs.readFile(destination);assert.equal(createHash('sha256').update(old).digest('hex'),hash,`Refusing to replace different existing asset ${destination}`);existing++;}
  catch(error){if(error.code!=='ENOENT')throw error;await fs.writeFile(destination,bytes,{flag:'wx'});created++;}
 }
}
const report={created,existing,total:destinations.size};await fs.writeFile(path.join(root,'asset-copy.json'),JSON.stringify(report,null,2));console.log(report);
