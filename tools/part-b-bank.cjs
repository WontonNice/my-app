/* Shared Part B source tags and conservative repeat detection. */
var PartBBank = (() => {
  function labels(question) {
    const values = Array.isArray(question?.versionLabels) ? question.versionLabels : [question?.versionLabel];
    const seen = new Set();
    return values.filter(value => typeof value === 'string').map(value => value.trim()).filter(value => {
      const key = value.toLocaleLowerCase();
      if (!value || seen.has(key)) return false;
      seen.add(key); return true;
    });
  }
  function withLabels(question, values) {
    const versionLabels = labels({ versionLabels: values });
    return { ...question, versionLabels, versionLabel: versionLabels[0] || '' };
  }
  function text(value) {
    return String(value || '').replace(/<\/?(?:p|div|br|li)\b[^>]*>/gi, ' ').replace(/<\/?[a-z][^>]*>/gi, '')
      .replace(/&nbsp;|&#160;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;|&#34;/gi, '"').replace(/&#39;|&apos;/gi, "'")
      .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&#(x[0-9a-f]+|\d+);/gi, (match, n) => {
        const number = n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n);
        return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : match;
      }).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
  }
  const rich = (q, field) => text(q[field + 'Html'] || q[field]);
  const answerText = choice => {
    const value = text(choice.html || choice.text);
    // Imported labels sometimes omit the final sentence punctuation in this
    // instruction. Preserve punctuation in actual answer sentences.
    return /^Insert a comma after \w+\.?$/i.test(value) ? value.replace(/\.$/, '') : value;
  };
  function contentKey(q) {
    const instructions = rich(q, 'instructions').replace(/^Read (?:this|the) (?:paragraph|sentence)\.?$/i, '');
    const base = [q.type, rich(q, 'prompt'), rich(q, 'stimulus'), instructions, Number(q.points) || 1];
    if (q.type === 'multiple_choice') base.push((q.choices || []).map(answerText));
    else if (q.type === 'category_sort') base.push((q.items || []).map(answerText), (q.categories || []).map(c => text(c.title)), q.categoryCapacity || 1, q.requiredPlacements || 1);
    else return '';
    return JSON.stringify(base);
  }
  function answerKey(q) {
    if (q.type === 'multiple_choice') {
      const index = (q.choices || []).findIndex(c => c.id === q.correctChoiceId);
      return index < 0 ? '' : String(index);
    }
    const placements = Object.entries(q.correctPlacements || {});
    if (!placements.length) return '';
    const mapped = placements.map(([item, category]) => [(q.items || []).findIndex(i => i.id === item), (q.categories || []).findIndex(c => c.id === category)]);
    return mapped.some(pair => pair.includes(-1)) ? '' : JSON.stringify(mapped.sort((a, b) => a[0] - b[0]));
  }
  function match(a, b) {
    // Identical options can be embedded in different sentences or mark a
    // different occurrence of the same word. These are distinct questions.
    if ((a.selectionHtml || '') !== (b.selectionHtml || '')) return null;
    const stimulusA = rich(a, 'stimulus') || text(a.selectionHtml), stimulusB = rich(b, 'stimulus') || text(b.selectionHtml);
    if (!stimulusA || !stimulusB || !rich(a, 'prompt') || !rich(b, 'prompt')) return null;
    const same = contentKey(a) && contentKey(a) === contentKey(b);
    const keyA = answerKey(a), keyB = answerKey(b);
    // A common generic prompt alone is never evidence of a repeat.
    if (!same && stimulusA !== stimulusB) return null;
    const hasMedia = [a, b].some(q => q.image || /<(?:img|svg|math)\b/i.test(JSON.stringify(q)));
    const targets = q => JSON.stringify(['promptHtml', 'stimulusHtml', 'instructionsHtml'].map(field => [...String(q[field] || '').matchAll(/<(u|sup|sub)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(match => [match[1].toLowerCase(), text(match[2])])));
    const sameTargets = targets(a) === targets(b);
    const canCombine = Boolean(same && keyA && keyA === keyB && !hasMedia && sameTargets);
    const correctContent = q => q.type === 'multiple_choice'
      ? answerText((q.choices || []).find(c => c.id === q.correctChoiceId) || {})
      : JSON.stringify(Object.entries(q.correctPlacements || {}).map(([item, category]) => [answerText((q.items || []).find(i => i.id === item) || {}), text((q.categories || []).find(c => c.id === category)?.title)]).sort());
    // Imports can lose all underlining. A teacher may verify that copy against
    // the formatted source, but two different sets of marked targets stay separate.
    const hasTargets = q => ['promptHtml', 'stimulusHtml', 'instructionsHtml'].some(field => /<(?:u|sup|sub)\b/i.test(q[field] || ''));
    const compatibleTargets = sameTargets || !hasTargets(a) || !hasTargets(b);
    const canVerify = Boolean(a.type === b.type && keyA && keyB && !hasMedia && compatibleTargets && correctContent(a) && correctContent(a) === correctContent(b));
    return {
      canCombine, canVerify,
      label: same ? keyA && keyB && keyA !== keyB ? 'Matching question · conflicting answers' : !sameTargets ? 'Matching text · verify formatting' : 'Matching question' : canVerify ? 'Possible repeat · verify question' : 'Shared paragraph · different question',
      reason: hasMedia ? 'Compare the source images before deciding whether these are the same question.' : !same ? canVerify ? 'The paragraph and keyed answer match, but some details differ. Verify the complete question before combining.' : 'The paragraph is reused, but the prompt, choices or answer differ. Keep separate questions.' : !sameTargets ? 'The underlined text or superscript/subscript targets differ. Check the source formatting before combining.' : !keyA || !keyB ? 'Complete and verify both answer keys before combining.' : keyA !== keyB ? 'The answer keys disagree. Correct the keys before combining.' : 'Same prompt, paragraph, answer choices and correct answer. Formatting, source tags, topics and explanations may differ.',
    };
  }
  function rootId(item, items) {
    const visited = new Set(); let current = item;
    while (current?.duplicateOf && !visited.has(current.id)) {
      visited.add(current.id);
      current = items.find(q => q.id === current.duplicateOf);
    }
    return current?.id || item.id;
  }
  function versions(item, items) {
    const id = rootId(item, items);
    return items.filter(q => rootId(q, items) === id);
  }
  function usage(item, items, tests = []) {
    const ids = new Set(versions(item, items).map(q => q.id));
    return tests.filter(test => (test.standaloneItemIds || []).some(id => ids.has(id))).map(test => ({ id: test.assessmentId, title: test.title }));
  }
  function withSharedTopic(items, id, topic) {
    const item = items.find(q => q.id === id);
    if (!item || typeof topic !== 'string' || !topic.trim()) return syncCanonicalContent(items);
    const root = rootId(item, items);
    return syncCanonicalContent(items.map(q => rootId(q, items) === root ? {...q, topic} : q));
  }
  function syncCanonicalContent(items) {
    return items.map(q => {
      if (!q.duplicateOf || q.canonicalContent !== true) return q;
      const primary = items.find(item => item.id === rootId(q, items));
      if (!primary || primary.duplicateOf) throw new Error('The combined question is missing. Refresh the bank.');
      return withLabels({ ...structuredClone(primary), id: q.id, duplicateOf: primary.id, canonicalContent: true }, labels(q));
    });
  }
  function pairs(items) {
    const active = items.filter(q => !q.duplicateOf), result = [];
    for (let i = 0; i < active.length; i++) for (let j = i + 1; j < active.length; j++) {
      const comparison = match(active[i], active[j]);
      if (comparison) result.push({ left: active[i], right: active[j], ...comparison });
    }
    return result;
  }
  function combine(items, keepId, removeId, { verifiedSameQuestion = false, replaceOtherContent = false, additionalLabels = [] } = {}) {
    const keep = items.find(q => q.id === keepId), other = items.find(q => q.id === removeId);
    if (!keep || !other || keep === other || keep.duplicateOf || other.duplicateOf) throw new Error('Choose two current bank questions. Refresh the repeat checker.');
    const comparison = match(keep, other);
    const replace = verifiedSameQuestion === true && replaceOtherContent === true && Boolean(comparison);
    if (replace && !answerKey(keep)) throw new Error('Complete the chosen copy’s answer key before verifying it.');
    if (!replace && !comparison?.canCombine && !(verifiedSameQuestion === true && comparison?.canVerify)) throw new Error('These questions differ or have unresolved answer keys. Keep them separate until corrected, or explicitly verify a compatible pair.');
    if (!Array.isArray(additionalLabels) || additionalLabels.some(label => typeof label !== 'string')) throw new Error('Source tags must be an array of text labels.');
    // Current copies own editable tags. Retired versions retain provenance and
    // attempt IDs, but must not restore labels the teacher deliberately removed.
    const combined = withLabels(keep, [...labels(keep), ...labels(other), ...additionalLabels]);
    if (!replace && !combined.explanation && other.explanation) {
      combined.explanation = other.explanation;
      if (other.explanationHtml) combined.explanationHtml = other.explanationHtml;
    }
    const related = new Set([...versions(keep, items), ...versions(other, items)].map(q => q.id));
    const next = items.map(q => q.id === keepId ? combined : replace && related.has(q.id)
      ? { ...q, duplicateOf: keepId, canonicalContent: true }
      : q.id === removeId || q.duplicateOf === removeId ? { ...q, duplicateOf: keepId } : q);
    return withSharedTopic(next, keepId, combined.topic);
  }
  return { labels, withLabels, text, contentKey, answerKey, match, rootId, versions, usage, withSharedTopic, syncCanonicalContent, pairs, combine };
})();
if (typeof module !== 'undefined') module.exports = PartBBank;
