import { supabase } from './supabase';
import { defaultPracticeCatalog, managedGeneratorIds, reconcilePracticeSkilled, studentPracticeCatalog, type PracticeCatalog } from '../shared/practiceCatalog';
import { mathCommandRoot, readMathCommandTaxonomy } from './mathCommandCatalogStore';
import { withMathCommandPersistence } from './mathCommandPersistence';
import type { PlanContent } from '../shared/learningPlan';

export async function publishedPracticeCatalog(): Promise<PracticeCatalog> {
  const result = await supabase.from('infinite_practice_catalog').select('catalog').eq('id', 'main').maybeSingle();
  if (result.error) throw Object.assign(new Error('Practice modules could not be loaded. Please retry.'), { status: 503 });
  return withMathCommandPersistence(mathCommandRoot,()=>studentPracticeCatalog(reconcilePracticeSkilled(result.data?.catalog??defaultPracticeCatalog(),readMathCommandTaxonomy().classificationSkills??[])));
}
export async function infiniteHomeworkCatalog(): Promise<PlanContent[]> {
  const catalog = await publishedPracticeCatalog();
  return catalog.modules.filter(module => managedGeneratorIds(module, catalog).length).map(module => ({
    id: `infinite-practice:${module.id}`, kind: 'practice', practiceMode: 'infinite', title: module.title,
    href: '/study-hall/shsat/infinite-practice', subject: 'Math', category: module.category,
    skills: [module.topic], questionCount: 0, aliases: [], classId: 'shsat', contentSource: 'Infinite modules',
  }));
}
