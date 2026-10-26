import { validateGenerator, type PracticeCatalog, type PracticeGeneratorDefinition } from '../../../../server/src/shared/practiceCatalog';

/** Snapshot the current draft so previews never publish edits or enable a saved generator. */
export function generatorPreviewCatalog(generator: PracticeGeneratorDefinition): PracticeCatalog {
  const definition = validateGenerator(structuredClone(generator));
  return {
    modules: [{ id: 'generator-preview', title: definition.title, description: definition.description,
      category: definition.category ?? 'Algebra', topic: definition.topic ?? 'Inequalities',
      published: true, includeAll: false, generatorIds: [definition.id] }],
    generators: [{ ...definition, enabled: true }], videos: [],
  };
}
