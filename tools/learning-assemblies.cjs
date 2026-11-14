const fs = require('node:fs');
const path = require('node:path');
const {createHash}=require('node:crypto');
const {withTypeScript,activityStore,assessmentQuestionFrom,examQuestions}=require('./exam-catalog.cjs');
const {writeExportFile}=require('./write-export-file.cjs');
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');

function canonicalQuestions(root,inventory,bank) {
  return withTypeScript(()=>{
    const entries=new Map();
    entries.learning=require('./learning-taxonomy.cjs').loadLearningTaxonomy(root);
    function load(folder,item){const file=path.join(root,'client/src/content/exams',folder,item.fileName);delete require.cache[require.resolve(file)];const module=require(file);return module[item.exportName];}
    for(const passage of inventory.passages){const set=load('passageSets',passage);for(const question of set.questions)entries.set(question.id,{question:{...question,source:question.source||set.source||passage.source||{publisher:withTypeScript(()=>require('../server/src/shared/learningTaxonomy.ts')).sourcePublisher(undefined,passage.passageCategory)}},passageSet:set,area:set.section||passage.section||'reading'});}
    for(const section of inventory.mathSections){const set=load('mathSets',section);for(const question of set.questions){const classified=section.questions.find(item=>item.id===question.id);entries.set(question.id,{question:{...question,...(classified?{topic:classified.topic,subtopic:classified.subtopic,skilled:classified.skilled}:{}),source:question.source||set.source||section.source},area:'math'});}}
    for(const question of inventory.standaloneItems)entries.set(question.id,{question,area:'revising_editing_b'});
    const {bankPassage}=require('../server/src/shared/questionBank.ts');
    for(const capture of bank.questions.filter(q=>q.status==='published')){
      const question={id:capture.id,type:'multiple_choice',topic:capture.topic,prompt:capture.prompt,choices:capture.choices,correctChoiceId:capture.correctChoiceId,explanation:capture.explanation,incorrectChoiceExplanations:capture.incorrectChoiceExplanations,image:capture.visualImage,points:1,source:{publisher:capture.source,url:capture.sourceUrl}};
      const set={id:capture.id+'-set',section:capture.section,label:capture.passage?.title||'SHSAT Lab',passage:bankPassage(capture),questionCount:1,questions:[question],directions:{title:'SHSAT Lab',subject:'English Language Arts',body:'Read the passage and answer the question.'}};
      entries.set(capture.id,{question,passageSet:set,area:capture.section});
    }
    return entries;
  });
}
function assembleActivity(activity,entries){
  const ids=activity.assembly.draftQuestionIds;
  if(!Array.isArray(ids)||!ids.length||ids.length>200||new Set(ids).size!==ids.length)throw new Error('Choose 1–200 distinct questions before previewing or publishing.');
  const passageSets=[],math=[],standalone=[];
  const sections={};
  for(const id of ids){
    const entry=entries.get(id);if(!entry)throw new Error(`Question ${id} is unavailable or has not been published from its bank.`);
    const {organizedQuestion}=entries.learning||withTypeScript(()=>require('../server/src/shared/learningTaxonomy.ts'));
    const question=organizedQuestion(entry.question);
    if(activity.studyHallWorksheet&&activity.studyHallWorksheet.subject!==(entry.area==='math'?'math':'english'))throw new Error('Every question must match the worksheet subject.');
    if(entry.area==='math')math.push(question);
    else if(entry.area==='revising_editing_b')standalone.push(question);
    else{
      const key=entry.passageSet.passage.id;
      let set=passageSets.find(set=>set.passage.id===key);
      if(!set){set={...entry.passageSet,section:entry.area,questions:[],questionCount:0};passageSets.push(set);sections[key]=entry.area;}
      set.questions.push(question);set.questionCount=set.questions.length;
    }
  }
  const directions={subject:'English Language Arts',title:'Stand Alone Items',body:'Read each question and choose the best answer.'};
  return {assessmentId:activity.id,title:activity.title,...(activity.studyHallWorksheet?.source?{source:activity.studyHallWorksheet.source}:{}),questionOrder:ids,passageSets,passageSections:sections,
    ...(math.length?{mathSection:{id:activity.id+'-math',label:'Math',questionCount:math.length,directions:{subject:'Mathematics',title:'Math',body:'Solve each problem.',notes:[]},questions:math}}:{}),
    ...(standalone.length?{standaloneSection:{id:activity.id+'-standalone',label:'Stand Alone Items',questionCount:standalone.length,directions,questions:standalone}}:{})};
}
function publicationIssues(activity,content,learning){
  const issues=[];
  const {questionOrganization,categoryFor,sourcePublisher}=learning||withTypeScript(()=>require('../server/src/shared/learningTaxonomy.ts'));
  const {libraryCorrectAnswer}=withTypeScript(()=>require('../server/src/shared/libraryBooks.ts'));
  const {correctCoordinateAnswer}=withTypeScript(()=>require('../server/src/shared/coordinateResponse.ts'));
  const {isExamQuestionCorrect}=withTypeScript(()=>require('../server/src/shared/examGrading.ts'));
  for(const question of examQuestions(content)){
    const location=content.mathSection?.questions.includes(question)?'math':content.standaloneSection?.questions.includes(question)?'revising_editing_b':content.passageSets.find(set=>set.questions.includes(question))?.section||'reading';
    const metadata=questionOrganization(question);
    if(!question.prompt?.trim()&&!question.promptHtml?.trim())issues.push(`${question.id}: prompt needed`);
    if(activity.studyHallWorksheet){
      if(!categoryFor(location,question.topic)?.active)issues.push(`${question.id}: category needed`);
      if(sourcePublisher(question.source)==='Unspecified')issues.push(`${question.id}: source needed`);
      if(location==='math'&&!question.subtopic)issues.push(`${question.id}: math topic needed`);
    }
    if(question.type==='multiple_choice'&&!question.choices?.some(choice=>choice.id===question.correctChoiceId))issues.push(`${question.id}: valid answer key needed`);
    if(question.type==='multi_select'&&!question.correctChoiceIds?.length)issues.push(`${question.id}: answer key needed`);
    try{const key=question.type==='coordinate_response'?correctCoordinateAnswer(question):question.correctTextAnswers?.[0]??libraryCorrectAnswer(question);if(!isExamQuestionCorrect(question,key))issues.push(`${question.id}: answer key does not pass the student grader`);}catch{issues.push(`${question.id}: answer format needs repair`);}
    const placement=activity.studyHallWorksheet;
    if(placement?.scope==='focused'&&placement.categoryId&&categoryFor(location,question.topic)?.id!==placement.categoryId)issues.push(`${question.id}: outside the focused worksheet category`);
    if(placement?.scope==='focused'&&placement.topicId&&metadata?.topicId!==placement.topicId&&!placement.topic?.includes(question.subtopic||'\u0000'))issues.push(`${question.id}: outside the focused worksheet topic`);
  }
  if(!activity.assembly.reviewed)issues.push('Review the student preview and confirm the answer key and formatting.');
  if(activity.assembly.reviewedContentHash&&activity.assembly.reviewedContentHash!==hash(content))issues.push('A selected question changed after review. Preview and review this edition again.');
  return [...new Set(issues)];
}
function publishActivity(root,activity,content){
  const learning=fs.existsSync(path.join(root,'server/src/shared/learningTaxonomy.ts'))?require('./learning-taxonomy.cjs').loadLearningTaxonomy(root):undefined;
  const issues=publicationIssues(activity,content,learning);if(issues.length)throw Object.assign(new Error(issues.join('\n')),{status:400});
  const file=path.join(root,'server/data/activity-releases.json');
  const releases=JSON.parse(fs.readFileSync(file,'utf8'));
  const releaseId=hash(content);
  releases[releaseId]??={id:releaseId,activityId:activity.id,createdAt:new Date().toISOString(),content:{...content,releaseId}};
  writeExportFile(file,JSON.stringify(releases,null,2)+'\n');
  activityStore(path.join(root,'server/data')).update(items=>items.map(item=>item.id===activity.id?{...item,questions:examQuestions(content).map(assessmentQuestionFrom),passages:content.passageSets.map(set=>({id:set.passage.id,title:set.passage.title,text:set.passage.lines.map(line=>line.text).join('\n'),imageUrl:''})),assembly:{...item.assembly,publishedMetadata:{title:activity.title,description:activity.description,durationMinutes:activity.durationMinutes,studyHallWorksheet:activity.studyHallWorksheet},publishedReleaseId:releaseId,publishedQuestionIds:examQuestions(content).map(q=>q.id),publishedAt:new Date().toISOString()},updatedAt:new Date().toISOString()}:item));
  return {releaseId};
}
module.exports={canonicalQuestions,assembleActivity,publicationIssues,publishActivity,hash};
