// Isolated browser regression fixture, following preview-exam-review.cjs.
// Only authentication and the remote persistence boundary use test data.
// No real users, credentials, database writes, or production entry points.
const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const esbuild = require('esbuild');
require(require.resolve('ts-node', { paths: [path.resolve(__dirname, '../server')] })).register({ transpileOnly: true, project: path.resolve(__dirname, '../server/tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { formA2025_2026Content } = require('../client/src/content/exams/tests/formA2025_2026.ts');
const { content20252026FormBContent } = require('../client/src/content/exams/tests/2025-2026-form-b.ts');
const { getAllExamQuestions } = require('../server/src/shared/examGrading.ts');
const content = [formA2025_2026Content, content20252026FormBContent];
const sessions = {};
const progress = { examResults: [], practice: {} };
(async () => {
  let files = new Map();
  const context = await esbuild.context({
    entryPoints: [path.resolve(__dirname, 'exam-session-preview.tsx')], bundle: true, write: false,
    outdir: path.resolve(__dirname, '.exam-session-preview'), format: 'esm', jsx: 'automatic',
    loader: { '.woff': 'file', '.woff2': 'file', '.ttf': 'file' }, define: { 'import.meta.env': '{}' },
    plugins: [{ name: 'isolated-auth-fixture', setup(build) {
      build.onEnd(result => { if (!result.errors.length) files = new Map(result.outputFiles.map(file => ['/' + path.basename(file.path), file.contents])); });
      build.onResolve({ filter: /\/supabase$/ }, args => args.importer.includes('client') ? { path: 'auth-fixture', namespace: 'qa' } : undefined);
      build.onLoad({ filter: /.*/, namespace: 'qa' }, () => ({ contents: `
        export const isSupabaseConfigured = true;
        const session = { access_token: 'isolated-test-session', user: { id: 'exam-player-qa', email: 'qa@example.test', app_metadata: { role: 'teacher' }, user_metadata: { full_name: 'Practice QA' } } };
        export const getSupabaseClient = () => ({ auth: { getSession: async () => ({data:{session}}), refreshSession: async () => ({data:{session}}) } });
      ` }));
    } }],
  });
  await context.watch();
  await context.rebuild();
  http.createServer(async (request, response) => {
    const url = new URL(request.url, 'http://127.0.0.1:4322').pathname;
    const json = value => { response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify(value)); };
    if (url.startsWith('/api/')) {
      let raw = ''; for await (const chunk of request) raw += chunk;
      const body = raw ? JSON.parse(raw) : {};
      if (url.startsWith('/api/assessments/student/')) {
        const exam = content.find(item => item.assessmentId === url.split('/').at(-1));
        if (!exam) { response.statusCode = 404; return json({ message: 'Unknown fixture exam' }); }
        return json({ assessment: { id: exam.assessmentId, title: exam.title, classId: 'qa', durationMinutes: 180, description: 'Isolated browser regression fixture', sectionAccess: { english: true, math: true }, allowCompletedAccess: true, questions: getAllExamQuestions(exam), passages: [], status: 'open' } });
      }
      if (url === '/api/progress/exam-sessions') return json({ sessions });
      if (url.startsWith('/api/progress/exam-sessions/')) {
        const id = url.split('/').at(-1);
        sessions[id] = { ...body, updatedAt: new Date().toISOString() };
        console.log('Session saved:', id, Object.keys(body.answers || {}).length, 'answers', body.status || 'in_progress');
        return json({ session: sessions[id] });
      }
      if (url.startsWith('/api/progress/exam-results/')) {
        progress.examResults = [...progress.examResults.filter(item => item.assessmentId !== body.result.assessmentId), body.result];
        console.log('Result saved:', body.result.assessmentId, body.result.correct, '/', body.result.total);
        return json({ progress, storage: 'database' });
      }
      if (url === '/api/progress') return json({ progress });
      response.statusCode = 404; return json({ message: 'Unexpected QA API request' });
    }
    const file = files.get(url);
    if (file) {
      response.setHeader('Content-Type', url.endsWith('.js') ? 'text/javascript' : url.endsWith('.css') ? 'text/css' : 'application/octet-stream');
      return response.end(file);
    }
    const publicRoot = path.resolve(__dirname, '../client/public');
    const asset = path.resolve(publicRoot, '.' + decodeURIComponent(url));
    if (asset.startsWith(publicRoot + path.sep) && fs.existsSync(asset) && fs.statSync(asset).isFile()) {
      response.setHeader('Content-Type', asset.endsWith('.svg') ? 'image/svg+xml' : asset.endsWith('.png') ? 'image/png' : 'application/octet-stream');
      return fs.createReadStream(asset).pipe(response);
    }
    response.setHeader('Content-Type', 'text/html');
    response.end('<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Exam player · isolated QA</title><link rel="stylesheet" href="/exam-session-preview.css"><div id="root"></div><script type="module" src="/exam-session-preview.js"></script></html>');
  }).listen(4322, '127.0.0.1', () => console.log('Real exam player QA: http://127.0.0.1:4322/exams/2025-2026-form-a?subject=math'));
})();
