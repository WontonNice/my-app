import { build } from 'esbuild';
import { join, basename, dirname } from 'node:path';
import { createRequire } from 'node:module';
let bundle;
export async function mathCommandAsset(root, pathname) {
  // The tool entry points and client components must use the same React dispatcher.
  const clientRequire = createRequire(join(root, 'client/package.json'));
  const alias = Object.fromEntries(['react', 'react-dom'].map(name => [name, dirname(clientRequire.resolve(name + '/package.json'))]));
  bundle ||= build({ entryPoints: [join(root,'tools/teacher-labels-studio.tsx')], alias,bundle:true,write:false,outdir:join(root,'tools/.content-drafts/math-command-build'),format:'esm',jsx:'automatic',minify:true,define:{'import.meta.env':'{}','process.env.NODE_ENV':'"production"'},loader:{'.woff':'file','.woff2':'file','.ttf':'file'} }).catch(error=>{bundle=undefined;throw error;});
  const output=(await bundle).outputFiles.find(file=>'/math-command/'+basename(file.path)===pathname);
  if(!output)return null;
  return {type:pathname.endsWith('.js')?'text/javascript':pathname.endsWith('.css')?'text/css':'application/octet-stream',body:output.contents};
}
