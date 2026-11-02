/** Carry a source selection to the authenticated planner; never an owner or token. */
export function generatorPlannerQuery(questionIds: string[] = []) {
  const ids = [...new Set(questionIds)];
  if (ids.length > 100) throw new Error('Select at most 100 questions for one batch.');
  const query = new URLSearchParams({ tab: 'planner' });
  for (const id of ids) query.append('plannerQuestionId', id);
  const encoded = query.toString();
  if (encoded.length > 20000) throw new Error('This selection is too large to open at once. Select fewer questions.');
  return encoded;
}

export function plannerQuestionIds(search: string) {
  return [...new Set(new URLSearchParams(search).getAll('plannerQuestionId'))]
    .filter(id => id.length > 0 && id.length <= 500).slice(0, 100);
}
