import { useMemo } from 'react';
import { CircleCheck, CircleDashed, Target, TrendingUp } from 'lucide-react';
import { ExamAnswer, ExamText } from '../../components/ExamReviewQuestion';
import { formatPracticeTime } from '../math-command/inequalitySession';
import { adaptiveQuestionFor, type AdaptiveState, type AdaptiveTopicSummary, type TopicStatus, type adaptiveSummary } from '../../../../server/src/shared/adaptiveMath/engine';
import { adaptiveCategories } from '../../../../server/src/shared/adaptiveMath/topics';
import { mathCorrectAnswer } from '../../../../server/src/shared/mathCommandAnalytics';
import './adaptive-math.css';

// The adaptive exam report, shared by the student's own page and the teacher's read-only view.
// Nothing here changes an exam: it only reads a saved state.

export type AdaptiveSummary = ReturnType<typeof adaptiveSummary>;
/** Who is reading the report. Only the wording changes. */
export type AdaptiveReportReader = 'student' | 'teacher';

const statusLabels: Record<TopicStatus, string> = { mastered: 'Mastered', learning: 'Building', weak: 'Needs practice', new: 'Not tested yet' };
const copy = {
  student: {
    focusTitle: 'Focus on these next',
    focusText: 'The exam will keep returning to these topics until you answer them correctly several times in a row.',
    topicsText: 'Mastered means you answered correctly on harder questions more than once. Topics marked Building need another correct answer or two.',
    missedTitle: 'Questions to review',
    missedText: (count: number) => `Your ${count === 1 ? 'most recent missed question' : `${count} most recent missed questions`}, newest first. Open one to see the solution.`,
    answer: 'Your answer',
  },
  teacher: {
    focusTitle: 'Needs practice',
    focusText: 'The exam keeps returning to these topics until the student answers them correctly several times in a row.',
    topicsText: 'Mastered means the student answered harder questions correctly more than once. Topics marked Building need another correct answer or two.',
    missedTitle: 'Recent missed questions',
    missedText: (count: number) => `The student’s ${count === 1 ? 'most recent missed question' : `${count} most recent missed questions`}, newest first. Open one to see both answers and the solution.`,
    answer: 'Student’s answer',
  },
} satisfies Record<AdaptiveReportReader, unknown>;

/** Questions answered, percent correct, topics mastered and time spent. */
export function AdaptiveStats({ state, summary }: { state: AdaptiveState; summary: AdaptiveSummary }) {
  return <dl className="am-stats">
    <div><dt>Questions answered</dt><dd>{summary.asked}</dd></div>
    <div><dt>Correct</dt><dd>{summary.asked ? `${Math.round(100 * summary.correct / summary.asked)}%` : '—'}<small>{summary.correct} of {summary.asked}</small></dd></div>
    <div><dt>Topics mastered</dt><dd>{summary.mastered}<small>of {summary.total}</small></dd></div>
    <div><dt>Time spent</dt><dd>{formatPracticeTime(state.totalMs)}</dd></div>
  </dl>;
}

function TopicRow({ topic }: { topic: AdaptiveTopicSummary }) {
  const percent = Math.round(topic.mastery * 100);
  return <tr className={`is-${topic.status}`}>
    <th scope="row">{topic.label}</th>
    <td><span className={`am-status is-${topic.status}`}>{topic.status === 'mastered' ? <CircleCheck size={13} aria-hidden="true" /> : topic.status === 'new' ? <CircleDashed size={13} aria-hidden="true" /> : topic.status === 'weak' ? <Target size={13} aria-hidden="true" /> : <TrendingUp size={13} aria-hidden="true" />}{statusLabels[topic.status]}</span></td>
    <td className="am-score">{topic.attempts ? <>{topic.correct} of {topic.attempts}<span className="sr-only"> correct</span></> : '—'}</td>
    <td>{topic.attempts ? <span className="am-meter" role="img" aria-label={`Estimated mastery ${percent}%`}><span style={{ width: `${percent}%` }} /></span> : <span className="am-meter is-empty" aria-hidden="true" />}</td>
  </tr>;
}

function MissedQuestions({ state, reader }: { state: AdaptiveState; reader: AdaptiveReportReader }) {
  const missed = useMemo(() => state.responses.filter(row => !row.correct).slice(-20).reverse().flatMap(row => {
    try { return [{ row, question: adaptiveQuestionFor(state.seed, row) }]; } catch { return []; }
  }), [state.responses, state.seed]);
  if (!missed.length) return null;
  const words = copy[reader];
  return <section className="am-panel" aria-labelledby="am-missed-title"><h2 id="am-missed-title">{words.missedTitle}</h2><p>{words.missedText(missed.length)}</p>
    <div className="am-missed">{missed.map(({ row, question }) => <details key={`${row.n}:${question.id}`}>
      <summary><span>Question {row.n + 1}</span>{question.subtopic}{row.skipped ? ' · skipped' : ''}</summary>
      <div className="am-missed-body">
        <div className="am-missed-prompt"><ExamText text={question.prompt} />{question.image && <img src={question.image.src} alt={question.image.alt} width={question.image.width} />}</div>
        <dl><div><dt>{words.answer}</dt><dd>{row.skipped ? 'Skipped' : <ExamAnswer question={question} answer={row.answer} />}</dd></div>
          <div><dt>Correct answer</dt><dd><ExamAnswer question={question} answer={question.correctTextAnswers?.[0] ?? mathCorrectAnswer(question) ?? undefined} /></dd></div></dl>
        <div className="am-missed-why"><h3>How to solve it</h3><ExamText text={question.explanation || ''} /></div>
      </div>
    </details>)}</div></section>;
}

/** Topics that need practice, the topic-by-topic table, and the most recent missed questions. */
export function AdaptiveReport({ state, summary, reader }: { state: AdaptiveState; summary: AdaptiveSummary; reader: AdaptiveReportReader }) {
  const words = copy[reader];
  const focus = summary.topics.filter(topic => topic.status === 'weak').sort((a, b) => a.mastery - b.mastery);
  return <>
    {focus.length > 0 && <section className="am-panel" aria-labelledby="am-focus-title"><h2 id="am-focus-title">{words.focusTitle}</h2><p>{words.focusText}</p><ul className="am-focus">{focus.map(topic => <li key={topic.id}><Target size={14} aria-hidden="true" />{topic.label}<small>{topic.correct} of {topic.attempts} correct</small></li>)}</ul></section>}
    <section className="am-panel" aria-labelledby="am-topics-title"><h2 id="am-topics-title">Topic report</h2><p>{words.topicsText}</p>
      {adaptiveCategories.map(category => <table className="am-topics" key={category}><caption>{category}</caption><thead><tr><th scope="col">Topic</th><th scope="col">Status</th><th scope="col">Correct</th><th scope="col">Estimated mastery</th></tr></thead><tbody>{summary.topics.filter(topic => topic.category === category).map(topic => <TopicRow key={topic.id} topic={topic} />)}</tbody></table>)}
    </section>
    <MissedQuestions state={state} reader={reader} />
  </>;
}
