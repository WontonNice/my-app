import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ExamQuestion } from '../content/exams';
import type { SelectedAnswer } from '../lib/examResults';

/** Source hot-text selections keep their context and reuse the normal choice answer format. */
export function InlineTextSelection({question, answer, onChange, correctIds = [], scrollable = false}: {
  question: ExamQuestion;
  answer?: SelectedAnswer;
  onChange?: (answer: SelectedAnswer) => void;
  correctIds?: string[];
  scrollable?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const focusAfterUpdate = useRef<string | null>(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const maxChoices = question.requiredSelections || question.choices?.length || 1;
  useEffect(() => {
    if (!showLimitWarning) return;
    const timer = window.setTimeout(() => setShowLimitWarning(false), 5000);
    return () => window.clearTimeout(timer);
  }, [showLimitWarning]);
  useEffect(() => { setShowLimitWarning(false); }, [question.id]);
  const selected = typeof answer === 'string' ? [answer] : Array.isArray(answer) ? answer : [];
  const markup = useMemo(() => {
    const doc = new DOMParser().parseFromString(question.selectionHtml || '', 'text/html');
    doc.body.querySelectorAll('script,style,iframe,object,embed,svg,math,link,meta,input,button').forEach(node => node.remove());
    doc.body.querySelectorAll('*').forEach(node => {
      for (const attr of Array.from(node.attributes)) if (!['data-choice-id','data-boxed','data-no-break'].includes(attr.name)) node.removeAttribute(attr.name);
      if(node.getAttribute('data-boxed') !== 'true')node.removeAttribute('data-boxed');
      if(node.getAttribute('data-no-break') !== 'true')node.removeAttribute('data-no-break');
    });
    // Imported hot-text paragraphs retain their printed number as a leading strong tag.
    doc.body.querySelectorAll('p > strong:first-child').forEach(node => {
      if (/^\d+$/.test(node.textContent?.trim() || '')) node.className = 'exam-selection-paragraph-number';
    });
    doc.body.querySelectorAll('[data-choice-id]').forEach(node => {
      const id = node.getAttribute('data-choice-id') || '';
      if (!question.choices?.some(choice => choice.id === id)) { node.removeAttribute('data-choice-id'); return; }
      // A span can fragment across wrapped lines, like TestNav hot text.
      // Native buttons remain atomic even with display:inline.
      const button = doc.createElement('span');
      button.setAttribute('role','checkbox');
      button.tabIndex = onChange ? 0 : -1;
      button.dataset.choiceId = id;
      button.className = `exam-text-selection${selected.includes(id) ? ' is-selected' : ''}${correctIds.includes(id) ? ' is-correct-answer' : ''}`;
      button.setAttribute('aria-checked', String(selected.includes(id)));
      if(!onChange)button.setAttribute('aria-disabled','true');
      button.innerHTML = node.innerHTML;
      node.replaceWith(button);
    });
    return doc.body.innerHTML;
  }, [question, answer, onChange, correctIds.join('|')]);
  useLayoutEffect(() => {
    const id = focusAfterUpdate.current;
    focusAfterUpdate.current = null;
    if (id) Array.from(container.current?.querySelectorAll<HTMLElement>('[data-choice-id]') || [])
      .find(node => node.dataset.choiceId === id)?.focus({ preventScroll: true });
  }, [markup]);
  function select(target: EventTarget | null) {
    const button = (target as Element | null)?.closest<HTMLElement>('.exam-text-selection[data-choice-id]');
    const id = button?.dataset.choiceId;
    if (!id || !onChange) return;
    if (button.contains(document.activeElement)) focusAfterUpdate.current = id;
    if (question.type === 'multiple_choice') onChange(id);
    else if (selected.includes(id)) onChange(selected.filter(value => value !== id));
    else if (selected.length < maxChoices) onChange([...selected,id]);
    else setShowLimitWarning(true);
  }
  return <><div ref={container} className={`exam-inline-selection${scrollable ? ' is-scrollable' : ''}`} role={scrollable ? 'region' : undefined} aria-label={scrollable ? 'Selectable passage excerpt' : undefined} tabIndex={scrollable ? 0 : undefined} onClick={event => select(event.target)} onKeyDown={event => {
    if(onChange && (event.key === 'Enter' || event.key === ' ') && (event.target as Element).closest('.exam-text-selection')) { event.preventDefault(); select(event.target); }
  }} dangerouslySetInnerHTML={{__html:markup}} />
    {showLimitWarning && <section aria-label="Choice limit warnings" aria-live="polite" className="exam-choice-warning-stack"><article className="exam-choice-warning"><button aria-label="Close warning" type="button" onClick={() => setShowLimitWarning(false)}>x</button><p>You are permitted a <strong>maximum of {maxChoices} choices</strong> for this question.</p><p>Please unselect one of your choices before making another choice.</p></article></section>}
  </>;
}
