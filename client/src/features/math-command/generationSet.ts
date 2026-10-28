import { managedGeneratorIds, practiceModuleKind, type ManagedPracticeModule, type PracticeCatalog } from '../../../../server/src/shared/practiceCatalog';
import { studioLocation, studioMatches } from './studioOrganization';

export type GenerationSetFilters={included:'all'|'included';category:string;topic:string;search:string};
export function generationSetEntries(module:ManagedPracticeModule,catalog:PracticeCatalog,filters:GenerationSetFilters) {
  const kind=practiceModuleKind(module),active=new Set(managedGeneratorIds(module,catalog));
  return catalog.generators.filter(generator=>!kind||studioLocation(generator).category===module.category&&studioLocation(generator).topic===module.topic).map(generator=>{
    const automatic=kind==='general'||module.includeAll;
    const contained=kind==='foundation'&&catalog.modules.some(child=>child.parentId===module.id&&(child.generatorIds.includes(generator.id)||child.includeAll));
    const included=automatic?active.has(generator.id):module.generatorIds.includes(generator.id)||active.has(generator.id);
    return {generator,included,locked:Boolean(automatic||contained||!generator.enabled),contained:Boolean(contained)};
  }).filter(entry=>(filters.included==='all'||entry.included)&&studioMatches(entry.generator,filters.search,filters.category,filters.topic))
    .sort((a,b)=>Number(b.included)-Number(a.included)||Number(studioLocation(b.generator).category===module.category&&studioLocation(b.generator).topic===module.topic)-Number(studioLocation(a.generator).category===module.category&&studioLocation(a.generator).topic===module.topic));
}
