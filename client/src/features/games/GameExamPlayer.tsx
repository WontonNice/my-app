import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ExamSessionPage, type ExamGameSession } from "../../pages/ExamSessionPage";
import { GAME_BOOSTERS, type GameView } from "../../../../server/src/shared/gameRooms";
import type { SelectedAnswer, SelectedAnswers } from "../../../../server/src/shared/examGrading";
import { GamePlaytestControls } from "./GamePlaytestControls";
import type { TeacherAssessment } from "../../lib/api";

type Action = (action: string, body?: Record<string, unknown>, quiet?: boolean) => Promise<boolean>;
export function BoosterInventory({ room, act, busy, now }: { room: GameView; act: Action; busy: boolean; now: number }) {
  const team = room.teams.find(item => item.id === room.me?.teamId);
  const [target, setTarget] = useState("");
  if (!room.party || !team || room.phase !== "question") return null;
  const opponents = room.teams.filter(item => item.id !== team.id && item.index < room.totalQuestions);
  const targetId = opponents.some(item => item.id === target) ? target : opponents[0]?.id ?? "";
  return <section className="game-booster-inventory" aria-label="Booster inventory"><label>Target team<select aria-label="Booster target" value={targetId} onChange={event => setTarget(event.target.value)}><option value="" disabled>No active opponents</option>{opponents.map(item => <option key={item.id} value={item.id}>{item.name}{item.blockedUntil > now ? " · Blackout active" : ""}</option>)}</select></label>{GAME_BOOSTERS.map(item => {
    const count = team.inventory?.[item.id] ?? (item.id === "blackout" ? team.boosters : 0);
    return <div key={item.id}><strong>{item.name} <span>×{count}</span></strong><small>{item.description}</small><button disabled={busy || !count || team.index >= room.totalQuestions || team.blockedUntil > now || !targetId || (opponents.find(item => item.id === targetId)?.blockedUntil ?? 0) > now} onClick={() => { void act("booster", { boosterId: item.id, teamId: targetId }); }}>Use {item.name}</button></div>;
  })}</section>;
}

function sessionContent(room: GameView): Pick<ExamGameSession, "content" | "assessment" | "screen"> {
  const first = room.unit[0], math = first.subject.toLowerCase() === "math";
  const directions = { subject: "English Language Arts", title: "Reading Comprehension Directions", body: "Read the passage and answer all questions. Review your answers before completing the passage." };
  // The shared player expects passage context even on Math/standalone screens.
  // Only its active screen's questions enter navigation and progress counts.
  const set = { id: first.passage?.id ?? "game-context", directions, questionCount: room.unit.length, questions: room.unit.map(item => item.question), passage: first.passage ?? { id: "game-context", title: "Game question", format: "prose" as const, lines: [] } };
  const content = { assessmentId: room.id, title: room.sourceTitle, passageSets: [set], ...(math ? { mathSection: { id: "game-math", label: "Math", questionCount: 1, questions: [first.question], directions: { subject: "Mathematics", title: "Math Directions", body: "Answer the question, then select Next to lock your answer.", notes: [] } } } : !first.passage ? { standaloneSection: { id: "game-english", label: "English", questionCount: 1, questions: [first.question], directions } } : {}) };
  const assessment: TeacherAssessment = { id: room.id, title: room.title, classId: "shsat", createdAt: room.createdAt, updatedAt: room.updatedAt, description: "Live practice game", durationMinutes: room.testMinutes, allowCompletedAccess: false, passages: [], questions: [], sectionAccess: { english: true, math: true }, split: false, status: "open" };
  return { content, assessment, screen: math ? "mathQuestion" : first.passage ? "passage" : "standaloneQuestion" };
}

