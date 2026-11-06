const StudioHotSpot = {
  defaultRegion(index) {
    return {x:5 + (index % 4) * 23, y:10 + Math.floor(index / 4) * 45, width:18, height:30};
  },
  settings(question) {
    const regions = question.choices.some(choice => choice.hotSpotRegion);
    return `<label class="field"><span>Hot Spot layout</span><select data-spot-layout>
      <option value="figures">Selectable figures</option><option value="regions" ${regions ? 'selected' : ''}>Regions on one diagram</option></select></label>
      <label class="field"><span>Student selection</span><select data-spot-count>
      <option value="single">One target</option><option value="multiple" ${question.type === 'multi_select' ? 'selected' : ''}>Multiple targets</option></select></label>
      <p class="field-note">${regions ? 'Upload the question diagram. Draw each target on the image or enter its bounds below.' : 'Add one image per target below and mark the correct target or targets.'}</p>
      ${regions && question.image?.src ? `<label class="field"><span>Target to draw</span><select data-spot-target>${question.choices.map(choice => `<option value="${escapeHtml(choice.id)}">${escapeHtml(choice.id)} · ${escapeHtml(choice.text || 'Target')}</option>`).join('')}</select></label>
      <div class="studio-spot-diagram" data-spot-diagram><img src="${escapeHtml(question.image.src)}" alt="${escapeHtml(question.image.alt)}" draggable="false">
      ${question.choices.map(choice => `<span data-spot-outline="${escapeHtml(choice.id)}" aria-hidden="true">${escapeHtml(choice.id)}</span>`).join('')}</div>` : ''}`;
  },
  regionFields(choice) {
    if (!choice.hotSpotRegion) return '';
    return `<div class="question-grid">${Object.entries({x:'Left',y:'Top',width:'Width',height:'Height'}).map(([key,label]) =>
      `<label class="field"><span>${label} (%)</span><input type="number" min="0" max="100" step="any" data-spot-region="${key}" value="${Number(choice.hotSpotRegion[key])}"></label>`).join('')}</div>`;
  },
  bind(root, question) {
    const layout = root.querySelector('[data-spot-layout]');
    if (!layout) return;
    const diagram = root.querySelector('[data-spot-diagram]');
    const paint = (choice, region) => {
      const outline = diagram?.querySelector(`[data-spot-outline="${choice.id}"]`);
      if (outline && region) Object.assign(outline.style, {left:region.x+'%',top:region.y+'%',width:region.width+'%',height:region.height+'%'});
    };
    if (diagram) {
      question.choices.forEach(choice => paint(choice, choice.hotSpotRegion));
      const point = event => {
        const bounds = diagram.getBoundingClientRect();
        const percent = value => Math.max(0, Math.min(100, Math.round(value * 100)));
        return {x:percent((event.clientX-bounds.left)/bounds.width), y:percent((event.clientY-bounds.top)/bounds.height)};
      };
      let drag;
      diagram.onpointerdown = event => {
        if (event.button !== 0 || drag) return;
        const choice = question.choices.find(item => item.id === root.querySelector('[data-spot-target]').value);
        if (!choice) return;
        drag = {id:event.pointerId, start:point(event), choice};
        diagram.setPointerCapture(event.pointerId);
      };
      diagram.onpointermove = event => {
        if (!drag || drag.id !== event.pointerId) return;
        const end = point(event), {start} = drag;
        drag.region = {x:Math.min(start.x,end.x),y:Math.min(start.y,end.y),width:Math.abs(start.x-end.x),height:Math.abs(start.y-end.y)};
        paint(drag.choice, drag.region);
      };
      diagram.onpointerup = event => {
        if (!drag || drag.id !== event.pointerId) return;
        diagram.onpointermove(event);
        const {choice,region} = drag; drag = null;
        if (region.width && region.height) {
          choice.hotSpotRegion = region;
          const row = root.querySelector(`[data-math-choice-index="${question.choices.indexOf(choice)}"]`);
          row?.querySelectorAll('[data-spot-region]').forEach(input => { input.value = region[input.dataset.spotRegion]; });
          markMathDirty(); renderMathPreview();
        } else paint(choice, choice.hotSpotRegion);
      };
      diagram.onlostpointercapture = () => {
        if (drag) { paint(drag.choice, drag.choice.hotSpotRegion); drag = null; }
      };
    }
    layout.onchange = () => {
      question.choices.forEach((choice, index) => {
        if (layout.value === 'regions') choice.hotSpotRegion = this.defaultRegion(index);
        else delete choice.hotSpotRegion;
      });
      markMathDirty(); renderMathBuilder();
    };
    root.querySelector('[data-spot-count]').onchange = event => {
      const keys = question.correctChoiceIds || (question.correctChoiceId ? [question.correctChoiceId] : []);
      if (event.target.value === 'multiple') {
        question.type = 'multi_select'; question.correctChoiceIds = keys; question.requiredSelections = keys.length;
        delete question.correctChoiceId;
      } else {
        question.type = 'multiple_choice'; question.correctChoiceId = keys.length === 1 ? keys[0] : '';
        delete question.correctChoiceIds; delete question.requiredSelections;
      }
      markMathDirty(); renderMathBuilder();
    };
    root.querySelectorAll('[data-spot-region]').forEach(input => {
      input.oninput = () => {
        const choice = question.choices[Number(input.closest('[data-math-choice-index]').dataset.mathChoiceIndex)];
        choice.hotSpotRegion[input.dataset.spotRegion] = input.valueAsNumber;
        paint(choice, choice.hotSpotRegion);
        markMathDirty(); renderMathPreview();
      };
    });
  },
};
