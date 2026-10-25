import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ExamSessionPage, type ExamGameSession } from "../../pages/ExamSessionPage";
import { hasActiveInk, type GameView } from "../../../../server/src/shared/gameRooms";
import type { SelectedAnswer, SelectedAnswers } from "../../../../server/src/shared/examGrading";
import { GamePlaytestControls } from "./GamePlaytestControls";
import type { TeacherAssessment } from "../../lib/api";
import { GameCursors } from "./GameCursors";
import { GameStandings } from "./GameStandings";
import { SabotageShop } from "./SabotageShop";
import { InkBombOverlay } from "./InkBombOverlay";

type Action = (action: string, body?: Record<string, unknown>, quiet?: boolean) => Promise<boolean>;
function sessionContent(room: GameView): Pick<ExamGameSession, "content" | "assessment" | "screen"> {
  const first = room.unit[0], math = first.subject.toLowerCase() === "math";
  const directions = { subject: "English Language Arts", title: "Reading Comprehension Directions", body: "Read the passage and answer all questions. Review your answers before completing the passage." };
  const set = { id: first.passage?.id ?? "game-context", directions, questionCount: room.unit.length, questions: room.unit.map(item => item.question), passage: first.passage ?? { id: "game-context", title: "Game question", format: "prose" as const, lines: [] } };
  const content = { assessmentId: room.id, title: room.sourceTitle, passageSets: !math && first.passage ? [set] : [], ...(math ? { mathSection: { id: "game-math", label: "Math", questionCount: 1, questions: [first.question], directions: { subject: "Mathematics", title: "Math Directions", body: "Answer the question, then select Next when ready.", notes: [] } } } : !first.passage ? { standaloneSection: { id: "game-english", label: "English", questionCount: 1, questions: [first.question], directions } } : {}) };
  const assessment: TeacherAssessment = { id: room.id, title: room.title, classId: "shsat", createdAt: room.createdAt, updatedAt: room.updatedAt, description: "Live practice game", durationMinutes: room.testMinutes, allowCompletedAccess: false, passages: [], questions: [], sectionAccess: { english: true, math: true }, split: false, status: "open" };
  return { content, assessment, screen: math ? "mathQuestion" : first.passage ? "passage" : "standaloneQuestion" };
}

