const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {passageEncounters}=require('../../client/src/lib/passageEncounters.ts');
const row=(id,evidence=[])=>({content:{id,title:'Passage',versionLabel:id},evidence,status:'Never assigned'});
test('encounters retain each version and each attempt, deduplicate identical evidence and sort newest first',()=>{
 const exam={at:'2026-11-09T15:00:00Z',correct:4,total:5,source:'Exam',reference:'exam'};
 const library={at:'2026-10-09T15:00:00Z',correct:0,total:5,source:'Library',reference:'library'};
 const entries=passageEncounters([row('hidden-version',[library,exam,exam]),row('shown-version'),row('other-version',[{...exam,at:null}])]);
 assert.equal(entries.length,3);assert.deepEqual(entries.map(entry=>entry.version.id),['hidden-version','hidden-version','other-version']);
 assert.deepEqual(entries[0].score,{correct:4,total:5});assert.deepEqual(entries[1].score,{correct:0,total:5});
 assert.equal(entries[0].activity.reference,'exam');assert.equal(entries[2].at,null);
});
test('unverified combined scores stay distinguishable from source-version scores; invalid scores stay absent',()=>{
 const entries=passageEncounters([row('one',[{at:null,correct:12,total:20,coverage:'related',source:'Combined library'}, {at:null,correct:8,total:5,source:'Bad'}, {at:null,correct:0,total:0,source:'Empty'}])]);
 assert.equal(entries[0].related,true);assert.equal(entries[0].score.total,20);assert.equal(entries[1].score,null);assert.equal(entries[2].score,null);
});
test('completion summaries use the score date and never invent a score for in-progress or unseen versions',()=>{
 const entries=passageEncounters([{...row('completed'),hasCompleted:true,lastCompletedAt:'2026-11-09',latestScore:{correct:2,total:5,at:'2026-10-09'}},{...row('started'),status:'In progress'},row('unseen')]);
 assert.equal(entries.length,2);assert.equal(entries[0].at,'2026-10-09');assert.equal(entries[1].score,null);assert.equal(entries[1].at,null);
});
