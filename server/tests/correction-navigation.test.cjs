const {test}=require('node:test');const assert=require('node:assert/strict');const path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {examCorrectionsHref,examCorrectionId,libraryCorrectionsHref,libraryCorrectionLocation,studentCorrectionRoute}=require('../../client/src/lib/correctionNavigation.ts');
const {getStudentPreviewContext}=require('../../client/src/lib/studentPreview.ts');
test('Results links preserve the selected student and point to dedicated correction routes, including encoded IDs',()=>{
  global.window={location:{origin:'http://qa.test',search:''}};
  const native=getStudentPreviewContext(''), preview=getStudentPreviewContext('?preview=student&teacherTools=1&studentId=selected&studentName=Selected&returnTo=%2Fteacher%2Fstudents');
  assert.equal(examCorrectionsHref('exam:form-a',native),'/study-hall/shsat/corrections/exam%3Aform-a');
  const href=examCorrectionsHref('exam:form-a',preview), url=new URL(href,'http://qa.test');
  assert.equal(url.searchParams.get('studentId'),'selected');assert.equal(url.searchParams.get('teacherTools'),'1');
  assert.equal(examCorrectionId(url.pathname),'exam:form-a');assert.equal(examCorrectionId('/results/exam%3Aform-a/corrections'),'exam:form-a');
  assert.equal(examCorrectionId('/study-hall/shsat/corrections/%invalid'),'');
  const book=libraryCorrectionsHref('/study-hall/shsat/library/book-one',preview), bookUrl=new URL(book,'http://qa.test');
  assert.equal(bookUrl.searchParams.get('studentId'),'selected');assert.deepEqual(libraryCorrectionLocation(bookUrl.pathname),{bookId:'book-one',backPath:'/study-hall/shsat/library/book-one'});
  assert.deepEqual(libraryCorrectionLocation('/advanced-practice/old-book/corrections'),{bookId:'old-book',backPath:'/advanced-practice/old-book'});
  assert.equal(studentCorrectionRoute(url.pathname),'exam');assert.equal(studentCorrectionRoute('/results/old-exam/corrections/'),'exam');assert.equal(studentCorrectionRoute(bookUrl.pathname),'library');
  assert.equal(studentCorrectionRoute('/study-hall/shsat/results'),null);assert.equal(studentCorrectionRoute('/study-hall/shsat/library/book-one'),null);
  delete global.window;
});
