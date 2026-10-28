// Real dashboard, fictional people, in-memory APIs; never uses production credentials.
const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('esbuild');
const express = require(require.resolve('express', { paths: [path.resolve(__dirname, '../server')] }));
require(require.resolve('ts-node', { paths: [path.resolve(__dirname,'../server')] })).register({ transpileOnly: true, project: path.resolve(__dirname, '../server/tsconfig.json') });
const { createExamResult, getAllExamQuestions } = require('../server/src/shared/examGrading.ts');
const { defaultAchievementDesign, defaultEnglishAchievementDesign, defaultLoginAchievementDesign } = require('../server/src/shared/achievements.ts');
const contents = require('../server/data/exam-content.json');
const assessments = require('../server/data/assessments.json').map((item,index) => ({ ...item, sectionAccess: { english: index === 1, math: index === 1 }, status: index === 1 ? 'open' : 'locked', allowCompletedAccess: false, correctionsOpen: index === 0, forms: item.forms ?? [], formAssignments: {} }));
const first = assessments[0];
const content = contents[first.id];
const names = ['Maya Chen','Jordan Lee','Alex Rivera','Sam Patel','Taylor Brooks','Riley Martin'];
const students = names.map((fullName,index) => {
  const answers = Object.fromEntries(getAllExamQuestions(content).map((q,number) => [q.id, number % 10 < 4 + index ? q.correctChoiceId ?? q.correctChoiceIds ?? q.correctTextAnswers?.[0] ?? '' : q.choices?.find(choice => choice.id !== q.correctChoiceId)?.id ?? '999']));
  const result = { ...createExamResult(content, answers, index === 3 ? ['math'] : index === 4 ? ['english'] : ['english','math']), completedAt: '2026-10-23T17:00:00Z' };
  return { id: `qa-student-${index}`, fullName, username: fullName.toLowerCase().replaceAll(' ','.'), email: `preview${index}@example.test`, classes: ['shsat'], lastLoginAt: '2026-10-23T16:00:00Z', examSessions: {}, insights: { practiceAccuracy: null, testsCompleted: index < 3 ? 1 : 0 }, progress: { examResults: index < 5 ? [result] : [], practice: {} } };
});
(async () => {
  const entry = `import {createRoot} from 'react-dom/client'; import {TeacherDashboardPage} from './client/src/pages/TeacherDashboardPage'; import './client/src/styles/global.css'; import './client/src/styles/examCorrections.css'; const root=createRoot(document.getElementById('root')); const render=()=>root.render(<TeacherDashboardPage key={location.pathname}/>); window.addEventListener('popstate',render); render();`;
  const output = await esbuild.build({ stdin: { contents: entry, loader: 'tsx', resolveDir: path.resolve(__dirname,'..') }, bundle: true, write: false, outdir: path.resolve(__dirname,'.teacher-assessments-preview'), format: 'esm', jsx: 'automatic', loader: { '.woff':'file','.woff2':'file','.ttf':'file' }, define: { 'import.meta.env':'{}' }, plugins: [{ name:'fictional-assessment-auth', setup(build) {
    build.onLoad({ filter:/lib[\\/]supabase\.ts$/ }, () => ({ contents:fs.readFileSync(path.resolve(__dirname,'boards-supabase-preview.ts'),'utf8'),loader:'ts' }));
    build.onLoad({ filter:/lib[\\/]accountSwitching\.ts$/ }, () => ({ contents:'export const getSavedAccounts=()=>[];export const rememberCurrentAccount=async()=>{};export const removeSavedAccount=()=>{};export const signInAndSaveAccount=async()=>{};export const switchToSavedAccount=async()=>{};export const signOutCurrentAccount=async()=>{};',loader:'ts' }));
  } }] });
  const files=new Map(output.outputFiles.map(file=>['/'+path.basename(file.path),file.contents]));
  const app=express(); app.use(express.json({ limit: '1mb' }));
  const achievementDesigns = { 'perfect-math': { design: defaultAchievementDesign, revision: 0 }, 'perfect-english': { design: defaultEnglishAchievementDesign, revision: 0 }, 'login-week': { design: defaultLoginAchievementDesign, revision: 0 } };
  const reentryGrants = {};
  app.get('/api/achievements', (_req, res) => res.json({ ...achievementDesigns['perfect-math'], achievements: Object.entries(achievementDesigns).map(([id, data]) => ({ id, ...data })) }));
  app.put('/api/achievements/:id/design', (req, res) => { if (!achievementDesigns[req.params.id]) return res.status(404).json({ message: 'Achievement not found.' }); const next = { design: req.body.design, revision: achievementDesigns[req.params.id].revision + 1 }; achievementDesigns[req.params.id] = next; res.json(next); });
  app.get('/api/assessments/teacher/:assessmentId/reentry/:studentId', (req, res) => {
    const student = students.find(item => item.id === req.params.studentId), result = student?.progress.examResults.find(item => item.assessmentId === req.params.assessmentId);
    res.json({ hasSubmission: Boolean(result), completedSections: result?.completedSections ?? [], grant: reentryGrants[req.params.studentId + ':' + req.params.assessmentId] ?? null });
  });
  app.put('/api/assessments/teacher/:assessmentId/reentry/:studentId', (req, res) => {
    const grant = { id: 'qa-grant', assessmentId: req.params.assessmentId, studentId: req.params.studentId, attemptId: 'qa-attempt', sections: req.body.sections, remainingSections: req.body.sections, additionalMinutes: req.body.additionalMinutes, grantedAt: new Date().toISOString(), grantedBy: 'qa-teacher', timerState: { startedAt: Date.now(), pausedAt: Date.now(), totalPausedMs: 0 } };
    reentryGrants[req.params.studentId + ':' + req.params.assessmentId] = grant; res.json({ grant });
  });
  app.delete('/api/assessments/teacher/:assessmentId/reentry/:studentId', (req, res) => { delete reentryGrants[req.params.studentId + ':' + req.params.assessmentId]; res.json({ grant: null }); });
  app.get('/api/assessments/teacher',(_req,res)=>res.json({assessments}));
  app.get('/api/progress/students',(_req,res)=>res.json({students}));
  app.get('/api/auth/students',(_req,res)=>res.json({students:[]}));
  app.get('/api/classes/requests',(_req,res)=>res.json({requests:[]}));
  app.get('/api/learning-plan/roster',(_req,res)=>res.json({students:{}}));
  app.get('/api/exam-review/teacher/:id/submissions',(_req,res)=>res.json({submissions:[]}));
  app.patch('/api/assessments/teacher/:id/sections/:section',(req,res)=>{const assessment=assessments.find(item=>item.id===req.params.id);assessment.sectionAccess[req.params.section]=req.body.open;assessment.status=assessment.sectionAccess.english||assessment.sectionAccess.math?'open':'locked';res.json({assessment});});
  app.patch('/api/assessments/teacher/:id/:action',(req,res)=>{
    const assessment=assessments.find(item=>item.id===req.params.id);
    if(!assessment)return res.status(404).json({message:'Fictional exam not found.'});
    if(req.params.action==='section-access') assessment.sectionAccess[req.body.section]=req.body.open;
    if(req.params.action==='status') assessment.sectionAccess={english:req.body.status==='open',math:req.body.status==='open'};
    if(req.params.action==='completed-access')assessment.allowCompletedAccess=req.body.allowCompletedAccess;
    assessment.status=assessment.sectionAccess.english||assessment.sectionAccess.math?'open':'locked';
    res.json({assessment});
  });
  app.patch('/api/exam-review/teacher/:id/access',(req,res)=>{const assessment=assessments.find(item=>item.id===req.params.id);assessment.correctionsOpen=req.body.open;res.json({assessment});});
  app.put('/api/assessments/teacher/:id/forms',(req,res)=>{const assessment=assessments.find(item=>item.id===req.params.id);assessment.forms=req.body.forms;assessment.formAssignments=req.body.assignments;res.json({assessment});});
  app.use('/api',(_req,res)=>res.status(404).json({message:'This action is outside the fictional assessment preview.'}));
  app.get('/qa/mobile',(_req,res)=>res.type('html').send('<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><title>390px mobile assessment QA</title><body style="margin:0;background:#e9ece8;display:flex;justify-content:center"><iframe title="390px assessment workspace" src="/teacher/assessments" style="width:390px;height:900px;border:0;background:white"></iframe></body></html>'));
  app.use((req,res)=>{const file=files.get(req.path);res.type(file?req.path.endsWith('.js')?'application/javascript':req.path.endsWith('.css')?'text/css':'application/octet-stream':'text/html').send(file?Buffer.from(file):'<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Assessments · fictional QA</title><link rel="stylesheet" href="/stdin.css"><div id="root"></div><script type="module" src="/stdin.js"></script></html>');});
  app.listen(4341,'127.0.0.1',()=>console.log('Fictional teacher assessments: http://127.0.0.1:4341/teacher/assessments'));
})().catch(error=>{console.error(error);process.exitCode=1;});
