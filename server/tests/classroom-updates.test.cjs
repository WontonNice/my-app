const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json') });
const {validateMealMenu,quoteMeal,mealEstimateCents}=require('../src/shared/classroomMeals.ts');
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
stub('../src/lib/supabase.ts',{supabase:{from(table){const filters=[];let single=false,changes,addition,ignore=false,limit=1000;return{select(){return this;},eq(key,value){filters.push(row=>row[key]===value);return this;},neq(key,value){filters.push(row=>row[key]!==value);return this;},order(){return this;},limit(value){limit=value;return this;},maybeSingle(){single=true;return this;},update(value){changes=value;return this;},upsert(value,options){addition=value;ignore=options?.ignoreDuplicates;return this;},then(resolve,reject){const rows=tables[table]??=[];if(addition){const old=rows.find(row=>table==='infinite_homework_sessions'?row.assignment_id===addition.assignment_id:row.id===addition.id);if(!old)rows.push({...structuredClone(addition),revision:table==='infinite_homework_sessions'?0:1});else if(!ignore)Object.assign(old,addition);}const found=rows.filter(row=>filters.every(filter=>filter(row))).slice(0,limit);if(changes)found.forEach(row=>Object.assign(row,structuredClone(changes)));return Promise.resolve({data:structuredClone(single?found[0]??null:found),error:null}).then(resolve,reject);}};},rpc:async(name,args)=>saveMealRequest(name,args)}});
// In-memory persistence boundary follows the transaction's locking/CAS contract.
// The SQL migration itself is verified separately on an isolated Postgres, when available.
function saveMealRequest(name,args) {
 rpcArgs={name,...args}; assert.equal(name,'save_classroom_meal_request');
 const session=tables.classroom_meal_sessions.find(row=>row.id===args.p_session_id);
 const previous=tables.classroom_meal_orders.find(row=>row.session_id===args.p_session_id&&row.student_id===args.p_student_id);
 const fail=message=>({error:{code:'P0001',message},data:null});
 if(!session?.open||session.revision!==args.p_menu_revision)return fail('Menu changed or ordering closed.');
 if((previous?.revision??0)!==args.p_order_revision)return fail('Your request changed. Refresh before submitting.');
 if(previous?.data.teacherDecision==='denied')return fail('Your teacher denied this request.');
 if(args.p_new_request&&previous?.status!=='ordered')return fail('This request changed.');
 if(previous?.status==='ordered'&&!args.p_new_request)return fail('Start another request to order again.');
 if(args.p_cancel&&previous?.status!=='submitted')return fail('There is no pending request to cancel.');
 if(!args.p_cancel&&(previous?.status==='ordered'||previous?.data.teacherDecision==='removed'&&previous.data.previousStatus==='ordered')) {
   tables.classroom_meal_order_history.push(structuredClone(previous));
 }
 const saved={session_id:args.p_session_id,student_id:args.p_student_id,revision:(previous?.revision??0)+1,status:args.p_cancel?'cancelled':'submitted',updated_at:new Date().toISOString(),data:args.p_cancel?previous.data:args.p_data};
 if(previous)Object.assign(previous,structuredClone(saved));else tables.classroom_meal_orders.push(structuredClone(saved));
 return {data:{order:saved,orderedHistory:tables.classroom_meal_order_history.filter(row=>row.session_id===saved.session_id&&row.student_id===saved.student_id)},error:null};
}
let server,root;
before(async()=>{const app=require('express')();app.use(require('express').json());app.use('/hw',require('../src/routes/infiniteHomework.ts').infiniteHomeworkRouter);app.use('/meals',require('../src/routes/classroomMeals.ts').classroomMealsRouter);server=await new Promise(resolve=>{const instance=app.listen(0,'127.0.0.1',()=>resolve(instance));});root=`http://127.0.0.1:${server.address().port}`;});
after(()=>new Promise(resolve=>server.close(resolve)));
beforeEach(()=>{task={id,studentId:student,kind:'practice',contentId:`infinite-practice:${catalog.modules[0].id}`,title:'Practice',assignedAt:new Date().toISOString(),status:'assigned',streakTarget:2,revision:1};tables={infinite_homework_sessions:[],classroom_meal_sessions:[{id,title:'Lunch',menu:structuredClone(menu),class_id:'shsat',open:true,revision:1}],classroom_meal_orders:[],classroom_meal_order_history:[]};rpcArgs=null;});
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
const gallery = () => ({...menu,restaurant:'',items:[],restaurants:[{id:'cafe',name:'Lunch café',url:menu.restaurantUrl,image:'',rating:4.6,reviewCount:322,items:[{...menu.items[0],buyOneGetOne:true,image:''}]},{id:'bakery',name:'Bakery',url:menu.restaurantUrl,image:'',rating:null,reviewCount:null,items:[{id:'bread',name:'Bread',description:'',priceCents:400,available:true}]}]});
function requestRow(){return {session_id:id,student_id:student,status:'submitted',revision:1,data:{studentName:'Student',notes:'Keep this note',menuRevision:1,quote:quoteMeal(menu,[{id:'bowl',quantity:1}])}};}
test('students can order repeatedly while every ordered snapshot stays visible to the correct student and teacher',async()=>{
 const body={sessionId:id,menuRevision:1,orderRevision:0,selections:[{id:'bowl',quantity:1}],notes:'First request'};
 const teacherRoute='/meals/teacher/orders/'+id+'/'+student;
 let saved=await call('/meals/student/orders','student','POST',body);assert.equal(saved.status,200);
 await call(teacherRoute,'teacher','PATCH',{revision:1,status:'ordered'});
 assert.equal((await call('/meals/student/orders','student','POST',{...body,orderRevision:2})).status,409);
 saved=await call('/meals/student/orders','student','POST',{...body,orderRevision:2,newRequest:true,notes:'Second request',selections:[{id:'bowl',quantity:2}],orderedHistory:[{fake:true}]});
 assert.equal(saved.status,200);assert.equal(saved.data.order.status,'submitted');assert.equal(saved.data.order.revision,3);
 assert.equal(saved.data.orderedHistory.length,1);assert.equal(saved.data.orderedHistory[0].data.notes,'First request');assert.equal(saved.data.orderedHistory[0].data.quote.items[0].quantity,1);
 assert.equal((await call('/meals/student','other')).data.orderedHistory.length,0);
 assert.equal((await call('/meals/teacher','teacher')).data.orderedHistory[0].student_id,student);
 assert.equal((await call('/meals/teacher','student')).status,403);
 assert.equal((await call(teacherRoute,'teacher','PATCH',{revision:2,status:'submitted'})).status,409);
 saved=await call('/meals/student/orders','student','POST',{...body,orderRevision:3,notes:'Edited second request'});
 assert.equal(saved.data.orderedHistory.length,1);
 await call(teacherRoute,'teacher','PATCH',{revision:4,status:'ordered'});
 saved=await call('/meals/student/orders','student','POST',{...body,orderRevision:5,newRequest:true,notes:'Third request'});
 assert.equal(saved.status,200);assert.equal(saved.data.orderedHistory.length,2);assert.equal(saved.data.orderedHistory[1].data.notes,'Edited second request');
 saved=await call('/meals/student/orders','student','POST',{...body,orderRevision:6,cancel:true});
 assert.equal(saved.data.order.status,'cancelled');assert.equal(saved.data.orderedHistory.length,2);
 assert.equal((await call('/meals/student')).data.orderedHistory.length,2);
});

