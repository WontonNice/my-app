// Explicitly synthetic, isolated integration data. Never contacts production auth or storage.
const fs = require('node:fs');
const path = require('node:path');
const studentId='11111111-1111-4111-8111-111111111111', teacherId='33333333-3333-4333-8333-333333333333', otherId='22222222-2222-4222-8222-222222222222';
const users={teacher:{id:teacherId,email:'teacher@example.test',app_metadata:{role:'teacher'},user_metadata:{full_name:'Fixture Teacher'}},student:{id:studentId,email:'student@example.test',app_metadata:{role:'student',class_ids:['shsat']},user_metadata:{full_name:'Andrew · synthetic QA'}},other:{id:otherId,email:'other@example.test',app_metadata:{role:'student',class_ids:['shsat']},user_metadata:{full_name:'Other · synthetic QA'}}};
function seed(root) {
  fs.mkdirSync(path.join(root,'server/data'),{recursive:true});fs.mkdirSync(path.join(root,'tools'),{recursive:true});
  const questions=Array.from({length:60},(_,i)=>({id:`qa-math-${String(i+1).padStart(3,'0')}`,type:'multiple_choice',topic:'Algebra',subtopic:'Equations & Systems',prompt:`Synthetic QA ${i+1}: Solve ${i+2}x + ${i+3} = ${(i+2)*4+i+3}. What is x?`,choices:[{id:'A',text:'4'},{id:'B',text:'5'},{id:'C',text:'6'},{id:'D',text:'7'}],correctChoiceId:'A',explanation:`Subtract ${i+3} from both sides, then divide by ${i+2}.`,points:1}));
  questions.push({...questions[0],id:'qa-missing-key',prompt:'Synthetic QA: A question awaiting its answer key.',correctChoiceId:''},{...questions[1],id:'qa-missing-explanation',prompt:'Synthetic QA: A question awaiting its explanation.',explanation:''},{...questions[2],id:'qa-duplicate-a',prompt:'Synthetic QA duplicate: What is 3 + 1?'},{...questions[2],id:'qa-duplicate-b',prompt:'Synthetic QA duplicate: What is 3 + 1?'});
  const section={id:'qa-math',label:'Mathematics',questionCount:questions.length,directions:{title:'Synthetic mathematics QA',subject:'Mathematics',body:'Test fixture only.',notes:[]},questions};
  const content={assessmentId:'qa-math-inventory',title:'Synthetic QA Math Inventory',passageSets:[],mathSection:section};
  const difficulties=['easy','easy','medium','medium','medium','medium','hard','hard','hard','expert'];
  const metadata=Object.fromEntries(questions.map((q,i)=>[q.id,{difficulty:difficulties[i%10],diagnosticSkill:'linear-equations',source:'Synthetic QA',reviewStatus:q.id.startsWith('qa-duplicate')?undefined:'reviewed'}]));
  const state={metadata,savedViews:[],collections:[],targets:{defaultPerDifficulty:10},skills:[{id:'linear-equations',label:'Linear Equations',category:'Algebra',subcategory:'Equations & Systems',prerequisiteIds:[]}],rules:{targetAccuracy:80,minAttempts:5,minUniqueQuestions:3,minAssessments:2,recentDays:90,recentMinAttempts:3,trendMinAttempts:3,trendDifference:10},pacePerWeek:20,history:[]};
  fs.writeFileSync(path.join(root,'server/data/exam-content.json'),JSON.stringify({[content.assessmentId]:content}));
  fs.writeFileSync(path.join(root,'server/data/question-bank.json'),JSON.stringify({revision:1,questions:[],sets:[]}));
  fs.writeFileSync(path.join(root,'server/data/math-command.json'),JSON.stringify(state));
  fs.writeFileSync(path.join(root,'tools/math-topics.json'),JSON.stringify({categories:[{label:'Algebra',topics:['Equations & Systems','Inequalities']},{label:'Geometry',topics:['Area & Perimeter']}]}));
  return {questions,content};
}
function database(seedData) {
  const {questions,content}=seedData;const date=days=>new Date(Date.now()-days*86400000).toISOString();
  const result=(id,days,correct)=>({assessmentId:id,title:`Synthetic assessment ${id.endsWith('1')?'1':'2'}`,attemptId:id,completedAt:date(days),completedSections:['math'],completionStatus:'math_complete',answers:Object.fromEntries(questions.slice(0,6).map((q,i)=>[q.id,i<correct?'A':i===5?'':'B'])),analysisContent:{...content,assessmentId:id,mathSection:{...content.mathSection,questions:questions.slice(0,6),questionCount:6}}});
  const tables={student_exam_results:[{user_id:studentId,assessment_id:'qa-assessment-1',result:result('qa-assessment-1',14,1)},{user_id:studentId,assessment_id:'qa-assessment-2',result:result('qa-assessment-2',2,4)}],student_assignments:[],student_practice_progress:[],student_learning_plans:[]};
  let failure=false,nextMutationFailure=null;
  const field=(row,key)=>key.includes('->>')?row[key.split('->>')[0]]?.[key.split('->>')[1]]:row[key];
  const db={tables,users,queryLog:[],setFailure(value){failure=value;},failNextMutation(table){nextMutationFailure=table;},auth:{admin:{getUserById:async id=>({data:{user:Object.values(users).find(user=>user.id===id)||null},error:null}),listUsers:async({page=1,perPage=1000}={})=>({data:{users:Object.values(users).slice((page-1)*perPage,page*perPage)},error:null})}},from(table){
    const filters=[];let start=0,end=Infinity,single=false,insert,update,ignore=false,orders=[],projection='*';
    const query={
      select(value='*'){projection=value;return this;},
      eq(key,value){filters.push(row=>String(field(row,key))===String(value));return this;},
      neq(key,value){filters.push(row=>field(row,key)!==value);return this;},
      in(key,values){filters.push(row=>values.includes(field(row,key)));return this;},
      or(expression){const keys=[...expression.matchAll(/and\(user_id\.eq\.([^,]+),assessment_id\.eq\.("(?:\\.|[^"])*")\)/g)].map(match=>[match[1],JSON.parse(match[2])]);filters.push(row=>keys.some(([user,id])=>row.user_id===user&&row.assessment_id===id));return this;},
      not(key,op,value){filters.push(row=>op==='is'?field(row,key)!==value:true);return this;},
      order(key,options={}){orders.push([key,options.ascending!==false]);return this;},
      range(a,b){start=a;end=b;return this;},limit(n){end=start+n-1;return this;},maybeSingle(){single=true;return this;},single(){single=true;return this;},
      upsert(rows,options={}){insert=Array.isArray(rows)?rows:[rows];ignore=options.ignoreDuplicates;return this;},insert(rows){insert=Array.isArray(rows)?rows:[rows];return this;},update(changes){update=changes;return this;},
      then(resolve,reject){try{
        db.queryLog.push({table,projection,mutation:Boolean(insert||update)});
        if((insert||update)&&nextMutationFailure===table){nextMutationFailure=null;return Promise.resolve({data:null,error:{message:'Synthetic deferred write failure'}}).then(resolve,reject);}
        if(failure)return Promise.resolve({data:null,error:{message:'Synthetic storage failure'}}).then(resolve,reject);
        const rows=tables[table]??=([]);
        if(insert)for(const row of insert){const old=rows.find(item=>row.id?item.id===row.id:row.assessment_id?item.user_id===row.user_id&&item.assessment_id===row.assessment_id:item.user_id===row.user_id&&item.topic_slug===row.topic_slug);if(old){if(!ignore)Object.assign(old,structuredClone(row));}else rows.push(structuredClone(row));}
        let selected=rows.filter(row=>filters.every(filter=>filter(row)));
        if(update)for(const row of selected)Object.assign(row,structuredClone(update));
        for(const [key,asc]of orders.reverse())selected.sort((a,b)=>String(field(a,key)??'').localeCompare(String(field(b,key)??''))*(asc?1:-1));
        const count=selected.length;selected=selected.slice(start,end+1);
        if(projection!=='*')selected=selected.map(row=>Object.fromEntries(projection.split(',').map(key=>[key,row[key]])));
        return Promise.resolve({data:structuredClone(single?selected[0]??null:selected),error:null,count}).then(resolve,reject);
      }catch(error){return Promise.reject(error).then(resolve,reject);}}
    };return query;
  }};return db;
}
function install(root,options={}) {
  const repo=path.resolve(__dirname,'..');
  require(require.resolve('ts-node',{paths:[path.join(repo,'server')]})).register({transpileOnly:true,project:path.join(repo,'server/tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
  const existing=options.reuse&&fs.existsSync(path.join(root,'server/data/exam-content.json'))?JSON.parse(fs.readFileSync(path.join(root,'server/data/exam-content.json'),'utf8')):null;
  const content=existing&&Object.values(existing)[0],data=content?{content,questions:content.mathSection.questions}:seed(root),db=database(data);
  const saved=path.join(root,'qa-tables.json');if(options.reuse&&fs.existsSync(saved))Object.assign(db.tables,JSON.parse(fs.readFileSync(saved,'utf8')));
  const stub=(name,exports)=>{const id=require.resolve(path.join(repo,name));require.cache[id]={id,filename:id,loaded:true,exports};};
  stub('server/src/lib/supabase.ts',{supabase:db});
  stub('server/src/lib/auth.ts',{getAuthenticatedUser:async header=>{const user=users[String(header||'').replace('Bearer ','')]||null;return {user,error:user?null:'Sign in required'};},getUserRole:user=>user.app_metadata.role??user.user_metadata.role??'student',getEnrolledClassIds:meta=>meta?.class_ids??[],isStudentArchived:user=>user.app_metadata.archived===true});
  const store=require(path.join(repo,'server/src/lib/mathCommandCatalogStore.ts'));
  stub('server/src/lib/mathCommandCatalogStore.ts',{...store,mathCommandRoot:root,readMathCommandCatalog:(target=root)=>store.readMathCommandCatalog(target),readMathCommandState:(target=root)=>store.readMathCommandState(target),readMathCommandTaxonomy:(target=root)=>store.readMathCommandTaxonomy(target)});
  return {db,data,studentId,otherId,teacherId,users,root};
}
module.exports={install,seed,database,users,studentId,teacherId,otherId};
