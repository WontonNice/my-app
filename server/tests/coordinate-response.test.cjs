const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json')});
const {coordinateAnswerComplete,correctCoordinateAnswer,clippedCoordinateLine}=require('../src/shared/coordinateResponse.ts');
const {isExamQuestionCorrect,createExamResult}=require('../src/shared/examGrading.ts');
const config={xMin:-7,xMax:7,yMin:-7,yMax:7,xStep:1,yStep:1,xSnap:1,ySnap:1,width:450,height:450,plot:{left:53,top:53,width:344,height:344},tools:[{id:'line',label:'Line',kind:'line',color:'#0000ff',correctPoints:[{x:0,y:5},{x:1,y:3}]},{id:'point',label:'Solution',kind:'point',color:'#465a5a',correctPoints:[{x:2,y:1}]}]};
const q={id:'graph',type:'coordinate_response',prompt:'Graph.',topic:'Algebra',coordinateResponse:config};
test('equivalent pairs grade as the same infinite line; complete wrong answers remain wrong',()=>{
 const a={line:JSON.stringify([{x:-1,y:7},{x:3,y:-1}]),point:JSON.stringify([{x:2,y:1}])};
 assert.equal(coordinateAnswerComplete(q,a),true);assert.equal(isExamQuestionCorrect(q,a),true);
 const wrong={...a,line:JSON.stringify([{x:1,y:1},{x:2,y:2}])};assert.equal(coordinateAnswerComplete(q,wrong),true);assert.equal(isExamQuestionCorrect(q,wrong),false);
 assert.equal(isExamQuestionCorrect(q,{...a,point:'[{"x":1,"y":2}]'}),false);
});
test('missing, malformed, repeated and out-of-bounds points cannot complete or earn credit',()=>{
 const good=correctCoordinateAnswer(q);
 for(const line of ['', 'null','{}','[{}]','[{"x":"0","y":5}]','[{"x":0,"y":5}]','[{"x":0,"y":5},{"x":0,"y":5}]','[{"x":0,"y":5},{"x":20,"y":-35}]']){
  assert.equal(coordinateAnswerComplete(q,{...good,line}),false,line);assert.equal(isExamQuestionCorrect(q,{...good,line}),false,line);
 }
 assert.equal(coordinateAnswerComplete(q,{line:good.line}),false);
});
test('polygon grading retains orientation and anchor independently',()=>{
 const polygon={...q,coordinateResponse:{...config,tools:[],shapes:[{id:'up',bankX:20,bankY:20,vertices:[{x:0,y:0},{x:3,y:0},{x:0,y:5}]},{id:'down',bankX:20,bankY:180,vertices:[{x:0,y:0},{x:3,y:0},{x:0,y:-5}]}],correctShapeId:'down',correctAnchor:{x:-4,y:-1}}};
 const key=correctCoordinateAnswer(polygon);assert.equal(isExamQuestionCorrect(polygon,key),true);
 assert.equal(isExamQuestionCorrect(polygon,{...key,shape:'up'}),false);
 assert.equal(isExamQuestionCorrect(polygon,{...key,anchor:'[{"x":-3,"y":-1}]'}),false);
 assert.equal(coordinateAnswerComplete(polygon,{...key,anchor:'[{"x":7,"y":0}]'}),false);
});
test('vertical, horizontal, and diagonal lines clip to the graph boundary',()=>{
 assert.deepEqual(clippedCoordinateLine(config,[{x:2,y:0},{x:2,y:1}]),[{x:2,y:-7},{x:2,y:7}]);
 assert.deepEqual(clippedCoordinateLine(config,[{x:0,y:1},{x:1,y:1}]),[{x:-7,y:1},{x:7,y:1}]);
 assert.deepEqual(clippedCoordinateLine(config,[{x:0,y:0},{x:0,y:0}]),[]);
});
test('authored graph validation rejects impossible geometry and missing keys',async()=>{
 const {normalizeCoordinateResponse}=await import('../../tools/coordinate-response.mjs');
 assert.deepEqual(normalizeCoordinateResponse(config),config);
 assert.throws(()=>normalizeCoordinateResponse({...config,xSnap:0}),/xSnap/);
 assert.throws(()=>normalizeCoordinateResponse({...config,plot:{...config.plot,width:900}}),/fit/);
 assert.throws(()=>normalizeCoordinateResponse({...config,tools:[{...config.tools[0],correctPoints:[]}]}),/answer key/);
 assert.throws(()=>normalizeCoordinateResponse({...config,tools:[{...config.tools[0],correctPoints:[{x:0,y:5},{x:0,y:5}]}]}),/distinct/);
});
test('response survives JSON persistence and normal exam result grading',()=>{
 const answer=JSON.parse(JSON.stringify(correctCoordinateAnswer(q)));
 const content={assessmentId:'coordinate-fixture',title:'Graph fixture',passageSets:[],mathSection:{questions:[q]}};
 const result=createExamResult(content,{[q.id]:answer});
 assert.equal(result.correct,1);assert.deepEqual(result.answers[q.id],answer);
});
