const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json') });
const studentId = '11111111-1111-1111-1111-111111111111', otherId = '22222222-2222-2222-2222-222222222222';
const users = { teacher: { id: '33333333-3333-3333-3333-333333333333', app_metadata: { role: 'teacher' } }, student: { id: studentId, app_metadata: { role: 'student', class_ids: ['shsat'] } }, other: { id: otherId, app_metadata: { role: 'student', class_ids: ['shsat'] } } };
function stub(relative, exports) { const id = require.resolve(relative); require.cache[id] = { id, filename: id, loaded: true, exports }; }
stub('../src/lib/auth.ts', { getAuthenticatedUser: async header => { const user = users[header?.replace('Bearer ', '')]; return { user, error: user ? null : 'Sign in required' }; }, getUserRole: user => user.app_metadata.role, getEnrolledClassIds: metadata => metadata.class_ids ?? [], isStudentArchived: user => Boolean(user.app_metadata.student_archived_at) });
const question = { id: 'lab-q-fixture', subject: 'English', source: 'SHSAT Lab', status: 'published', choices: ['A','B','C','D'].map(id => ({ id, text: id })), correctChoiceId: 'A', topic: 'Evidence & Support', difficulty: 'easy' };
const set = { id: 'lab-set-fixture', title: 'Synthetic ELA set', subject: 'English', source: 'SHSAT Lab', questionIds: [question.id] };
const bank = { revision: 1, questions: [question], sets: [set] };
stub('../src/lib/questionBank.ts', { readQuestionBank: () => bank, libraryContentKind: id => id === set.id ? 'practice' : 'passage' });
const completions = [];
let mergedAssigned = false;
stub('../src/lib/learningPlanStore.ts', { hasAssignedContent: async (student, kind, id) => student === studentId && (kind === 'practice' && id === set.id || mergedAssigned && kind === 'passage' && id === 'source-a'), learningCatalog: () => [{id:'book-fixture',title:'Merged fixture',subject:'English',href:'/study-hall/shsat/library/book-fixture'}, {id:set.id,title:set.title,subject:'English',href:'/study-hall/shsat/library/'+set.id}], recordPlanCompletion: async (...args) => completions.push(args) });
const mergedBook = { id: 'book-fixture', versions: [{id:'source-a',label:'A'},{id:'source-b',label:'B'}], passageSet: { passage:{title:'Merged fixture'}, questions: [{...question,type:'multiple_choice'},{...question,type:'multiple_choice',id:'merged-q-2'}] } };
stub('../src/lib/libraryBooks.ts', { getMergedLibraryBook: id => id === mergedBook.id ? mergedBook : undefined, canonicalLibraryBookId: id => ['book-fixture','source-a','source-b'].includes(id) ? 'book-fixture' : id, libraryBookAccessIds: id => ['book-fixture','source-a','source-b'].includes(id) ? ['book-fixture','source-a','source-b'] : [id] });
const tables = { student_assignments: [], teacher_library_books: [], student_practice_progress: [], student_library_attempts: [], student_library_corrections: [] };
let compatibility = false, accessFailure = false;
const db = { auth: { admin: { listUsers: async () => ({ data: { users: Object.values(users) }, error: null }), getUserById: async id => ({ data: { user: Object.values(users).find(user => user.id === id) }, error: null }) } }, from(table) {
  const filters = []; let rows; let one = false; let limit = Infinity; let offset = 0;
  const query = {
    select() { return query; }, in(key, values) { filters.push(row => values.includes(row[key])); return query; }, eq(key, value) { filters.push(row => row[key] === value); return query; },
    like(key, value) { filters.push(row => String(row[key] ?? '').startsWith(value.replace(/%$/, ''))); return query; },
    order() { return query; }, limit(value) { limit = value; return query; }, range(start, end) { offset = start; limit = end - start + 1; return query; },
    maybeSingle() { one = true; return query; }, single() { one = true; return query; },
    insert(row) { tables[table].push(row); rows = [row]; return query; },
    upsert(row, options = {}) { const old = tables[table].find(q => table === "teacher_library_books" ? q.book_id === row.book_id : q.user_id === row.user_id && q.topic_slug === row.topic_slug); if (old) { if (!options.ignoreDuplicates) Object.assign(old, row); } else tables[table].push(row); rows = [row]; return query; },
    then(resolve, reject) { if (accessFailure && table === "student_practice_progress") return Promise.resolve({ data:null, error:{message:"storage unavailable"} }).then(resolve,reject); if (compatibility && table === 'student_library_attempts') return Promise.resolve({ data: null, error: { code: 'PGRST205', message: 'missing library table' } }).then(resolve, reject); const result = (rows ?? tables[table] ?? []).filter(row => filters.every(filter => filter(row))).slice(offset, offset + limit); return Promise.resolve({ data: one ? result[0] ?? null : result, error: null }).then(resolve, reject); },
  }; return query;
} };
stub('../src/lib/supabase.ts', { supabase: db });
const express = require('express'); const { libraryRouter } = require('../src/routes/library.ts');
test('teacher analytical feed is student-scoped, rejects students/archived accounts and deduplicates compatibility copies', async () => {
  Object.assign(question,{prompt:'Stored fixture question',explanation:'Because A is supported.',incorrectChoiceExplanations:{},passage:null});
  const row={id:'analytics-fixture',user_id:studentId,book_id:set.id,attempt_number:1,score:0,total_questions:1,completed_at:'2026-10-01T12:00:00Z',question_stats:[{questionId:question.id,questionNumber:1,selectedAnswerId:'B',correctAnswerId:'A',isCorrect:false,timeSpentSeconds:12}]};
  tables.student_library_attempts.push(row,{...row,id:'foreign-analytics',user_id:otherId});
  tables.student_practice_progress.push({user_id:studentId,topic_slug:'english-library:'+set.id,progress:{attempts:[row]}});
  assert.equal((await call('/library/teacher/analytics/'+studentId,'student')).status,403);
  const result=await call('/library/teacher/analytics/'+studentId);
  assert.equal(result.status,200);assert.equal(result.data.inputs.filter(input=>input.result.attemptId===row.id).length,1);
  assert.equal(result.data.inputs.some(input=>input.result.attemptId==='foreign-analytics'),false);
  const record=result.data.inputs.find(input=>input.result.attemptId===row.id);assert.equal(record.responses[0].isCorrect,false);assert.equal(record.kind,'practice');
  users.student.app_metadata.student_archived_at='2026-10-01';
  try{assert.equal((await call('/library/teacher/analytics/'+studentId)).status,404);}finally{delete users.student.app_metadata.student_archived_at;}
  tables.student_library_attempts.splice(tables.student_library_attempts.findIndex(item=>item.id===row.id),1);
  tables.student_library_attempts.splice(tables.student_library_attempts.findIndex(item=>item.id==='foreign-analytics'),1);
  tables.student_practice_progress.splice(tables.student_practice_progress.findIndex(item=>item.topic_slug==='english-library:'+set.id),1);
});
let server, base;
before(async () => { const app = express(); app.use(express.json()); app.use('/library', libraryRouter); app.use('/progress', require('../src/routes/progress.ts').progressRouter); server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve)); base = `http://127.0.0.1:${server.address().port}`; });
after(() => new Promise(resolve => server.close(resolve)));
async function call(path, role = 'teacher', body, method) { const result = await fetch(base + path, { method: method ?? (body ? 'POST' : 'GET'), headers: { Authorization: `Bearer ${role}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) }); return { status: result.status, data: await result.json() }; }
const attempt = (extra = {}) => ({ startedAt: '2026-10-05T12:00:00Z', totalTimeSeconds: 40, questions: [{ questionId: question.id, selectedAnswerId: 'C', correctAnswerId: 'C', timeSpentSeconds: 40 }], ...extra });

test('assigned bank set access is student-specific; Math/foreign sets are not opened', async () => {
  assert.equal((await call(`/library/books/${set.id}/attempts`, 'other', attempt())).status, 403);
  assert.equal((await call(`/library/books/lab-set-missing/attempts`, 'student', attempt())).status, 403);
  assert.equal((await call(`/library/books/${set.id}/attempts`, 'teacher', attempt())).status, 403);
});
test('server regrades forged selected-answer key and completes only assigned student practice', async () => {
  const result = await call(`/library/books/${set.id}/attempts`, 'student', attempt()); assert.equal(result.status, 201); assert.equal(result.data.attempt.score, 0);
  const stored = tables.student_library_attempts.at(-1); assert.equal(stored.question_stats[0].correctAnswerId, 'A'); assert.equal(stored.question_stats[0].selectedAnswerId, 'C');
  assert.equal(completions.at(-1)[0], studentId); assert.equal(completions.at(-1)[1], 'practice');
  assert.equal((await call(`/library/books/${set.id}/attempts`, 'student', attempt({ questions: [] }))).status, 400);
});
test('teacher ELA insights are authenticated, student isolated, and use canonical topics', async () => {
  assert.equal((await call(`/library/teacher/bank-attempts/${studentId}`, 'student')).status, 403);
  const result = await call(`/library/teacher/bank-attempts/${studentId}`); assert.equal(result.status, 200); assert.equal(result.data.attempts.length, 1); assert.equal(result.data.attempts[0].questions[0].topic, 'Evidence & Support'); assert.equal(result.data.attempts[0].score, 0);
  assert.equal((await call(`/library/teacher/bank-attempts/${otherId}`)).data.attempts.length, 0);
});
test('compatibility attempt storage keeps server grading and does not duplicate native attempts', async () => {
  compatibility = true;
  const result = await call(`/library/books/${set.id}/attempts`, 'student', attempt({ questions: [{ questionId: question.id, selectedAnswerId: 'A', correctAnswerId: 'C' }] }));
  assert.equal(result.status, 201); assert.equal(result.data.attempt.score, 1); assert.equal(result.data.storage, 'compatibility');
  compatibility = false;
  const insights = await call(`/library/teacher/bank-attempts/${studentId}`); assert.equal(insights.data.attempts.length, 2); assert.equal(completions.at(-1)[1], 'practice');
});
test('combined books use individual grants, preserve legacy access/history, reject codes, and grade on the server', async () => {
  tables.teacher_library_books.push({book_id:'source-b',title:'Old version',access_code:'ABC123'});
  const legacy = { id:'legacy-attempt',user_id:studentId,book_id:'source-a',attempt_number:1,completed_at:'2026-10-01T12:00:00Z',started_at:'2026-10-01T11:50:00Z',score:1,total_questions:1,total_time_seconds:30,question_stats:[] };
  tables.student_library_attempts.push(legacy); const original = structuredClone(legacy);
  assert.equal((await call('/library/books/book-fixture/access','other')).data.unlocked,false);
  mergedAssigned = true;
  assert.equal((await call('/library/books/book-fixture/access','student')).data.unlocked,true);
  assert.equal((await call('/library/books/book-fixture/unlock','other',{code:'WRONG1'})).status,410);
  assert.equal((await call('/library/books/book-fixture/unlock','other',{code:'ABC123'})).status,410);
  assert.equal((await call('/library/teacher/books/source-a/code','teacher',{title:'Old version'})).status,410);
  assert.equal((await call('/library/books/book-fixture/attempts','other',attempt({code:'ABC123'}))).status,403);
  const grantPath = `/library/teacher/books/source-b/students/${otherId}/access`;
  assert.equal((await call(grantPath,'student',{granted:true},'PUT')).status,403);
  assert.equal((await call(grantPath,'teacher',{granted:true},'PUT')).status,200);
  assert.equal((await call('/library/books/source-a/access','other')).data.unlocked,true);
  const responses = mergedBook.passageSet.questions.map(q => ({questionId:q.id,selectedAnswerId:'C',correctAnswerId:'C',timeSpentSeconds:10}));
  const saved = await call('/library/books/book-fixture/attempts','other',attempt({questions:responses}));
  assert.equal(saved.status,201);assert.equal(saved.data.attempt.score,0);
  assert.equal(tables.student_library_attempts.at(-1).question_stats[0].correctAnswerId,'A');
  assert.deepEqual(legacy,original);
  assert.equal((await call('/library/books/source-a/attempts','student')).data.attempts.length,1);
  assert.equal((await call('/library/books/book-fixture/attempts','student')).data.attempts.length,0);
  assert.equal((await call('/library/books/book-fixture/attempts','other',attempt({questions:responses.slice(0,1)}))).status,400);
  assert.deepEqual(completions.filter(row=>row[0]===otherId).map(row=>row[2]),['book-fixture','source-a','source-b']);
});
test('library correction classification persists, previews are student-isolated, and the perfect-score gate remains enforced',async()=>{
  assert.equal((await call(`/library/books/${set.id}/corrections`,'student')).status,403);
  await call(`/library/books/${set.id}/attempts`,'student',attempt({questions:[{questionId:question.id,selectedAnswerId:'A',timeSpentSeconds:10}]}));
  const view=await call(`/library/books/${set.id}/corrections`,'student');assert.equal(view.status,200);
  const response={questionId:question.id,whyChosenIncorrect:'No supporting detail.',whyCorrectAnswerCorrect:'The text supports A.',questionType:'Tone & Mood'};
  assert.equal((await call(`/library/books/${set.id}/corrections`,'student',{responses:[{...response,questionType:''}]})).status,400);
  const submitted=await call(`/library/books/${set.id}/corrections`,'student',{responses:[response]});
  assert.equal(submitted.status,201);assert.equal(submitted.data.correction.responses[0].questionType,'Tone & Mood');
  assert.equal(question.topic,'Evidence & Support');
  const preview=await call(`/library/books/${set.id}/corrections?studentId=${studentId}`);assert.equal(preview.status,200);assert.equal(preview.data.readOnly,true);
  assert.equal((await call(`/library/books/${set.id}/corrections?studentId=${studentId}`,'other')).status,403);
  assert.equal((await call(`/library/books/${set.id}/corrections?studentId=${otherId}`)).status,404);
  assert.equal((await call(`/library/books/${set.id}/corrections`,'teacher',{responses:[response]})).status,403);
  delete tables.student_library_corrections.at(-1).responses[0].questionType;
  assert.equal((await call(`/library/books/${set.id}/corrections`,'student')).status,200);
});

test('teacher dashboard combines version histories; revocation overrides assignments and past attempts', async () => {
 const detail = await call('/library/teacher/books/source-a');
 assert.equal(detail.status,200); assert.equal(detail.data.book.bookId,'book-fixture'); assert.equal('accessCode' in detail.data.book,false);
 assert.equal(detail.data.students.find(s=>s.id===studentId).attempts[0].id,'legacy-attempt');
 assert.equal(detail.data.students.find(s=>s.id===otherId).access.unlocked,true);
 const path=`/library/teacher/books/book-fixture/students/${studentId}/access`;
 assert.equal((await call(path,'teacher',{granted:'true'},'PUT')).status,400);
 assert.equal((await call(path,'teacher',{granted:false},'PUT')).status,200);
 assert.equal((await call('/library/books/source-a/access','student')).data.unlocked,false);
 assert.equal((await call('/library/books/book-fixture/attempts','student',attempt())).status,403);
 assert.equal((await call('/library/books/book-fixture/access','other')).data.unlocked,true);
 assert.equal((await call('/library/books/source-a/attempts','student')).data.attempts[0].id,'legacy-attempt');
 assert.equal((await call('/library/teacher/books/unknown/students/'+studentId+'/access','teacher',{granted:true},'PUT')).status,404);
 assert.equal((await call(path.replace(studentId,users.teacher.id),'teacher',{granted:true},'PUT')).status,404);
 accessFailure=true;
 assert.equal((await call(path,'teacher',{granted:true},'PUT')).status,503);
 assert.equal((await call('/library/books/book-fixture/access','student')).status,503);
 accessFailure=false;
});

test('students cannot forge library access through practice progress or profile metadata',async()=>{
 const progress=await call('/progress/practice/'+encodeURIComponent('english-library:access:book-fixture'),'student',{progress:{granted:true}},'PUT');
 assert.equal(progress.status,403);
 users.forged={id:studentId,app_metadata:{},user_metadata:{role:'teacher'}};
 assert.equal((await call(`/library/teacher/books/book-fixture/students/${studentId}/access`,'forged',{granted:true},'PUT')).status,403);
 users.archived={id:'44444444-4444-4444-4444-444444444444',app_metadata:{role:'student',class_ids:['shsat'],student_archived_at:'2026-10-17'}};
 users.unenrolled={id:'55555555-5555-5555-5555-555555555555',app_metadata:{role:'student',class_ids:[]}};
 for(const role of ['archived','unenrolled']) {
  assert.equal((await call(`/library/teacher/books/book-fixture/students/${users[role].id}/access`,'teacher',{granted:true},'PUT')).status,404);
  assert.equal((await call('/library/books/book-fixture/access',role)).data.unlocked,false);
 }
});
