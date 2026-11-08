const {test}=require('node:test'),assert=require('node:assert/strict'),{build}=require('esbuild'),{resolve}=require('node:path'),vm=require('node:vm');
test('practice sync failures and loading are visible in the launch dialog without starting a new session',async()=>{
 const result=await build({stdin:{contents:`import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {InequalityPractice} from './client/src/features/math-command/InequalityPractice';export const render=()=>renderToStaticMarkup(<InequalityPractice initialModuleId="all" onClose={()=>{}}/>);`,resolveDir:resolve(__dirname,'..'),loader:'tsx'},bundle:true,platform:'node',format:'cjs',write:false,jsx:'automatic',define:{'import.meta.env':'{}'},loader:{'.css':'empty'},plugins:[{name:'isolated-practice-account',setup(p){
 p.onLoad({filter:/MathEntryResponse.tsx$/},()=>({contents:'export const MathEntryResponse=()=>null;',loader:'ts'}));
 p.onResolve({filter:/^react-dom$/},args=>args.importer.endsWith('InequalityPractice.tsx')?({path:'portal',namespace:'qa'}):undefined);p.onLoad({filter:/.*/,namespace:'qa'},()=>({contents:'export const createPortal=node=>node;export const flushSync=fn=>fn();',loader:'js'}));
 p.onLoad({filter:/[\\/]account[\\/]account.tsx$/},()=>({contents:'export const useAccountProfile=()=>({profile:{id:"qa"}});',loader:'ts'}));
 p.onLoad({filter:/usePracticeAccount.ts$/},()=>({contents:'export const usePracticeAccount=()=>globalThis.syncStatus;export const retryPracticeAccount=()=>{};export const flushPracticeAccount=()=>{};',loader:'ts'}));
 }}]});
 const ctx={module:{exports:{}},exports:{},require,process,console,URL,URLSearchParams,TextEncoder,TextDecoder,Buffer,setTimeout,clearTimeout,setInterval,clearInterval,queueMicrotask,document:{body:{}},window:{location:{search:''}},localStorage:{getItem:()=>null},syncStatus:'unavailable'};vm.createContext(ctx);vm.runInContext(result.outputFiles[0].text,ctx);
 let html=ctx.module.exports.render();assert.match(html,/role="dialog"/);assert.match(html,/role="alert"/);assert.match(html,/Try again/);assert.match(html,/Back to practice/);assert.doesNotMatch(html,/Question 1/);
 ctx.syncStatus='loading';html=ctx.module.exports.render();assert.match(html,/role="dialog"/);assert.match(html,/Loading saved streaks/);
});
