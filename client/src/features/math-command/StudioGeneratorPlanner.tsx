import { useEffect, useState } from 'react';
import type { MathCommandRequest } from './client';
import { accountPlannerDestination } from './generatorPlannerClient';

/** The local editor has no login. Personal batches belong to the teacher app. */
export function StudioGeneratorPlanner({ request }: { request: MathCommandRequest }) {
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    void accountPlannerDestination(request).then(({ url }) => {
      if (active) (window.top || window).location.assign(url);
    }).catch(reason => { if (active) setError(reason.message); });
    return () => { active = false; };
  }, [request, attempt]);
  return <section className="gp-workspace" aria-label="My generator planner">
    <h1>My generator planner</h1>
    <p>Opening your account planner, shared with Student Progress…</p>
    {error && <p role="alert">{error} <button type="button" onClick={() => { setError(''); setAttempt(value => value + 1); }}>Try again</button></p>}
  </section>;
}
