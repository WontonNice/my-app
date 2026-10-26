// Fictional local QA of the real Crystal Defense question UI. No accounts or API.
const path = require('node:path');
const { build } = require('esbuild');
const express = require(require.resolve('express', { paths: [path.resolve(__dirname, '../server')] }));
(async () => {
  const output = await build({ stdin: { resolveDir: path.resolve(__dirname, '..'), loader: 'tsx', contents: `
    import {useState,useCallback} from 'react';
    import {createRoot} from 'react-dom/client';
    import {CrystalDefensePanel} from './client/src/features/games/world/CrystalDefensePanel';
    import {content20262027FormDMathSection} from './client/src/content/exams/mathSets/2026-2027-form-dMath';
    import './client/src/styles/global.css';
    const mode=new URLSearchParams(location.search).get('mode')||'math';
    const question=mode==='table'?{subject:'Math',question:content20262027FormDMathSection.questions.find(q=>q.id==='2026-2027-form-d-math-item-46')}:{subject:mode==='math'?'Math':'English',question:{id:'qa-question',type:'multiple_choice',prompt:mode==='math'?'What is 1 + 1?':'Which detail is emphasized by the poem?',promptHtml:mode==='math'?'<p>What is <strong>1 + 1</strong>?</p>':undefined,topic:'QA',choices:[{id:'A',text:mode==='math'?'2':'The changing light'},{id:'B',text:mode==='math'?'3':'The distant city'}]},...(mode==='passage'?{passage:{id:'qa-poem',title:'Morning light',format:'poem',lines:[{text:'Light slips across the window.',lineNumber:'1'},{text:'A quiet day begins.',align:'indent',lineNumber:'2',html:'A <em>quiet</em> day begins.'}]}}:{})};
    function App(){
      const [attempt,setAttempt]=useState(1),[done,setDone]=useState(false),[failed,setFailed]=useState(false),[submitted,setSubmitted]=useState(null);
      const focus=useCallback(()=>{},[]);
      const player={id:'qa-student',name:'QA Student',ready:true,score:0,lastSeen:1000,online:true,lastResult:attempt>1?{monsterId:'qa-monster',correct:false,retry:true,at:1000,points:0}:undefined};
      const crystal={runId:'qa-run',config:{source:{kind:'exam-math',assessmentId:'all'}},sourceTitle:'Exam player QA',phase:'battle',wave:1,hearts:5,participants:[player],hostId:'qa-student',isHost:true,canAdmin:true,teacherMode:'playtest',serverNow:1000,movementPaused:false,questionCount:1,totalPoints:0,activePlayers:1,defeated:0,items:[],monsters:[{id:'qa-monster',status:'challenged',failedIds:[],stage:0,retryAvailableFor:attempt===1?'qa-student':undefined}],challenges:done?[]:[{playerId:'qa-student',monsterId:'qa-monster',attemptId:'attempt-'+attempt,question}]};
      const act=async(action,body)=>{if(action!=='crystal-answer')return true;setSubmitted(body);if(new URLSearchParams(location.search).has('error')&&!failed){setFailed(true);return false;}if(body.answer==='B'&&attempt===1)setAttempt(2);else setDone(true);return true;};
      return <main><h1>Fictional exam player QA</h1><a href='?mode=math'>Math</a> · <a href='?mode=passage'>Passage</a> · <a href='?mode=standalone'>Standalone</a> · <a href='?mode=math&error=1'>Retry network error</a><button onClick={()=>document.documentElement.requestFullscreen()}>Fullscreen</button><button onClick={()=>{setDone(false);setAttempt(v=>v+1)}}>Open challenge</button><output>{submitted?JSON.stringify(submitted):'No answer submitted'}</output><CrystalDefensePanel room={{id:'qa-room',serverNow:1000,crystal}} accessToken='fictional' actorId='qa-student' act={act} busy={false} error={failed&&!done?'Simulated connection error. Try Next again.':''} open={false} setOpen={()=>{}} arena onMonster={()=>{}} focusWorld={focus}/></main>;
    }
    createRoot(document.getElementById('root')).render(<App/>);
  ` }, bundle: true, write: false, outdir: path.resolve(__dirname, '.crystal-exam-preview'), format: 'esm', jsx: 'automatic', loader: { '.woff': 'file', '.woff2': 'file', '.ttf': 'file' }, define: { 'import.meta.env': '{}' } });
  const files = new Map(output.outputFiles.map(file => ['/' + path.basename(file.path), file.contents]));
  const app = express();
  app.use((req, res) => { const file = files.get(req.path); res.type(file ? req.path.endsWith('.js') ? 'application/javascript' : req.path.endsWith('.css') ? 'text/css' : 'application/octet-stream' : 'text/html').send(file ? Buffer.from(file) : '<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Crystal exam QA</title><link rel="stylesheet" href="/stdin.css"><div id="root"></div><script type="module" src="/stdin.js"></script></html>'); });
  app.listen(4347, '127.0.0.1', () => console.log('Crystal exam QA: http://127.0.0.1:4347'));
})().catch(error => { console.error(error); process.exitCode = 1; });
