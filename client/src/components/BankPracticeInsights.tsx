import { useEffect, useMemo, useState } from "react";
import { getBankPracticeAttempts, type BankPracticeAttempt } from "../lib/api";

/** Exact saved responses only. ELA practice is not a full SHSAT exam or scaled score. */
export function BankPracticeInsights({ accessToken, studentId, onAssignSkill }: { accessToken: string; studentId: string; onAssignSkill: (topic: string) => void }) {
  const [attempts, setAttempts] = useState<BankPracticeAttempt[]>([]);
  const [error, setError] = useState(""); const [revision, setRevision] = useState(0); const [loading, setLoading] = useState(true);
  const [unverified, setUnverified] = useState(0); const [topic, setTopic] = useState(""); const [difficulty, setDifficulty] = useState("");
  useEffect(() => { let active = true;
    getBankPracticeAttempts(accessToken, studentId).then(data => { if (active) { setAttempts(data.attempts); setUnverified(data.unverified ?? 0); setError(""); setLoading(false); } }).catch(error => { if (active) { setError(error instanceof Error ? error.message : "Practice analytics unavailable."); setLoading(false); } });
    return () => { active = false; };
  }, [accessToken, studentId, revision]);
  const questions = useMemo(() => attempts.flatMap(attempt => attempt.questions), [attempts]);
  const skills = useMemo(() => {
    const groups = new Map<string, { topic: string; correct: number; total: number; seconds: number }>();
    for (const q of questions) { if (topic && q.topic !== topic || difficulty && q.difficulty !== difficulty) continue; const group = groups.get(q.topic) ?? { topic: q.topic, correct: 0, total: 0, seconds: 0 }; group.total++; group.correct += Number(q.isCorrect); group.seconds += q.timeSpentSeconds; groups.set(q.topic, group); }
    return [...groups.values()].sort((a, b) => a.correct / a.total - b.correct / b.total);
  }, [questions, topic, difficulty]);
  return <section className="lp-workspace" aria-label="SHSAT Lab ELA practice analytics"><header className="lp-heading"><div><h3>SHSAT Lab · ELA practice insights</h3><small>English only · Actual saved responses, including repeat attempts. Kept separate from exam scores and Math analytics.</small></div><button type="button" onClick={() => { setLoading(true); setRevision(value => value + 1); }}>Refresh practice results</button></header>
    {error && <p role="alert">{error}</p>}{loading && <p>Loading saved practice attempts…</p>}{!loading && !error && <>
      <div className="lp-toolbar"><span>Subject: English · Source: SHSAT Lab</span><label>Topic<select value={topic} onChange={event => setTopic(event.target.value)}><option value="">All ELA topics</option>{[...new Set(questions.map(q => q.topic))].sort().map(value => <option key={value}>{value}</option>)}</select></label><label>Difficulty<select value={difficulty} onChange={event => setDifficulty(event.target.value)}><option value="">All levels</option>{[...new Set(questions.map(q => q.difficulty))].sort().map(value => <option key={value}>{value}</option>)}</select></label></div>
      {unverified > 0 && <p>{unverified} incompatible saved records excluded; no answer data was invented.</p>}
      {skills.length ? <div className="lp-table-scroll"><table><thead><tr><th>ELA skill</th><th>Saved response accuracy</th><th>Response count</th><th>Average time</th><th>Next step</th></tr></thead><tbody>{skills.map(skill => <tr key={skill.topic}><td>{skill.topic}</td><td>{Math.round(skill.correct / skill.total * 100)}% ({skill.correct}/{skill.total})</td><td>{skill.total}{skill.total < 5 && " · limited sample"}</td><td>{Math.round(skill.seconds / skill.total)} sec</td><td><button type="button" onClick={() => onAssignSkill(skill.topic)}>Assign Practice</button></td></tr>)}</tbody></table></div> : <p>No saved matching SHSAT Lab practice responses yet. Publish captured ELA questions, build a set in the Content Editor, and assign it in the learning plan.</p>}
      {attempts.length > 0 && <details><summary>Saved set attempts ({attempts.length})</summary>{attempts.map(attempt => <p key={attempt.id}><a href={`/teacher/library/${attempt.bookId}`}>{attempt.title}</a> · {attempt.score}/{attempt.totalQuestions} · {new Date(attempt.completedAt).toLocaleDateString()}</p>)}</details>}
    </>}
  </section>;
}
