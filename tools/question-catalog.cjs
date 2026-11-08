const { isDeepStrictEqual } = require('node:util');
const { examQuestions, reconcileAssessments } = require('./exam-catalog.cjs');
const plain = value => JSON.parse(JSON.stringify(value));
const { createHash } = require('node:crypto');
const { withTypeScript } = require('./exam-catalog.cjs');

/** An index of existing records, never another editable copy of a question. */
function questionCatalog(inventory, catalog, bank = { questions: [], sets: [] }, learning = withTypeScript(() => require('../server/src/shared/learningTaxonomy.ts'))) {
  const {canonicalWorksheetCollection}=withTypeScript(()=>require('../server/src/shared/studyHallWorksheets.ts'));
  const entries = [], issues = [];
  const add = (question, details) => entries.push({
    id: question.id, canonicalId: question.duplicateOf || question.id,
    subject: details.section === 'math' ? 'Math' : 'English',
    type: question.type || 'multiple_choice', topic: question.topic || '',
    subtopic: question.subtopic || '', difficulty: question.difficulty || null,
    status: question.status || 'authored', question, ...details, exams: [], sets: [],
  });
  for (const passage of inventory.passages) for (const question of passage.questions) add(question, {
    kind: 'passage', section: passage.section || 'reading',
    source: passage.source, sourceCategory: passage.passageCategory, passageTitle:passage.title,
    contextVersion: createHash('sha256').update(JSON.stringify([passage.text,passage.richText,passage.images])).digest('hex').slice(0,16),
    editor: { passageId: passage.id, fileName: passage.fileName },
  });
  for (const section of inventory.mathSections) for (const question of section.questions) add(question, {
    kind: 'math', section: 'math', source:question.source || section.source, editor: { sectionId: section.id, fileName: section.fileName },
  });
  for (const question of inventory.standaloneItems) add(question, {
    kind: 'standalone', section: 'revising_editing_b', source:question.source, editor: { questionId: question.duplicateOf || question.id, versionId: question.id, fileName: 'standaloneItems.ts' },
  });
  for (const question of bank.questions) add(question, {
    kind: 'capture', section: question.subject === 'Math' ? 'math' : question.section,
    source: question.source, editor: { questionId: question.id, fileName: 'server/data/question-bank.json' },
  });
  const byId = new Map();
  for (const entry of entries) {
    entry.authoredClassification=JSON.stringify([entry.question.topic??'',entry.question.subtopic??'',entry.question.skilled??'']);
    if (byId.has(entry.id)) issues.push({ type: 'duplicate-bank-id', id: entry.id });
    else byId.set(entry.id, entry);
  }
  for (const entry of entries) if (!byId.has(entry.canonicalId)) issues.push({ type: 'missing-source-version', id: entry.id, canonicalId: entry.canonicalId });
  const tests = new Map(inventory.tests.map(exam => [exam.assessmentId, exam]));
  for (const id of catalog.registeredIds) {
    const content = catalog.content[id], assembly=catalog.assessments?.find(item=>item.id===id)?.assembly;
    const test = tests.get(id) || (assembly?{passageIds:[],standaloneItemIds:[],questionIds:assembly.publishedQuestionIds||[]}:undefined);
    if (!test) issues.push({ type: 'missing-editor-exam', exam: id });
    const editorIds = new Set(test ? [
      ...(test.questionIds||[]),...test.passageIds.flatMap(passageId => inventory.passages.find(p => p.id === passageId)?.questions.map(q => q.id) || []),
      ...test.standaloneItemIds,
      ...(inventory.mathSections.find(section => section.fileName === test.mathSectionFileName)?.questions || []).map(q => q.id),
    ] : []);
    const actualIds = new Set();
    const orderedQuestions=examQuestions(content);
    const mathIds=new Set(content.mathSection?.questions.map(question=>question.id) || []);
    const mathNumbers=new Map(orderedQuestions.filter(question=>mathIds.has(question.id)).map((question,index)=>[question.id,index+1]));
    for (const [index, question] of orderedQuestions.entries()) {
      actualIds.add(question.id);
      const entry = byId.get(question.id);
      if (!entry) issues.push({ type: 'missing-editor-question', exam: id, id: question.id });
      else entry.exams.push({ assessmentId: id, title: content.title, number: index + 1, ...(entry.section==='math'?{sectionNumber:mathNumbers.get(question.id)}:{}) });
      if (!editorIds.has(question.id)) issues.push({ type: 'missing-editor-membership', exam: id, id: question.id });
    }
    for (const questionId of editorIds) if (!actualIds.has(questionId)) issues.push({ type: 'extra-editor-membership', exam: id, id: questionId });
  }
  for (const test of inventory.tests) if (!catalog.registeredIds.has(test.assessmentId)) issues.push({ type: 'unregistered-editor-exam', exam: test.assessmentId });
  for (const set of bank.sets) {
    const seen = new Set();
    for (const id of set.questionIds) {
      const question = byId.get(id);
      if (seen.has(id)) issues.push({ type: 'duplicate-set-question', set: set.id, id });
      seen.add(id);
      if (!question || question.kind !== 'capture' || question.status !== 'published') issues.push({ type: 'invalid-set-question', set: set.id, id });
      else question.sets.push(set.id);
    }
  }
  for (const error of inventory.errors || []) issues.push({ type: 'editor-parse-error', ...error });
  for (const entry of entries) {
    const metadata=learning.questionOrganization(entry.question);
    entry.question=learning.organizedQuestion(entry.question);
    entry.area=metadata?.area || entry.section;
    entry.bankId=entry.kind==='capture'?'shsat_lab':entry.section;
    entry.publisher=metadata?.publisher || learning.sourcePublisher(entry.question.source || entry.source,entry.sourceCategory);
    const source=entry.question.source || entry.source || {};
    entry.sourceFamily=source.sourceFamily || '';
    entry.shsatLevel=source.shsatLevel || (/^(?:Grade|SHSAT)\s*9$/i.test(source.form || '')?'9':/^(?:Grade|SHSAT)\s*8$/i.test(source.form || '')?'8':'');
    entry.year=source.year || '';
    entry.collection=source.collection || '';
    entry.sourceLocator=metadata?.sourceLocator || entry.question.source?.sourceQuestion || '';
    entry.topic=entry.question.topic || '';
    entry.subtopic=entry.question.subtopic || '';
    const category=learning.categoryFor(entry.area,entry.topic);
    entry.categoryId=category?.active?category.id:'';
    entry.topicId=category?.topics.find(topic=>[topic.id,topic.label,...topic.aliases].includes(entry.subtopic))?.id || '';
    entry.mathSkillId=entry.question.skilled || '';
    entry.contentVersion=createHash('sha256').update(JSON.stringify([entry.question,entry.contextVersion])).digest('hex').slice(0,16);
    entry.usages=entry.exams.map(usage=>({...usage,id:usage.assessmentId,kind:catalog.assessments?.find(item=>item.id===usage.assessmentId)?.studyHallWorksheet?'worksheet':'assessment'}));
    for(const activity of catalog.assessments??[]){const number=activity.assembly?.draftQuestionIds.indexOf(entry.id);if(number!==undefined&&number>=0)entry.usages.push({id:activity.id,assessmentId:activity.id,title:activity.title,number:number+1,kind:activity.studyHallWorksheet?'worksheet':'assessment',status:'draft'});}
    entry.collections=[...new Set(entry.usages.map(usage=>catalog.assessments?.find(activity=>activity.id===usage.id)?.studyHallWorksheet?.collection).map(canonicalWorksheetCollection).filter(Boolean))];
    entry.classificationIssues=[...(entry.publisher==='Unspecified'?['Source needed']:[]),...(!entry.categoryId?['Category needed']:[]),...(entry.area==='math'&&!entry.topicId?['Math topic needed']:[]),...(entry.area==='math'&&(!entry.mathSkillId||entry.mathSkillId.toLowerCase()==='tbd')?['Math skill needed']:[])];
  }
  return { entries, issues };
}

