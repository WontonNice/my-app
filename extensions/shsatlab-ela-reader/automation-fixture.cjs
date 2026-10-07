const reader = require('./reader.js');
const { create } = require('./automation.js');
const { identity, merge } = require('./queue.js');

// In-memory visible DOM fixture; no source account, network, or filesystem writes.
function fixture(options = {}) {
  const state = { url: 'https://www.shsatlab.com/units/unit-1/practice?src=topics', number: 1, revealed: !!options.revealed, expanded: !!options.expanded, selected: '', time: 0, queue: [], events: [], ...options };
  class Element {
    constructor(text = '', tagName = 'DIV', selectors = {}) { this.value = text; this.tagName = tagName; this.selectors = selectors; this.children = []; }
    get innerText() { return typeof this.value === 'function' ? this.value() : this.value; }
    getClientRects() { return (typeof this.hidden === 'function' ? this.hidden() : this.hidden) ? [] : [{}]; }
    closest(selector) { return selector.includes('rounded-2xl') ? this.card : null; }
    querySelector(selector) { return this.selectors[selector] ?? null; }
    querySelectorAll(selector) { return this.selectors[selector] ?? []; }
    getAttribute() { return null; }
    click() { state.events.push(this.name ?? this.innerText); this.action?.(); }
  }
  const prompt = new Element(() => `Which theme fits question ${state.number}?`);
  const choices = ['A', 'B', 'C', 'D'].map(id => {
    const el = new Element(() => `${id}\nChoice ${id}${state.revealed && id === (state.key ?? 'B') ? '\n✓ Correct answer' : ''}`, 'BUTTON', { '.math-text': new Element(`Choice ${id}`) });
    Object.defineProperty(el, 'disabled', { get: () => state.revealed || !!state.choicesDisabled });
    el.name = `choice-${id}`; el.action = () => { state.selected = id; state.onSelect?.(state); }; return el;
  });
  const group = new Element(); group.children = choices; group.previousElementSibling = new Element('', 'DIV', { 'p .math-text': prompt });
  const passage = new Element(); passage.children = [new Element('First paragraph.'), new Element('    A preserved second line.')]; passage.hidden = () => !!state.passageHidden;
  const wrongItems = ['A', 'C', 'D'].map(id => new Element('', 'LI', { span: new Element(id), p: new Element(`Why ${id} is wrong.`) }));
  const headings = ["Iko's Quick Read", 'Step-by-step solution', 'Concept tip', "Why the other choices don't work"].map(label => {
    const heading = new Element(label, 'H3'); heading.hidden = () => !state.expanded;
    heading.card = new Element(`${label}\n${label === 'Step-by-step solution' ? '1\nB is supported by the passage.' : 'Full explanation content.'}`, 'DIV', { li: wrongItems });
    heading.card.hidden = () => !state.expanded; return heading;
  });
  const main = new Element('', 'MAIN', { 'div[class*="space-y-2"]': [group], '.prose': [passage] });
  const submit = new Element('Submit Answer', 'BUTTON'); submit.name = 'submit'; submit.hidden = () => state.revealed || !!state.noSubmit;
  Object.defineProperty(submit, 'disabled', { get: () => !state.selected || !!state.submitDisabled });
  submit.action = () => { if (!state.noReveal) state.revealed = true; state.onSubmit?.(state); };
  const show = new Element('Not quite — See explanation', 'BUTTON'); show.name = 'show'; show.hidden = () => !state.revealed || state.expanded;
  show.action = () => { if (!state.noExplanation) state.expanded = true; };
  const next = new Element(options.nextLabel ?? 'Next Question', 'BUTTON'); next.name = 'next'; next.hidden = () => !state.expanded || !!state.noNext;
  next.action = () => { state.onNext?.(state); if (!state.nextStuck) { state.number++; state.revealed = state.expanded = false; state.selected = ''; } };
  const document = {
    querySelector: () => main,
    querySelectorAll: selector => selector === 'header p' ? [new Element(state.topic ?? 'Central Idea & Theme')] : selector === 'p' && state.revealed ? [new Element(`Correct Answer: ${state.conflict ? 'C' : state.key ?? 'B'}) Choice`)] : selector === 'h3' ? headings : selector === 'header button' ? [new Element('medium')] : selector === 'button' ? [...choices, submit, show, next, ...(state.extraControls ?? [])] : []
  };
  const controller = create({ reader, identity, document, getUrl: () => state.url,
    now: () => state.time, timeoutMs: 2000, intervalMs: 250,
    wait: async ms => { state.time += ms; await state.onWait?.(state); },
    save: async q => {
      state.events.push('save');
      if (state.failSave) throw new Error('Storage quota exceeded');
      const merged = merge(state.queue, q); state.queue = merged.queue;
      await state.onSave?.(state); return merged;
    }
  });
  return { state, controller, document, reader, Element, headings };
}
module.exports = { fixture };
