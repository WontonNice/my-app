/* Shared by publication and the editor's unsaved Exam Builder draft. */
var PassageExamAssignment = (() => {
  function assign(draft, passage, passages) {
    const next = { ...draft, readingPassageIds: [...(draft.readingPassageIds || [])], revisingEditingPartAPassageIds: [...(draft.revisingEditingPartAPassageIds || [])], standaloneItemIds: [...(draft.standaloneItemIds || [])] };
    const field = passage.section === 'revising_editing_a' ? 'revisingEditingPartAPassageIds' : 'readingPassageIds';
    const byId = new Map(passages.map(item => [item.id, item]));
    const family = passage.title.trim().toLowerCase();
    for (const section of ['readingPassageIds', 'revisingEditingPartAPassageIds']) {
      next[section] = next[section].filter(id => id === passage.id ? section === field : byId.get(id)?.title.trim().toLowerCase() !== family);
    }
    if (!next[field].includes(passage.id)) next[field].push(passage.id);
    return next;
  }
  return { assign };
})();
if (typeof module !== 'undefined') module.exports = PassageExamAssignment;