function auditQuestionSync(inventory, catalog, bank, savedContent) {
  const { entries, issues } = questionCatalog(inventory, catalog, bank);
  const expected = reconcileAssessments(catalog);
  for (const assessment of expected) {
    if (!catalog.registeredIds.has(assessment.id)) continue;
    const actual = catalog.assessments?.find(a => a.id === assessment.id);
    const actualById = new Map((actual.questions || []).map(q => [q.id, q]));
    for (const question of assessment.questions) {
      const previous = actualById.get(question.id);
      if (!previous) issues.push({ type: 'missing-registry-question', exam: assessment.id, id: question.id });
      else if (!isDeepStrictEqual(plain(previous), plain(question))) issues.push({ type: 'registry-drift', exam: assessment.id, id: question.id, fields: [...new Set([...Object.keys(previous), ...Object.keys(question)])].filter(key => !isDeepStrictEqual(previous[key], question[key])) });
      actualById.delete(question.id);
    }
    for (const id of actualById.keys()) issues.push({ type: 'orphan-registry-question', exam: assessment.id, id });
    if (!isDeepStrictEqual((actual.questions || []).map(q => q.id), assessment.questions.map(q => q.id))) issues.push({ type: 'registry-order', exam: assessment.id });
  }
  if (!isDeepStrictEqual(plain(savedContent), plain(catalog.content))) issues.push({ type: 'stale-server-export' });
  return {
    ok: issues.length === 0,
    counts: { exams: catalog.registeredIds.size, questions: entries.length, math: entries.filter(q => q.kind === 'math').length, standalone: inventory.standaloneItems.length, passage: entries.filter(q => q.kind === 'passage').length, captures: bank.questions.length, sets: bank.sets.length },
    issues,
  };
}

function selectCatalog(entries, filters = {}) {
  const search = String(filters.search || '').trim().toLocaleLowerCase();
  const sort = ['id', 'topic', 'subject', 'type'].includes(filters.sort) ? filters.sort : 'id';
  return entries.filter(entry => ['id', 'canonicalId', 'subject', 'section', 'topic', 'subtopic', 'difficulty', 'type', 'kind', 'status','bankId','area','publisher','sourceFamily','shsatLevel','year','categoryId','topicId','mathSkillId'].every(key => !filters[key] || entry[key] === filters[key])
    && (!filters.collection || entry.collections.includes(filters.collection))
    && (!filters.assessmentId || entry.exams.some(exam => exam.assessmentId === filters.assessmentId))
    && (!filters.usage || filters.usage==='unused' ? (!filters.usage||!entry.usages.length) : entry.usages.some(usage=>usage.kind===filters.usage))
    && (!filters.review || filters.review!=='needs-classification' || entry.classificationIssues.length)
    && (!search || [entry.id, entry.question.prompt, entry.topic, entry.subtopic, entry.publisher,entry.passageTitle,entry.sourceLocator, ...entry.exams.map(exam => exam.title)].join(' ').toLocaleLowerCase().includes(search)))
    .sort((a, b) => String(a[sort]).localeCompare(String(b[sort]),undefined,{numeric:true}) || a.id.localeCompare(b.id,undefined,{numeric:true}));
}

module.exports = { questionCatalog, auditQuestionSync, selectCatalog };
