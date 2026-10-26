import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { ExamSessionPage, type ExamGameSession } from "../../pages/ExamSessionPage";
import { hasActiveInk, type GameView } from "../../../../server/src/shared/gameRooms";
import type { SelectedAnswer, SelectedAnswers } from "../../../../server/src/shared/examGrading";
import { GamePlaytestControls } from "./GamePlaytestControls";
import type { TeacherAssessment } from "../../lib/api";
import { GameCursors } from "./GameCursors";
import { GameStandings } from "./GameStandings";
import { SabotageShop } from "./SabotageShop";
import { TeamChat } from "./TeamChat";
import { LandmineOutcome } from "./LandmineOutcome";
import { GameAnswerStatus } from "./GameAnswerStatus";
import { useTeamTools } from "./useTeamTools";
import { TeamReadyControl } from "./TeamReadyControl";
import { InkBombOverlay } from "./InkBombOverlay";
import { gameExamContent } from "./gameExamContent";

type Action = (action: string, body?: Record<string, unknown>, quiet?: boolean) => Promise<boolean>;
function sessionContent(room: GameView): Pick<ExamGameSession, "content" | "assessment" | "screen"> {
  const session = gameExamContent(room.id, room.sourceTitle, room.unit);
  const assessment: TeacherAssessment = { id: room.id, title: room.title, classId: "shsat", createdAt: room.createdAt, updatedAt: room.updatedAt, description: "Live practice game", durationMinutes: room.testMinutes, allowCompletedAccess: false, passages: [], questions: [], sectionAccess: { english: true, math: true }, split: false, status: "open" };
  return { ...session, assessment };
}

