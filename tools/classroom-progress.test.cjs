const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const { build } = require('esbuild');
const { runInNewContext } = require('node:vm');
const { resolve } = require('node:path');
let api;
const window={location:{search:'?subject=english'}};
Object.defineProperties(window,{localStorage:{get(){throw new Error('Device storage blocked');}},sessionStorage:{get(){throw new Error('Device storage blocked');}}});
before(async()=>{const result=await build({stdin:{contents:`export * from './client/src/lib/resultFilters'; export * from './client/src/lib/examSessionProgress'; export * from './client/src/lib/examTimer';`,resolveDir:resolve(__dirname,'..')},bundle:true,platform:'node',format:'cjs',write:false});const module={exports:{}};runInNewContext(result.outputFiles[0].text,{module,exports:module.exports,window,URLSearchParams,Intl,Date});api=module.exports;});
test('date filters use New York dates inclusively and score ordering is numeric',()=>{
 const rows=[{title:'Test 3',completedAt:'2026-10-28T02:00:00Z',percentage:90},{title:'Test 2',completedAt:'2026-10-28T04:00:00Z',percentage:100}];
 assert.equal(api.resultDate(rows[0].completedAt),'2026-10-27');
 assert.equal(api.filterResults(rows,{name:'test',from:'2026-10-27',to:'2026-10-27',sort:'date-desc'}).length,1);
 assert.equal(api.filterResults(rows,{name:'',from:'',to:'',sort:'score-desc'})[0].percentage,100);
 assert.equal(api.filterResults(rows,{name:'missing',from:'',to:'',sort:'name'}).length,0);
});
test('an equal-count replacement question invalidates completion',()=>{
 const content={assessmentId:'exam',passageSets:[{questions:[{id:'new'}]}],mathSection:{questions:[]}};
 assert.equal(api.isExamResultCompleteForContent({completionStatus:'complete',total:1,answers:{old:'A'},completedSections:['english']},content),false);
 assert.equal(api.isExamResultCompleteForContent({completionStatus:'complete',total:1,answers:{new:'A'},completedSections:['english']},content),true);
});
test('explicit English survives blocked storage and failed caching cannot break cloud submission',()=>{
 assert.equal(api.getStoredStartingSubject('exam'),'english');window.location.search='?subject=math';assert.equal(api.getStoredStartingSubject('exam'),'math');window.location.search='';assert.equal(api.getStoredStartingSubject('exam'),'english');
 assert.equal(api.saveLocalExamSession('student','exam',{q:'A'},['english'],'submitted').status,'submitted');
 assert.doesNotThrow(()=>api.clearLocalExamSession('student','exam'));assert.doesNotThrow(()=>api.loadExamTimer('exam'));
});
