const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const invalidOrder = () => new Error('Source question order must contain every selected question exactly once.');

/** Adding/removing selections alone does not constitute a manual reorder. */
export function selectionOrderChanged(previous = [], next = []) {
  return !same(previous.filter(id => next.includes(id)), next.filter(id => previous.includes(id)));
}

export function reconcileExamQuestionOrder({ requestedOrder, existingOrder, englishIds, mathIds, reorderedEnglishGroups = [] }) {
  const explicit = requestedOrder != null && !same(requestedOrder, existingOrder);
  const order = requestedOrder ?? existingOrder;
  if (order == null) return undefined;
  const selected = [...englishIds, ...mathIds];
  if (!Array.isArray(order) || (explicit && (new Set(order).size !== order.length || order.some(id => !selected.includes(id)) || selected.some(id => !order.includes(id))))) throw invalidOrder();
  const seen = new Set();
  const retained = [...order, ...selected].filter(id => selected.includes(id) && !seen.has(id) && seen.add(id));
  let english = retained.filter(id => englishIds.includes(id));
  if (!explicit) for (const blocks of reorderedEnglishGroups) {
    const reordered = blocks.map(block => block.filter(id => english.includes(id))).filter(block=>block.length);
    const blockForId = new Map(reordered.flatMap((block,index)=>block.map(id=>[id,index])));
    const replaced = new Set();
    let index = 0;
    // Replace whole passage blocks, not individual slots: different passage
    // lengths must not split one passage around an independent question.
    english = english.flatMap(id => {
      if (!blockForId.has(id)) return [id];
      const originalBlock = blockForId.get(id);
      if (replaced.has(originalBlock)) return [];
      replaced.add(originalBlock);
      return reordered[index++];
    });
  }
  return [...english, ...retained.filter(id => mathIds.includes(id))];
}
