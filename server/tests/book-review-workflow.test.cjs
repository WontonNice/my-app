const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {keepBookQuestion,latestPassageAttempt}=require('../../client/src/lib/bookReview.ts');
const {passageExamAttempt,newerPassageAttempt}=require('../src/shared/passageLastTaken.ts');
test('the merged Telegraph book recognizes all four source exams',()=>{
 const {libraryBookAccessIds}=require('../src/lib/libraryBooks.ts');
 const contents=Object.values(require('../data/exam-content.json'));
 const books=require('../data/library-books.json');
 const book=books.find(book=>book.passageSet.passage.title==='Invention of the Telegraph');
 const ids=libraryBookAccessIds(book.id);
 const matches=contents.filter(content=>passageExamAttempt(ids,{title:content.title,completedAt:'2026-11-09T15:30:00Z',completedSections:['english'],passages:content.passageSets.map(set=>({id:set.id,total:set.questions.length}))},content));
 assert.deepEqual(matches.map(content=>content.title).sort(),['2018-2019 Form B','2020-2021 Form A','2024-2025 Form B','2026-2027 Form C']);
});
test('last taken matches scored exam passage identities and uses the English section date',()=>{
 const result={title:'2026 Form C',completedAt:'2026-11-09T15:30:00Z',sectionCompletedAt:{english:'2026-11-08T13:00:00Z'},completedSections:['english','math'],passages:[{id:'exam-set',total:6,title:'Shared title'}]};
 const content={passageSets:[{id:'exam-set',passage:{id:'version-two'},questions:[{id:'q'}]}]};
 assert.deepEqual(passageExamAttempt(['book-one','version-one','version-two'],result,content),{completedAt:'2026-11-08T13:00:00Z',source:'exam',title:'2026 Form C'});
 assert.equal(passageExamAttempt(['unrelated'],result,content),null);
 assert.equal(passageExamAttempt(['version-two'],{...result,completedSections:['math']},content),null);
 assert.equal(passageExamAttempt(['version-two'],{...result,passages:[{id:'exam-set',total:0}]},content),null);
 assert.equal(passageExamAttempt(['version-two'],{...result,completedSections:[]},content),null);
});
test('last taken honors historical snapshots and legacy scored IDs without inventing missing dates',()=>{
 const result={title:'Archived exam',completedAt:'2026-11-08T13:00:00Z',completionStatus:'english_complete',passages:[{id:'old-set',total:4}],analysisContent:{passageSets:[{id:'old-set',passage:{id:'old-version'},questions:[{id:'q'}]}]}};
 assert.equal(passageExamAttempt(['old-version'],result,{passageSets:[]}).source,'exam');
 assert.equal(passageExamAttempt(['old-set'],{...result,analysisContent:undefined}).completedAt,result.completedAt);
 assert.equal(passageExamAttempt(['old-set'],{...result,completedAt:'bad'}),null);
 assert.equal(passageExamAttempt(['old-version'],{...result,passages:[]}).source,'exam');
});
test('newest library or exam completion wins independent of current/archive ordering',()=>{
 const library={completedAt:'2026-11-08T13:00:00Z',source:'library'},exam={completedAt:'2026-11-09T13:00:00Z',source:'exam',title:'Form C'};
 assert.deepEqual(newerPassageAttempt(library,exam),exam);
 assert.deepEqual(newerPassageAttempt(exam,library),exam);
 assert.deepEqual(newerPassageAttempt(exam,{...library,completedAt:'invalid'}),exam);
 assert.equal(newerPassageAttempt(null,{...library,completedAt:'invalid'}),null);
});
test('keeping one version disables the entire reviewed group and preserves other groups and unique questions',()=>{
 const original=['unique','a','b','c','other'];
 assert.deepEqual(keepBookQuestion(original,['a','b','c','d'],'d'),['unique','other','d']);
 assert.deepEqual(original,['unique','a','b','c','other']);
 assert.deepEqual(keepBookQuestion(original,['a','b'],'outside'),original);
 assert.deepEqual(keepBookQuestion(['unique','d'],['a','b','c','d'],'d'),['unique','d']);
});
test('last passage attempt uses the latest valid timestamp regardless of order, including earlier source versions',()=>{
 assert.equal(latestPassageAttempt([{completedAt:'2026-10-01T12:00:00Z'},{completedAt:'bad'},{completedAt:'2026-11-02T10:00:00Z'},{completedAt:'2026-10-22T14:00:00Z'}]),'2026-11-02T10:00:00Z');
 assert.equal(latestPassageAttempt([]),undefined);
 assert.equal(latestPassageAttempt([{completedAt:'bad'}]),undefined);
});
