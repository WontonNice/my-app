const {test}=require('node:test');
const assert=require('node:assert/strict');
const {resolve}=require('node:path');
const {runInNewContext}=require('node:vm');
const {build}=require('esbuild');
const root=resolve(__dirname,'..');

// Exercise the persistence boundary through the same callbacks the player uses.
async function session({preview=false,revision,save=async()=>({id:'saved'})}={}) {
  const result=await build({
    stdin:{contents:`import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {LibraryBookSession} from './client/src/components/LibraryBookSession';
      export function render(props){renderToStaticMarkup(<LibraryBookSession {...props}/>);}`,
      resolveDir:root,loader:'tsx'},bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',
    alias:require('./react-build-aliases.cjs')(root),plugins:[{name:'persistence-boundary',setup(plugin){
      plugin.onLoad({filter:/ExamSessionPage\.tsx$/},()=>({loader:'tsx',contents:'export function ExamSessionPage({librarySession}) {globalThis.player=librarySession;return null;}'}));
      plugin.onLoad({filter:/[\\/]lib[\\/]api\.ts$/},()=>({loader:'ts',contents:'export const saveStudentLibraryAttempt=(...args)=>globalThis.save(...args);'}));
    }}],
  });
  const calls=[],completed=[],module={exports:{}};
  const context={module,exports:module.exports,require,console,process,TextEncoder,TextDecoder,URL,URLSearchParams,Buffer,setTimeout,clearTimeout,queueMicrotask,ReadableStream,WritableStream,TransformStream,save:async(...args)=>{calls.push(args);return save(...args);}};
  runInNewContext(result.outputFiles[0].text,context);
  const passage={id:'source',title:'Reading',format:'prose',lines:[{text:'Source text'}]};
  module.exports.render({book:{id:'legacy-reading',passageSet:{passage,questions:[{id:'q1',type:'multiple_choice',correctChoiceId:'B'},{id:'q2',type:'multi_select',correctChoiceIds:['A','C'],requiredSelections:2}]},questionPassages:{q1:passage},versions:[]},revision,preview,teacher:false,studentName:'Student',accessToken:'fixture',backHref:'/library',onComplete:attempt=>completed.push(attempt)});
  return {player:context.player,calls,completed};
}

test('library submits one complete attempt with legacy answers and structured responses intact',async()=>{
  const {player,calls,completed}=await session();
  player.onCurrentQuestionChange('q1');
  player.onCurrentQuestionChange('q2');
  assert.equal(await player.onSubmit({q1:'B',q2:['A','C']}),true);
  assert.equal(calls.length,1);
  const [token,id,payload]=calls[0];
  assert.equal(token,'fixture');assert.equal(id,'legacy-reading');assert.equal(payload.bookRevision,undefined);
  assert.equal(payload.questions[0].correctAnswerId,'B');
  assert.equal(payload.questions[1].selectedAnswerId,'["A","C"]');
  assert.ok(payload.questions.every(q=>Number.isFinite(q.timeSpentSeconds)));
  assert.equal(completed[0].id,'saved');
});

test('unanswered parts cannot save; previews never save scores',async()=>{
  const {player,calls,completed}=await session({preview:true});
  assert.equal(await player.onSubmit({q1:'B',q2:['A']}),false);
  assert.equal(completed.length,0);
  assert.equal(await player.onSubmit({q1:'B',q2:['A','C']}),true);
  assert.equal(completed.length,1);assert.equal(calls.length,0);
});

test('failed saves retain the edition and can retry, while overlapping submits are ignored',async()=>{
  let rejectSave;
  const {player,calls,completed}=await session({revision:'edition:fingerprint',save:()=>new Promise((_,reject)=>{rejectSave=reject;})});
  const answers={q1:'B',q2:['A','C']};
  const first=player.onSubmit(answers);
  assert.equal(await player.onSubmit(answers),false);assert.equal(calls.length,1);
  rejectSave(new Error('offline'));assert.equal(await first,false);assert.equal(completed.length,0);
  const retry=player.onSubmit(answers);assert.equal(calls.length,2);
  assert.equal(calls[1][2].bookRevision,'edition:fingerprint');
  rejectSave(new Error('still offline'));assert.equal(await retry,false);
});
