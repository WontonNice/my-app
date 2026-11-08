import registry from './learning-taxonomy.json';
import organization from './question-organization.json';
import type { ExamQuestion, ExamContent, ExamSource } from './examTypes';

export const learningAreas = [
  { id:'reading', label:'Reading Comprehension' },
  { id:'math', label:'Math' },
  { id:'revising_editing_a', label:'Revising/Editing A' },
  { id:'revising_editing_b', label:'Stand Alone Items' },
] as const;
export type LearningArea = typeof learningAreas[number]['id'];
export type QuestionBankId = LearningArea | 'shsat_lab';
export const questionBanks = [...learningAreas, {id:'shsat_lab',label:'SHSAT Lab Questions'}] as const;
export type LearningCategory = {id:string;area:LearningArea;label:string;aliases:string[];active:boolean;topics:{id:string;label:string;aliases:string[];active:boolean}[]};
export type QuestionOrganization = {source?:ExamSource; publisher:string; sourceLocator?:string; area:LearningArea; bank:QuestionBankId; categoryId:string; topicId?:string; mathSkillId?:string; authoredClassification?:string};
export const learningCategories = registry.categories as LearningCategory[];
const normalize = (value:string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/['’]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
export function categoryFor(area:LearningArea,value:string) {
  return learningCategories.find(item=>item.area===area&&(item.id===value||[item.label,...item.aliases].some(label=>normalize(label)===normalize(value))));
}
export function questionOrganization(question:{id:string;duplicateOf?:string}):QuestionOrganization|undefined {
  const records=organization as Record<string,QuestionOrganization>;
  return records[question.id] ?? records[question.duplicateOf ?? ''];
}
export function sourcePublisher(source?:ExamSource|string, fallback?:string):string {
  if(typeof source==='string'&&source.trim())return source;
  if(source&&typeof source==='object') {
    if(source.publisher)return source.publisher;
    const value=[source.collection,source.sourceFamily,source.label].filter(Boolean).join(' ');
    for(const [pattern,label] of [[/shsat.?lab/i,'SHSAT Lab'],[/kaplan/i,'Kaplan'],[/prestige/i,'Prestige'],[/official|handbook|doe/i,'Official Handbook']] as const)if(pattern.test(value))return label;
    if(source.collection)return source.collection;
  }
  return ({official_handbook:'Official Handbook',prestige:'Prestige',kaplan:'Kaplan',shsat_lab:'SHSAT Lab'} as Record<string,string>)[fallback??''] ?? 'Unspecified';
}
export function organizedQuestion(question:ExamQuestion):ExamQuestion {
  const metadata=questionOrganization(question);
  if(!metadata)return question;
  const authoredChanged=metadata.authoredClassification!==undefined&&metadata.authoredClassification!==JSON.stringify([question.topic??'',question.subtopic??'',question.skilled??'']);
  if(authoredChanged){
    const category=categoryFor(metadata.area,question.topic),topic=category?.topics.find(item=>[item.label,...item.aliases].includes(question.subtopic??''));
    return {...question,organization:{...metadata,categoryId:category?.id??'',topicId:topic?.id,mathSkillId:question.skilled},source:{...(typeof question.source==='object'?question.source:{}),...metadata.source,publisher:metadata.publisher,...(metadata.sourceLocator?{sourceQuestion:metadata.sourceLocator}:{})}};
  }
  const category=learningCategories.find(item=>item.id===metadata.categoryId);
  const topic=category?.topics.find(item=>item.id===metadata.topicId);
  return {...question,organization:metadata,source:{...(question.source&&typeof question.source==='object'?question.source:{}),...metadata.source,publisher:metadata.publisher,...(metadata.sourceLocator?{sourceQuestion:metadata.sourceLocator}:{})},
    ...(category?{topic:category.label}:{}),...(topic?{subtopic:topic.label}:{}),...(metadata.mathSkillId?{skilled:metadata.mathSkillId}:{})};
}
/** Call only for current authored content. Historical snapshots keep their original metadata. */
export function organizedContent(content:ExamContent):ExamContent {
  return {...content,passageSets:content.passageSets.map(set=>({...set,questions:set.questions.map(organizedQuestion)})),
    ...(content.mathSection?{mathSection:{...content.mathSection,questions:content.mathSection.questions.map(organizedQuestion)}}:{}),
    ...(content.standaloneSection?{standaloneSection:{...content.standaloneSection,questions:content.standaloneSection.questions.map(organizedQuestion)}}:{})};
}
