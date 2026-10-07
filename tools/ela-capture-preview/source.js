let questionNumber = 1;
const choices = [...document.getElementById('choices').children];
const el = id => document.getElementById(id);
function reset() {
  el('prompt').textContent = `Question ${questionNumber}: Which statement best expresses the central idea?`;
  choices.forEach(button => { button.disabled = false; button.classList.remove('selected'); button.querySelector('.marker').textContent = ''; });
  el('submit').hidden = false; el('submit').disabled = true; el('show').hidden = el('explanation').hidden = el('feedback').hidden = true;
}
choices.forEach((button, index) => button.addEventListener('click', () => {
  choices.forEach(b => b.classList.remove('selected')); button.classList.add('selected'); el('submit').disabled = false;
  parent.fixtureEvent(`Selected ${String.fromCharCode(65 + index)}`);
}));
el('submit').addEventListener('click', () => {
  choices.forEach(button => { button.disabled = true; }); choices[1].querySelector('.marker').textContent = '\n✓ Correct answer';
  el('submit').hidden = true; el('show').hidden = el('feedback').hidden = false; el('feedback').textContent = 'Temporary answer submitted. Correct answer: B.';
  parent.fixtureEvent('Submitted once · source key B');
});
el('show').addEventListener('click', () => { el('show').hidden = true; el('explanation').hidden = false; parent.fixtureEvent('Revealed full explanation'); });
el('next').addEventListener('click', () => { questionNumber++; reset(); parent.fixtureEvent(`Next question ${questionNumber} ready`); });
reset();
