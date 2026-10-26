const {test,before,after}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),{createHash}=require('node:crypto');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json')});
const users={student:{id:'student',email:'student@students.nathantutors.local',last_sign_in_at:'2026-10-24T12:00:00Z',app_metadata:{role:'student'},user_metadata:{username:'student',full_name:'Test Student'}},teacher:{id:'teacher',email:'teacher@example.test',app_metadata:{role:'teacher'},user_metadata:{}},archived:{id:'archived',email:'archived@students.nathantutors.local',app_metadata:{role:'student',student_archived_at:'2026-01-01'},user_metadata:{}}};
const tables={account_profiles:[],account_email_tokens:[],account_presence:[]},mail=[],updates=[],limits=new Map();let ready=true,deliveryFails=false;
const digest=value=>createHash('sha256').update(value).digest('hex');
function stub(relative,exports){const id=require.resolve(relative);require.cache[id]={id,filename:id,loaded:true,exports};}
const auth={getUser:async token=>({data:{user:users[token]??null},error:null}),admin:{getUserById:async id=>({data:{user:users[id]??null},error:null}),updateUserById:async(id,value)=>{updates.push({id,...value});return {error:null};}}};
const database={auth,from(table){let filters=[],operation='read',value,single=false;const q={select(){return this;},eq(key,expected){filters.push(row=>row[key]===expected);return this;},gte(key,expected){filters.push(row=>row[key]>=expected);return this;},maybeSingle(){single=true;return this;},upsert(next){value=next;operation='upsert';return this;},insert(next){value=next;operation='insert';return this;},update(next){value=next;operation='update';return this;},delete(){operation='delete';return this;},then(resolve){let data=tables[table].filter(row=>filters.every(filter=>filter(row)));if(operation==='insert'){tables[table].push({...value});}if(operation==='upsert'){const existing=tables[table].find(row=>row.user_id===value.user_id&&(table!=='account_presence'||row.client_id===value.client_id));if(existing)Object.assign(existing,value);else tables[table].push({...value});}if(operation==='update')data.forEach(row=>Object.assign(row,value));if(operation==='delete')tables[table]=tables[table].filter(row=>!data.includes(row));resolve({data:structuredClone(single?data[0]??null:data),error:null});}};return q;},async rpc(name,args){if(name==='record_account_login'){return {data:{login_streak:1,login_best:1,login_last_day:require('../src/shared/accountPreferences.ts').accountDay(),login_days:[require('../src/shared/accountPreferences.ts').accountDay()],user_id:args.p_user_id},error:null};}if(name==='claim_account_request'){const count=(limits.get(args.p_bucket)||0)+1;limits.set(args.p_bucket,count);return{data:count<=args.p_limit,error:null};}const token=tables.account_email_tokens.find(row=>row.token_hash===args.p_hash&&!row.used_at&&Date.parse(row.expires_at)>Date.now()&&row.purpose===(name==='verify_account_email'?'verify':'recover'));const profile=token&&tables.account_profiles.find(row=>row.user_id===token.user_id);if(!token||!profile)return{data:null,error:null};if(name==='verify_account_email'){if(profile.pending_email!==token.email)return{data:false,error:null};Object.assign(profile,{email:token.email,email_verified_at:new Date().toISOString(),pending_email:null});token.used_at=new Date().toISOString();return{data:true,error:null};}if(profile.email!==token.email||!profile.email_verified_at)return{data:null,error:null};token.used_at=new Date().toISOString();return{data:token.user_id,error:null};}};
stub('../src/lib/supabase.ts',{supabase:database});
stub('@supabase/supabase-js',{createClient:()=>({auth:{signInWithPassword:async({email,password})=>({data:{user:password==='current-password'?Object.values(users).find(user=>user.email===email):null,session:null},error:null}),signOut:async()=>({error:null})}})});
stub('../src/lib/accountMail.ts',{accountMailReady:()=>ready,sendAccountMail:async(email,purpose,token)=>{if(deliveryFails)throw Object.assign(new Error('Delivery unavailable'),{status:503});mail.push({email,purpose,token});}});
let server,root;
before(async()=>{const express=require('express'),app=express();app.use(express.json());app.use('/api/account',require('../src/routes/account.ts').accountRouter);server=await new Promise(resolve=>{const instance=app.listen(0,'127.0.0.1',()=>resolve(instance));});root=`http://127.0.0.1:${server.address().port}/api/account`;});
after(async()=>new Promise(resolve=>server.close(resolve)));
async function call(route,token='student',method='GET',body){const response=await fetch(root+route,{method,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return{status:response.status,data:await response.json()};}
test('profiles require an active session and avatar updates cannot alter role, email or another account',async()=>{
 assert.equal((await call('/profile','bad')).status,401);assert.equal((await call('/profile','archived')).status,403);
 assert.equal((await call('/profile','student','PATCH',{avatar:'data:image/svg+xml;base64,AAAA'})).status,400);
 const avatar='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jP3kAAAAASUVORK5CYII=';
 const saved=await call('/profile','student','PATCH',{avatar,user_id:'teacher',email:'attacker@example.test',role:'teacher'});
 assert.equal(saved.status,200);assert.equal(saved.data.avatar,avatar);assert.equal(saved.data.email,null);assert.equal(saved.data.id,'student');assert.equal(saved.data.username,'student');assert.equal((await call('/profile','teacher')).data.avatar,null);
});
test('email enrollment reauthenticates, hashes tokens, verifies once and preserves username login',async()=>{
 limits.clear();assert.equal((await call('/email','student','POST',{email:'person@example.test',password:'wrong'})).status,403);
 limits.clear();const sent=await call('/email','student','POST',{email:'Person@example.test',password:'current-password'});assert.equal(sent.status,200);
 const letter=mail.at(-1),stored=tables.account_email_tokens.at(-1);assert.equal(stored.token_hash,digest(letter.token));assert.notEqual(stored.token_hash,letter.token);assert.equal(stored.email,'person@example.test');assert.equal(stored.purpose,'verify');
 assert.equal((await call('/profile')).data.email,null);assert.equal((await call('/verify-email','none','POST',{token:letter.token})).status,200);assert.equal((await call('/verify-email','none','POST',{token:letter.token})).status,400);
 const profile=(await call('/profile')).data;assert.equal(profile.email,'person@example.test');assert.equal(profile.username,'student');assert.equal(users.student.email,'student@students.nathantutors.local');
});
test('recovery rejects unknown email; reset requires a verified, unexpired, single-use token',async()=>{
 const known=await call('/forgot-password','none','POST',{email:'person@example.test'}),letter=mail.at(-1),count=mail.length;
 const unknown=await call('/forgot-password','none','POST',{email:'unknown@example.test'});assert.equal(known.status,200);assert.equal(unknown.status,404);assert.match(unknown.data.message,/Email not found/);assert.equal(mail.length,count);
 assert.equal((await call('/reset-password','none','POST',{token:letter.token,password:'short'})).status,400);
 assert.equal((await call('/reset-password','none','POST',{token:'f'.repeat(64),password:'new-long-password'})).status,400);
 const pair=await Promise.all([call('/reset-password','none','POST',{token:letter.token,password:'new-long-password',userId:'teacher'}),call('/reset-password','none','POST',{token:letter.token,password:'other-long-password'})]);
 assert.deepEqual(pair.map(item=>item.status).sort(),[200,400]);assert.equal(updates.length,1);assert.equal(updates[0].id,'student');
 const expired='a'.repeat(64);tables.account_email_tokens.push({token_hash:digest(expired),user_id:'student',email:'person@example.test',purpose:'recover',expires_at:new Date(Date.now()-1000).toISOString()});
 assert.equal((await call('/reset-password','none','POST',{token:expired,password:'new-long-password'})).status,400);
});
test('missing email configuration is explicit and failed verification deliveries leave unusable tokens',async()=>{
 ready=false;assert.equal((await call('/email','student','POST',{email:'next@example.test',password:'current-password'})).status,503);assert.equal((await call('/forgot-password','none','POST',{email:'person@example.test'})).status,503);ready=true;
 limits.clear();deliveryFails=true;assert.equal((await call('/email','student','POST',{email:'next@example.test',password:'current-password'})).status,503);assert.ok(tables.account_email_tokens.at(-1).used_at);deliveryFails=false;
});
test('presence is per authenticated account and browser lease; students cannot read the roster',async()=>{
 const first='00000000-0000-4000-8000-000000000001',second='00000000-0000-4000-8000-000000000002';
 assert.equal((await call('/presence','student','POST',{clientId:first,userId:'teacher'})).status,200);assert.equal((await call('/presence','student','POST',{clientId:second})).status,200);
 assert.equal((await call('/activity','student')).status,403);let activity=(await call('/activity','teacher')).data;assert.deepEqual(activity.onlineIds,['student']);assert.equal(activity.lastLogins.student,users.student.last_sign_in_at);
 await call(`/presence/${first}`,'student','DELETE');assert.deepEqual((await call('/activity','teacher')).data.onlineIds,['student']);
 tables.account_presence[0].last_seen_at=new Date(Date.now()-100000).toISOString();assert.deepEqual((await call('/activity','teacher')).data.onlineIds,[]);
});

test('unverified, pending and archived recovery addresses stop before creating a token or sending mail',async()=>{
 limits.clear();const profile=tables.account_profiles.find(row=>row.user_id==='student'),old=structuredClone(profile);
 const count=mail.length,tokens=tables.account_email_tokens.length;
 profile.email_verified_at=null;
 assert.equal((await call('/forgot-password','none','POST',{email:'person@example.test'})).status,404);
 Object.assign(profile,old,{pending_email:'pending@example.test'});
 assert.equal((await call('/forgot-password','none','POST',{email:'pending@example.test'})).status,404);
 tables.account_profiles.push({user_id:'archived',email:'archived@example.test',email_verified_at:new Date().toISOString()});
 assert.equal((await call('/forgot-password','none','POST',{email:'archived@example.test'})).status,404);
 assert.equal(mail.length,count);assert.equal(tables.account_email_tokens.length,tokens);
 limits.clear();deliveryFails=true;
 assert.equal((await call('/forgot-password','none','POST',{email:'person@example.test'})).status,503);
 assert.ok(tables.account_email_tokens.at(-1).used_at);deliveryFails=false;
});
test('palette changes are authenticated, constrained, persistent and preserve account data',async()=>{
 limits.clear();assert.equal((await call('/preferences','bad','PATCH',{themeColor:'navy'})).status,401);
 assert.equal((await call('/preferences','student','PATCH',{themeColor:'#ffffff'})).status,400);
 const before=(await call('/profile')).data;
 const saved=await call('/preferences','student','PATCH',{themeColor:'plum',user_id:'teacher',email:'bad@example.test',login_streak:900});
 assert.equal(saved.status,200);assert.equal(saved.data.themeColor,'plum');assert.equal(saved.data.avatar,before.avatar);assert.equal(saved.data.email,before.email);
 assert.equal((await call('/profile')).data.themeColor,'plum');assert.equal((await call('/profile','teacher')).data.themeColor,'forest');
});
test('check-in requires authentication and ignores dates and counts supplied by browser',async()=>{
 assert.equal((await call('/check-in','bad','POST')).status,401);
 assert.equal((await call('/check-in','archived','POST')).status,403);
 const saved=await call('/check-in','student','POST',{user_id:'teacher',date:'2099-01-01',login_streak:900});
 assert.equal(saved.status,200);assert.equal(saved.data.streak.current,1);assert.notEqual(saved.data.streak.today,'2099-01-01');
});
