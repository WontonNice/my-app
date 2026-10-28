/** Teacher-managed third classification level; independent of diagnostic skills and tags. */
export type MathClassificationSkill={id:string;label:string;category:string;subcategory:string};
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
export function skilledLabel(value:unknown,skills:MathClassificationSkill[]=[]) {
  return skills.find(skill=>skill.id===value)?.label??skilledTbd;
}
export function validateSkilled(value:unknown,category:string,subcategory:string|undefined,skills:MathClassificationSkill[]=[]) {
  if(value===undefined||value===''||value===skilledTbd)return skilledTbd;
  if(typeof value!=='string'||resolveSkilled(value,category,subcategory,skills)===skilledTbd)return fail('Choose a Skilled definition in this question’s main category and specific topic, or choose TBD.');
  return value;
}
