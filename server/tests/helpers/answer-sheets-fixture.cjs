const path = require('node:path');
const { randomUUID } = require('node:crypto');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../../tsconfig.json')});
function stub(relative, exports) { const id=require.resolve(relative);require.cache[id]={id,filename:id,loaded:true,exports}; }
const ids={teacher:'33333333-3333-4333-8333-333333333333',student:'11111111-1111-4111-8111-111111111111',other:'22222222-2222-4222-8222-222222222222',foreign:'44444444-4444-4444-8444-444444444444'};
const users=Object.fromEntries(Object.entries(ids).map(([name,id])=>[name,{id,email:`${name}@example.test`,app_metadata:{role:name==='teacher'||name==='foreign'?'teacher':'student',class_ids:['shsat']},user_metadata:{full_name:({teacher:'Preview Teacher',student:'Maya Chen',other:'Jordan Lee',foreign:'Other Teacher'})[name]}}]));
const tables={student_practice_progress:[],student_assignments:[],student_exam_results:[]};
const controls={fail:false};
const db={auth:{admin:{listUsers:async({page=1,perPage=500}={})=>({data:{users:Object.values(users).slice((page-1)*perPage,page*perPage)},error:null}),getUserById:async id=>({data:{user:Object.values(users).find(user=>user.id===id)||null},error:null})}},from(table){
 let filters=[],single=false,offset=0,limit=Infinity,mutation=null,options={};
 const rows=()=>tables[table]??(tables[table]=[]);
 const query={select(){return query;},eq(key,value){filters.push(row=>key==='progress->>revision'?String(row.progress.revision)===String(value):row[key]===value);return query;},in(key,values){filters.push(row=>values.includes(row[key]));return query;},like(key,value){filters.push(row=>String(row[key]||'').startsWith(value.replace(/%$/,'')));return query;},not(){return query;},order(){return query;},range(start,end){offset=start;limit=end-start+1;return query;},limit(value){limit=value;return query;},maybeSingle(){single=true;return query;},single(){single=true;return query;},insert(value){mutation={type:'insert',value};return query;},upsert(value,opts={}){mutation={type:'upsert',value};options=opts;return query;},update(value){mutation={type:'update',value};return query;},delete(){mutation={type:'delete'};return query;},then(resolve,reject){
  if(controls.fail)return Promise.resolve({data:null,error:{message:'simulated storage outage'}}).then(resolve,reject);
  let result=rows().filter(row=>filters.every(fn=>fn(row)));
  if(mutation?.type==='update')result.forEach(row=>Object.assign(row,structuredClone(mutation.value)));
  if(mutation?.type==='delete'){tables[table]=rows().filter(row=>!result.includes(row));result=[];}
  if(mutation?.type==='insert'||mutation?.type==='upsert'){
   result=[];
   for(const value of Array.isArray(mutation.value)?mutation.value:[mutation.value]){
    const old=rows().find(row=>table==='student_practice_progress'?row.user_id===value.user_id&&row.topic_slug===value.topic_slug:table==='student_exam_results'?row.user_id===value.user_id&&row.assessment_id===value.assessment_id:row.id===value.id);
    if(old&&mutation.type==='insert')return Promise.resolve({data:null,error:{code:'23505',message:'unique conflict'}}).then(resolve,reject);
    if(old){if(!options.ignoreDuplicates)Object.assign(old,structuredClone(value));result.push(old);}else{const row={id:randomUUID(),...structuredClone(value)};rows().push(row);result.push(row);}
   }
  }
  result=result.slice(offset,offset+limit);return Promise.resolve({data:structuredClone(single?result[0]??null:result),error:null}).then(resolve,reject);
 }};return query;
}};
stub('../../src/lib/supabase.ts',{supabase:db});
stub('../../src/lib/auth.ts',{getAuthenticatedUser:async header=>{const user=users[header?.replace('Bearer ','')];return{user,error:user?null:'Sign in required'};},getEnrolledClassIds:meta=>meta.class_ids??[],getUserRole:user=>user.app_metadata.role??'student',isStudentArchived:user=>Boolean(user.app_metadata.archived)});
const question=(id,type='multiple_choice')=>({id,type,topic:'Evidence',prompt:`Digitized ${id}`,choices:[{id:'A',text:'Option A'},{id:'B',text:'Option B'}],correctChoiceId:'A',correctChoiceIds:['A','B'],correctTextAnswers:['0']});
const target={id:'fixture-form-a',title:'Fixture Form A',passageSets:[{id:'passage',passage:{id:'passage',title:'Fixture',lines:[]},questions:[question('target-single'),question('target-multi','multi_select'),question('target-short','short_response')],questionCount:3}],mathSection:undefined};
stub('../../src/lib/examContent.ts',{getExamContent:id=>id===target.id?target:undefined});
stub('../../src/config/assessments.ts',{listTeacherAssessments:()=>[{id:target.id,title:target.title}]});
function createFixtureApp(){const express=require('express'),app=express();app.use(express.json({limit:'1mb'}));app.use('/api/answer-sheets',require('../../src/routes/answerSheets.ts').answerSheetsRouter);return app;}
const draft=()=>({title:'Paper/PDF fixture',sourceVersion:'Fixture Form A',instructions:'Use the printed booklet. No content or key is required.',sourceUrl:'',allowUnanswered:true,sections:[{id:'english-section',title:'English',subject:'english',items:[{id:'q-single',number:'1',type:'multiple_choice',options:[{id:'single-A',label:'A'},{id:'single-B',label:'B'}]},{id:'q-multi',number:'2',type:'multi_select',options:[{id:'multi-A',label:'A'},{id:'multi-B',label:'B'},{id:'multi-C',label:'C'}],minSelections:2,maxSelections:2},{id:'q-short',number:'3',type:'short_response',options:[],multiline:true}]},{id:'math-section',title:'Math',subject:'math',items:[{id:'q-math',number:'1',type:'short_response',options:[]}]}]});
module.exports={createFixtureApp,db,tables,controls,users,ids,draft,target,question};
