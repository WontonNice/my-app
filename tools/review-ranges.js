/* Shared one-based math question selection; never uses filtered list positions. */
var ReviewRanges = {
  parse(value, count) {
    if (!String(value).trim()) throw new Error('Enter question numbers, for example 1–5, 8, 10–12.');
    const selected = new Set();
    for (const part of String(value).split(',')) {
      const match = part.trim().match(/^(\d+)(?:\s*[-–]\s*(\d+))?$/);
      if (!match) throw new Error('Use question numbers or ranges separated by commas.');
      const from = Number(match[1]), to = Number(match[2] || match[1]);
      if (from < 1 || to > count || from > to) throw new Error(`Choose question numbers from 1 to ${count}, in increasing ranges.`);
      for (let n = from; n <= to; n++) selected.add(n - 1);
    }
    return [...selected].sort((a, b) => a - b);
  },
};
if (typeof module !== 'undefined') module.exports = ReviewRanges;
