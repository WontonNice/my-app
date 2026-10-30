import { managedGeneratorIds, practiceModuleKind, type PracticeCatalog, type ManagedPracticeModule, type PracticeGeneratorDefinition, type PracticeVideo } from '../../../../server/src/shared/practiceCatalog';

export type StudioResource = ManagedPracticeModule | PracticeGeneratorDefinition | PracticeVideo;
export const studioLocation = (item: StudioResource) => ({ category: item.category ?? 'Algebra', topic: item.topic ?? 'Inequalities' });
export function studioMatches(item: StudioResource, query: string, category = '', topic = '') {
  const location = studioLocation(item);
  return (!category || category === location.category) && (!topic || topic === location.topic)
    && `${item.id} ${item.title} ${item.description} ${location.category} ${location.topic} ${'kind' in item ? [...(item.skills??[]),...(item.prerequisites??[]),...(item.sourceQuestionIds??[]),...(item.programs??['SHSAT']),item.subject??'Math'].join(' ') : ''}`.toLowerCase().includes(query.trim().toLowerCase());
}

export function generatorModuleUsage(generator: PracticeGeneratorDefinition, catalog: PracticeCatalog) {
  return catalog.modules.flatMap(module => {
    const kind=practiceModuleKind(module),sameTopic=studioLocation(module).category===studioLocation(generator).category&&studioLocation(module).topic===studioLocation(generator).topic;
    const direct=module.generatorIds.includes(generator.id);
    const automatic=(kind==='general'||module.includeAll)&&(!kind||sameTopic);
    const inherited=catalog.modules.some(child=>child.parentId===module.id&&child.published&&(child.generatorIds.includes(generator.id)||child.includeAll));
    if(!direct&&!automatic&&!inherited)return [];
    return [{module,reason:direct?'Selected directly':automatic?'Included automatically':'Included through a contained module',active:module.published&&managedGeneratorIds(module,catalog).includes(generator.id),focused:!kind||kind==='foundation'&&direct}];
  });
}

export type GeneratorFilters={status:string;difficulty:string;program:string;subject:string;moduleId?:string};
export function filterStudioGenerators(catalog:PracticeCatalog,query:string,category:string,topic:string,filters:GeneratorFilters) {
  const skillModule=filters.moduleId?catalog.modules.find(module=>module.id===filters.moduleId&&!practiceModuleKind(module)):undefined;
  const skillGeneratorIds=new Set(skillModule?.generatorIds??[]);
  const focusedIds=new Set<string>();
  if(filters.status==='unused')for(const module of catalog.modules){
    const kind=practiceModuleKind(module);
    if(!kind||kind==='foundation')for(const id of module.generatorIds)focusedIds.add(id);
    if(!kind&&module.includeAll)for(const generator of catalog.generators)focusedIds.add(generator.id);
  }
  return catalog.generators.filter(generator=>studioMatches(generator,query,category,topic)
    && (!filters.moduleId||skillModule&&(skillModule.includeAll||skillGeneratorIds.has(generator.id)))
    && (!filters.difficulty||(generator.difficulty??'unassigned')===filters.difficulty)
    && (!filters.program||(generator.programs??['SHSAT']).includes(filters.program))
    && (!filters.subject||(generator.subject??'Math')===filters.subject)
    && (!filters.status||filters.status==='enabled'&&generator.enabled||filters.status==='disabled'&&!generator.enabled
      || filters.status==='unreviewed'&&(generator.reviewStatus??'unreviewed')==='unreviewed'
      || filters.status==='in-review'&&generator.reviewStatus==='in-review'||filters.status==='approved'&&generator.reviewStatus==='approved'
      || filters.status==='unused'&&!focusedIds.has(generator.id)));
}

export function updateStudioGenerators(catalog:PracticeCatalog,ids:string[],patch:Partial<PracticeGeneratorDefinition>):PracticeCatalog {
  const chosen=new Set(ids);
  const next={...catalog,generators:catalog.generators.map(generator=>chosen.has(generator.id)?{...generator,...patch,...(patch.category!==undefined&&patch.category!==generator.category||patch.topic!==undefined&&patch.topic!==generator.topic?{skilled:'TBD'}:{}),id:generator.id}:generator)};
  return patch.enabled===false?{...next,modules:next.modules.map(module=>({...module,published:module.published&&(Boolean(practiceModuleKind(module))||managedGeneratorIds(module,next).length>0)}))}:next;
}
export function studioResourceGroups(items: StudioResource[], query: string, category = '', topic = '') {
  const groups = new Map<string, {category:string; topics:{topic:string;resources:StudioResource[];count:number}[];count:number}>();
  for (const item of items) {
    if (!studioMatches(item, '', category, topic)) continue;
    const location = studioLocation(item);
    let group = groups.get(location.category);
    if (!group) { group = { category:location.category, topics:[], count:0 }; groups.set(location.category, group); }
    let child = group.topics.find(child => child.topic === location.topic);
    if (!child) { child = {topic:location.topic,resources:[],count:0}; group.topics.push(child); }
    child.resources.push(item);
    if (studioMatches(item, query)) { child.count++; group.count++; }
  }
  return [...groups.values()].filter(group => group.count).map(group => ({...group,topics:group.topics.filter(child => child.count)}));
}
