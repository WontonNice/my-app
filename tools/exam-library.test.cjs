const {test}=require('node:test'),assert=require('node:assert/strict');
const bundle = require('esbuild').buildSync({entryPoints:[require('node:path').resolve(__dirname,'../client/src/lib/examLibrary.ts')],bundle:true,platform:'node',format:'cjs',write:false});
const api={exports:{}};require('node:vm').runInNewContext(bundle.outputFiles[0].text,{module:api,exports:api.exports,require,URLSearchParams,Intl});
const {examLibraryMetadata,compareExamLibrary,matchesExamLibrary,emptyExamLibraryFilter}=api.exports;
const exam=title=>({id:title.toLowerCase().replaceAll(' ','-'),title});

test('Grade 9 sample collection uses its saved label and the existing year filters',()=>{
 const {isGrade9MathSample,grade9MathCollectionLabel}=api.exports;
 const sample={...exam('Grade 9 2018-2019'),examLabel:grade9MathCollectionLabel};
 assert.equal(isGrade9MathSample(sample),true);
 assert.equal(isGrade9MathSample(exam('Grade 9 Mini Form')),false);
 assert.equal(isGrade9MathSample({...exam('2026-2027 Form A'),examLabel:'Official practice'}),false);
 assert.equal(examLibraryMetadata(sample).category,'Grade 9 math samples');
 assert.equal(matchesExamLibrary(sample,'2018',{...emptyExamLibraryFilter,year:'2018–2019'}),true);
});
test('exam families, year ranges and forms normalize without inventing dates for practice tests',()=>{
 assert.deepEqual({...examLibraryMetadata(exam('2026–2027 Form B'))},{year:'2026–2027',yearNumber:2026,form:'B',category:'Yearly forms',publisher:'',sourceFamily:'',shsatLevel:'',collection:''});
 assert.equal(examLibraryMetadata(exam('Digital SHSAT Practice Test 2')).category,'Digital practice');
 assert.equal(examLibraryMetadata(exam('Digital SHSAT Practice Test Adaptive 1')).category,'Adaptive practice');
 assert.equal(examLibraryMetadata(exam('Digital SHSAT Practice Test 202')).year,'');
 assert.equal(examLibraryMetadata(exam('Math diagnostic')).category,'Other exams');
});

test('source, SHSAT level, edition and collection remain independent filters',()=>{
 const item={...exam('Mixed review'),studyHallWorksheet:{subject:'math',category:'Math',scope:'mixed',collection:'Grade 9 Mathematics Sample Questions',source:{sourceFamily:'official_shsat',shsatLevel:'9',year:'2008-2009'}}};
 const filter={...emptyExamLibraryFilter,publisher:'Official Handbook',shsatLevel:'9',year:'2008–2009',collection:'Grade 9 Mathematics Sample Questions'};
 assert.equal(matchesExamLibrary(item,'mixed',filter),true);
 assert.equal(matchesExamLibrary(item,'',{...filter,shsatLevel:'8'}),false);
 assert.equal(matchesExamLibrary(item,'',{...filter,publisher:'Kaplan'}),false);
 assert.equal(matchesExamLibrary(item,'',{...filter,collection:'Other collection'}),false);
 assert.equal(examLibraryMetadata({...exam('Official test'),source:{sourceFamily:'official_shsat',shsatLevel:'8'}}).shsatLevel,'8');
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

