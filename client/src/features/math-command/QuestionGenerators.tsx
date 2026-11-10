import { useEffect, useState } from 'react';
import type { PracticeCatalog } from '../../../../server/src/shared/practiceCatalog';
import { generatorAvailable } from '../../../../server/src/shared/practiceCatalog';
import type { MathCommandRequest } from './client';

export function QuestionGenerators({ questionId, request, onOpen, onCreate }: { questionId: string; request: MathCommandRequest; onOpen: (id: string) => void; onCreate?: () => void }) {
  const [result, setResult] = useState<{questionId: string; retry: number; request: MathCommandRequest; catalog?: PracticeCatalog; error?: string}>();
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    request<{catalog: PracticeCatalog}>('/catalog?manage=1').then(data => { if (active) setResult({questionId, retry, request, catalog:data.catalog}); }).catch(reason => { if (active) setResult({questionId, retry, request, error:reason instanceof Error ? reason.message : 'Could not load linked generators.'}); });
    return () => { active = false; };
  }, [questionId, request, retry]);
  const current = result?.questionId === questionId && result.retry === retry && result.request === request ? result : undefined;
  const catalog = current?.catalog, error = current?.error;
  const generators = catalog?.generators.filter(generator => generator.sourceQuestionIds?.includes(questionId)) ?? [];
  return <section className="mc-question-generators" aria-label="Generators for this question"><h3>Generators for this question</h3>
    <p>The source question is the home for its generators. Its publisher supplies the source filters.</p>
    {error ? <p role="alert">{error} <button type="button" onClick={() => setRetry(value => value + 1)}>Retry</button></p> : !catalog ? <p role="status">Loading linked generators…</p> : generators.length ? <ul>{generators.map(generator => <li key={generator.id}><div><strong>{generator.title}</strong><small>{generatorAvailable(generator) ? 'Enabled' : 'Not available to students'} · {generator.reviewStatus ?? 'unreviewed'}<br />{generator.category} / {generator.topic}</small></div><button type="button" onClick={() => onOpen(generator.id)}>Manage & preview</button></li>)}</ul> : <p>No generator linked yet. Create one using this question’s category and topic.</p>}
    {onCreate && <button type="button" onClick={onCreate}>Create generator for this question</button>}
  </section>;
}
