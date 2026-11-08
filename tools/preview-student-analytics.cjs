const path = require('node:path');
const http = require('node:http');
const esbuild = require('esbuild');
const { execFileSync } = require('node:child_process');
const {withTypeScript}=require('./exam-catalog.cjs');
const qaResponse=withTypeScript(()=>{
  const {defaultPracticeCatalog,generateCatalogQuestion}=require('../server/src/shared/practiceCatalog.ts');
  const generator=defaultPracticeCatalog().generators[0],question=generateCatalogQuestion(generator,0,'isolated-qa');
  return {moduleId:'qa-practice',moduleTitle:'QA generated practice',seed:'isolated-qa',startedAt:1793980000000,generationVersion:1,sourceQuestionIds:generator.sourceQuestionIds||[],index:0,sequenceIndex:0,generatorId:generator.id,question,answer:question.correctTextAnswers?.[0]??question.correctChoiceId,correct:true,durationMs:12000,submittedAt:'2026-11-06T15:00:00.000Z'};
});
(async () => {
  const options = { alias: require('./react-build-aliases.cjs')(path.resolve(__dirname,'..')), entryPoints: [path.resolve(__dirname, 'student-analytics-preview.tsx')], bundle: true, write: false, outdir: path.resolve(__dirname, '.student-analytics-preview'), format: 'esm', jsx: 'automatic', loader: { '.woff': 'file', '.woff2': 'file', '.ttf': 'file' }, define: { 'import.meta.env': '{}' } };
  const built = await esbuild.build(options);
  const original = execFileSync('git', ['show', 'HEAD:client/src/pages/TeacherDashboardPage.tsx'], { cwd: path.resolve(__dirname, '..'), encoding: 'utf8' });
  const legacy = await esbuild.build({ ...options, entryNames: 'student-analytics-legacy', plugins: [{ name: 'original-dashboard-for-qa', setup(build) {
    build.onLoad({ filter: /TeacherDashboardPage\.tsx$/ }, args => ({ contents: original.replace(/^function StudentDetail\(/m, 'export function StudentDetail('), loader: 'tsx', resolveDir: path.dirname(args.path) }));
  } }] });
  const files = new Map([...built.outputFiles, ...legacy.outputFiles].map(file => ['/' + path.basename(file.path), file.contents]));
  const server = http.createServer((request, response) => {
    const url = request.url.split('?')[0];
    if(url.startsWith('/api/')){response.setHeader('Content-Type','application/json');if(request.method!=='GET'){response.statusCode=405;response.end(JSON.stringify({message:'This isolated preview is read-only.'}));return;}response.end(JSON.stringify(url.startsWith('/api/infinite-practice/evidence/')?{responses:[qaResponse],hasMore:false}:{inputs:[],limitations:[],examCorrections:[],assignments:[],sessions:[],items:[],attempts:[]}));return;}
    const file = files.get(url);
    response.setHeader('Content-Type', file ? url.endsWith('.js') ? 'text/javascript' : url.endsWith('.css') ? 'text/css' : 'application/octet-stream' : 'text/html');
    const entry = url === '/legacy' ? 'student-analytics-legacy' : 'student-analytics-preview';
    response.end(file || `<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Student analytics · isolated QA</title><link rel="stylesheet" href="/${entry}.css"><div id="root"></div><script type="module" src="/${entry}.js"></script></html>`);
  });
  server.listen(4323, '127.0.0.1', () => console.log('Student analytics QA at http://127.0.0.1:4323'));
})();
