import { CheckCircle2, Flame, XCircle } from "lucide-react";
import type { GameTeam } from "../../../../server/src/shared/gameRooms";
import "./game-answer-status.css";

export function GameAnswerStatus({ team, questionId }: { team: Pick<GameTeam, "streak" | "answerFeedback" | "pendingFeedback">; questionId?: string }) {
  const reviewed = team.pendingFeedback?.find(item => item.questionId === questionId);
  const result = reviewed ?? team.answerFeedback;
  return <div className="game-answer-status" aria-label="Answer feedback and streak">
    {result && <span role="status" className={result.correct ? "answer-correct" : "answer-incorrect"}>
      {result.correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
      Q{result.questionIndex + 1} · {result.correct ? "Correct" : "Incorrect"}{reviewed ? " · Locked" : ""}
    </span>}
    <span className={`game-live-streak${team.streak >= 3 ? " is-hot" : ""}`} aria-label={`${team.streak} correct in a row`}><Flame size={17} /><strong>{team.streak}</strong> streak</span>
  </div>;
}
