import { managedGeneratorIds, validateGenerator, type ManagedPracticeModule, type PracticeCatalog, type PracticeGeneratorDefinition } from '../../../../server/src/shared/practiceCatalog';

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

/** Preview the draft's effective mix, including automatic and contained generators. */
export function modulePreviewCatalog(module:ManagedPracticeModule,catalog:PracticeCatalog):PracticeCatalog {
  const ids=new Set(managedGeneratorIds(module,catalog));
  if(!ids.size)throw new Error('Include at least one enabled generator to preview this module.');
  const generators=catalog.generators.filter(generator=>ids.has(generator.id)).map(generator=>validateGenerator(structuredClone(generator)));
  return {modules:[{id:'generator-preview',title:module.title,description:module.description,category:module.category,topic:module.topic,published:true,includeAll:false,generatorIds:generators.map(generator=>generator.id)}],generators,videos:[]};
}
