import type { PlannerEntry } from '../../../../server/src/shared/generatorPlanner';
import { managedGeneratorIds, practiceModuleKind, type PracticeCatalog } from '../../../../server/src/shared/practiceCatalog';

export function relatedGenerators(entry: PlannerEntry, catalog: PracticeCatalog) {
  return catalog.generators.filter(generator => generator.sourceQuestionIds?.includes(entry.source.id) ||
    generator.category === entry.source.category && generator.topic === entry.source.subcategory)
    .map(generator => ({ generator, exact: !!generator.sourceQuestionIds?.includes(entry.source.id),
      modules: catalog.modules.filter(module => managedGeneratorIds(module, catalog).includes(generator.id))
        .sort((a, b) => Number(!!practiceModuleKind(a)) - Number(!!practiceModuleKind(b)) || a.title.localeCompare(b.title)) }))
    .sort((a, b) => Number(b.exact) - Number(a.exact) || a.generator.title.localeCompare(b.generator.title));
}
