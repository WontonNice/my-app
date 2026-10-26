import { useState } from 'react';
import type { ExamQuestion } from '../content/exams/types';
import type { SelectedAnswer } from '../lib/examResults';
import { ExamText } from './ExamReviewQuestion';

/** Existing single-blank questions retain their string answers. New layouts use slot IDs. */
export function SentenceDragDrop({ question, answer, onChange }: { question: ExamQuestion; answer?: SelectedAnswer; onChange: (answer: SelectedAnswer) => void }) {
  const [selected, setSelected] = useState('');
  const modern = Boolean(question.dragDropSlots?.length);
  const slots = modern ? question.dragDropSlots! : [{ id: 'blank-1', correctItemId: question.correctChoiceId || '' }];
  const lines = modern ? question.dragDropContent || [] : [`${question.transitionBlankBefore || ''} {{blank-1}} ${question.transitionBlankAfter || ''}`];
  const values: Record<string, string> = modern ? answer && typeof answer === 'object' && !Array.isArray(answer) ? answer : typeof answer === 'string' && slots.length === 1 && answer ? { [slots[0].id]: answer } : {} : typeof answer === 'string' && answer ? { 'blank-1': answer } : {};
  const choices = question.choices || [];
  const save = (next: Record<string, string>) => { onChange(modern ? next : next['blank-1'] || ''); setSelected(''); };
  const place = (slot: string, id: string) => {
    if (!choices.some(choice => choice.id === id) || !slots.some(item => item.id === slot)) return;
    const next = { ...values };
    if (!question.allowReuse) for (const key of Object.keys(next)) if (next[key] === id) delete next[key];
    next[slot] = id; save(next);
  };
  const remove = (slot: string) => { const next = { ...values }; delete next[slot]; save(next); };
  return <div className="exam-transition-drop">
    <div className="exam-transition-bank" aria-label="Drag-and-drop answer bank" onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); const id = event.dataTransfer.getData('text/plain'); save(Object.fromEntries(Object.entries(values).filter(([, value]) => value !== id))); }}>
      {choices.map(choice => <button key={choice.id} type="button" className="exam-transition-chip" draggable aria-pressed={selected === choice.id} hidden={!question.allowReuse && Object.values(values).includes(choice.id)} onClick={() => slots.length === 1 ? place(slots[0].id, choice.id) : setSelected(choice.id)} onDragStart={event => { event.dataTransfer.setData('text/plain', choice.id); setSelected(choice.id); }}><ExamText text={choice.text} html={choice.html} /></button>)}
    </div>
    <small className="exam-transition-help" role="status">{selected ? 'Choose a blank for the selected word.' : 'Drag a word into each blank, or choose a word and then a blank. Click a filled blank to clear it.'}</small>
    {lines.map((line, lineIndex) => <p className="exam-transition-sentence" key={lineIndex}>{lineIndex === 0 && question.transitionSentenceNumber ? <span>{question.transitionSentenceNumber} </span> : null}{line.split(/(\{\{[\w-]+\}\})/g).map((part, index) => {
      const id = /^\{\{([\w-]+)\}\}$/.exec(part)?.[1];
      if (!id) return <ExamText key={index} text={part} />;
      const choice = choices.find(choice => choice.id === values[id]);
      return <button key={index} type="button" className={`exam-transition-blank${choice ? ' is-filled' : ''}`} aria-label={`Blank ${slots.findIndex(slot => slot.id === id) + 1}${choice ? `: ${choice.text}. Click to clear` : ''}`} draggable={Boolean(choice)} onClick={() => selected ? place(id, selected) : remove(id)} onKeyDown={event => { if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); remove(id); } }} onDragOver={event => event.preventDefault()} onDragStart={event => { if (choice) event.dataTransfer.setData('text/plain', choice.id); }} onDrop={event => { event.preventDefault(); place(id, event.dataTransfer.getData('text/plain')); }}><ExamText text={choice?.text || ''} html={choice?.html} /></button>;
    })}</p>)}
  </div>;
}