export function GameExamPlayer({ room, act, busy, now, timerText, error, accessToken, watchControls }: { room: GameView; act: Action; busy: boolean; now: number; timerText: string; error: string; accessToken: string; watchControls?: ReactNode }) {
  const [controls, setControls] = useState(false);
  const [pending, setPending] = useState<Record<string, { value?: SelectedAnswer; version: number }>>({});
  const version = useRef(0);
  const surface = useRef<HTMLFieldSetElement>(null);
  const observing = Boolean(room.observingTeamId);
  const team = room.teams.find(item => item.id === (room.observingTeamId ?? room.me?.teamId)), index = team?.index;
  const step = team?.step ?? 0, teammates = room.players.filter(player => player.teamId === team?.id && !player.excusedAt), readyIds = team?.readyIds ?? [];
  const voted = readyIds.includes(room.me?.id ?? ""), saving = Object.keys(pending).length > 0;
  const navigation = { questionId: room.unit[0].question.id, index, step, draftVersion: team?.draftVersion ?? 0 };
  const answers = { ...room.myAnswers };
  for (const [id, edit] of Object.entries(pending)) { if (edit.value === undefined) delete answers[id]; else answers[id] = edit.value; }
  const locked = room.phase !== "question" || room.mode === "survival" && room.answeredIds.includes(room.me!.id);
  const blackout = Math.max(0, Math.ceil(((team?.blockedUntil ?? 0) - now) / 1000));
  const inked = Boolean(team && hasActiveInk(team, now));
  const blocked = blackout || (inked ? 1 : 0);
  useEffect(() => {
    if (observing || room.mode !== "teams" || !Object.keys(pending).length || locked || blocked) return;
    const timer = window.setTimeout(() => {
      for (const [questionId, edit] of Object.entries(pending)) void act("draft", { questionId, index, answer: edit.value === "" || Array.isArray(edit.value) && !edit.value.length ? null : edit.value ?? null }, true).then(ok => {
        if (ok) setPending(current => { if (current[questionId]?.version !== edit.version) return current; const next = { ...current }; delete next[questionId]; return next; });
      });
    }, 450);
    return () => window.clearTimeout(timer);
  }, [pending, act, index, room.mode, locked, blocked, observing]);
  useEffect(() => {
    const previous = document.body.style.overflow, root = document.getElementById("root"), wasInert = root?.inert ?? false;
    document.body.style.overflow = "hidden"; if (root) root.inert = true;
    return () => { document.body.style.overflow = previous; if (root) root.inert = wasInert; };
  }, []);
  function change(next: SelectedAnswers) {
    if (observing) return;
    setPending(current => {
      const result = { ...current };
      for (const id of new Set([...Object.keys(answers), ...Object.keys(next)])) if (JSON.stringify(answers[id]) !== JSON.stringify(next[id])) result[id] = { value: next[id], version: ++version.current };
      return result;
    });
  }
  const vote = () => observing || saving || busy || blocked > 0 ? Promise.resolve(false) : act("vote", navigation);
  const review = (targetStep: number) => { if (!observing && !saving) void act("review", { ...navigation, targetStep }); };
  const session = sessionContent(room);
  return createPortal(<div className="game-exam-overlay">
    <div className="game-exam-ribbon"><strong>{room.title}</strong><span>{team ? `${team.name} · ${team.score} pts` : room.me?.alive ? "Still standing" : "Audience"}</span><span>{observing ? "Live teacher view · Read only" : room.mode === "teams" ? "Active teammates vote before moving on" : room.unit.length > 1 ? "Points post when you finish this passage" : "Next locks your answer"}</span>{watchControls}{team && room.party && !observing && <button className="game-shop-trigger" onClick={() => setControls(true)}>Shop · {team.coins ?? 0} {(team.coins ?? 0) === 1 ? "coin" : "coins"}</button>}<button onClick={() => setControls(value => !value)}>{controls ? "Return to exam" : "Game controls & standings"}</button></div>
    {team && <div className="game-team-ready game-rooms"><div><strong>{step >= room.unit.length ? "Ready to submit this passage?" : "Ready to move on together?"}</strong><p aria-live="polite">{saving ? "Saving your shared answer…" : `${readyIds.length} of ${teammates.length} active teammates ready. Changing an answer clears the votes.`}</p><ul>{teammates.map(player => <li key={player.id} className={readyIds.includes(player.id) ? "is-ready" : ""}>{player.name} · {readyIds.includes(player.id) ? "Ready" : "Waiting"}</li>)}</ul>{room.players.some(player => player.teamId === team.id && player.excusedAt) && <p>Left class: {room.players.filter(player => player.teamId === team.id && player.excusedAt).map(player => player.name).join(", ")} · Vote not required.</p>}</div>{!observing && <button className="game-primary" disabled={busy || saving || blocked > 0 || !voted && room.myAnswers[room.unit[Math.min(step, room.unit.length - 1)].question.id] === undefined} onClick={() => { void (voted ? act("unvote", navigation) : vote()); }}>{voted ? "Undo my ready vote" : step >= room.unit.length ? "Vote to submit passage" : "Ready for next question"}</button>}</div>}
    {controls && <aside className="game-exam-controls game-rooms"><button onClick={() => setControls(false)}>Return to exam</button>{!observing && <><SabotageShop room={room} act={act} busy={busy} now={now} /><GamePlaytestControls room={room} act={act} busy={busy} /></>}<GameStandings room={room} now={now} />{!observing && (room.isHost || room.canPlaytest) && <button onClick={() => { void act("finish"); }}>End room</button>}</aside>}
    <fieldset ref={surface} className="game-exam-player" disabled={observing || busy || locked || blocked > 0} inert={observing || busy || locked || blocked > 0}>
      <ExamSessionPage gameSession={{ ...session, ...(team ? { teamNavigation: { step, onNext: () => { void vote(); }, onReview: review } } : {}), subjectPosition: room.subjectPosition, answers, onAnswersChange: change, studentName: observing ? `${team?.name} · Teacher view` : room.me!.name, timerText, onSubmit: values => team ? vote() : act("answer", { questionId: room.unit[0].question.id, index, round: room.round, answers: values }) }} />
    </fieldset>
    {team && <GameCursors room={room} token={accessToken} surface={surface} hidden={controls || blocked > 0} />}
    {locked && <div className="game-exam-wait" role="status"><strong>Answers locked</strong><p>Waiting for the other players to finish.</p><button onClick={() => setControls(true)}>View standings</button></div>}
    {blackout > 0 && <div className="game-exam-blackout" role="alert"><span>{team?.sabotagedBy?.boosterId === "landmine" ? "LANDMINE TRIGGERED" : "BLACKOUT"}</span><h2>{team?.sabotagedBy ? `Sabotaged by ${team.sabotagedBy.teamName}` : "Your team was sabotaged"}</h2><strong>{blackout}</strong><p>{team?.name}'s exam returns in {blackout} seconds.</p><button onClick={() => setControls(true)}>Game controls</button></div>}
    {inked && team?.inkBomb && <InkBombOverlay key={team.inkBomb.id} ink={team.inkBomb} now={now} observing={observing} act={act} />}
    {team?.landmineResult?.outcome === "disarmed" && now - team.landmineResult.at < 8000 && <div className="game-mine-disarmed" role="status">Landmine disarmed! Your correct answer stopped {team.landmineResult.source.teamName}'s trap.</div>}
    {error && <div className="game-exam-error" role="alert">{error}</div>}
  </div>, document.body);
}
