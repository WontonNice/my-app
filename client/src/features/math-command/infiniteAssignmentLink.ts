export type InfiniteAssignmentIntent = { studentId?: string; category?: string; topic?: string; moduleId?: string; generatorId?: string; questionId?: string };

/** Navigation only: the teacher reviews the existing homework form before saving. */
export function infiniteAssignmentHref(intent: InfiniteAssignmentIntent) {
  const query = new URLSearchParams({ workspace: 'content', practice: 'infinite' });
  for (const [key, value] of Object.entries(intent)) if (value) query.set(key === 'studentId' ? 'student' : key, value);
  return `/teacher/students?${query}`;
}

export function readInfiniteAssignmentIntent(search: string): InfiniteAssignmentIntent | undefined {
  const query = new URLSearchParams(search);
  if (query.get('practice') !== 'infinite') return undefined;
  return { studentId: query.get('student') || undefined, category: query.get('category') || undefined,
    topic: query.get('topic') || undefined, moduleId: query.get('moduleId') || undefined,
    generatorId: query.get('generatorId') || undefined, questionId: query.get('questionId') || undefined };
}
