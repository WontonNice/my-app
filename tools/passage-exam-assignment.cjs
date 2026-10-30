/* Shared by publication and the editor's unsaved Exam Builder draft. */
var PassageExamAssignment = (() => {
  function assign(draft, passage, passages) {
    const next = { ...draft, readingPassageIds: [...(draft.readingPassageIds || [])], revisingEditingPartAPassageIds: [...(draft.revisingEditingPartAPassageIds || [])], standaloneItemIds: [...(draft.standaloneItemIds || [])] };
    const field = passage.section === 'revising_editing_a' ? 'revisingEditingPartAPassageIds' : 'readingPassageIds';
    for (const section of ['readingPassageIds', 'revisingEditingPartAPassageIds']) {
      next[section] = next[section].filter(id => id !== passage.id || section === field);
    }
    if (!next[field].includes(passage.id)) next[field].push(passage.id);
    return next;
  }
  return { assign };
})();
if (typeof module !== 'undefined') module.exports = PassageExamAssignment;
