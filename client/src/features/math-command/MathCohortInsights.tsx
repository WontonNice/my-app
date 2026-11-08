import { useEffect, useState } from 'react';
import type { MathAttemptEvidence, MathStudentInsights } from '../../../../server/src/shared/mathCommandAnalytics';
import { mathQuestionMetrics } from '../../../../server/src/shared/mathCommandAnalytics';
import type { MathCatalogFilters } from '../../../../server/src/shared/mathCommandTypes';
import { ExamAnswer, ExamText } from '../../components/ExamReviewQuestion';
import { AddToGeneratorPlanner } from './AddToGeneratorPlanner';
import { cohortQuestions, cohortTopics, readCohortEvidence } from './mathCohort';
import { mathDate, mathPercent, type MathCommandRequest } from './client';

export function MathCohortInsights({ students, selected, onSelect, request, onInspect, onBrowse }: {
  students: { id: string; name: string }[]; selected: string[]; onSelect: (ids: string[]) => void;
  request: MathCommandRequest; onInspect: (id: string) => void; onBrowse: (scope: Partial<MathCatalogFilters>) => void;
}) {
  const [search, setSearch] = useState('');
  const [loaded, setLoaded] = useState<{ request: MathCommandRequest; key: string; data: MathStudentInsights[] }>();
  const [topicId, setTopicId] = useState('');
  const [responses, setResponses] = useState<{ request: MathCommandRequest; key: string; rows: MathAttemptEvidence[] }>();
  const [failure, setFailure] = useState<{ key: string; message: string }>();
  const [retry, setRetry] = useState(0);
  const [chosen, setChosen] = useState<{ key: string; ids: string[] }>({ key: '', ids: [] });
  const studentKey = JSON.stringify(selected);
  const insights = loaded?.request === request && loaded.key === studentKey ? loaded.data : undefined;
  const topics = cohortTopics(insights ?? []);
  const topic = topics.find(item => item.id === topicId);
  const scopeKey = JSON.stringify(topic ? { category: topic.category, subcategory: topic.subcategory } : null);
  const evidenceKey = `${studentKey}:${scopeKey}:${retry}`;
  const rows = responses?.request === request && responses.key === evidenceKey ? responses.rows : undefined;
  const selectedQuestions = chosen.key === evidenceKey ? chosen.ids : [];
  useEffect(() => {
    if (!selected.length) return;
    const controller = new AbortController();
    Promise.all((JSON.parse(studentKey) as string[]).map(id => request<MathStudentInsights>(`/students/${encodeURIComponent(id)}/insights`, { signal: controller.signal })))
      .then(data => { if (!controller.signal.aborted) { setLoaded({ request, key: studentKey, data }); setFailure(current => current?.key === studentKey ? undefined : current); } })
      .catch(error => { if (!controller.signal.aborted) setFailure({ key: studentKey, message: error.message }); });
    return () => controller.abort();
  }, [request, studentKey, retry, selected.length]);
  useEffect(() => {
    if (scopeKey === 'null' || !selected.length) return;
    const controller = new AbortController();
    readCohortEvidence(request, JSON.parse(studentKey), JSON.parse(scopeKey), controller.signal)
      .then(rows => { if (!controller.signal.aborted) { setResponses({ request, key: evidenceKey, rows }); setFailure(current => current?.key === evidenceKey ? undefined : current); } })
      .catch(error => { if (!controller.signal.aborted) setFailure({ key: evidenceKey, message: error.message }); });
    return () => controller.abort();
  }, [request, studentKey, scopeKey, evidenceKey, selected.length]);
  const error = failure && [studentKey, evidenceKey].includes(failure.key) ? failure.message : '';
  const questions = cohortQuestions(rows ?? []);
  return <section className="mc-panel mc-cohort" aria-label="Compare students">
    <h2>Choose practice for a group</h2>
    <p>Compare a topic once across your selected students, then send varied source questions to the planner. Missing skills do not block selection.</p>
    <details open className="mc-details"><summary>Students · {selected.length} selected</summary>
      <label>Find students<input type="search" value={search} onChange={event => setSearch(event.target.value)}/></label>
      <div className="mc-cohort-students">{students.filter(student => student.name.toLowerCase().includes(search.toLowerCase())).map(student => <label key={student.id}><input type="checkbox" checked={selected.includes(student.id)} onChange={event => onSelect(event.target.checked ? [...selected, student.id] : selected.filter(id => id !== student.id))}/>{student.name}</label>)}</div>
      {selected.length > 0 && <button type="button" onClick={() => onSelect([])}>Clear students</button>}
    </details>
    {selected.length > 0 && <p>{students.filter(student => selected.includes(student.id)).map(student => student.name).join(' · ')}</p>}
    {error && <p role="alert" className="mc-error">{error} <button type="button" onClick={() => { setFailure(undefined); setRetry(value => value + 1); }}>Retry comparison</button></p>}
    {!!selected.length && !insights && !error && <p role="status">Loading selected students…</p>}
    {insights && <><label>Compare topic<select value={topic?.id ?? ''} onChange={event => setTopicId(event.target.value)}><option value="">Choose a topic with recorded evidence</option>{topics.map(item => <option key={item.id} value={item.id}>{item.subcategory || 'Uncategorized'} · {item.category || 'Uncategorized'}</option>)}</select></label>{!topics.length && <p>No question-level topic evidence is available for these students.</p>}</>}
    {topic && <><h3>{topic.subcategory || 'Uncategorized'}</h3><p>{rows ? `${rows.length} response records · ${questions.length} distinct source questions · ${new Set(rows.map(row => row.studentId)).size} students with evidence` : 'Loading topic evidence…'}</p>
      <div className="mc-table-wrap"><table className="mc-table"><thead><tr><th>Student</th><th>Correct / scored</th><th>Accuracy</th><th>Unanswered</th><th>Pending</th><th>Distinct questions</th></tr></thead><tbody>{selected.map(id => {
        const own = rows?.filter(row => row.studentId === id), metric = mathQuestionMetrics(own ?? []);
        return <tr key={id}><th scope="row">{students.find(student => student.id === id)?.name || 'Student'}</th><td>{!own ? 'Loading…' : own.length ? `${metric.correct}/${metric.correct + metric.incorrect + metric.unanswered}` : 'No evidence'}</td><td>{mathPercent(metric.accuracy)}</td><td>{own ? metric.unanswered : '—'}</td><td>{own ? metric.pending : '—'}</td><td>{own ? new Set(own.map(row => row.questionId)).size : '—'}</td></tr>;
      })}</tbody></table></div>
      <p className="mc-caption">Unanswered scored questions count toward accuracy; pending grades do not. Repeated responses are retained. Limited evidence is not a diagnosis.</p>
      <button type="button" onClick={() => onBrowse({ category: topic.category ? [topic.category] : [], subcategory: topic.subcategory ? [topic.subcategory] : [] })}>Browse this topic to diversify the set</button>
      {selectedQuestions.length > 0 && <AddToGeneratorPlanner questionIds={selectedQuestions} request={request}/>}
      {questions.map(group => <details key={group.id} className="mc-details mc-cohort-question"><summary><ExamText text={group.evidence[0].prompt}/> · {group.metrics.correct}/{group.metrics.correct + group.metrics.incorrect + group.metrics.unanswered} correct</summary>
        <label><input type="checkbox" checked={selectedQuestions.includes(group.id)} onChange={event => setChosen({ key: evidenceKey, ids: event.target.checked ? [...selectedQuestions, group.id] : selectedQuestions.filter(id => id !== group.id) })}/>Select {group.id} for planner</label><button type="button" onClick={() => onInspect(group.id)}>Inspect source question &amp; diagrams</button>
        <div className="mc-table-wrap"><table className="mc-table"><thead><tr><th>Student / assessment</th><th>Answer</th><th>Recorded key</th><th>Result</th></tr></thead><tbody>{group.evidence.map(row => <tr key={row.id}><td>{students.find(student => student.id === row.studentId)?.name}<small>{row.assessmentTitle} · Math Q{row.questionNumber} · {mathDate(row.at)}</small><small>{row.gradingBasis === 'current_key' ? 'Current key · original snapshot unavailable' : 'Saved grading evidence'}</small></td><td>{row.answer === null ? 'Unanswered' : <ExamAnswer question={row.question} answer={row.answer}/>}</td><td>{row.correctAnswer === null ? 'Pending key' : <ExamAnswer question={row.question} answer={row.correctAnswer}/>}</td><td>{row.status}</td></tr>)}</tbody></table></div>
      </details>)}
    </>}
  </section>;
}