test('repeat requests respect closure, denial, explicit intent and revisions; duplicate submissions archive only once',async()=>{
 const row=requestRow();row.status='ordered';tables.classroom_meal_orders.push(row);
 const body={sessionId:id,menuRevision:1,orderRevision:1,selections:[{id:'bowl',quantity:1}],newRequest:true};
 for(const invalid of [{...body,newRequest:'yes'},{...body,cancel:true}])assert.equal((await call('/meals/student/orders','student','POST',invalid)).status,400);
 tables.classroom_meal_sessions[0].open=false;
 assert.equal((await call('/meals/student/orders','student','POST',body)).status,409);assert.equal(tables.classroom_meal_order_history.length,0);
 tables.classroom_meal_sessions[0].open=true;
 const results=await Promise.all([call('/meals/student/orders','student','POST',body),call('/meals/student/orders','student','POST',body)]);
 assert.deepEqual(results.map(result=>result.status).sort(),[200,409]);assert.equal(tables.classroom_meal_order_history.length,1);
 assert.equal((await call('/meals/student/orders','student','POST',{...body,orderRevision:2})).status,409);
 await call('/meals/teacher/orders/'+id+'/'+student,'teacher','PATCH',{revision:2,status:'denied'});
 assert.equal((await call('/meals/student/orders','student','POST',{...body,orderRevision:3})).status,409);
 assert.equal(tables.classroom_meal_order_history.length,1);
});