export function GameExamPlayer({ room, act, busy, now, timerText, error }: { room: GameView; act: Action; busy: boolean; now: number; timerText: string; error: string }) {
  const [controls, setControls] = useState(false);
  const [pending, setPending] = useState<Record<string, { value?: SelectedAnswer; version: number }>>({});
  const version = useRef(0);
  const team = room.teams.find(item => item.id === room.me?.teamId), index = team?.index;
  const answers = { ...room.myAnswers };
  for (const [id, edit] of Object.entries(pending)) { if (edit.value === undefined) delete answers[id]; else answers[id] = edit.value; }
  const locked = room.phase !== "question" || room.mode === "survival" && room.answeredIds.includes(room.me!.id);
  const blocked = Math.max(0, Math.ceil(((team?.blockedUntil ?? 0) - now) / 1000));
  useEffect(() => {
    if (room.mode !== "teams" || !Object.keys(pending).length || locked || blocked) return;
    const timer = window.setTimeout(() => {
      for (const [questionId, edit] of Object.entries(pending)) void act("draft", { questionId, index, answer: edit.value ?? null }, true).then(ok => {
        if (ok) setPending(current => { if (current[questionId]?.version !== edit.version) return current; const next = { ...current }; delete next[questionId]; return next; });
      });
    }, 450);
    return () => window.clearTimeout(timer);
  }, [pending, act, index, room.mode, locked, blocked]);
  useEffect(() => {
    const previous = document.body.style.overflow, root = document.getElementById("root"), wasInert = root?.inert ?? false;
    document.body.style.overflow = "hidden"; if (root) root.inert = true;
    return () => { document.body.style.overflow = previous; if (root) root.inert = wasInert; };
  }, []);
  function change(next: SelectedAnswers) {
    setPending(current => {
      const result = { ...current };
      for (const id of new Set([...Object.keys(answers), ...Object.keys(next)])) if (JSON.stringify(answers[id]) !== JSON.stringify(next[id])) result[id] = { value: next[id], version: ++version.current };
      return result;
    });
  }
  const session = sessionContent(room);
  return createPortal(<div className="game-exam-overlay">
    <div className="game-exam-ribbon"><strong>{room.title}</strong><span>{team ? `${team.name} · ${team.score} pts` : room.me?.alive ? "Still standing" : "Audience"}</span><span>{room.unit.length > 1 ? "Points post when you finish this passage" : "Next locks your answer"}</span><button onClick={() => setControls(value => !value)}>{controls ? "Return to exam" : "Game controls & standings"}</button></div>
    {controls && <aside className="game-exam-controls game-rooms"><button onClick={() => setControls(false)}>Return to exam</button><GamePlaytestControls room={room} act={act} busy={busy} /><BoosterInventory room={room} act={act} busy={busy} now={now} /><h3>Live standings</h3>{[...(room.mode === "teams" ? room.teams : room.players)].sort((a, b) => b.score - a.score).map(item => <p key={item.id}><strong>{item.name}</strong> · {item.score} points {"index" in item && `· ${item.index >= room.totalQuestions ? "Finished" : `Question ${item.index + 1} of ${room.totalQuestions}`}`}</p>)}{(room.isHost || room.canPlaytest) && <button onClick={() => { void act("finish"); }}>End room</button>}</aside>}
    <fieldset className="game-exam-player" disabled={busy || locked || blocked > 0} inert={busy || locked || blocked > 0}>
      <ExamSessionPage gameSession={{ ...session, subjectPosition: room.subjectPosition, answers, onAnswersChange: change, studentName: room.me!.name, timerText, onSubmit: values => act("answer", { questionId: room.unit[0].question.id, index, round: room.round, answers: values }) }} />
    </fieldset>
    {locked && <div className="game-exam-wait" role="status"><strong>Answers locked</strong><p>Waiting for the other players to finish.</p><button onClick={() => setControls(true)}>View standings</button></div>}
    {blocked > 0 && <div className="game-exam-blackout" role="alert"><span>BLACKOUT</span><h2>Your team was sabotaged</h2><strong>{blocked}</strong><p>Your exam returns in {blocked} seconds.</p><button onClick={() => setControls(true)}>Game controls</button></div>}
    {error && <div className="game-exam-error" role="alert">{error}</div>}
  </div>, document.body);
}
