import { commitMathCommandState, readMathCommandCatalog, readMathCommandState, readMathCommandTaxonomy } from './mathCommandCatalogStore';

const fail = (message: string, status = 400) => Object.assign(new Error(message), { status });
const name = (value: unknown) => { if (typeof value !== 'string' || !value.trim() || value.trim().length > 80) throw fail('Use a name of 1–80 characters.'); return value.trim(); };
/** Explicit classification edits update only classifications, never question content. */
export function saveMathTaxonomy(root: string, input: Record<string, unknown>) {
  const state = readMathCommandState(root), taxonomy = readMathCommandTaxonomy(root);
  if (input.revision !== state.revision) throw fail('Categories changed. Reload and retry.', 409);
  const label = name(input.name), categoryName = name(input.category);
  let category = taxonomy.categories.find(item => item.label === categoryName);
  if (input.action === 'add-category') {
    if (taxonomy.categories.some(item => item.label.toLowerCase() === categoryName.toLowerCase())) throw fail('This category already exists.');
    taxonomy.categories.push({ label: categoryName, topics: [label] });
  } else {
    if (!category) throw fail('Choose an existing category.');
    if (category.topics.some(item => item.toLowerCase() === label.toLowerCase() && item !== input.original)) throw fail('This subcategory already exists.');
    if (input.action === 'add-subcategory') category.topics.push(label);
    else if (input.action === 'rename-subcategory') {
      const original = name(input.original);
      if (!category.topics.includes(original)) throw fail('This subcategory no longer exists.', 409);
      category.topics = category.topics.map(item => item === original ? label : item);
      if(original!==label)state.taxonomyTopicRenames=[...(state.taxonomyTopicRenames??[]),{category:categoryName,from:original,to:label}];
      for (const record of readMathCommandCatalog(root)) if (record.question.topic === categoryName && record.question.subtopic === original) state.metadata[record.id] = { ...state.metadata[record.id], subcategory: label };
      state.skills = state.skills.map(skill => skill.category === categoryName && skill.subcategory === original ? { ...skill, subcategory: label } : skill);
      state.targets.overrides = state.targets.overrides?.map(target => target.category === categoryName && target.subcategory === original ? { ...target, subcategory: label } : target);
    } else throw fail('Choose a supported category action.');
  }
  state.taxonomy = { categories: taxonomy.categories };
  const saved = commitMathCommandState(root, state.revision, state);
  return { revision: saved.revision, taxonomy: readMathCommandTaxonomy(root) };
}