test('replacing a teacher-removed ordered request preserves that earlier meal',async()=>{
 const row=requestRow();row.status='ordered';tables.classroom_meal_orders.push(row);
 await call('/meals/teacher/orders/'+id+'/'+student,'teacher','PATCH',{revision:1,status:'removed'});
 const saved=await call('/meals/student/orders','student','POST',{sessionId:id,menuRevision:1,orderRevision:2,selections:[{id:'bowl',quantity:2}]});
 assert.equal(saved.status,200);assert.equal(saved.data.orderedHistory.length,1);assert.equal(saved.data.orderedHistory[0].data.quote.items[0].quantity,1);
 assert.equal(saved.data.order.data.teacherDecision,undefined);
});

test('teacher can mark and undo ordered while the rest of the menu remains open',async()=>{
 tables.classroom_meal_orders.push(requestRow());const route='/meals/teacher/orders/'+id+'/'+student;
 assert.equal((await call(route,'student','PATCH',{revision:1,status:'ordered'})).status,403);
 const marked=await call(route,'teacher','PATCH',{revision:1,status:'ordered'});assert.equal(marked.status,200);assert.equal(marked.data.order.status,'ordered');assert.equal(tables.classroom_meal_sessions[0].open,true);
 assert.equal((await call(route,'teacher','PATCH',{revision:1,status:'submitted'})).status,409);
 const undone=await call(route,'teacher','PATCH',{revision:2,status:'submitted'});assert.equal(undone.data.order.status,'submitted');assert.equal(undone.data.order.data.notes,'Keep this note');
});
test('denial blocks student resubmission until restored; removal remains recoverable',async()=>{
 tables.classroom_meal_orders.push(requestRow());const route='/meals/teacher/orders/'+id+'/'+student;
 const denied=await call(route,'teacher','PATCH',{revision:1,status:'denied'});assert.equal(denied.status,200);assert.equal(denied.data.order.status,'cancelled');assert.equal(denied.data.order.data.teacherDecision,'denied');
 const body={sessionId:id,menuRevision:1,orderRevision:2,selections:[{id:'bowl',quantity:1}]};
 assert.equal((await call('/meals/student/orders','student','POST',body)).status,409);assert.equal(rpcArgs,null);
 assert.equal((await call('/meals/student/orders','student','POST',{...body,cancel:true})).status,409);
 const restored=await call(route,'teacher','PATCH',{revision:2,status:'restore'});assert.equal(restored.status,200);assert.equal(restored.data.order.status,'submitted');assert.equal(restored.data.order.data.teacherDecision,undefined);
 const removed=await call(route,'teacher','PATCH',{revision:3,status:'removed'});assert.equal(removed.status,200);assert.equal(removed.data.order.data.teacherDecision,'removed');assert.equal(removed.data.order.data.quote.items[0].name,'Bowl');
 assert.equal((await call('/meals/student/orders','student','POST',{...body,orderRevision:4})).status,200);
 assert.equal((await call(route,'teacher','PATCH',{revision:4,status:'restore'})).status,409);
});
test('removed ordered requests restore to ordered; cancelled student requests cannot be restored by these actions',async()=>{
 const row=requestRow();row.status='ordered';tables.classroom_meal_orders.push(row);const route='/meals/teacher/orders/'+id+'/'+student;
 assert.equal((await call(route,'teacher','PATCH',{revision:1,status:'denied'})).status,409);
 assert.equal((await call(route,'teacher','PATCH',{revision:1,status:'removed'})).status,200);
 assert.equal((await call(route,'teacher','PATCH',{revision:2,status:'restore'})).data.order.status,'ordered');
 tables.classroom_meal_orders[0].status='cancelled';assert.equal((await call(route,'teacher','PATCH',{revision:3,status:'restore'})).status,409);
});
test('customizations enforce required/max choices, snapshot selections and keep the teacher estimate fixed',()=>{
 const input=gallery();input.restaurants[0].items[0].estimatedTotalCents=1500;
 input.restaurants[0].items[0].optionGroups=[{id:'rice',name:'Rice',required:true,maxChoices:1,options:[{id:'white',name:'White rice',extraCents:0},{id:'brown',name:'Brown rice',extraCents:100}]},{id:'extras',name:'Extras',required:false,maxChoices:2,options:[{id:'chicken',name:'Chicken',extraCents:450},{id:'salsa',name:'Salsa',extraCents:0}]}];
 const valid=validateMealMenu(input);
 for(const choices of [{},{rice:['white','brown']},{rice:['fake']},{rice:['white','white']},{rice:['white'],fake:[]},{rice:['white'],extras:['chicken','salsa','fake']}])assert.throws(()=>quoteMeal(valid,[{id:'bowl',quantity:1,choices}]));
 const quote=quoteMeal(valid,[{id:'bowl',quantity:2,choices:{rice:['white'],extras:['chicken']},extraCents:0}]);
 assert.equal(quote.items[0].customizations[0].option,'White rice');assert.equal(quote.items[0].customizations[1].extraCents,450);assert.equal(quote.afterFeesTotalCents,3000);assert.equal(quote.items[0].unitCents,1700);assert.equal(mealEstimateCents({...quote,afterFeesTotalCents:3980}),3000);assert.equal(quoteMeal(valid,[{id:'bowl',quantity:2,choices:{rice:['brown'],extras:['chicken','salsa']}}]).afterFeesTotalCents,3000);
 assert.equal(quoteMeal(valid,[{id:'bowl',quantity:1,choices:{rice:['white']}}]).afterFeesTotalCents,1500);
 assert.equal(quoteMeal(valid,[{id:'bread',quantity:1}]).afterFeesTotalCents,null);
 assert.equal(quoteMeal(valid,[{id:'bowl',quantity:1,choices:{rice:['white']}},{id:'bread',quantity:1}]).afterFeesTotalCents,null);
 input.restaurants[0].items[0].optionGroups[0].maxChoices=3;assert.throws(()=>validateMealMenu(input));
 input.restaurants[0].items[0].optionGroups[0].maxChoices=1;input.restaurants[0].items[0].optionGroups[0].options[0].extraCents=-1;assert.throws(()=>validateMealMenu(input));
});
test('manual item totals default to N/A, persist in quotes, and reject invalid money',()=>{
 const input=gallery();let valid=validateMealMenu(input);assert.equal(valid.restaurants[0].items[0].estimatedTotalCents,null);
 input.restaurants[0].items[0].estimatedTotalCents=1599;valid=validateMealMenu(input);
 const quote=quoteMeal(valid,[{id:'bowl',quantity:2,estimatedTotalCents:1}]);assert.equal(quote.items[0].estimatedTotalCents,1599);assert.equal(quote.subtotalCents,2500);
 input.restaurants[0].items[0].estimatedTotalCents=0;assert.equal(validateMealMenu(input).restaurants[0].items[0].estimatedTotalCents,0);
 for(const value of [-1,1.5,NaN,'1599',1000001]){input.restaurants[0].items[0].estimatedTotalCents=value;assert.throws(()=>validateMealMenu(input));}
});
test('restaurant galleries preserve ratings and label-only offers without discounting quantities',()=>{
 const valid=validateMealMenu(gallery());const quote=quoteMeal(valid,[{id:'bowl',quantity:2},{id:'bread',quantity:1}]);
 assert.equal(quote.subtotalCents,2900);assert.equal(quote.items[0].quantity,2);assert.equal(quote.items[0].buyOneGetOne,true);assert.equal(quote.items[0].restaurant,'Lunch café');assert.equal(quote.items[1].restaurant,'Bakery');assert.equal(valid.restaurants[0].reviewCount,322);
});
test('gallery rejects duplicate IDs, malformed images, forged offers, and invalid ratings',()=>{
 for(const change of [{rating:5.1},{rating:NaN},{reviewCount:-1},{reviewCount:1.5},{image:'data:image/svg+xml;base64,PHN2Zz4='},{image:'https://example.com/pixel.png'},{image:'data:image/png;base64,bm90YW5pbWFnZQ=='}]){const value=gallery();Object.assign(value.restaurants[0],change);assert.throws(()=>validateMealMenu(value));}
 const duplicated=gallery();duplicated.restaurants[1].items[0].id='bowl';assert.throws(()=>validateMealMenu(duplicated));
 const badOffer=gallery();badOffer.restaurants[0].items[0].buyOneGetOne='yes';assert.throws(()=>validateMealMenu(badOffer));
});
test('teacher saves gallery with inline raster images, requires revision, and student cannot edit it',async()=>{
 const value=gallery();value.restaurants[0].image='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWZkAAAAASUVORK5CYII=';
 const body={title:'Lunch',revision:1,open:true,menu:value};
 assert.equal((await call('/meals/teacher/sessions/'+id,'student','PUT',body)).status,403);
 const result=await call('/meals/teacher/sessions/'+id,'teacher','PUT',body);assert.equal(result.status,200);assert.equal(result.data.session.menu.restaurants[0].image,value.restaurants[0].image);
 assert.equal((await call('/meals/teacher/sessions/'+id,'teacher','PUT',body)).status,409);
 const studentView=await call('/meals/student');assert.equal(studentView.data.session.menu.restaurants.length,2);
});
