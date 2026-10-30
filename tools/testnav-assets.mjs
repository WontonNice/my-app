import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { load } from 'cheerio';
const root=path.resolve(process.argv[2]);
for(const form of ['A','B','C','D']) {
 const folder=path.join(root,`testnav-${form}`),inv=JSON.parse(await fs.readFile(path.join(folder,'inventory.json'),'utf8')),assets=new Map();
 for(const item of inv.items) {
  const data=JSON.parse(await fs.readFile(path.join(folder,item.file),'utf8')),$=load(data.itemBodyHtml,null,false);
  const exhibit=$('.exhibits-list img').first().attr('src');
  item.exhibit=exhibit;
  $('[src]').each((_,el)=> {const url=$(el).attr('src'); if(url?.startsWith('https://adam.pearsontestcontent.com/'))assets.set(url,{url});});
  const css=data.itemBodyHtml+' '+data.itemBodyExtraStyles;
  for(const m of css.matchAll(/url\(['"]?(https:\/\/[^)'"\s]+)/g)) assets.set(m[1],{url:m[1]});
 }
 const queue=[...assets.values()];let next=0;
 await fs.mkdir(path.join(folder,'assets'),{recursive:true});
 await Promise.all(Array.from({length:4},async()=>{while(next<queue.length){const a=queue[next++];
  const ext=path.extname(new URL(a.url).pathname);a.file=`assets/${createHash('sha256').update(a.url).digest('hex').slice(0,20)}${ext==='.svgz'?'.svg':ext}`;
  let bytes;try{bytes=await fs.readFile(path.join(folder,a.file))}catch{const response=await fetch(a.url);if(!response.ok)throw new Error(`${response.status} ${a.url}`);bytes=Buffer.from(await response.arrayBuffer());if(bytes[0]===31&&bytes[1]===139)bytes=gunzipSync(bytes);await fs.writeFile(path.join(folder,a.file),bytes)}
  a.sha256=createHash('sha256').update(bytes).digest('hex');a.bytes=bytes.length;
 }}));
 inv.assets=queue;
 await fs.writeFile(path.join(folder,'inventory.json'),JSON.stringify(inv,null,2));
 console.log(form,'assets',queue.length);
}
