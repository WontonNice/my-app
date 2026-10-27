import { build } from 'esbuild';
import { join, basename } from 'node:path';
let bundle;
export async function mathPreviewAsset(root, pathname) {
  if (pathname === '/math-student-preview/') return { type: 'text/html', body: `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Math student preview</title><link rel="stylesheet" href="/math-student-preview/math-student-preview.css"></head><body><div id="root"><p role="status" style="font:14px Arial,sans-serif;padding:16px">Loading student player…</p></div><script>
window.addEventListener('error', function(event) {
  if (event.target && event.target.tagName === 'LINK') return;
  var root = document.getElementById('root');
  if (!root || root.querySelector('main')) return;
  root.textContent = '';
  var message = document.createElement('p');
  message.setAttribute('role', 'alert');
  message.style.cssText = 'font:14px/1.6 Arial,sans-serif;padding:16px';
  message.textContent = 'The student preview could not load. Refresh Content Studio to retry. Your question is still in the editor.';
  root.append(message);
}, true);
</script><script type="module" src="/math-student-preview/math-student-preview.js"></script></body></html>` };
  bundle ||= build({ entryPoints: [join(root,'tools/math-student-preview.tsx')], bundle: true, write: false, outdir: join(root,'tools/.content-drafts/math-preview-build'), format: 'esm', jsx: 'automatic', minify: true, define: { 'import.meta.env': '{}', 'process.env.NODE_ENV': '"production"' }, loader: { '.woff': 'file', '.woff2': 'file', '.ttf': 'file' } }).catch(error => { bundle = undefined; throw error; });
  const output = (await bundle).outputFiles.find(file => '/math-student-preview/' + basename(file.path) === pathname);
  if (!output) return null;
  return { type: pathname.endsWith('.js') ? 'text/javascript' : pathname.endsWith('.css') ? 'text/css' : 'application/octet-stream', body: output.contents };
}
