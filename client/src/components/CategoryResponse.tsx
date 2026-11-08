import { useState, type KeyboardEvent, type DragEvent } from 'react';
import type { ExamQuestion } from '../content/exams/types';
import { placeCategoryItem } from '../lib/categoryPlacement';

/** The exam's category/table interaction, shared with authoring and preview. */
export function CategoryResponse({question, answer, onChange, standalone = false}: {
  question: ExamQuestion; answer: Record<string, string>;
  onChange: (answer: Record<string, string>) => void; standalone?: boolean;
}) {
  const [selected, setSelected] = useState('');
  const [limited, setLimited] = useState(false);
  const table = question.type === 'table_match';
  const prefix = table ? 'exam-table-match' : standalone ? 'exam-standalone-category' : 'exam-category';
  const place = (id: string, target?: string) => {
    if (!question.items?.some(item => item.id === id)) return;
    if (target) {
      const next = placeCategoryItem(table ? {...question, categoryCapacity: 1} : question, answer, id, target);
      if (next === answer) { setLimited(true); return; }
      onChange(next);
    }
    else { const next = {...answer}; delete next[id]; onChange(next); }
    setLimited(false); setSelected('');
  };
  const keyboard = (event: KeyboardEvent<HTMLElement>, target?: string) => {
    if (event.target === event.currentTarget && ['Enter', ' '].includes(event.key)) { event.preventDefault(); place(selected, target); }
  };
  const drop = (event: DragEvent<HTMLElement>, target?: string) => { event.preventDefault(); place(event.dataTransfer.getData('text/plain'), target); };
  const cards = (target?: string) => question.items?.filter(item => target ? answer[item.id] === target : !answer[item.id]).map(item => <button
    className={`${prefix}-card${target ? ' is-placed' : ''}${selected === item.id ? ' is-selected' : ''}`} key={item.id} type="button" draggable
    onClick={event => {event.stopPropagation(); setSelected(current => current === item.id ? '' : item.id);}}
    onDragStart={event => {event.dataTransfer.setData('text/plain', item.id); setSelected(item.id);}}
    onKeyDown={event => {if (target && ['Delete', 'Backspace'].includes(event.key)) {event.preventDefault(); place(item.id);}}}>
    {item.html ? <span dangerouslySetInnerHTML={{__html: item.html}} /> : item.text}
  </button>);
  const targetProps = (id: string) => ({tabIndex: 0, onClick: () => place(selected, id), onKeyDown: (event: KeyboardEvent<HTMLElement>) => keyboard(event, id), onDragOver: (event: DragEvent<HTMLElement>) => event.preventDefault(), onDrop: (event: DragEvent<HTMLElement>) => drop(event, id)});
  return <div className={table ? prefix : `${prefix}-sort${question.categoryCapacity === 1 ? ' is-single-capacity' : ''}${question.categories?.length === 1 ? ' is-single-category' : ''}`}>
    <div className={`${prefix}-bank${selected && answer[selected] ? ' is-return-target' : ''}`} role="group" tabIndex={0} aria-label="Answer choice bank. Drop an answer here to undo a selection."
      onClick={() => place(selected)} onKeyDown={event => keyboard(event)} onDragOver={event => event.preventDefault()} onDrop={event => drop(event)}>{cards()}</div>
    {table ? <table className="exam-table-match-table"><thead><tr><th scope="col">{question.tableHeaders?.row ?? 'Rows'}</th><th scope="col">{question.tableHeaders?.answer ?? 'Answer'}</th></tr></thead>
      <tbody>{question.categories?.map(category => <tr key={category.id}><th scope="row">{category.title}</th><td className="exam-table-match-target" aria-label={category.title} {...targetProps(category.id)}><div className="exam-table-match-slot">{cards(category.id)}</div></td></tr>)}</tbody></table>
      : <div className={`${prefix}-target-grid`}>{question.categories?.map(category => <section key={category.id} className={`${prefix}-target`} role="group" aria-label={`${category.title}. Select an answer, then press Enter here to place it.`} {...targetProps(category.id)}><h2>{category.title}</h2><div className={`${prefix}-target-items`}>{cards(category.id)}</div></section>)}</div>}
    {limited && <section aria-label="Choice limit warnings" aria-live="polite" className="exam-choice-warning-stack"><article className="exam-choice-warning"><button type="button" aria-label="Close warning" onClick={() => setLimited(false)}>x</button><p>You are permitted a <strong>maximum of {question.requiredPlacements} choices</strong> for this question.</p><p>Please unselect one of your choices before making another choice.</p></article></section>}
  </div>;
}
