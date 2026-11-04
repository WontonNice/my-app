/** Teacher-managed third classification level; independent of diagnostic skills and tags. */
export type MathClassificationSkill={id:string;label:string;category:string;subcategory:string;moduleIds?:string[];moduleOwned?:boolean};
export const skilledTbd='TBD';
type Taxonomy={categories:{label:string;topics:string[]}[];classificationSkills?:MathClassificationSkill[]};
const fail=(message:string):never=>{throw Object.assign(new Error(message),{status:400});};
export function validateClassificationSkills(value:unknown,taxonomy:Taxonomy):MathClassificationSkill[] {
  if(!Array.isArray(value)||value.length>1000)return fail('Keep at most 1,000 Skilled definitions.');
  const ids=new Set<string>(),labels=new Set<string>();
  return value.map(item=>{
    if(!item||typeof item!=='object'||Array.isArray(item))return fail('Each Skilled definition needs a name and subcategory.');
    const skill={} as MathClassificationSkill;
    for(const key of ['id','label','category','subcategory'] as const){if(typeof item[key]!=='string'||!item[key].trim()||item[key].length>(key==='id'?100:120))return fail('Skilled names must contain 1–120 characters.');skill[key]=item[key].trim();}
    if(item.moduleIds!==undefined){if(!Array.isArray(item.moduleIds)||item.moduleIds.length>1000||item.moduleIds.some((id:unknown)=>typeof id!=='string'||!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/.test(id)))return fail('Invalid module references for this skill.');skill.moduleIds=[...new Set<string>(item.moduleIds)];}
    if(item.moduleOwned===true)skill.moduleOwned=true;
    if(!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/.test(skill.id)||skill.id===skilledTbd||ids.has(skill.id))return fail('Skilled definitions need unique, stable IDs.');
    if(skill.label.toLowerCase()===skilledTbd.toLowerCase())return fail('TBD is reserved for questions without a Skilled classification.');
    if(!taxonomy.categories.some(category=>category.label===skill.category&&category.topics.includes(skill.subcategory)))return fail('Choose an existing main category and specific topic for every Skilled definition.');
    const key=JSON.stringify([skill.category,skill.subcategory,skill.label.toLowerCase()]);
    if(labels.has(key))return fail('Skilled names must be unique within each subcategory.');
    ids.add(skill.id);labels.add(key);return skill;
  });
}
export function resolveSkilled(value:unknown,category:string,subcategory:string|undefined,skills:MathClassificationSkill[]=[]) {
  return skills.find(skill=>skill.id===value&&skill.category===category&&skill.subcategory===subcategory)?.id??skilledTbd;
}

export type SkillModule={id:string;title:string;category:string;topic:string;skilled?:string;defaultType?:'foundation'|'general'};
/** One organization vocabulary. Publication and generator counts never hide a skill. */
export function universalClassificationSkills(definitions:MathClassificationSkill[],modules:SkillModule[]):MathClassificationSkill[] {
  const focused=modules.filter(m=>!m.defaultType&&m.id!=='foundation'&&m.id!=='all').sort((a,b)=>a.id.localeCompare(b.id));
  const byId=new Map(focused.map(m=>[m.id,m]));
  const result=definitions.map(s=>({...s,...(s.moduleIds?{moduleIds:s.moduleIds.filter(id=>{
    const m=byId.get(id);if(!m||m.category!==s.category||m.topic!==s.subcategory)return false;
    const selected=definitions.find(candidate=>candidate.id===m.skilled&&candidate.category===m.category&&candidate.subcategory===m.topic);
    return !selected||selected.id===s.id;
  })}:{})})).filter(s=>!s.moduleOwned||s.moduleIds?.length||focused.some(m=>
    m.category===s.category&&m.topic===s.subcategory&&m.title.trim().toLowerCase()===s.label.trim().toLowerCase()
    &&!definitions.some(selected=>selected.id===m.skilled&&selected.id!==s.id&&selected.category===m.category&&selected.subcategory===m.topic)));

  const same=(s:MathClassificationSkill,m:SkillModule)=>s.category===m.category&&s.subcategory===m.topic;
  for(const module of focused){
    let skill=result.find(s=>same(s,module)&&s.moduleIds?.includes(module.id))
      ??result.find(s=>same(s,module)&&s.id===module.skilled)
      ??result.find(s=>same(s,module)&&s.label.trim().toLowerCase()===module.title.trim().toLowerCase());
    if(!skill){
      let hash=2166136261;for(const char of module.id)hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;
      const id=`module-${module.id.slice(0,80)}-${hash.toString(36)}`;
      skill={id,label:module.title.trim(),category:module.category,subcategory:module.topic,moduleIds:[],moduleOwned:true};result.push(skill);
    }
    skill.moduleIds=[...new Set([...(skill.moduleIds??[]),module.id])];
  }
  return result;
}
export function skilledLabel(value:unknown,skills:MathClassificationSkill[]=[]) {
  return skills.find(skill=>skill.id===value)?.label??skilledTbd;
}
export function validateSkilled(value:unknown,category:string,subcategory:string|undefined,skills:MathClassificationSkill[]=[]) {
  if(value===undefined||value===''||value===skilledTbd)return skilledTbd;
  if(typeof value!=='string'||resolveSkilled(value,category,subcategory,skills)===skilledTbd)return fail('Choose a Skilled definition in this question’s main category and specific topic, or choose TBD.');
  return value;
}
