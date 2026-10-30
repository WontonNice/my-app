import { generatePracticeQuestion, practiceGenerators, practiceModules } from './infinitePractice';
import type { ExamQuestion } from './examTypes';
import { organizePracticeCatalog, practiceDifficulties, practicePrograms, practiceReviewStatuses, type GeneratorOrganization } from './practiceOrganization';
import { resolveSkilled, skilledTbd, validateSkilled, type MathClassificationSkill } from './mathClassificationSkills';
import { generateTemplateQuestion, validateGeneratorTemplate, type GeneratorTemplate } from './generatorTemplate';

export type GeneratorSettings = { minCoefficient:number; maxCoefficient:number; minBoundary:number; maxBoundary:number; minOffset:number; maxOffset:number; negativeCoefficients:boolean; inclusive:boolean };
export type PracticeGeneratorDefinition = GeneratorOrganization & { skilled?:string; id:string; title:string; description:string; enabled:boolean; kind:'builtin'|'one-step'|'two-step'|'template'; builtinId?:string; settings?:GeneratorSettings; template?:GeneratorTemplate; category?:string; topic?:string };
export type ManagedPracticeModule = { titleMode?:'custom'|'skill'; skilled?:string; id:string; title:string; description:string; category:string; topic:string; published:boolean; includeAll:boolean; generatorIds:string[]; parentId?:string|null; defaultType?:'foundation'|'general'; selectionAliases?:string[]; skillId?:string };
export type PracticeVideo = { id:string; title:string; description:string; category:string; topic:string; published:boolean; url:string; channelTitle?:string; duration?:string; viewCount?:number; publishedAt?:string };
export type PracticeCatalog = { modules:ManagedPracticeModule[]; generators:PracticeGeneratorDefinition[]; videos:PracticeVideo[] };
export type PracticeCatalogResponse = { revision:number; catalog:PracticeCatalog };
export const defaultGeneratorSettings:GeneratorSettings = {minCoefficient:2,maxCoefficient:9,minBoundary:-10,maxBoundary:10,minOffset:1,maxOffset:12,negativeCoefficients:true,inclusive:false};
export function defaultPracticeCatalog(topics?:PracticeTaxonomy):PracticeCatalog {
  let catalog=ensureTopicPracticeModules({
    generators:practiceGenerators.map(generator=>({id:generator.id,title:generator.title,description:generator.description??(generator.foundation?'Small positive coefficients and exact division.':'Positive and negative coefficients, including sign flips.'),enabled:true,kind:'builtin',builtinId:generator.id,category:generator.category??'Algebra',topic:generator.topic??'Inequalities'})),
    modules:practiceModules.map(module=>({id:module.id,title:module.title,description:module.id==='foundation'?'Build confidence with one-step inequalities, including positive division and sign flips.':module.description,category:module.category??'Algebra',topic:module.topic??'Inequalities',published:true,includeAll:module.selection==='all',generatorIds:module.id==='foundation'?practiceGenerators.filter(generator=>(generator.category??'Algebra')==='Algebra'&&(generator.topic??'Inequalities')==='Inequalities').map(generator=>generator.id):Array.isArray(module.selection)?module.selection:[]})),
    videos:[],
  },topics);
  for(const definition of practiceModules.filter(module=>module.placement==='foundation')){
    const module=catalog.modules.find(module=>module.id===definition.id)!;
    const parent=catalog.modules.find(parent=>practiceModuleKind(parent)==='foundation'&&sameTopic(parent,module))!;
    catalog=movePracticeModule(catalog,module.id,parent.id);
  }
  return organizePracticeCatalog(catalog);
}
export type PracticeSelection = { childModuleIds?:string[]; topics?:string[] };
export const generatorTopicKey=(generator:PracticeGeneratorDefinition)=>`${generator.category??'Algebra'} / ${generator.topic??'Inequalities'}`;
export type PracticeTaxonomy = {categories:{label:string;topics:string[]}[];classificationSkills?:MathClassificationSkill[]};
export type PracticeTopicRename = {category:string;from:string;to:string};
/** Follow explicit taxonomy renames without guessing destinations or changing stable IDs. */
export function reconcilePracticeTaxonomy(catalog:PracticeCatalog,taxonomy:PracticeTaxonomy,renames:PracticeTopicRename[]=[]):PracticeCatalog {
  const location=<T extends {category?:string;topic?:string}>(resource:T):T=>{
    const category=resource.category??'Algebra',topic=resource.topic??'Inequalities';
    if(taxonomy.categories.some(item=>item.label===category&&item.topics.includes(topic)))return {...resource};
    let renamed=topic;
    for(const rename of renames)if(rename.category===category&&rename.from===renamed)renamed=rename.to;
    return {...resource,...(renamed!==topic?{topic:renamed}:{})};
  };
  return {...catalog,modules:catalog.modules.map(location),generators:catalog.generators.map(location),videos:catalog.videos.map(location)};
}
export function practiceModuleKind(module:ManagedPracticeModule) {
  return module.defaultType ?? (module.id==='foundation'?'foundation':module.id==='all'?'general':undefined);
}
/** Explicitly linked modules follow the selected shared skill; legacy names remain intact. */
export function reconcilePracticeSkilled(catalog:PracticeCatalog,skills:MathClassificationSkill[]):PracticeCatalog {
  return {...catalog,generators:catalog.generators.map(generator=>({...generator,skilled:resolveSkilled(generator.skilled,generator.category??'Algebra',generator.topic??'Inequalities',skills)})),
    modules:catalog.modules.map(module=>{
      const skilled=resolveSkilled(module.skilled,module.category,module.topic,skills);
      const definition=skills.find(skill=>skill.id===skilled);
      return {...module,skilled,...(module.titleMode==='skill'&&definition&&!practiceModuleKind(module)?{title:definition.label}:{})};
    })};
}
/** Assign a shared skill without replacing the module, its generators, or its history. */
export function assignPracticeModuleSkill(catalog:PracticeCatalog,moduleId:string,skill:MathClassificationSkill):PracticeCatalog {
  const module=catalog.modules.find(item=>item.id===moduleId);
  if(!module||practiceModuleKind(module))throw new Error('Choose an individual module to assign a skill.');
  if((module.includeAll||module.generatorIds.length>0)&&(module.category!==skill.category||module.topic!==skill.subcategory))throw new Error('Choose a skill in this module’s Category and Subcategory so its existing generators stay in the same practice group.');
  const next=ensureTopicPracticeModules(catalog,{categories:[{label:skill.category,topics:[skill.subcategory]}]});
  const currentParent=next.modules.find(item=>item.id===module.parentId);
  const kind=currentParent?practiceModuleKind(currentParent)??'general':'general';
  const parent=next.modules.find(item=>practiceModuleKind(item)===kind&&item.category===skill.category&&item.topic===skill.subcategory)!;
  return {...next,modules:next.modules.map(item=>item.id===moduleId?{...item,title:skill.label,titleMode:'skill',skilled:skill.id,category:skill.category,topic:skill.subcategory,parentId:parent.id}:item)};
}
const sameTopic=(first:{category?:string;topic?:string},second:{category?:string;topic?:string})=>(first.category??'Algebra')===(second.category??'Algebra')&&(first.topic??'Inequalities')===(second.topic??'Inequalities');
export function topicPracticeModuleId(category:string,topic:string,kind:'foundation'|'general') {
  let hash=2166136261;for(const ch of JSON.stringify([category,topic]))hash=Math.imul(hash^ch.charCodeAt(0),16777619)>>>0;
  const slug=(category+'-'+topic).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,65);
  return kind+'-'+slug+'-'+hash.toString(36);
}
/** Backfill each topic once, retaining stable IDs, curated selections and visibility. */
export function ensureTopicPracticeModules(catalog:PracticeCatalog,topics?:PracticeTaxonomy):PracticeCatalog {
  const modules=catalog.modules.map(module=>{
    const kind=practiceModuleKind(module);
    return {...module,...(kind?{defaultType:kind,parentId:null}:{}),...(kind==='general'?{...(module.titleMode!=='custom'?{title:'General Practice'}:{}),includeAll:true}:{})};
  });
  const locations=new Map<string,{category:string;topic:string}>();
  const add=(category:string,topic:string)=>locations.set(JSON.stringify([category,topic]),{category,topic});
  topics?.categories.forEach(category=>category.topics.forEach(topic=>add(category.label,topic)));
  [...catalog.modules,...catalog.generators,...catalog.videos].forEach(item=>add(item.category??'Algebra',item.topic??'Inequalities'));
  for(const location of locations.values())for(const kind of ['foundation','general'] as const){
    if(modules.some(module=>practiceModuleKind(module)===kind&&sameTopic(module,location)))continue;
    modules.push({id:topicPracticeModuleId(location.category,location.topic,kind),title:kind==='foundation'?'Foundation Building':'General Practice',
      description:kind==='foundation'?'Build confidence with a focused selection of question types.':'Practice every available question type in this topic.',
      ...location,defaultType:kind,published:true,includeAll:true,generatorIds:[],parentId:null});
  }
  for(const module of modules){
    if(practiceModuleKind(module))continue;
    const parent=modules.find(item=>item.id===module.parentId);
    if(parent&&practiceModuleKind(parent)&&sameTopic(module,parent))continue;
    module.parentId=modules.find(item=>practiceModuleKind(item)==='general'&&sameTopic(module,item))!.id;
  }
  return {...catalog,modules};
}
export function managedGeneratorIds(module:ManagedPracticeModule,catalog:Pick<PracticeCatalog,'generators'>&Partial<Pick<PracticeCatalog,'modules'>>,selection:PracticeSelection={}) {
  const excludedChildren=catalog.modules?.filter(child=>child.parentId===module.id&&(!child.published||selection.childModuleIds&&!selection.childModuleIds.includes(child.id)))??[];
  const children=catalog.modules?.filter(child=>child.parentId===module.id&&child.published&&(!selection.childModuleIds||selection.childModuleIds.includes(child.id)))??[];
  const ids=new Set([...module.generatorIds,...children.flatMap(child=>child.generatorIds)]);
  const kind=practiceModuleKind(module);
  const available=(generator:PracticeGeneratorDefinition)=>!kind||sameTopic(module,generator);
  return catalog.generators.filter(generator=>generator.enabled&&available(generator)&&(!excludedChildren.some(child=>child.includeAll||child.generatorIds.includes(generator.id))||ids.has(generator.id)||children.some(child=>child.includeAll))&&(kind==='general'||module.includeAll||ids.has(generator.id)||children.some(child=>child.includeAll))&&(!selection.topics||selection.topics.includes(generatorTopicKey(generator)))).map(generator=>generator.id);
}
export function movePracticeModule(catalog:PracticeCatalog,moduleId:string,parentId:string|null):PracticeCatalog {
  const module=catalog.modules.find(item=>item.id===moduleId);
  if(!module||practiceModuleKind(module))throw new Error('Only individual modules can be moved between practice groups.');
  const parent=catalog.modules.find(item=>parentId?item.id===parentId:practiceModuleKind(item)==='general'&&sameTopic(module,item));
  if(!parent||!practiceModuleKind(parent)||!sameTopic(module,parent))throw new Error('Choose Foundation Building or General Practice in the same category and subcategory.');
  const inherited=new Set(managedGeneratorIds(module,catalog));
  return {...catalog,modules:catalog.modules.map(item=>item.id===moduleId?{...item,parentId:parent.id}:item.id===parent.id&&practiceModuleKind(parent)==='foundation'?{...item,includeAll:false,generatorIds:managedGeneratorIds(item,catalog).filter(id=>!inherited.has(id))}:item)};
}
export function removePracticeGenerator(catalog:PracticeCatalog,generatorId:string):PracticeCatalog {
  const next={...catalog,generators:catalog.generators.filter(item=>item.id!==generatorId),modules:catalog.modules.map(module=>({...module,generatorIds:module.generatorIds.filter(id=>id!==generatorId)}))};
  return {...next,modules:next.modules.map(module=>({...module,published:module.published&&(Boolean(practiceModuleKind(module))||managedGeneratorIds(module,next).length>0)}))};
}
export function removePracticeModule(catalog:PracticeCatalog,moduleId:string):PracticeCatalog {
  const module=catalog.modules.find(item=>item.id===moduleId);
  if(!module)throw new Error('This practice module no longer exists.');
  if(practiceModuleKind(module))throw new Error('Foundation Building and General Practice are required topic groups.');
  if(catalog.modules.some(item=>item.parentId===moduleId))throw new Error('Move contained modules before deleting this module.');
  return {...catalog,modules:catalog.modules.filter(item=>item.id!==moduleId)};
}
export function mergePracticeModules(catalog:PracticeCatalog,keepId:string,removeId:string):PracticeCatalog {
  const keep=catalog.modules.find(item=>item.id===keepId),remove=catalog.modules.find(item=>item.id===removeId);
  if(!keep||!remove||keepId===removeId||practiceModuleKind(keep)||practiceModuleKind(remove)||!sameTopic(keep,remove))throw new Error('Choose two individual modules in the same category and subcategory.');
  const next={...catalog,modules:catalog.modules.map(item=>item.id===keepId?{...item,includeAll:keep.includeAll||remove.includeAll,generatorIds:[...new Set([...keep.generatorIds,...remove.generatorIds])]}:item)};
  return removePracticeModule(next,removeId);
}
const fail=(message:string):never=>{throw Object.assign(new Error(message),{status:400});};
const record=(value:unknown):Record<string,unknown>=>value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:fail('Invalid resource configuration.');
const text=(value:unknown,label:string,max:number,required=true)=>typeof value==='string'&&value.length<=max&&(!required||value.trim())?value.trim():fail(`${label} must be ${required?'nonempty ':''}text up to ${max} characters.`);
const bool=(value:unknown)=>typeof value==='boolean'?value:fail('Choose a valid on/off setting.');
const id=(value:unknown)=>typeof value==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/.test(value)?value:fail('Invalid resource ID.');
const array=(value:unknown,max:number)=>Array.isArray(value)&&value.length<=max?value:fail(`A resource list cannot contain more than ${max} items.`);
export function youtubeVideoId(value:string):string|null {
  try {const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password||url.port)return null;
    const host=url.hostname.toLowerCase(),parts=url.pathname.split('/').filter(Boolean);
    const key=host==='youtu.be'?parts[0]:['youtube.com','www.youtube.com','m.youtube.com'].includes(host)?url.pathname==='/watch'?url.searchParams.get('v'):['shorts','embed','live'].includes(parts[0])?parts[1]:null:null;
    return key&&/^[a-zA-Z0-9_-]{11}$/.test(key)?key:null;
  }catch{return null;}
}

