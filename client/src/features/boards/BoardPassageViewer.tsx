import { useState } from "react";
import { ChevronLeft, ChevronRight, Scissors } from "lucide-react";
import { ExamReviewPassage, ReviewQuestionBody } from "../../components/ExamReviewQuestion";
import type { BoardContent } from "./api";
import type { BoardNode } from "../../../../server/src/shared/boards";
import type { BoardCardContextValue } from "./cardContext";
import { BoardAnnotations } from "./BoardAnnotations";
import { BoardQuestionResponses } from "./BoardQuestionResponses";

export function BoardPassageViewer({ source, card, context }: { source: BoardContent; card: BoardNode; context: BoardCardContextValue }) {
  const [index, setIndex] = useState(0);
  const viewer = source.viewer!, question = viewer.questions[Math.min(index, viewer.questions.length - 1)];
  const current = context.session.snapshot();
  const editable = current.ready && current.board.role !== "viewer" && !current.board.archivedAt && current.status !== "Recovery needed";
  return <div className="board-mini-exam">
    <header className="board-card-drag-handle"><strong>{source.title}</strong><small>{viewer.questions.length} question{viewer.questions.length === 1 ? "" : "s"}</small></header>
    <div className="board-exam-navigation nodrag nopan"><button aria-label="Previous question" disabled={index === 0} onClick={() => setIndex(value => value - 1)}><ChevronLeft size={14} /></button><label>Question <select aria-label="Passage question" value={index} onChange={event => setIndex(Number(event.target.value))}>{viewer.questions.map((question, i) => <option key={question.id} value={i}>{i + 1}</option>)}</select> of {viewer.questions.length}</label><button aria-label="Next question" disabled={index >= viewer.questions.length - 1} onClick={() => setIndex(value => value + 1)}><ChevronRight size={14} /></button>{viewer.passage && question && <button disabled={!editable} onClick={event => { event.stopPropagation(); context.extract(card, question.id, `Question ${index + 1} · ${source.title}`); }}><Scissors size={14} /> Extract question</button>}</div>
    <BoardAnnotations card={card} context={context} revisionKey={`${question?.id}:${source.title}`}>
      {viewer.directions && <details className="board-exam-directions"><summary>Directions</summary><p>{viewer.directions.body}</p></details>}
      <div className={`board-exam-document ${viewer.passage ? "has-passage" : ""}`}>
        {viewer.passage && <div className="board-exam-passage" data-board-highlight-key={`passage:${viewer.passage.id}`}><ExamReviewPassage passage={viewer.passage} /></div>}
        {question ? <div key={question.id} className={`board-exam-question is-${question.type}`} data-board-highlight-key={`question:${question.id}`}><ReviewQuestionBody answerPresentation="comparison" item={{ question, number: index + 1, section: "english", isCorrect: false }} showAnswers={false} viewer /><BoardQuestionResponses question={question} /></div> : <p>No questions are available for this source.</p>}
      </div>
    </BoardAnnotations>
  </div>;
}