export function GameExamPlayer({ room, act, busy, now, timerText, error, accessToken, watchControls }: { room: GameView; act: Action; busy: boolean; now: number; timerText: string; error: string; accessToken: string; watchControls?: ReactNode }) {
  const [panel, setPanel] = useState<"shop" | "sandbox" | "standings" | "chat" | null>(null);
  const [visibleQuestionId, setVisibleQuestionId] = useState<string | null>(room.unit[0]?.question.id ?? null);
  const controls = panel !== null;
  const [pending, setPending] = useState<Record<string, { value?: SelectedAnswer; version: number }>>({});
  const version = useRef(0);
  const ribbon = useRef<HTMLDivElement>(null);
  const [ribbonHeight, setRibbonHeight] = useState(52);
  useEffect(() => { if (!ribbon.current) return; const observer = new ResizeObserver(entries => setRibbonHeight(entries[0].target.getBoundingClientRect().height)); observer.observe(ribbon.current); return () => observer.disconnect(); }, []);
  const surface = useRef<HTMLFieldSetElement>(null);
  const observing = Boolean(room.observingTeamId);
  const team = room.teams.find(item => item.id === (room.observingTeamId ?? room.me?.teamId)), index = team?.index;
  const step = team?.step ?? 0, readyIds = team?.readyIds ?? [];
  const shared = useTeamTools(room, act);
  const voted = readyIds.includes(room.me?.id ?? ""), saving = Object.keys(pending).length > 0 || shared.saving;
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
      for (const id of new Set([...Object.keys(answers), ...Object.keys(next)])) if (!team?.pendingFeedback?.some(item => item.questionId === id) && JSON.stringify(answers[id]) !== JSON.stringify(next[id])) result[id] = { value: next[id], version: ++version.current };
      return result;
    });
  }
  const vote = () => observing || saving || busy || blocked > 0 ? Promise.resolve(false) : act("vote", navigation);
  const review = (targetStep: number) => { if (!observing && !saving) void act("review", { ...navigation, targetStep }); };
  const session = sessionContent(room);
  const sandboxAction: Action = async (action, body, quiet) => {
    const ok = await act(action, body, quiet);
    if (ok && action === "test-select" && typeof body?.questionId === "string") {
      const questionId = body.questionId;
      setPending(current => { const next = { ...current }; delete next[questionId]; return next; });
    }
    if (ok && ["test-sabotage", "test-landmine-result"].includes(action)) setPanel(null);
    return ok;
  };
  return createPortal(<div className="game-exam-overlay" style={{ "--game-ribbon-height": ribbonHeight + "px" } as CSSProperties}>
    <div className="game-exam-ribbon" ref={ribbon}><strong>{room.title}</strong><span>{team ? `${team.name} · ${team.score} pts` : room.me?.alive ? "Still standing" : "Audience"}</span><span>{observing ? "Live teacher view · Read only" : room.mode === "teams" ? "" : room.unit.length > 1 ? "Points post when you finish this passage" : "Next locks your answer"}</span>{team && <TeamReadyControl players={room.players.filter(player => player.teamId === team.id)} readyIds={readyIds} myId={room.me?.id} saving={saving} observing={observing} passageReview={step >= room.unit.length} disabled={busy || saving || blocked > 0 || !voted && room.myAnswers[room.unit[Math.min(step, room.unit.length - 1)].question.id] === undefined} onToggle={() => { void (voted ? act("unvote", navigation) : vote()); }} />}{team && <GameAnswerStatus team={team} questionId={room.unit[step]?.question.id} />}{team && <span className="game-shared-tools-status" role="status">{shared.saving ? "Sharing tools…" : "Tools shared with team"}</span>}{watchControls}{room.canPlaytest && !observing && <label className="game-sandbox-pov">Student POV<select aria-label="Student POV" disabled={busy} value={room.me?.id ?? ""} onChange={event => { void act("test-control", { playerId: event.target.value }); }}>{room.players.map(player => <option value={player.id} key={player.id}>{player.name} · {room.teams.find(item => item.id === player.teamId)?.name ?? (player.alive ? "Standing" : "Audience")}</option>)}</select></label>}{team && room.party && !observing && <button className="game-shop-trigger" onClick={() => setPanel("shop")}>Shop · {room.canPlaytest && room.playtest?.unlimitedCoins ? "∞ coins" : `${team.coins ?? 0} ${(team.coins ?? 0) === 1 ? "coin" : "coins"}`}</button>}{room.canPlaytest && !observing && <button onClick={() => setPanel("sandbox")}>Sandbox</button>}{team && <button onClick={() => setPanel("chat")}>Team chat</button>}<button onClick={() => setPanel(controls ? null : "standings")}>{controls ? "Return to exam" : "Standings"}</button></div>
    {room.canPlaytest && room.playtestKeys?.length ? <details className="game-playtest-key"><summary>Teacher answer key · {room.playtestKeys.map(item => "Q" + item.number + ": " + item.answer).join(" · ")}</summary><p>Private playtest only. These answers are never sent to student accounts.</p></details> : null}
    {controls && <aside className={"game-exam-controls game-rooms" + (panel === "sandbox" ? " game-sandbox-panel" : "")} aria-label="Game panel"><nav className="game-panel-tabs" aria-label="Game tools">{!observing && room.party && <button aria-pressed={panel === "shop"} onClick={() => setPanel("shop")}>Shop</button>}{room.canPlaytest && !observing && <button aria-pressed={panel === "sandbox"} onClick={() => setPanel("sandbox")}>Sandbox</button>}<button aria-pressed={panel === "standings"} onClick={() => setPanel("standings")}>Standings</button>{team && <button aria-pressed={panel === "chat"} onClick={() => setPanel("chat")}>Chat</button>}<button className="game-panel-close" onClick={() => setPanel(null)} aria-label="Close game panel">✕</button></nav>{panel === "shop" && !observing && <SabotageShop room={room} act={act} busy={busy} now={now} />}{panel === "sandbox" && !observing && <GamePlaytestControls room={room} act={sandboxAction} busy={busy || room.mode === "teams" && saving} currentQuestionId={visibleQuestionId} onReturnToExam={() => setPanel(null)} />}{panel === "chat" && team && <TeamChat key={team.id} room={room} act={act} busy={busy} readOnly={observing} />}{panel === "standings" && <GameStandings room={room} now={now} />}{!observing && (room.isHost || room.canPlaytest) && <button onClick={() => { void act("finish"); }}>End room</button>}</aside>}
    <fieldset ref={surface} className="game-exam-player" disabled={observing || busy || locked || blocked > 0} inert={observing || busy || locked || blocked > 0}>
      <ExamSessionPage gameSession={{ ...session, onCurrentQuestionChange: setVisibleQuestionId, sharedTools: shared.tools, lockedQuestionIds: team?.pendingFeedback?.map(item => item.questionId), ...(team ? { teamNavigation: { step, onNext: () => { void vote(); }, onReview: review } } : {}), subjectPosition: room.subjectPosition, answers, onAnswersChange: change, studentName: observing ? `${team?.name} · Teacher view` : room.me!.name, timerText, onSubmit: values => team ? vote() : act("answer", { questionId: room.unit[0].question.id, index, round: room.round, answers: values }) }} />
    </fieldset>
    {team && <GameCursors room={room} token={accessToken} surface={surface} hidden={controls || blocked > 0} />}
    {locked && <div className="game-exam-wait" role="status"><strong>Answers locked</strong><p>Waiting for the other players to finish.</p><button onClick={() => setPanel("standings")}>View standings</button></div>}
    {blackout > 0 && <div className="game-exam-blackout" role="alert"><span>{team?.sabotagedBy?.boosterId === "landmine" ? "LANDMINE TRIGGERED" : "BLACKOUT"}</span><h2>{team?.sabotagedBy ? `Sabotaged by ${team.sabotagedBy.teamName}` : "Your team was sabotaged"}</h2><strong>{blackout}</strong><p>{team?.name}'s exam returns in {blackout} seconds.</p><button onClick={() => setPanel(room.canPlaytest ? "sandbox" : "standings")}>{room.canPlaytest ? "Open sandbox" : "View standings"}</button></div>}
    {inked && team?.inkBomb && <InkBombOverlay key={team.inkBomb.id} ink={team.inkBomb} now={now} observing={observing} act={act} />}
    <LandmineOutcome result={team?.landmineResult} now={now} />
    {error && <div className="game-exam-error" role="alert">{error}</div>}
  </div>, document.body);
}
