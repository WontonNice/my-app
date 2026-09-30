// Shared by the React exam runner, Content Studio, and its student-preview iframe.
// Definitions are plain text; authored HTML is never executed in a popup.
export function createGlossaryRichText(text, definitions, format = 'prose') {
  const escape = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const ranges = [];
  for (const entry of definitions || []) {
    if (!entry?.term?.trim() || !entry?.definition?.trim()) continue;
    const start = text.indexOf(entry.term);
    if (start < 0 || ranges.some((range) => start < range.end && start + entry.term.length > range.start)) continue;
    ranges.push({ start, end: start + entry.term.length, definition: entry.definition });
  }
  ranges.sort((a, b) => a.start - b.start);
  let html = '', cursor = 0;
  for (const range of ranges) {
    html += escape(text.slice(cursor, range.start));
    html += `<span data-glossary-definition="${escape(range.definition)}" role="link" tabindex="0">${escape(text.slice(range.start, range.end))}</span>`;
    cursor = range.end;
  }
  html += escape(text.slice(cursor));
  return (format === 'poem' ? html.split('\n') : html.split(/\n\s*\n/))
    .map((block) => `<${format === 'poem' ? 'div' : 'p'}>${block.replace(/\n/g, '<br>')}</${format === 'poem' ? 'div' : 'p'}>`).join('');
}

export function mountPassageGlossary(root) {
  const doc = root.ownerDocument;
  const view = doc.defaultView;
  let popup = null;
  let anchor = null;
  let drag = null;
  const clamp = (value, max) => Math.max(8, Math.min(value, Math.max(8, max)));

  function close(restoreFocus = true) {
    if (anchor) {
      anchor.setAttribute('aria-expanded', 'false');
      if (restoreFocus && anchor.isConnected) anchor.focus({ preventScroll: true });
    }
    popup?.remove();
    popup = anchor = drag = null;
  }

  function constrain(left, top) {
    if (!popup) return;
    popup.style.left = `${clamp(left, view.innerWidth - popup.offsetWidth - 8)}px`;
    popup.style.top = `${clamp(top, view.innerHeight - popup.offsetHeight - 8)}px`;
  }

  function open(term) {
    const definition = term.getAttribute('data-glossary-definition')?.trim();
    if (!definition) return;
    close(false);
    anchor = term;
    anchor.setAttribute('aria-expanded', 'true');
    popup = doc.createElement('div');
    popup.className = 'exam-glossary-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', 'Glossary Definition');
    const header = doc.createElement('div');
    header.className = 'exam-glossary-header';
    const title = doc.createElement('h2');
    title.textContent = 'Glossary Definition';
    const button = doc.createElement('button');
    button.type = 'button';
    button.className = 'exam-glossary-close';
    button.setAttribute('aria-label', 'Close');
    button.textContent = '×';
    button.addEventListener('click', () => close());
    header.append(title, button);
    const body = doc.createElement('div');
    body.className = 'exam-glossary-body';
    body.tabIndex = 0;
    body.setAttribute('aria-label', 'Glossary definition text');
    const paragraph = doc.createElement('p');
    paragraph.textContent = definition;
    body.append(paragraph);
    popup.append(header, body);
    doc.body.append(popup);
    const rect = term.getBoundingClientRect();
    const top = rect.top >= popup.offsetHeight + 9 ? rect.top - popup.offsetHeight - 1 : rect.bottom + 1;
    constrain(rect.left + rect.width / 2 - popup.offsetWidth / 2, top);
    header.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || event.target.closest('button')) return;
      event.preventDefault();
      drag = { x: event.clientX, y: event.clientY, left: popup.offsetLeft, top: popup.offsetTop };
      header.setPointerCapture(event.pointerId);
    });
    header.addEventListener('pointermove', (event) => {
      if (drag) constrain(drag.left + event.clientX - drag.x, drag.top + event.clientY - drag.y);
    });
    header.addEventListener('pointerup', () => { drag = null; });
    header.addEventListener('pointercancel', () => { drag = null; });
    button.focus({ preventScroll: true });
  }

  function activate(event) {
    const term = event.target instanceof view.Element ? event.target.closest('[data-glossary-definition]') : null;
    if (!term || !root.contains(term) || term.closest('[contenteditable="true"]')) return;
    if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
    if (event.type === 'click' && !view.getSelection()?.isCollapsed) return;
    event.preventDefault();
    event.stopPropagation();
    open(term);
  }
  const escape = (event) => { if (popup && event.key === 'Escape') { event.preventDefault(); close(); } };
  const resize = () => { if (popup) constrain(popup.offsetLeft, popup.offsetTop); };
  const observer = new view.MutationObserver(() => { if (anchor && !root.contains(anchor)) close(false); });
  observer.observe(root, { childList: true, subtree: true });
  root.addEventListener('click', activate);
  root.addEventListener('keydown', activate);
  view.addEventListener('keydown', escape);
  view.addEventListener('resize', resize);
  return {
    close,
    destroy() {
      close(false);
      observer.disconnect();
      root.removeEventListener('click', activate);
      root.removeEventListener('keydown', activate);
      view.removeEventListener('keydown', escape);
      view.removeEventListener('resize', resize);
    },
  };
}
