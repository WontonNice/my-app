const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json') });
const {validateMealMenu,quoteMeal}=require('../src/shared/classroomMeals.ts');
const {defaultPracticeCatalog,studentPracticeCatalog}=require('../src/shared/practiceCatalog.ts');
const {homeworkQuestion}=require('../src/shared/infiniteHomework.ts');
const {validateDraft}=require('../src/shared/learningPlan.ts');
const student='11111111-1111-1111-1111-111111111111', id='22222222-2222-2222-2222-222222222222';
const users={student:{id:student,app_metadata:{role:'student',class_ids:['shsat']},user_metadata:{full_name:'Student'}},other:{id:'33333333-3333-3333-3333-333333333333',app_metadata:{role:'student',class_ids:['shsat']}},teacher:{id:'44444444-4444-4444-4444-444444444444',app_metadata:{role:'teacher'}},outsider:{id:'55555555-5555-5555-5555-555555555555',app_metadata:{role:'student',class_ids:[]}}};
const stub=(relative,exports)=>{const filename=require.resolve(relative);require.cache[filename]={id:filename,filename,loaded:true,exports};};
stub('../src/lib/auth.ts',{getAuthenticatedUser:async header=>({user:users[header?.replace('Bearer ','')],error:'Sign in required'}),getUserRole:user=>user.app_metadata.role,getEnrolledClassIds:meta=>meta.class_ids??[],isStudentArchived:()=>false});
const catalog=studentPracticeCatalog(defaultPracticeCatalog());
stub('../src/lib/infiniteHomeworkCatalog.ts',{publishedPracticeCatalog:async()=>catalog});
const menu={restaurant:'Test café',restaurantUrl:'https://www.ubereats.com/feed',taxBasisPoints:887.5,feeCents:125,items:[{id:'bowl',name:'Bowl',description:'Rice',priceCents:1250,available:true}]};
let task,tables,rpcArgs;
stub('../src/lib/learningPlanStore.ts',{assignmentDetail:async(studentId,taskId)=>studentId===student&&taskId===id?structuredClone(task):null,updateAssignment:async(old,changes)=>{if(old.revision!==task.revision)throw Object.assign(new Error('Changed'),{status:409});Object.assign(task,changes,{revision:task.revision+1});return structuredClone(task);}});
stub('../src/lib/supabase.ts',{supabase:{from(table){const filters=[];let single=false,changes,addition,ignore=false,limit=1000;return{select(){return this;},eq(key,value){filters.push(row=>row[key]===value);return this;},neq(key,value){filters.push(row=>row[key]!==value);return this;},order(){return this;},limit(value){limit=value;return this;},maybeSingle(){single=true;return this;},update(value){changes=value;return this;},upsert(value,options){addition=value;ignore=options?.ignoreDuplicates;return this;},then(resolve,reject){const rows=tables[table]??=[];if(addition){const old=rows.find(row=>table==='infinite_homework_sessions'?row.assignment_id===addition.assignment_id:row.id===addition.id);if(!old)rows.push({...structuredClone(addition),revision:table==='infinite_homework_sessions'?0:1});else if(!ignore)Object.assign(old,addition);}const found=rows.filter(row=>filters.every(filter=>filter(row))).slice(0,limit);if(changes)found.forEach(row=>Object.assign(row,structuredClone(changes)));return Promise.resolve({data:structuredClone(single?found[0]??null:found),error:null}).then(resolve,reject);}};},rpc:async(name,args)=>{rpcArgs={name,...args};return{data:{data:args.p_data,status:'submitted',revision:1},error:null};}}});
let server,root;
before(async()=>{const app=require('express')();app.use(require('express').json());app.use('/hw',require('../src/routes/infiniteHomework.ts').infiniteHomeworkRouter);app.use('/meals',require('../src/routes/classroomMeals.ts').classroomMealsRouter);server=await new Promise(resolve=>{const instance=app.listen(0,'127.0.0.1',()=>resolve(instance));});root=`http://127.0.0.1:${server.address().port}`;});
after(()=>new Promise(resolve=>server.close(resolve)));
beforeEach(()=>{task={id,studentId:student,kind:'practice',contentId:`infinite-practice:${catalog.modules[0].id}`,title:'Practice',assignedAt:new Date().toISOString(),status:'assigned',streakTarget:2,revision:1};tables={infinite_homework_sessions:[],classroom_meal_sessions:[{id,title:'Lunch',menu:structuredClone(menu),class_id:'shsat',open:true,revision:1}],classroom_meal_orders:[]};rpcArgs=null;});
async function call(url,token='student',method='GET',body){const response=await fetch(root+url,{method,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return{status:response.status,data:await response.json()};}
function answer(question){if(question.correctChoiceId)return question.correctChoiceId;if(question.correctTextAnswers)return question.correctTextAnswers[0];if(question.numberLineResponse){const line=question.numberLineResponse;return JSON.stringify({value:line.correctValue,direction:line.correctDirection,endpoint:line.correctEndpoint});}throw new Error('Add answer fixture for this generator');}
test('money includes fractional tax rate, rounds once, rejects unavailable or forged selections',()=>{
 const valid=validateMealMenu(menu),quote=quoteMeal(valid,[{id:'bowl',quantity:1,priceCents:1}]);assert.equal(quote.totalCents,1486);assert.equal(quote.taxCents,111);
 for(const selection of [[{id:'bowl',quantity:-1}],[{id:'bowl',quantity:1},{id:'bowl',quantity:1}],[{id:'unknown',quantity:1}]])assert.throws(()=>quoteMeal(valid,selection));
 assert.throws(()=>validateMealMenu({...menu,restaurantUrl:'https://www.ubereats.com.evil.test'}));assert.throws(()=>validateMealMenu({...menu,taxBasisPoints:NaN}));
});
test('infinite assignments require a valid streak, not aggregate practice totals',()=>{const content={id:'module',kind:'practice',practiceMode:'infinite',title:'Practice'};for(const streakTarget of [undefined,0,101,2.5])assert.throws(()=>validateDraft({kind:'practice',contentId:'module',status:'assigned',streakTarget},[content]));const draft=validateDraft({kind:'practice',contentId:'module',status:'assigned',streakTarget:5,questionTarget:1},[content]);assert.equal(draft.streakTarget,5);assert.equal(draft.questionTarget,null);});
test('homework rejects unauthenticated, teachers, unenrolled and other students',async()=>{for(const [token,status]of [['missing',401],['teacher',403],['outsider',403],['other',404]])assert.equal((await call('/hw/'+id,token)).status,status);});
test('homework checks on server, resets mistakes, resumes, deduplicates retries, completes exactly at streak',async()=>{
 let result=await call('/hw/'+id);assert.equal(result.status,200);assert.equal(result.data.question.correctChoiceId,undefined);assert.equal(result.data.question.explanation,undefined);
 const submit=async(value)=>{const row=tables.infinite_homework_sessions[0];const question=homeworkQuestion(row.state);return call('/hw/'+id+'/answers','student','POST',{revision:row.revision,questionId:question.id,answer:value??answer(question),correct:true,streak:100});};
 result=await submit();assert.equal(result.data.streak,1);assert.equal(task.status,'in_progress');
 const last=tables.infinite_homework_sessions[0].state.last;result=await call('/hw/'+id+'/answers','student','POST',{revision:0,questionId:last.question.id,answer:last.answer});assert.equal(result.data.answered,1);
 assert.equal((await call('/hw/'+id+'/answers','student','POST',{revision:0,questionId:last.question.id,answer:'different'})).status,409);
 result=await submit('definitely wrong');assert.equal(result.data.streak,0);assert.equal(result.data.bestStreak,1);
 result=await call('/hw/'+id);assert.equal(result.data.answered,2);assert.equal(result.data.streak,0);
 result=await submit();assert.notEqual(task.status,'completed');result=await submit();assert.equal(task.status,'completed');assert.equal(result.data.question,null);assert.equal(result.data.streak,2);
});
test('concurrent homework answers advance once',async()=>{await call('/hw/'+id);const row=tables.infinite_homework_sessions[0],question=homeworkQuestion(row.state),body={revision:0,questionId:question.id,answer:answer(question)};const results=await Promise.all([call('/hw/'+id+'/answers','student','POST',body),call('/hw/'+id+'/answers','student','POST',body)]);assert.ok(results.every(result=>[200,409].includes(result.status)));assert.equal(tables.infinite_homework_sessions[0].state.index,1);});
test('meal routes isolate identities and recompute prices before the locked database write',async()=>{
 assert.equal((await call('/meals/teacher')).status,403);assert.equal((await call('/meals/student','outsider')).status,403);
 const body={sessionId:id,menuRevision:1,orderRevision:0,selections:[{id:'bowl',quantity:1,priceCents:0}],studentId:users.other.id,quote:{totalCents:0}};
 assert.equal((await call('/meals/student/orders','teacher','POST',body)).status,403);
 assert.equal((await call('/meals/student/orders','student','POST',body)).status,200);assert.equal(rpcArgs.p_student_id,student);assert.equal(rpcArgs.p_data.quote.totalCents,1486);assert.equal(rpcArgs.p_menu_revision,1);
 tables.classroom_meal_sessions[0].revision=2;assert.equal((await call('/meals/student/orders','student','POST',body)).status,409);
 tables.classroom_meal_sessions[0].revision=1;tables.classroom_meal_sessions[0].open=false;assert.equal((await call('/meals/student/orders','student','POST',body)).status,409);
});
