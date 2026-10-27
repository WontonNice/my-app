import type { ManagedPracticeModule, PracticeGeneratorDefinition, PracticeVideo } from '../../../../server/src/shared/practiceCatalog';

export type StudioResource = ManagedPracticeModule | PracticeGeneratorDefinition | PracticeVideo;
export const studioLocation = (item: StudioResource) => ({ category: item.category ?? 'Algebra', topic: item.topic ?? 'Inequalities' });
export function studioMatches(item: StudioResource, query: string, category = '', topic = '') {
  const location = studioLocation(item);
  return (!category || category === location.category) && (!topic || topic === location.topic)
    && `${item.id} ${item.title} ${item.description} ${location.category} ${location.topic}`.toLowerCase().includes(query.trim().toLowerCase());
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
