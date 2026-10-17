/* Clipboard and cursor-position media reuse the existing math image API. */
const studioImages = {
  fileFromPaste(event) {
    return Array.from(event.clipboardData?.items || []).find(item => item.kind === 'file' && item.type.startsWith('image/'))?.getAsFile();
  },
  async clipboard() {
    if (!navigator.clipboard?.read) throw new Error('Click in the question and press Ctrl+V (⌘V on Mac) to paste your copied image.');
    for (const item of await navigator.clipboard.read()) {
      const type = item.types.find(type => type.startsWith('image/'));
      if (type) return new File([await item.getType(type)], 'pasted-image.' + type.split('/')[1], { type });
    }
    throw new Error('Copy an image or screenshot first, then paste it here.');
  },
  range(editor) {
    const selection = getSelection();
    if (selection?.rangeCount && editor.contains(selection.getRangeAt(0).commonAncestorContainer)) return selection.getRangeAt(0).cloneRange();
    if (editor.studioSelection && editor.contains(editor.studioSelection.commonAncestorContainer)) return editor.studioSelection.cloneRange();
    const range = document.createRange(); range.selectNodeContents(editor); range.collapse(false); return range;
  },
  async insert(editor, file, range = this.range(editor)) {
    if (!file || !editor.isConnected) return;
    const question = app.mathDraft.questions[app.selectedMathQuestionIndex], assessmentId = app.selectedMathAssessmentId;
    const marker = document.createElement('span'); marker.className = 'studio-image-upload'; marker.contentEditable = 'false'; marker.textContent = 'Uploading image…';
    // Inserting at a cloned range keeps the image at the intended line while the upload runs.
    range.collapse(false); range.insertNode(marker);
    setStatus('Uploading pasted image…');
    try {
      const dataUrl = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('The image could not be read.')); reader.readAsDataURL(file); });
      const data = await api('/api/math-images', { method: 'POST', body: JSON.stringify({assessmentId, questionId: question.id, dataUrl, fileName: file.name, mimeType: imageUploadMimeType(file), inline: true}) });
      if (!editor.isConnected || app.mathDraft.questions[app.selectedMathQuestionIndex] !== question) { marker.remove(); setStatus('The image uploaded, but the question changed. Paste again in the intended question.'); return; }
      const image = document.createElement('img'); image.src = data.image.src; image.alt = 'Math diagram'; image.width = 360;
      marker.replaceWith(image);
      const caret = document.createRange(); caret.setStartAfter(image); caret.collapse(true); editor.focus({preventScroll:true}); getSelection().removeAllRanges(); getSelection().addRange(caret);
      editor.dispatchEvent(new Event('input', {bubbles:true}));
      this.inspect(editor, image);
      setStatus('Image inserted at the cursor. Add a description below, then save the Math section.', 'success');
    } catch (error) { marker.remove(); setStatus(error.message, 'error'); }
  },
  linePositions(editor) {
    const positions = [];
    const add = (range, label) => positions.push({range, label});
    const start = document.createRange(); start.selectNodeContents(editor); start.collapse(true);
    add(start, 'Before the first line');
    let line = '', number = 0;
    const afterLine = range => {
      number++;
      const text = line.replace(/\s+/g, ' ').trim();
      add(range, `After line ${number}${text ? ': ' + text.slice(0, 65) : ' (blank)'}`);
      line = '';
    };
    const visit = node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue || '';
        let offset = 0;
        for (const part of text.split(/(\n)/)) {
          offset += part.length;
          if (part === '\n') { const range = document.createRange(); range.setStart(node, offset); range.collapse(true); afterLine(range); }
          else line += part;
        }
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.matches('img,figure,.studio-image-upload')) return;
      if (node.matches('.math-visual-token,math-field')) { line += ' [equation] '; return; }
      if (node.tagName === 'BR') { const range = document.createRange(); range.setStartAfter(node); range.collapse(true); afterLine(range); return; }
      Array.from(node.childNodes).forEach(visit);
      if (node !== editor && /^(P|DIV|H[1-6]|LI|BLOCKQUOTE)$/.test(node.tagName) && line.trim()) {
        const range = document.createRange(); range.setStartAfter(node); range.collapse(true); afterLine(range);
      }
    };
    visit(editor);
    const end = document.createRange(); end.selectNodeContents(editor); end.collapse(false);
    add(end, 'After the last line');
    return positions;
  },
  move(editor, image, onPlaced) {
    const panel = editor.closest('.rich-editor-shell').querySelector('.studio-inline-image-controls');
    if (!panel) return;
    editor.studioImagePlacement?.();
    panel.hidden = false;
    panel.classList.add('is-placing-image');
    panel.innerHTML = '<strong>Move image between text lines</strong><p>Choose a line below, or click an exact spot in the text and use the cursor position.</p><label>Image position<select aria-label="Image position between text lines"><option value="cursor">At the cursor — click in the text</option></select></label><button type="button" data-image-place>Place image here</button><button type="button" data-image-cancel>Cancel</button><span role="status" data-image-place-status>Choose where the image should go.</span>';
    const positions = this.linePositions(editor), select = panel.querySelector('select'), place = panel.querySelector('[data-image-place]');
    positions.forEach((position, index) => { const option = document.createElement('option'); option.value = String(index); option.textContent = position.label; select.append(option); });
    let target;
    place.disabled = true;
    const capture = () => {
      const selection = getSelection();
      if (!selection?.rangeCount) return;
      const range = selection.getRangeAt(0), node = range.endContainer.nodeType === Node.ELEMENT_NODE ? range.endContainer : range.endContainer.parentElement;
      if (!editor.contains(range.commonAncestorContainer) || node.closest('math-field,.math-visual-token,img,figure')) return;
      target = range.cloneRange(); target.collapse(false);
      select.value = 'cursor'; place.disabled = false;
      panel.querySelector('[data-image-place-status]').textContent = 'Ready to place at your cursor.';
    };
    const finish = () => {
      editor.removeEventListener('mouseup', capture); editor.removeEventListener('keyup', capture);
      editor.classList.remove('is-placing-image'); panel.classList.remove('is-placing-image');
      delete editor.studioImagePlacement;
    };
    editor.studioImagePlacement = finish;
    editor.classList.add('is-placing-image');
    editor.addEventListener('mouseup', capture); editor.addEventListener('keyup', capture);
    select.onchange = () => {
      target = select.value === 'cursor' ? null : positions[Number(select.value)]?.range.cloneRange();
      place.disabled = !target;
      panel.querySelector('[data-image-place-status]').textContent = target ? 'Ready to place at the selected line.' : 'Click a spot in the text.';
    };
    place.onclick = () => {
      if (!target || !editor.isConnected || !editor.contains(target.commonAncestorContainer)) return;
      const media = image.closest('figure') || image;
      target.insertNode(media);
      finish();
      // Remove the separate question image before publishing the edited prompt,
      // so the shared student player never renders the same image twice.
      onPlaced?.();
      editor.dispatchEvent(new Event('input', {bubbles:true}));
      this.inspect(editor, image);
      setStatus('Image moved between text lines. Save the Math section to keep this position.', 'success');
    };
    panel.querySelector('[data-image-cancel]').onclick = () => { finish(); panel.hidden = true; };
    panel.scrollIntoView({block:'nearest', behavior:'smooth'});
  },
  moveQuestionImage(editor) {
    const question = app.mathDraft.questions[app.selectedMathQuestionIndex], source = question.image;
    if (!source?.src) return;
    const image = document.createElement('img'); image.src = source.src; image.alt = source.alt || ''; image.width = 360;
    if (source.caption) {
      const figure = document.createElement('figure'), caption = document.createElement('figcaption');
      caption.textContent = source.caption; figure.append(image, caption);
    }
    this.move(editor, image, () => {
      delete question.image;
      const imagePanel = document.querySelector('.math-question-image');
      if (imagePanel) { imagePanel.querySelector('.image-editor-preview').textContent = 'Image is now inside the question text.'; imagePanel.querySelectorAll('[data-math-image-field],#remove-math-image,#move-math-image-into-text').forEach(control => { control.disabled = true; }); }
      editor.closest('.rich-editor-shell').querySelector('[data-move-question-image]')?.remove();
    });
  },
  inspect(editor, image) {
    const panel = editor.closest('.rich-editor-shell').querySelector('.studio-inline-image-controls');
    if (!panel) return;
    panel.hidden = false;
    editor.studioImagePlacement?.();
    panel.innerHTML = '<label>Description <input aria-label="Inline image description"></label><label>Width <input aria-label="Inline image width" type="number" min="40" max="1200" step="10"></label><button type="button" data-image-move>Move between text lines</button><button type="button" data-image-remove>Remove image</button><button type="button" data-image-done>Done</button>';
    const description = panel.querySelector('[aria-label="Inline image description"]'), width = panel.querySelector('[aria-label="Inline image width"]');
    description.value = image.alt; width.value = image.getAttribute('width') || '360';
    const changed = () => editor.dispatchEvent(new Event('input',{bubbles:true}));
    description.oninput = () => { image.alt = description.value; changed(); };
    width.onchange = () => { image.width = Math.max(40, Math.min(1200, Number(width.value) || 360)); changed(); };
    panel.querySelector('[data-image-move]').onclick = () => this.move(editor, image);
    panel.querySelector('[data-image-remove]').onclick = () => { (image.closest('figure') || image).remove(); panel.hidden = true; changed(); editor.focus(); };
    panel.querySelector('[data-image-done]').onclick = () => { panel.hidden = true; editor.focus(); };
  },
  bind(root) {
    root.querySelectorAll('[data-rich-kind^="math-"]').forEach(editor => {
      if (editor.dataset.imagesBound) return; editor.dataset.imagesBound = 'true';
      const shell = editor.closest('.rich-editor-shell'); if (!shell) return;
      const bar = document.createElement('div'); bar.className = 'studio-image-insert';
      bar.innerHTML = '<button type="button" data-insert-image>Insert image</button><button type="button" data-paste-image>Paste image</button><span>Paste at the cursor · Ctrl+V / ⌘V · Click an image to resize or move between lines</span><input hidden type="file" accept="image/png,image/jpeg,image/gif,image/webp,.svgz">';
      if (editor.dataset.richKind === 'math-prompt' && app.mathDraft.questions[app.selectedMathQuestionIndex]?.image?.src) {
        const move = document.createElement('button'); move.type = 'button'; move.dataset.moveQuestionImage = ''; move.textContent = 'Move question image between text lines'; bar.prepend(move);
      }
      shell.append(bar);
      const panel = document.createElement('div'); panel.className = 'studio-inline-image-controls'; panel.hidden = true; shell.append(panel);
      let range;
      bar.onmousedown = event => { if (event.target.closest('button')) { event.preventDefault(); range = this.range(editor); } };
      bar.querySelector('[data-move-question-image]')?.addEventListener('click', () => this.moveQuestionImage(editor));
      bar.querySelector('[data-insert-image]').onclick = () => { range ||= this.range(editor); bar.querySelector('input').click(); };
      bar.querySelector('input').onchange = event => this.insert(editor, event.target.files?.[0], range || this.range(editor));
      bar.querySelector('[data-paste-image]').onclick = async () => { const target = range || this.range(editor); try { await this.insert(editor, await this.clipboard(), target); } catch (error) { setStatus(error.message, 'error'); } };
      editor.addEventListener('click', event => { if (event.target.tagName === 'IMG') this.inspect(editor,event.target); });
    });
    const moveQuestion = root.querySelector('#move-math-image-into-text');
    if (moveQuestion) moveQuestion.onclick = () => { const editor = root.querySelector('[data-rich-kind="math-prompt"]'); if (editor) this.moveQuestionImage(editor); };
    const button = root.querySelector('#paste-math-image');
    if (button) button.onclick = async () => { try { await uploadMathImage(await this.clipboard()); } catch(error) { setStatus(error.message,'error'); } };
    root.querySelectorAll('[data-paste-choice-image]').forEach(button => button.onclick = async () => { try { await uploadMathChoiceImage(Number(button.dataset.pasteChoiceImage), await this.clipboard()); } catch(error) { setStatus(error.message,'error'); } });
  },
};
