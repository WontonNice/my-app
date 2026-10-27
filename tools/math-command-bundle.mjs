import { build } from 'esbuild';
import { join, basename } from 'node:path';
let bundle;
export async function mathCommandAsset(root, pathname) {
  if (pathname === '/math-command/') return { type: 'text/html', body: '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Math Command Center</title><link rel="stylesheet" href="/math-command/math-command-studio.css"></head><body><div id="root"></div><script type="module" src="/math-command/math-command-studio.js"></script></body></html>' };
  bundle ||= build({ entryPoints: [join(root,'tools/math-command-studio.tsx'), join(root,'tools/teacher-labels-studio.tsx')], bundle:true,write:false,outdir:join(root,'tools/.content-drafts/math-command-build'),format:'esm',jsx:'automatic',minify:true,define:{'import.meta.env':'{}','process.env.NODE_ENV':'"production"'},loader:{'.woff':'file','.woff2':'file','.ttf':'file'} }).catch(error=>{bundle=undefined;throw error;});
  const output=(await bundle).outputFiles.find(file=>'/math-command/'+basename(file.path)===pathname);
  if(!output)return null;
  return {type:pathname.endsWith('.js')?'text/javascript':pathname.endsWith('.css')?'text/css':'application/octet-stream',body:output.contents};
}
