(function (root) {
  const escape = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const plain = html => html.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
  function fromElement(element, style = () => ({}), omit = null) {
    function visit(node) {
      if (node === omit) return '';
      if (node.nodeType === 3) return escape(node.textContent);
      if (node.nodeType !== 1) return '';
      const tag = node.tagName.toLowerCase();
      if (['script', 'style', 'svg', 'math', 'annotation', 'button', 'img', 'iframe'].includes(tag)) return '';
      if (node.classList?.contains('shsat-paragraph')) return '<br><br>';
      if (node.classList?.contains('newline')) return '<br>';
      if (tag === 'br') return '<br>';
      if (node.classList?.contains('katex')) {
        const tex = node.querySelector('annotation[encoding="application/x-tex"]')?.textContent;
        if (tex) return escape(`\\(${tex}\\)`);
      }
      if (!node.childNodes) return escape(node.innerText || node.textContent || '');
      let html = Array.from(node.childNodes, visit).join('');
      if (!html) return '';
      const current = style(node) || {}, parent = node.parentElement ? style(node.parentElement) || {} : {};
      const bold = value => /bold/.test(value || '') || Number(value) >= 600;
      const italic = value => /italic|oblique/.test(value || '');
      if (['strong', 'b'].includes(tag) || node.classList?.contains('textbf') || bold(current.fontWeight) && !bold(parent.fontWeight)) html = `<strong>${html}</strong>`;
      if (['em', 'i'].includes(tag) || node.classList?.contains('textit') || italic(current.fontStyle) && !italic(parent.fontStyle)) html = `<em>${html}</em>`;
      if (tag === 'u' || /underline/.test(current.textDecorationLine || '') && !/underline/.test(parent.textDecorationLine || '')) html = `<u>${html}</u>`;
      if (['sup', 'sub', 's'].includes(tag)) html = `<${tag}>${html}</${tag}>`;
      if (['p', 'div', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) html = `<p>${html}</p>`;
      return html;
    }
    return element ? visit(element).trim() : '';
  }
  function blocks(element, style) {
    return fromElement(element, style).replace(/<\/?p>/g, '\n').replace(/(?:<br>\s*)+/g, '\n').split(/\n+/)
      .map(html => ({ html: html.trim(), text: plain(html).trim() })).filter(block => block.text);
  }
  function passage(element, style) {
    // KaTeX lays these poems out by column, so innerText reads every printed
    // number before any verse. Read the visible verse rows and their spacing.
    const tables = Array.from(element?.querySelectorAll?.('.mtable') || []);
    for (const table of tables) {
      const columns = Array.from(table.children || []);
      const numberColumn = columns.find(node => node.classList.contains('col-align-r'));
      const verseColumn = columns.find(node => node.classList.contains('col-align-l'));
      if (!numberColumn || !verseColumn) continue;
      const numberLabels = (numberColumn.textContent || '').replace(/[\u200b\u2060]/g, '').trim().split(/\s+/).filter(Boolean);
      // Rendered number cells can have no whitespace between them.
      const numberRows = Array.from(numberColumn.querySelector('.vlist')?.children || []).map(row => row.textContent.trim()).filter(Boolean);
      const labels = numberRows.length ? numberRows : numberLabels;
      const rows = Array.from(verseColumn.querySelector('.vlist')?.children || []).map(row => ({
        html: fromElement(row, style),
        text: (row.textContent || '').replace(/[\u200b\u2060]/g, '').trimEnd(),
        top: Number.parseFloat(row.style?.top),
      })).filter(row => row.text.trim());
      if (labels.length < 2 || labels.some(label => !/^\d+$/.test(label)) || rows.length < 5 ||
          labels.some((label, i) => Number(label) > rows.length || (i && Number(label) <= Number(labels[i - 1]))) ||
          rows.some(row => !/[a-zA-Z]/.test(row.text))) continue;
      const gaps = rows.slice(1).map((row, i) => row.top - rows[i].top).filter(gap => Number.isFinite(gap) && gap > 0).sort((a, b) => a - b);
      const lineGap = gaps[Math.floor((gaps.length - 1) / 2)];
      const verse = [];
      rows.forEach((row, i) => {
        if (i && lineGap && row.top - rows[i - 1].top > lineGap * 1.5) verse.push({ html: '<br>', text: '' });
        verse.push({ html: row.html, text: row.text });
      });
      const metadata = fromElement(element, style, table).replace(/<\/?p>/g, '\n').replace(/(?:<br>\s*)+/g, '\n').split(/\n+/)
        .map(html => ({ html: html.trim(), text: plain(html).replace(/[\u200b\u2060]/g, '').trim() })).filter(block => block.text);
      const formattedBlocks = [...metadata, ...verse];
      return { format: 'poem', formattedBlocks, text: formattedBlocks.map(block => block.text).join('\n') };
    }
    return { formattedBlocks: blocks(element, style) };
  }
  const api = { fromElement, blocks, passage };
  if (typeof module !== 'undefined') module.exports = api;
  else root.NathanSatRichText = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