function videoDetails(row:Record<string,unknown>):Pick<PracticeVideo,'channelTitle'|'duration'|'viewCount'|'publishedAt'> {
  const details:Pick<PracticeVideo,'channelTitle'|'duration'|'viewCount'|'publishedAt'>={};
  if(row.channelTitle!==undefined&&row.channelTitle!=='')details.channelTitle=text(row.channelTitle,'Channel name',160);
  if(row.duration!==undefined&&row.duration!==''){
    const duration=text(row.duration,'Video duration',10);
    if(!/^(?:\d{1,3}:[0-5]\d|\d{1,3}):[0-5]\d$/.test(duration))fail('Use a video duration like 14:02 or 1:14:02.');
    details.duration=duration;
  }
  if(row.viewCount!==undefined){
    if(typeof row.viewCount!=='number'||!Number.isSafeInteger(row.viewCount)||row.viewCount<0)fail('Video views must be a nonnegative whole number.');
    details.viewCount=row.viewCount as number;
  }
  if(row.publishedAt!==undefined&&row.publishedAt!==''){
    const date=text(row.publishedAt,'Published date',10);
    const parsed=new Date(`${date}T00:00:00Z`);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==date)fail('Choose a valid video publication date.');
    details.publishedAt=date;
  }
  return details;
}
export function validateGenerator(value:unknown):PracticeGeneratorDefinition {
  const row=record(value);
  const list=(value:unknown,label:string,max:number,length:number)=>{
    const values=array(value,max).map(item=>text(item,label,length));
    if(new Set(values.map(item=>item.toLowerCase())).size!==values.length)fail(`${label} cannot contain duplicates.`);
    return values;
  };
  const organization:GeneratorOrganization={};
  if(row.skills!==undefined)organization.skills=list(row.skills,'Skills',20,120);
  if(row.prerequisites!==undefined)organization.prerequisites=list(row.prerequisites,'Prerequisites',20,120);
  if(row.sourceQuestionIds!==undefined)organization.sourceQuestionIds=list(row.sourceQuestionIds,'Source question IDs',50,100).map(id);
  if(row.programs!==undefined){organization.programs=list(row.programs,'Programs',4,10);if(!organization.programs.length||organization.programs.some(program=>!practicePrograms.includes(program as typeof practicePrograms[number])))fail('Choose at least one supported program.');}
  if(row.subject!==undefined)organization.subject=text(row.subject,'Subject',80);
  if(row.difficulty!==undefined){if(!practiceDifficulties.includes(row.difficulty as typeof practiceDifficulties[number]))fail('Choose a valid difficulty.');organization.difficulty=row.difficulty as GeneratorOrganization['difficulty'];}
  if(row.reviewStatus!==undefined){if(!practiceReviewStatuses.includes(row.reviewStatus as typeof practiceReviewStatuses[number]))fail('Choose a valid review status.');organization.reviewStatus=row.reviewStatus as GeneratorOrganization['reviewStatus'];}
  const base={...organization,...(row.skilled===undefined?{}:{skilled:row.skilled===skilledTbd?skilledTbd:id(row.skilled)}),id:id(row.id),title:text(row.title,'Generator title',120),description:text(row.description,'Generator description',600,false),enabled:bool(row.enabled),category:row.category===undefined?'Algebra':text(row.category,'Generator category',120),topic:row.topic===undefined?'Inequalities':text(row.topic,'Generator topic',120)};
  if(row.kind==='builtin') {
    if(!practiceGenerators.some(generator=>generator.id===row.builtinId))return fail('This built-in question generator is unavailable.');
    return {...base,kind:'builtin',builtinId:String(row.builtinId)};
  }
  if(row.kind==='template')return {...base,kind:'template',template:validateGeneratorTemplate(row.template)};
  if(row.kind!=='one-step'&&row.kind!=='two-step')return fail('Choose a supported question template.');
  const input=record(row.settings),settings={} as GeneratorSettings;
  for(const key of ['minCoefficient','maxCoefficient','minBoundary','maxBoundary','minOffset','maxOffset'] as const){const number=input[key];if(typeof number!=='number'||!Number.isSafeInteger(number)||Math.abs(number)>50)return fail('Generator ranges must use whole numbers between -50 and 50.');settings[key]=number;}
  settings.negativeCoefficients=bool(input.negativeCoefficients);settings.inclusive=bool(input.inclusive);
  if(settings.minCoefficient<1||settings.minCoefficient>settings.maxCoefficient||settings.minBoundary>settings.maxBoundary||settings.minOffset>settings.maxOffset)return fail('Check generator ranges. Coefficients must be positive magnitudes; minimums cannot exceed maximums.');
  if(row.kind==='two-step'&&settings.minOffset===0&&settings.maxOffset===0)return fail('Two-step questions need a nonzero offset.');
  return {...base,kind:row.kind,settings};
}
export function validatePracticeCatalog(value:unknown,topics?:PracticeTaxonomy):PracticeCatalog {
  const input=record(value),generators=array(input.generators,1000).map(validateGenerator),known=new Set(generators.map(generator=>generator.id));
  if(known.size!==generators.length)fail('Generator IDs must be unique.');
  const location=(row:Record<string,unknown>)=>{const category=text(row.category,'Category',120),topic=text(row.topic,'Topic',120);if(topics&&!topics.categories.some(item=>item.label===category&&item.topics.includes(topic)))fail('Choose an existing math category and topic.');return {category,topic};};
  const modules=array(input.modules,1000).map(value=>{const row=record(value),generatorIds=array(row.generatorIds,1000).map(id);if(new Set(generatorIds).size!==generatorIds.length||generatorIds.some(key=>!known.has(key)))fail('A module contains duplicate or unavailable generators.');
    const module:ManagedPracticeModule={id:id(row.id),title:text(row.title,'Module title',120),description:text(row.description,'Module description',600,false),...location(row),published:bool(row.published),includeAll:row.id==='all'?true:bool(row.includeAll),generatorIds,parentId:row.parentId===undefined||row.parentId===null?null:id(row.parentId),...(row.defaultType===undefined?{}:{defaultType:row.defaultType==='foundation'||row.defaultType==='general'?row.defaultType:fail('Choose a valid default module type.')})};
    if(row.selectionAliases!==undefined)module.selectionAliases=array(row.selectionAliases,20).map(id);
    if(row.titleMode!==undefined){if(row.titleMode!=='custom'&&row.titleMode!=='skill')fail('Choose a valid module naming mode.');module.titleMode=row.titleMode as ManagedPracticeModule['titleMode'];}
    if(row.skillId!==undefined)module.skillId=id(row.skillId);
    if(row.skilled!==undefined)module.skilled=row.skilled===skilledTbd?skilledTbd:id(row.skilled);
    return module;
  });
  for(const foundation of modules.filter(module=>practiceModuleKind(module)==='foundation')){
    const contained=modules.filter(module=>module.parentId===foundation.id);
    if(contained.length){foundation.includeAll=false;const inherited=new Set(contained.flatMap(module=>managedGeneratorIds(module,{generators,modules})));foundation.generatorIds=foundation.generatorIds.filter(id=>!inherited.has(id));}
  }
  const presets=new Set<string>();
  for(const module of modules){
    const kind=practiceModuleKind(module),parent=modules.find(item=>item.id===module.parentId);
    if(module.parentId&&(kind||!parent||!practiceModuleKind(parent)||!sameTopic(module,parent)))fail('Individual modules can only be contained in Foundation Building or General Practice in the same topic.');
    if(kind){const key=JSON.stringify([module.category,module.topic,kind]);if(presets.has(key))fail('Each topic can have only one Foundation Building and one General Practice module.');presets.add(key);}
    if(kind&&module.skilled&&module.skilled!==skilledTbd)fail('Assign Skilled to a focused module. Foundation Building and General Practice are required topic groups.');
    if(module.published&&!kind&&!managedGeneratorIds(module,{generators,modules}).length)fail('“'+module.title+'” needs at least one enabled generator before publishing.');
  }
  if(topics&&generators.some(generator=>!topics.categories.some(category=>category.label===generator.category&&category.topics.includes(generator.topic!))))fail('Choose an existing category and topic for each generator.');
  const videos=array(input.videos,500).map(value=>{const row=record(value),raw=text(row.url,'YouTube link',600,false),key=youtubeVideoId(raw),published=bool(row.published);if((raw||published)&&!key)fail('Use a valid HTTPS YouTube video link (watch, shorts, or youtu.be).');return {id:id(row.id),title:text(row.title,'Video title',160),description:text(row.description,'Video description',1000,false),...location(row),published,url:key?`https://www.youtube.com/watch?v=${key}`:'',...videoDetails(row)};});
  for(const [label,items]of [['Module',modules],['Video',videos]] as const)if(new Set(items.map(item=>item.id)).size!==items.length)fail(`${label} IDs must be unique.`);
  if(topics?.classificationSkills){
    for(const generator of generators)if(generator.skilled!==undefined)validateSkilled(generator.skilled,generator.category??'Algebra',generator.topic??'Inequalities',topics.classificationSkills);
    for(const module of modules)if(module.skilled!==undefined){
      module.skilled=resolveSkilled(module.skilled,module.category,module.topic,topics.classificationSkills);
      const skill=topics.classificationSkills.find(skill=>skill.id===module.skilled);
      if(module.titleMode==='skill'&&skill&&!practiceModuleKind(module))module.title=skill.label;
    }
  }
  return ensureTopicPracticeModules({modules,generators,videos},topics);
}
export function studentPracticeCatalog(catalog:PracticeCatalog):PracticeCatalog {
  return {...catalog,modules:catalog.modules.filter(module=>module.published),generators:catalog.generators.filter(generator=>generator.enabled),videos:catalog.videos.filter(video=>video.published)};
}
export function generateCatalogQuestion(generator:PracticeGeneratorDefinition,index:number,seed:string):ExamQuestion {
  if(generator.kind==='template')return {...generateTemplateQuestion(generator.template!,index,seed,generator.id,generator.category??'Algebra',generator.topic??'Inequalities'),skilled:generator.skilled??skilledTbd};
  if(generator.kind==='builtin'){
    const question=generatePracticeQuestion([generator.builtinId!],index,seed);
    return {...question,topic:generator.category??question.topic,subtopic:generator.topic??question.subtopic,skilled:generator.skilled??skilledTbd};
  }
  if(!Number.isSafeInteger(index)||index<0)throw new Error('Invalid practice sequence.');
  const config=generator.settings!;let state=2166136261;for(const ch of `${generator.id}:${seed}:${index}`)state=Math.imul(state^ch.charCodeAt(0),16777619)>>>0;
  const next=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return state>>>0;};
  const between=(min:number,max:number)=>min+next()%(max-min+1);
  const coefficient=between(config.minCoefficient,config.maxCoefficient)*(config.negativeCoefficients&&next()%2?-1:1),boundary=between(config.minBoundary,config.maxBoundary);
  let offset=generator.kind==='two-step'?between(config.minOffset,config.maxOffset):0;
  if(generator.kind==='two-step'&&offset===0)offset=config.maxOffset!==0?config.maxOffset:config.minOffset;
  const sign=next()%2?'>':'<',relation=config.inclusive?`${sign}=`:sign,reverse=sign==='>'?'<':'>',solution=coefficient<0?(config.inclusive?`${reverse}=`:reverse):relation;
  const opposite=solution.startsWith('>')?solution.replace('>','<'):solution.replace('<','>'),constant=coefficient*boundary+offset;
  const options=[`x${solution}${boundary}`,`x${opposite}${boundary}`,`x${solution}${boundary+1}`,`x${solution}${boundary-1}`],rotation=next()%4,choices=options.slice(rotation).concat(options.slice(0,rotation));
  const latex=(value:string)=>value.replace('>=','\\geq ').replace('<=','\\leq ');
  const term=coefficient===1?'x':coefficient===-1?'-x':`${coefficient}x`;
  return {id:`${generator.id}:${seed}:${index}`,skilled:generator.skilled??skilledTbd,type:'multiple_choice',points:1,topic:'Algebra',subtopic:'Inequalities',prompt:`\\[${term}${offset?offset>0?`+${offset}`:`${offset}`:''}${latex(relation)}${constant}\\]\n\nFor what values of \\(x\\) is the inequality true?`,choices:choices.map((math,at)=>({id:'ABCD'[at],math:latex(math),text:math})),correctChoiceId:'ABCD'[choices.indexOf(options[0])],explanation:`${offset?`Subtract ${offset} from both sides.\n\n`:''}Divide both sides by ${coefficient}. ${coefficient<0?'Dividing by a negative number reverses the inequality sign.':'Dividing by a positive number keeps the inequality sign.'}\n\nTherefore, \\(x${latex(solution)}${boundary}\\).`};
}
