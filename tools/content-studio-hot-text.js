/* Hot Text uses the same choice IDs and answer keys as the TestNav player. */
const StudioHotText = {
  create(question) {
    const choices = (question.choices || []).filter(choice => choice.text);
    const selectionHtml = choices.length
      ? choices.map(choice => `<span data-choice-id="${escapeHtml(choice.id)}">${escapeHtml(choice.text)}</span>`).join(' ')
      : '';
    return {type: question.type === 'multi_select' ? 'multi_select' : 'multiple_choice', choices,
      selectionHtml: `<blockquote data-boxed="true">${selectionHtml}</blockquote>`,
      ...(question.type === 'multi_select' ? {correctChoiceIds: question.correctChoiceIds || [], requiredSelections: question.requiredSelections}
        : {correctChoiceId: question.correctChoiceId || ''})};
  },

  mount(root, question, onChange) {
    if (!root) return;
    root.innerHTML = `<label class="field"><span>Selectable text</span></label>
      <p class="field-note">Enter the excerpt. Select a word or phrase in it, then choose Mark phrase.</p>
      <div class="rich-editor-content studio-hot-text" role="textbox" aria-label="Selectable text" aria-multiline="true" contenteditable="true"></div>
      <button class="secondary" type="button" data-mark>Mark phrase</button>
      <span role="status"></span><fieldset><legend>Correct answer</legend><div data-keys></div></fieldset>`;
    const editor = root.querySelector('[contenteditable]');
    editor.innerHTML = DocumentImport.sanitizeRichText(question.selectionHtml);
    const status = root.querySelector('[role=status]');
    const keys = root.querySelector('[data-keys]');
    const changed = () => { onChange(); root.dispatchEvent(new Event("hot-text-change")); };
    const markers = () => [...editor.querySelectorAll('[data-choice-id]')];
    const answerIds = () => question.correctChoiceIds || (question.correctChoiceId ? [question.correctChoiceId] : []);
    const setAnswer = ids => {
      if (ids.length > 1 || (question.type === 'multi_select' && ids.length === 0)) {
        question.type = 'multi_select'; question.correctChoiceIds = ids; question.requiredSelections = ids.length;
        delete question.correctChoiceId;
      } else {
        question.type = 'multiple_choice'; question.correctChoiceId = ids[0] || '';
        delete question.correctChoiceIds; delete question.requiredSelections;
      }
    };
    function renderKeys() {
      keys.replaceChildren();
      markers().forEach(marker => {
        const row = document.createElement('div'), label = document.createElement('label');
        const check = document.createElement('input');
        check.type = 'checkbox'; check.checked = answerIds().includes(marker.dataset.choiceId);
        label.append(check, ' ' + marker.textContent);
        check.onchange = () => {
          setAnswer(markers().filter((_, i) => keys.querySelectorAll('input')[i].checked).map(node => node.dataset.choiceId));
          changed();
        };
        const remove = document.createElement('button');
        remove.type = 'button'; remove.className = 'secondary'; remove.textContent = 'Unmark';
        remove.setAttribute('aria-label', 'Unmark ' + marker.textContent);
        remove.onclick = () => { marker.replaceWith(...marker.childNodes); sync(); };
        row.append(label, remove); keys.append(row);
      });
    }
    function sync() {
      const previousKeys = answerIds(), nextKeys = [];
      question.choices = markers().map((marker, index) => {
        const id = String.fromCharCode(65 + index);
        if (previousKeys.includes(marker.dataset.choiceId)) nextKeys.push(id);
        marker.dataset.choiceId = id;
        return {id, text: marker.textContent.trim(), html: DocumentImport.sanitizeRichText(marker.innerHTML)};
      });
      setAnswer(nextKeys);
      question.selectionHtml = DocumentImport.sanitizeRichText(editor.innerHTML) || '<p></p>';
      renderKeys(); changed();
    }
    editor.oninput = sync;
    editor.onpaste = event => { event.preventDefault(); document.execCommand('insertText', false, event.clipboardData.getData('text/plain')); };
    editor.ondrop = event => event.preventDefault();
    editor.onbeforeinput = event => {
      if (['insertParagraph','insertLineBreak'].includes(event.inputType) && document.getSelection()?.anchorNode?.parentElement?.closest('[data-choice-id]')) event.preventDefault();
    };
    let lastRange;
    for (const event of ['keyup','mouseup','focusout']) editor.addEventListener(event, () => {
      const selection = document.getSelection();
      if (selection?.rangeCount && editor.contains(selection.getRangeAt(0).commonAncestorContainer)) lastRange = selection.getRangeAt(0).cloneRange();
    });
    root.querySelector('[data-mark]').onmousedown = event => event.preventDefault();
    root.querySelector('[data-mark]').onclick = () => {
      const selection = document.getSelection();
      const range = selection?.rangeCount && editor.contains(selection.getRangeAt(0).commonAncestorContainer) ? selection.getRangeAt(0) : lastRange;
      if (!range || !editor.contains(range.commonAncestorContainer) || !range.toString().trim() || markers().some(node => range.intersectsNode(node)) ||
          range.cloneContents().querySelector('p,div,blockquote,br')) {
        status.textContent = 'Select unmarked text within one paragraph.'; return;
      }
      if (markers().length >= 8) { status.textContent = 'A question can have up to eight selectable phrases.'; return; }
      const marker = document.createElement('span');
      marker.dataset.choiceId = 'new';
      marker.append(range.extractContents()); range.insertNode(marker);
      selection?.removeAllRanges(); lastRange = null; status.textContent = ''; sync();
    };
    renderKeys();
  },
};
