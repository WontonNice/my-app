import { useEffect, useState } from 'react';
import type { MathEvidencePage, MathStudentInsights } from '../../../../server/src/shared/mathCommandAnalytics';
import { mathCommandRequest, mathDate } from './client';
import { AppLink } from '../../components/AppLink';
import { ExamAnswer, ExamText } from '../../components/ExamReviewQuestion';
import type { InfiniteAssignmentIntent } from './infiniteAssignmentLink';

export function PracticeAssignmentContext({ accessToken, studentId, intent }: { accessToken: string; studentId: string; intent: InfiniteAssignmentIntent }) {
  const [data, setData] = useState<MathStudentInsights>();
  const [rows, setRows] = useState<MathEvidencePage>();
  const [error, setError] = useState('');
  const key = JSON.stringify(intent);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Clear previous student evidence while loading the new external request.
    let active = true; setData(undefined); setRows(undefined); setError('');
    const request = mathCommandRequest(accessToken), scope: InfiniteAssignmentIntent = JSON.parse(key);
    const params = new URLSearchParams({ status: scope.questionId ? 'all' : 'incorrect', page: '0', ...(scope.questionId ? { questionId: scope.questionId } : {}), ...(!scope.questionId && scope.category ? { category: scope.category } : {}), ...(!scope.questionId && scope.topic ? { subcategory: scope.topic } : {}) });
    Promise.all([request<MathStudentInsights>(`/students/${studentId}/insights`), request<MathEvidencePage>(`/students/${studentId}/evidence?${params}`)])
      .then(([insights, evidence]) => { if (active) { setData(insights); setRows(evidence); } })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : 'Evidence unavailable.'); });
    return () => { active = false; };
  }, [accessToken, studentId, key]);
  const skill = data?.skills.find(item => intent.topic ? item.level === 'subcategory' && item.subcategory === intent.topic && (!intent.category || item.category === intent.category) : item.level === 'category' && item.category === intent.category);
  return <section className="lp-evidence-context" aria-label="Teacher-only assignment evidence"><strong>Why this practice · Teacher-only evidence</strong>
    <p>{skill ? `${skill.label}: ${skill.reason}` : data ? 'Review the source errors before choosing a module.' : error || 'Loading saved evidence…'}</p>
    {intent.questionId && <p>Selected source: {intent.questionId}</p>}
    <details><summary>{intent.questionId ? "Review selected source response" : "Review incorrect responses"} ({rows?.total ?? "…"})</summary><ul>{rows?.items.slice(0, 5).map(row => <li key={row.id}><ExamText text={row.prompt}/><small>{row.assessmentTitle} · {mathDate(row.at)}</small><span>Submitted: <ExamAnswer question={row.question} answer={row.answer ?? undefined}/></span></li>)}</ul>
    {rows && rows.total > 5 && <small>Showing 5 of {rows.total} incorrect responses.</small>}
    </details><AppLink href={`/teacher/math-command?tab=students&studentId=${encodeURIComponent(studentId)}`}>Review all question evidence</AppLink>
  </section>;
}
