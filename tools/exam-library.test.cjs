const {test}=require('node:test'),assert=require('node:assert/strict');
const {examLibraryMetadata,compareExamLibrary,matchesExamLibrary,emptyExamLibraryFilter}=require('../client/src/lib/examLibrary.ts');
const exam=title=>({id:title.toLowerCase().replaceAll(' ','-'),title});
test('exam families, year ranges and forms normalize without inventing dates for practice tests',()=>{
 assert.deepEqual(examLibraryMetadata(exam('2026–2027 Form B')),{year:'2026–2027',yearNumber:2026,form:'B',category:'Yearly forms'});
 assert.equal(examLibraryMetadata(exam('Digital SHSAT Practice Test 2')).category,'Digital practice');
 assert.equal(examLibraryMetadata(exam('Digital SHSAT Practice Test Adaptive 1')).category,'Adaptive practice');
 assert.equal(examLibraryMetadata(exam('Digital SHSAT Practice Test 202')).year,'');
 assert.equal(examLibraryMetadata(exam('Math diagnostic')).category,'Other exams');
});
test('year sorting pairs forms and keeps undated exams last; form and category are explicit sort keys',()=>{
 const list=['2024-2025 Form B','2026-2027 Form B','Digital SHSAT Practice Test 10','2024-2025 Form A','2026-2027 Form A','Digital SHSAT Practice Test 2'].map(exam);
 const ordered=list.toSorted((a,b)=>compareExamLibrary(a,b,'year')).map(x=>x.title);
 assert.deepEqual(ordered,['2026-2027 Form A','2026-2027 Form B','2024-2025 Form A','2024-2025 Form B','Digital SHSAT Practice Test 2','Digital SHSAT Practice Test 10']);
 assert.deepEqual(list.toSorted((a,b)=>compareExamLibrary(a,b,'form')).slice(0,2).map(x=>x.title),['2026-2027 Form A','2024-2025 Form A']);
 assert.equal(examLibraryMetadata(list.toSorted((a,b)=>compareExamLibrary(a,b,'category'))[0]).category,'Digital practice');
});
test('year, form, category and a case-insensitive search combine without hiding similarly named exams incorrectly',()=>{
 const item=exam('2026–2027 Form B'),filter={year:'2026–2027',form:'B',category:'Yearly forms'};
 assert.equal(matchesExamLibrary(item,'2026-2027 form b',filter),true);
 assert.equal(matchesExamLibrary(item,'2026',{...filter,form:'A'}),false);
 assert.equal(matchesExamLibrary(item,'2026',{...filter,category:'Digital practice'}),false);
 assert.equal(matchesExamLibrary(exam('Digital SHSAT Practice Test 2'),'digital 2',emptyExamLibraryFilter),true);
});

