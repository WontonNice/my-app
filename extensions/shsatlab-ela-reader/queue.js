(function (root) {
  const identity = q => JSON.stringify([q.prompt, q.choices, q.passage?.text ?? ""]);
  const envelope = questions => ({ format: "nathan-tutors-shsatlab-ela-v1", questions });
  function merge(queue, question) {
    const index = queue.findIndex(q => identity(q) === identity(question));
    if (index < 0) return { queue: [...queue, question], updated: false };
    const previous = queue[index];
    if (previous.correctChoiceId && question.correctChoiceId && previous.correctChoiceId !== question.correctChoiceId) throw new Error("Conflicting visible answer key. Previous capture retained.");
    const enriched = { ...question, correctChoiceId: question.correctChoiceId || previous.correctChoiceId, explanation: question.explanation || previous.explanation, incorrectChoiceExplanations: { ...previous.incorrectChoiceExplanations, ...question.incorrectChoiceExplanations } };
    enriched.reviewNotes = enriched.reviewNotes.filter(note => !(enriched.correctChoiceId && note.startsWith("No revealed correct answer")) && !(enriched.explanation && note.startsWith("No revealed explanation")));
    return { queue: queue.map((q, i) => i === index ? enriched : q), updated: true };
  }
  const api = { identity, envelope, merge };
  if (typeof module !== "undefined") module.exports = api;
  else root.NathanLabElaQueue = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
