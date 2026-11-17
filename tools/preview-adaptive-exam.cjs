// Local-only fictional student for the Adaptive Math Exam. Never reads env files or connects to Supabase.
// Account saves go to this process's memory through the same validation the real route uses.
const { createServer } = require('node:http'), { resolve, basename } = require('node:path'), { build } = require('esbuild');
require(require.resolve('ts-node', { paths: [resolve(__dirname, '../server')] })).register({ transpileOnly: true, project: resolve(__dirname, '../server/tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const engine = require('../server/src/shared/adaptiveMath/engine.ts'), { parseAdaptiveState, compareAdaptiveStates, adaptiveSummary } = engine;
const studentId = '00000000-0000-4000-8000-00000000a001';
let saved = null, saves = 0;
(async () => {
  const result = await build({ entryPoints: [resolve(__dirname, 'adaptive-exam-preview.tsx')], bundle: true, external: ['/images/*'], write: false, outdir: resolve(__dirname, '.adaptive-exam-preview'), format: 'esm', jsx: 'automatic', loader: { '.woff': 'file', '.woff2': 'file', '.ttf': 'file' }, define: { 'import.meta.env': '{}' }, plugins: [{ name: 'fictional-adaptive-exam-session', setup(plugin) {
    plugin.onLoad({ filter: /useStudentPortalAccess\.ts$/ }, () => ({ loader: 'ts', contents: `export function useStudentPortalAccess(){const params=new URLSearchParams(location.search),mode=params.get('preview')||'';const isPreview=Boolean(mode&&params.get('teacherTools')==='1');return {accessToken:'fictional',isCheckingSession:false,isSupabaseConfigured:true,studentName:'QA Student',previewContext:{isPreview,mode,query:isPreview?'?preview='+mode+'&teacherTools=1&returnTo=%2Fteacher':'',returnHref:'/teacher',studentId:'',studentName:''}};}` }));
    plugin.onLoad({ filter: /[\\/]lib[\\/]sessionCache\.ts$/ }, () => ({ loader: 'ts', contents: `const session={access_token:'fictional',user:{id:'${studentId}',app_metadata:{role:'student'},user_metadata:{full_name:'QA Student'}}};export const getActiveSession=async()=>session;export const peekActiveSession=()=>session;export const cacheActiveSession=()=>{};export const cacheStudentClasses=()=>{};export const getCachedStudentClasses=()=>null;export const cacheStudentDashboard=()=>{};export const getCachedStudentDashboard=()=>null;export const cacheTeacherDashboard=()=>{};export const getCachedTeacherDashboard=()=>null;` }));
    plugin.onLoad({ filter: /[\\/]features[\\/]account[\\/]account\.tsx$/ }, () => ({ loader: 'tsx', contents: `const value={profile:{id:'${studentId}',name:'QA Student',username:'qa',avatar:null,email:null,verifiedAt:null,pendingEmail:null,lastLoginAt:null,emailDeliveryReady:false,themeColor:'green',streak:{current:0,longest:0,lastDay:''}},signedIn:true,loading:false,error:'',refresh:async()=>{}};export const accountCall=async()=>({});export function AccountProvider({children}){return children;}export function useAccountProfile(){return value;}export function ProfileAvatar({fallback}){return <>{fallback}</>;}` }));
  } }] });
  const files = new Map(result.outputFiles.map(file => ['/' + basename(file.path), file.contents]));
  const port = Number(process.argv.find(value => value.startsWith('--port='))?.slice(7)) || 4336;
  createServer(async (request, response) => {
    const url = new URL(request.url, 'http://localhost'), name = url.pathname;
    if (name === '/api/infinite-practice/adaptive-exam') {
      response.setHeader('Content-Type', 'application/json');
      // ?offline=1 on the page URL is not visible here; use /qa/offline to rehearse a failed account connection.
      if (globalThis.adaptiveOffline) { response.statusCode = 503; response.end('{"message":"Account storage for the adaptive exam is unavailable. Your browser copy is kept."}'); return; }
      if (request.method === 'PUT') {
        let raw = ''; for await (const chunk of request) raw += chunk;
        let incoming = null; try { incoming = parseAdaptiveState(JSON.parse(raw).state); } catch { /* reported below */ }
        if (!incoming || request.headers['x-practice-owner'] !== studentId) { response.statusCode = 400; response.end('{"message":"Invalid adaptive exam progress."}'); return; }
        if (compareAdaptiveStates(incoming, saved) >= 0) saved = incoming;
        saves++;
      }
      response.end(JSON.stringify({ state: saved, summary: saved ? adaptiveSummary(saved) : null })); return;
    }
    if (name === '/qa/offline') { globalThis.adaptiveOffline = url.searchParams.get('on') === '1'; response.end(String(globalThis.adaptiveOffline)); return; }
    if (name === '/qa/saved') { response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify({ saves, asked: saved?.asked ?? null, mode: saved?.mode ?? null, finished: saved?.finished ?? null, summary: saved ? adaptiveSummary(saved) : null })); return; }
    if (name === '/qa/reset') { saved = null; saves = 0; response.end('reset'); return; }
    if (name === '/qa/figures') {
      // Quick visual check of every generated figure question type.
      const { adaptiveTopics } = require('../server/src/shared/adaptiveMath/topics.ts'), rows = [];
      for (const topic of adaptiveTopics) for (const family of topic.families) for (let index = 0; index < 2; index++) { const question = family.generate(index, 'figures'); if (question.image && family.id.startsWith('adaptive-')) rows.push(`<section style="margin:0 0 28px"><h2 style="font:600 15px Arial">${family.id} #${index}</h2><p style="font:15px Arial;max-width:70ch">${question.prompt}</p><img src="${question.image.src}" alt="${question.image.alt}" width="${question.image.width}" style="border:1px solid #ccc"><p style="font:13px Arial">Answer ${question.correctChoiceId}: ${question.choices.map(choice => choice.id + ') ' + choice.text).join(' · ')}</p></section>`); }
      response.setHeader('Content-Type', 'text/html'); response.end(`<!doctype html><html lang="en"><meta charset="utf-8"><title>Figure check</title><body style="margin:24px">${rows.join('')}</body></html>`); return;
    }
    if (name === '/qa/seed') {
      // Build a fictional in-progress exam on the "account": strong on most topics, weak on a few.
      const count = Number(url.searchParams.get('count')) || 60, weak = new Set((url.searchParams.get('weak') ?? 'percentages,triangles,probability,rates').split(',').filter(Boolean));
      let state = engine.createAdaptiveState('qa' + Date.now().toString(36), Date.now(), 'exam');
      for (let step = 0; step < count && !adaptiveSummary(state).complete; step++) {
        const question = engine.adaptiveQuestion(state), right = !weak.has(state.current.topicId) || (step % 5 === 0 && state.current.level === 1);
        const answer = right ? question.correctChoiceId ?? question.correctTextAnswers[0] : question.choices ? question.choices.find(choice => choice.id !== question.correctChoiceId).id : '0.5';
        state = engine.submitAdaptiveAnswer(engine.addAdaptiveTime(engine.selectAdaptiveAnswer(state, answer), 25000 + step * 600), Date.now(), !right && step % 7 === 3);
      }
      saved = url.searchParams.get('open') === '1' ? state : engine.finishAdaptive(state, Date.now());
      response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify(adaptiveSummary(saved))); return;
    }
    if (name === '/api/assessments/student') { response.setHeader('Content-Type', 'application/json'); response.end('{"assessments":[]}'); return; }
    if (name.startsWith('/api/')) { response.setHeader('Content-Type', 'application/json'); response.end('{}'); return; }
    const file = files.get(name); response.setHeader('Content-Type', file ? name.endsWith('.js') ? 'text/javascript' : name.endsWith('.css') ? 'text/css' : 'application/octet-stream' : 'text/html');
    response.end(file || '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Adaptive Math Exam · fictional QA</title><link rel="stylesheet" href="/adaptive-exam-preview.css"><div id="root"></div><script type="module" src="/adaptive-exam-preview.js"></script></html>');
  }).listen(port, '127.0.0.1', () => console.log(`Fictional Adaptive Math Exam: http://127.0.0.1:${port}/study-hall/shsat/assessments`));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
