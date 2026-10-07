// Isolated test adapter. This module never reads env files or calls Supabase.
const path = require('node:path');
const { randomUUID } = require('node:crypto');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../../tsconfig.json') });
const studentId = '11111111-1111-4111-8111-111111111111';
const teacherId = '33333333-3333-4333-8333-333333333333';
const users = {
  teacher: { id: teacherId, app_metadata: { role: 'teacher' }, user_metadata: { full_name: 'QA Teacher' }, email: 'teacher@example.test' },
  student: { id: studentId, app_metadata: { role: 'student', class_ids: ['shsat'] }, user_metadata: { full_name: 'QA Student' }, email: 'student@example.test' },
  other: { id: '22222222-2222-4222-8222-222222222222', app_metadata: { role: 'student', class_ids: ['shsat'] }, user_metadata: {} },
  viewer: { id: '44444444-4444-4444-8444-444444444444', app_metadata: { role: 'teacher' }, user_metadata: { full_name: 'QA Viewer' } },
  forged: { id: '55555555-5555-4555-8555-555555555555', app_metadata: { class_ids: ['shsat'] }, user_metadata: { role: 'teacher' } },
};
const tables = { student_boards: [], board_participants: [], board_revisions: [], board_assets: [], student_assignments: [], student_practice_progress: [], student_library_attempts: [], student_exam_results: [] };
const tableErrors = new Map();
const objects = new Map(); const channels = new Set(); let forceCasConflict = false, failNextChannel = false;
function stub(relative, exports) { const id = require.resolve(relative); require.cache[id] = { id, filename: id, loaded: true, exports }; }
const db = {
  auth: {
    getUser: async token => ({ data: { user: users[token] ?? null }, error: users[token] ? null : { message: 'Invalid test session' } }),
    admin: { getUserById: async id => ({ data: { user: Object.values(users).find(user => user.id === id) ?? null }, error: null }), listUsers: async () => ({ data: { users: Object.values(users) }, error: null }) },
  },
  from(table) {
    const filters = [], sorts = []; let start = 0, end = Infinity, single = false, changes, additions;
    const query = {
      select() { return this; }, eq(key, value) { filters.push(row => row[key] === value); return this; },
      neq(key, value) { filters.push(row => row[key] !== value); return this; }, is(key, value) { filters.push(row => value === null ? row[key] == null : row[key] === value); return this; },
      not(key, _op, value) { filters.push(row => row[key] !== value); return this; }, in(key, values) { filters.push(row => values.includes(row[key])); return this; },
      like(key, value) { filters.push(row => String(row[key]).startsWith(value.replace('%', ''))); return this; },
      or(value) { const owner = value.match(/owner_id\.eq\.([^,]+)/)?.[1], ids = value.match(/id\.in\.\(([^)]+)\)/)?.[1].split(',') ?? []; filters.push(row => row.owner_id === owner || ids.includes(row.id)); return this; },
      order(key, options = {}) { sorts.push([key, options]); return this; }, range(a, b) { start = a; end = b + 1; return this; }, limit(n) { end = n; return this; },
      single() { single = true; return this; }, maybeSingle() { single = true; return this; }, insert(value) { additions = Array.isArray(value) ? value : [value]; return this; }, update(value) { changes = value; return this; },
      then(resolve, reject) {
        if (tableErrors.has(table)) return Promise.resolve({ data: null, error: tableErrors.get(table) }).then(resolve, reject);
        const rows = tables[table] ?? []; if (additions) rows.push(...structuredClone(additions));
        let matching = rows.filter(row => filters.every(filter => filter(row))); if (changes) matching.forEach(row => Object.assign(row, structuredClone(changes)));
        matching.sort((a, b) => { for (const [key, options] of sorts) if (a[key] !== b[key]) return String(a[key]).localeCompare(String(b[key])) * (options.ascending === false ? -1 : 1); return 0; });
        const count = matching.length; const data = matching.slice(start, end).map(row => structuredClone(row));
        return Promise.resolve({ data: single ? data[0] ?? null : data, error: null, count }).then(resolve, reject);
      },
    }; return query;
  },
  async rpc(name, args) {
    if (name === 'create_student_board') {
      const board = { id: args.p_id, student_id: args.p_student, owner_id: args.p_owner, title: args.p_title, state: args.p_state, epoch: randomUUID(), revision: 1, archived_at: null, deleted_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), updated_by: args.p_owner };
      tables.student_boards.push(board); if (board.student_id !== board.owner_id) tables.board_participants.push({ board_id: board.id, user_id: board.student_id, role: 'editor' });
      tables.board_revisions.push({ id: randomUUID(), board_id: board.id, epoch: board.epoch, state: board.state, title: board.title, label: 'Board created', created_by: board.owner_id, created_at: new Date().toISOString() });
      return { data: null, error: null };
    }
    const board = tables.student_boards.find(board => board.id === args.p_id);
    if (!board || board.deleted_at) return { data: null, error: { message: 'Board not found' } };
    const member = tables.board_participants.find(member => member.board_id === board.id && member.user_id === args.p_actor);
    const role = board.owner_id === args.p_actor ? 'owner' : member?.role;
    if (board.revision !== args.p_revision || name === 'commit_student_board' && board.epoch !== args.p_epoch) return { data: null, error: null };
    if (forceCasConflict) { forceCasConflict = false; board.revision++; return { data: null, error: null }; }
    if (name === 'commit_student_board') {
      if (!role || role === 'viewer' || board.archived_at) return { data: null, error: { message: 'Board is not editable' } };
      board.state = args.p_state;
    } else if (name === 'manage_student_board') {
      if (role !== 'owner') return { data: null, error: { message: 'Owner required' } };
      const value = args.p_value;
      if (args.p_action === 'rename') board.title = value.title;
      else if (args.p_action === 'archive') board.archived_at = value.archived ? new Date().toISOString() : null;
      else if (args.p_action === 'delete') board.deleted_at = new Date().toISOString();
      else if (args.p_action === 'participant') {
        const existing = tables.board_participants.find(member => member.board_id === board.id && member.user_id === value.id);
        if (value.role === 'remove') { const index = tables.board_participants.indexOf(existing); if (index >= 0) tables.board_participants.splice(index, 1); }
        else if (existing) existing.role = value.role; else tables.board_participants.push({ board_id: board.id, user_id: value.id, role: value.role });
      } else if (['restore', 'checkpoint'].includes(args.p_action)) {
        tables.board_revisions.push({ id: randomUUID(), board_id: board.id, epoch: board.epoch, state: board.state, title: board.title, label: args.p_action === 'restore' ? 'Before restore' : 'Named checkpoint', created_by: args.p_actor, created_at: new Date().toISOString() });
        if (args.p_action === 'restore') { board.state = value.state; board.epoch = randomUUID(); }
      }
    }
    board.updated_by = args.p_actor; board.updated_at = new Date().toISOString(); board.revision++;
    return { data: structuredClone(board), error: null };
  },
  storage: { from: () => ({
    upload: async (key, bytes) => { objects.set(key, Buffer.from(bytes)); return { data: { path: key }, error: null }; },
    remove: async keys => { keys.forEach(key => objects.delete(key)); return { error: null }; },
    copy: async (source, target) => { objects.set(target, objects.get(source)); return { data: { path: target }, error: null }; },
    createSignedUrl: async key => ({ data: { signedUrl: `/qa-asset/${encodeURIComponent(key)}` }, error: null }),
  }) },
  channel(topic) {
    const listeners = []; const channel = { topic, on(_type, _filter, listener) { listeners.push(listener); return this; }, subscribe(callback) { channels.add(channel); const fail = failNextChannel; failNextChannel = false; queueMicrotask(() => callback(fail ? 'CHANNEL_ERROR' : 'SUBSCRIBED')); return this; }, async send(message) { for (const other of channels) if (other !== channel && other.topic === topic) other.listeners.forEach(listener => listener({ payload: message.payload })); return 'ok'; }, listeners };
    return channel;
  },
  removeChannel: async channel => { channels.delete(channel); return 'ok'; },
};
stub('../../src/lib/auth.ts', { getAuthenticatedUser: async header => ({ user: users[header?.slice(7)] ?? null, error: 'Sign in required' }), getEnrolledClassIds: meta => meta?.student_archived_at ? [] : meta?.class_ids ?? [], isStudentArchived: user => Boolean(user.app_metadata?.student_archived_at), getUserRole: user => user.app_metadata?.role ?? 'student' });
stub('../../src/lib/supabase.ts', { supabase: db });
const passage = { id: 'qa-passage', kind: 'passage', title: 'A synthetic reading passage', aliases: ['qa-passage'], href: '/study-hall/shsat/library/qa-passage' };
const catalog = [passage];
stub('../../src/lib/learningPlanStore.ts', { learningCatalog: () => catalog, assignedContentIds: async (student, kind) => new Set(tables.student_assignments.filter(row => row.student_id === student && row.kind === kind && row.assigned_at && row.status !== 'planned').map(row => row.content_id)) });
stub('../../src/lib/questionBank.ts', { readQuestionBank: () => ({ revision: 1, sets: [{ id: 'qa-bank', subject: 'English', questionIds: ['qa-bank-q'] }], questions: [{ id: 'qa-bank-q', subject: 'English', status: 'published', source: 'QA', topic: 'Evidence & Support', prompt: 'Which evidence supports the idea?', choices: [{ id: 'A', text: 'Evidence A' }], correctChoiceId: 'SECRET-ANSWER', explanation: 'SECRET-EXPLANATION', passage: null }] }) });
const assessment = { id: 'qa-exam', title: 'QA exam', status: 'locked', sectionAccess: { english: false, math: false } };
stub('../../src/config/assessments.ts', { listTeacherAssessments: () => [assessment], findAssessmentForStudent: () => assessment });
const examContent = { passageSets: [{ id: 'qa-passage', passage: { id: 'qa-passage', title: 'A synthetic reading passage', lines: [{ text: 'A seed grows when it receives sunlight and water.' }] }, questions: [{ id: 'qa-exam-q', topic: 'Inference', prompt: 'What helps the seed grow?', choices: [{ id: 'A', text: 'Water' }], correctChoiceId: 'SECRET-ANSWER' }] }] };
stub('../../src/lib/examContent.ts', { getExamContent: id => id === assessment.id ? examContent : null });
module.exports = { db, tables, tableErrors, objects, users, catalog, examContent, studentId, teacherId, assessment, failChannel: () => { failNextChannel = true; }, conflict: () => { forceCasConflict = true; }, shared: require('../../src/shared/boards.ts'), store: require('../../src/lib/boardStore.ts') };
