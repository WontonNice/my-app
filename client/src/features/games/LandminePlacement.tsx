import { useState } from "react";
import type { GameView } from "../../../../server/src/shared/gameRooms";

export function LandminePlacement({ room, teamId, busy, act, onSent }: { room: GameView; teamId: string; busy: boolean; act: (action: string, body?: Record<string, unknown>) => Promise<boolean>; onSent: (name: string) => void }) {
  const [question, setQuestion] = useState(""), [choice, setChoice] = useState("");
  const target = room.teams.find(team => team.id === teamId);
  const options = room.mineTargets.find(team => team.teamId === teamId)?.questions ?? [];
  const selected = options.find(item => String(item.questionIndex) === question);
  return <form className="mine-placement" onSubmit={event => { event.preventDefault(); if (selected && choice) void act("use-sabotage", { boosterId: "landmine", teamId, questionIndex: selected.questionIndex, choiceId: choice }).then(ok => { if (ok) onSent(target?.name ?? "the team"); }); }}>
    <h4>Plant in {target?.name}</h4><p>Choose a question they have not submitted, then the answer choice to trap. Correct answers always survive.</p>
    <label>Question<select aria-label="Landmine question" value={selected ? question : ""} onChange={event => { setQuestion(event.target.value); setChoice(""); }} required disabled={busy}><option value="" disabled>Choose a question</option>{options.map(item => <option key={item.questionIndex} value={item.questionIndex}>{item.label}</option>)}</select></label>
    <fieldset><legend>Answer choice</legend><div>{selected?.choices.map(id => <label key={id}><input type="radio" name="mine-choice" value={id} checked={choice === id} onChange={() => setChoice(id)} disabled={busy} /><span>{id}</span></label>)}</div>{!selected && <small>Select a question to see its answer choices.</small>}</fieldset>
    {!options.length && <p>No unsubmitted choice questions remain for this team.</p>}
    <button className="sabotage-buy" disabled={busy || !selected || !selected.choices.includes(choice)}>Plant Landmine{selected && choice ? ` · Q${selected.questionIndex + 1}, choice ${choice}` : ""}</button>
  </form>;
}
