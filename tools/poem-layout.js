// Shared by the exam player and Content Studio. A block may be one line or a whole stanza.
const plain = html => html.replace(/<[^>]*>/g, '').replace(/&nbsp;|&#160;/gi, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
const words = text => text.replace(/\s+/g, ' ').trim();

function balancedLines(html) {
  // Pretty-printed HTML commonly puts a source-code newline beside each br.
  // The br already supplies the verse break; displaying that newline inside
  // break-spaces text adds a second row and moves the gutter number off-line.
  // Keep horizontal indentation after the final newline and explicit br gaps.
  html = html.replace(/(?:\r?\n[\t ]*)+(?=<br\s*\/?>)/gi, '')
    .replace(/(<br\s*\/?>)(?:[\t ]*\r?\n)+/gi, '$1');
  const stack = [], lines = [];
  let line = '';
  const finish = () => { lines.push(line + [...stack].reverse().map(tag => `</${tag.name}>`).join('')); line = stack.map(tag => tag.html).join(''); };
  for (const token of html.split(/(<[^>]*>)/g)) {
    if (/^<br\s*\/?>$/i.test(token)) { finish(); continue; }
    const close = /^<\/([\w-]+)\s*>$/.exec(token);
    const open = /^<([\w-]+)\b[^>]*>$/.exec(token);
    if (close) { const index = stack.map(tag => tag.name).lastIndexOf(close[1].toLowerCase()); if (index >= 0) stack.splice(index); }
    else if (open && !/\/>$/.test(token) && !/^(?:img|hr|input)$/i.test(open[1])) stack.push({ name: open[1].toLowerCase(), html: token });
    line += token;
  }
  finish();
  if (lines.length > 1 && !plain(lines.at(-1)).trim()) lines.pop();
  return lines;
}

/** @param {Array<any>} blocks @param {string} [sourceText] @returns {Array<any>} */
export function poemRichBlocks(blocks, sourceText = '') {
  const result = [];
  blocks.forEach((block, index) => {
    const lines = balancedLines(block.html || '');
    // Adjacent multi-line blocks are stanzas. One-div-per-line imports remain consecutive lines.
    const previous = blocks[index - 1];
    if (previous && previous.poetryLine !== true && block.poetryLine !== true &&
        plain(previous.html || '').trim() && plain(block.html || '').trim() &&
        (/<br\s*\/?>/i.test(previous.html || '') || lines.length > 1)) result.push({ html: '', text: '' });
    result.push(...lines.map(html => ({ ...block, html, text: plain(html).trimEnd() })));
  });
  const source = sourceText.replace(/\r\n?/g, '\n').split('\n');
  const sourceContent = source.filter(line => line.trim());
  const richContent = result.filter(line => line.text.trim());
  // Restore blank source lines even if richText used one div per line and omitted empty divs.
  if (sourceContent.length !== richContent.length || !sourceContent.every((line, i) => words(line) === words(richContent[i].text))) return result;
  const gaps = [];
  let gap = 0;
  for (const line of source) { if (!line.trim()) gap++; else { gaps.push(gap); gap = 0; } }
  let contentIndex = 0, existingGap = 0;
  const aligned = [];
  for (const line of result) {
    if (!line.text.trim()) { existingGap++; continue; }
    if (contentIndex) for (let i = 0; i < Math.max(existingGap, gaps[contentIndex]); i++) aligned.push({ html: '', text: '' });
    aligned.push(line); existingGap = 0; contentIndex++;
  }
  return aligned;
}
