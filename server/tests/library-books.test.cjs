const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {groupPassageBooks,libraryQuestionKey,gradeLibraryBook,libraryQuestionAnswered}=require('../src/shared/libraryBooks.ts');
const {examPassageLibrary,examLibraryBooks,getExamLibraryPassage}=require('../../client/src/content/exams/passageLibrary.ts');
const {readingPracticeMaterials,editingPracticeMaterials,studentLibraryBooks}=require('../../client/src/lib/studentMaterials.ts');
const question=(id,prompt='Which detail?')=>({id,type:'multiple_choice',topic:'Inference',prompt,choices:[{id:'A',text:'First'},{id:'B',text:'Second'}],correctChoiceId:'A'});
const set=(id,questions,author='Same author')=>({id,passage:{id,title:'Same book',versionLabel:id,lines:[{kind:'byline',text:author},{text:`Text for ${id}`}],passageCategory:id==='one'?'official_handbook':'prestige'},questions,questionCount:questions.length,directions:{body:'Read',title:'Read',subject:'English'}});
test('versions combine without mutating assessment content; duplicate questions ignore formatting, IDs and choice order',()=>{
 const first=question('original'), duplicate={...question('duplicate'),promptHtml:'<b>Which detail?</b>',choices:[{id:'X',text:'Second'},{id:'Y',text:'First'}],correctChoiceId:'Y'};
 const sources=[set('one',[first]),set('two',[duplicate,question('new','A new question?')])], saved=structuredClone(sources);
 const books=groupPassageBooks(sources);
 assert.equal(books.length,1);assert.equal(books[0].id,'book-one');assert.equal(books[0].passageSet.questionCount,2);
 assert.deepEqual(books[0].passageSet.questions.map(q=>q.id),['original','new']);
 assert.equal(books[0].questionPassages.new.lines[1].text,'Text for two');assert.deepEqual(sources,saved);
 assert.deepEqual(books[0].versions.map(v=>v.category),['official_handbook','prestige']);
});
test('same-title different authors, changed answers, and HTML-only answer options retain distinct content',()=>{
 assert.equal(groupPassageBooks([set('one',[question('a')]),set('two',[question('b')],'Different author')]).length,2);
 assert.notEqual(libraryQuestionKey(question('a')),libraryQuestionKey({...question('b'),correctChoiceId:'B'}));
 const a={...question('a'),choices:[{id:'A',text:'',html:'First'},{id:'B',text:'',html:'Second'}]}, b={...a,id:'b',choices:[{id:'A',text:'',html:'Different'},{id:'B',text:'',html:'Second'}]};
 assert.notEqual(libraryQuestionKey(a),libraryQuestionKey(b));
 const collided=groupPassageBooks([set('one',[question('same')]),set('two',[question('same','Different prompt?')])])[0];
 assert.equal(new Set(collided.passageSet.questions.map(q=>q.id)).size,2);
 assert.equal(collided.questionPassages[collided.passageSet.questions[1].id].id,'two');
});
test('real library exposes one shelf entry per book and keeps every unique question and legacy route',()=>{
 assert.equal(examPassageLibrary.length,30);assert.equal(examLibraryBooks.length,25);
 const miracle=examLibraryBooks.find(book=>book.id==='book-a-miracle-mile');assert.equal(miracle.passageSet.questionCount,9);
 assert.equal(getExamLibraryPassage('a-miracle-mile-version-2').passageSet.questionCount,7);
 assert.equal(getExamLibraryPassage('book-a-miracle-mile').passageSet.questionCount,9);
 for(const book of examLibraryBooks){const originals=examPassageLibrary.filter(set=>book.versions.some(v=>v.id===set.passage.id));const expected=new Set(originals.flatMap(set=>set.questions.map(libraryQuestionKey)));assert.equal(book.passageSet.questions.length,expected.size);}
 assert.equal(studentLibraryBooks.filter(book=>book.title==='A Miracle Mile').length,1);
 assert.equal(readingPracticeMaterials.length,8);assert.equal(editingPracticeMaterials.length,8);
 assert.ok(readingPracticeMaterials.every(item=>item.href.startsWith('/study-hall/shsat/topics/')));
 assert.ok(!readingPracticeMaterials.some(item=>item.title==='test'));
});
test('combined-book grading uses canonical keys, requires a full unique attempt, and handles technology-enhanced questions',()=>{
 const tei={id:'sort',type:'category_sort',topic:'Evidence & Support',prompt:'Sort',items:[{id:'item',text:'Evidence'}],categories:[{id:'box',title:'Evidence'}],correctPlacements:{item:'box'},requiredPlacements:1};
 const book=groupPassageBooks([set('one',[question('a'),tei]),set('two',[question('duplicate')])])[0];
 const rows=[{questionId:'a',selectedAnswerId:'B',correctAnswerId:'B'},{questionId:'sort',selectedAnswerId:'{"item":"box"}'}];
 const graded=gradeLibraryBook(book,rows);assert.deepEqual(graded.map(row=>row.isCorrect),[false,true]);assert.equal(graded[0].correctAnswerId,'A');
 assert.throws(()=>gradeLibraryBook(book,rows.slice(0,1)),/every/);assert.throws(()=>gradeLibraryBook(book,[rows[0],rows[0]]),/every/);
 assert.throws(()=>gradeLibraryBook(book,[{...rows[0],selectedAnswerId:'Z'},rows[1]]),/included/);
 assert.equal(libraryQuestionAnswered(tei,'{}'),false);assert.equal(libraryQuestionAnswered(tei,'{"item":"box"}'),true);
});
