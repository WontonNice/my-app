import { combinatoricsPractice } from './combinatoricsPractice';
import { generatorReviewSignature, type PracticeCatalog, type PracticeGeneratorDefinition } from './practiceCatalog';

// Recommended practice that ships with the code. The stored catalog only accepts
// built-in generators the running server knows, so these are added at read time
// instead of being written to the database ahead of a deploy. Once a teacher saves
// the studio, the stored copies (including any edits, such as disabling one) win.
export const combinatoricsRecommendedCategoryId = 'recommended-combinatorics';
export const combinatoricsRecommendedModuleId = 'recommended-combinatorics-infinite';
/** Permutation/combination generators that already existed before this module; reused, not duplicated. */
export const existingCombinatoricsGeneratorIds = [
  'counting-distinct-paint-arrangements-v1', // Paint Arrangements Without Repeats (permutations)
  'counting-unordered-cookie-pairs-v1', // Choosing Unordered Pairs (combinations)
  'probability-unordered-sample-spaces-v1', // Unordered Sample Spaces (listing combinations)
];

export function combinatoricsGeneratorDefinitions(): PracticeGeneratorDefinition[] {
  return combinatoricsPractice.map(template => {
    const definition: PracticeGeneratorDefinition = { id:template.id, title:template.title, description:template.description, enabled:true, kind:'builtin', builtinId:template.id,
      category:template.category, topic:template.topic, skilled:template.skilled, difficulty:template.difficulty, sourceQuestionIds:template.sourceQuestionIds, programs:['SHSAT'] };
    return { ...definition, reviewRequired:true, reviewStatus:'approved', reviewedSignature:generatorReviewSignature(definition) };
  });
}

export function withRecommendedPractice(catalog: PracticeCatalog): PracticeCatalog {
  const known = new Set(catalog.generators.map(generator => generator.id));
  const generators = [...catalog.generators, ...combinatoricsGeneratorDefinitions().filter(generator => !known.has(generator.id))];
  const present = catalog.recommended?.some(category => category.id === combinatoricsRecommendedCategoryId || category.modules.some(module => module.id === combinatoricsRecommendedModuleId));
  const moduleIds = new Set(catalog.modules.map(module => module.id));
  if (present || moduleIds.has(combinatoricsRecommendedCategoryId) || moduleIds.has(combinatoricsRecommendedModuleId)) return { ...catalog, generators };
  const recommended = [...(catalog.recommended ?? []), { id:combinatoricsRecommendedCategoryId, title:'Combinatorics', modules:[{
    id:combinatoricsRecommendedModuleId, title:'Permutations & Combinations · Infinite', published:true,
    // Only reference existing generators the catalog still has; unknown IDs would fail catalog validation.
    generatorIds:[...existingCombinatoricsGeneratorIds.filter(id => known.has(id)), ...combinatoricsPractice.map(template => template.id)],
  }] }];
  return { ...catalog, generators, recommended };
}
