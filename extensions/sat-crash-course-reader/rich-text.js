(function (root) {
  const escape = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const plain = html => html.replace(/<br\s*\/?>|<\/p>/gi, '\n').replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').trim();
  function expressionAnswer(content) {
    // Only flat rendered expressions can be read as text without losing position
    // (e.g. turning a fraction or exponent into concatenated digits).
    if (!content || content.querySelector('.ML__vlist, .ML__frac, .ML__sqrt, .ML__supsub, .ML__array')) return '';
    return (content.textContent || '').replace(/[\u200b\u2060]/g, '').trim();
  }
  // The tutor site renders KaTeX with output:'html', so there is no TeX annotation.
  // Recover the layout operators before flattening text (1/2 must not become 21).
  function renderedMath(node) {
    const has = name => node.classList?.contains(name);
    const children = () => Array.from(node.childNodes || [], renderedMath).join('');
    if (node.nodeType === 3) return node.textContent.replace(/[\u200b\u2060]/g, '').replace(/[\\$%&#_{}]/g, c => `\\${c}`)
      .replace(/[−×÷π≤≥≠∞·°]/g, c => ({'−':'-', '×':'\\times ', '÷':'\\div ', 'π':'\\pi ', '≤':'\\le ', '≥':'\\ge ', '≠':'\\ne ', '∞':'\\infty ', '·':'\\cdot ', '°':'^{\\circ}'}[c]));
    if (node.nodeType !== 1 || ['svg', 'path'].includes(node.tagName.toLowerCase()) || ['strut', 'katex-strut', 'pstrut', 'vlist-s', 'frac-line', 'hide-tail'].some(has)) return '';
    const rows = () => Array.from(node.querySelector('.vlist')?.children || []);
    if (has('mfrac')) {
      const parts = rows().filter(row => !Array.from(row.children || []).some(child => child.classList?.contains('frac-line'))).sort((a,b) => parseFloat(a.style.top) - parseFloat(b.style.top));
      if (parts.length === 2) return `\\frac{${renderedMath(parts[0])}}{${renderedMath(parts[1])}}`;
    }
    if (has('msupsub')) return rows().map(row => {
      const baseline = parseFloat(row.querySelector('.pstrut')?.style.height || '0');
      return `${parseFloat(row.style.top) + baseline < -0.05 ? '^' : '_'}{${renderedMath(row)}}`;
    }).join('');
    if (has('sqrt')) {
      const root = Array.from(node.children || []).find(child => child.classList?.contains('root'));
      const body = node.querySelector('.svg-align');
      if (body) return `\\sqrt${root ? `[${renderedMath(root)}]` : ''}{${renderedMath(body)}}`;
    }
    if (has('mtable')) {
      const cols = Array.from(node.children || []).filter(child => child.querySelector('.vlist')).map(child => Array.from(child.querySelector('.vlist').children, renderedMath));
      if (cols.length) return `\\begin{array}{${'c'.repeat(cols.length)}}${Array.from({length: Math.max(...cols.map(col => col.length))}, (_, i) => cols.map(col => col[i] || '').join(' & ')).join(' \\\\ ')}\\end{array}`;
    }
    if (has('mspace')) return ' ';
    if (has('text')) return `\\text{${children()}}`;
    if (has('overline')) return `\\overline{${children()}}`;
    return children();
  }
  function fromElement(element, style = () => ({}), omit = null, replace = () => undefined) {
    function visit(node) {
      if (node === omit) return '';
      const replacement = replace(node);
      if (replacement !== undefined) return replacement;
      if (node.nodeType === 3) return escape(node.textContent);
      if (node.nodeType !== 1) return '';
      const tag = node.tagName.toLowerCase();
      if (['script', 'style', 'svg', 'math', 'annotation', 'button', 'iframe', 'input', 'select', 'textarea', 'math-field'].includes(tag)) return '';
      if (tag === 'img') {
        const src = node.currentSrc || node.getAttribute?.('src') || '';
        if (!/^(?:https?:\/\/|\/)/i.test(src)) return '';
        const width = Number(node.getAttribute?.('width') || node.width);
        return `<img src="${escape(src)}" alt="${escape(node.getAttribute?.('alt') || '')}"${width > 0 ? ` width="${Math.round(width)}"` : ''}>`;
      }
      if (node.classList?.contains('shsat-paragraph')) return '<br><br>';
      if (node.classList?.contains('newline')) return '<br>';
      if (tag === 'br') return '<br>';
      if (node.classList?.contains('katex')) {
        const tex = node.querySelector('annotation[encoding="application/x-tex"]')?.textContent;
        if (tex) return escape(`\\(${tex}\\)`);
        const rendered = Array.from(node.children || []).find(child => child.classList?.contains('katex-html'));
        if (rendered && rendered.querySelector('.newline') && !renderedMath(rendered).trim()) return '<br>';
        if (rendered) return escape(`\\(${renderedMath(rendered)}\\)`);
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
      if (['table','caption','thead','tbody','tfoot','tr','th','td','ul','ol','li','blockquote'].includes(tag)) {
        const attrs = ['colspan','rowspan','scope'].map(name => node.getAttribute?.(name) ? ` ${name}="${escape(node.getAttribute(name))}"` : '').join('');
        return `<${tag}${attrs}>${html}</${tag}>`;
      }
      if (tag === 'a') {
        const href = node.getAttribute?.('href') || '';
        if (/^https?:\/\//i.test(href)) return `<a href="${escape(href)}">${html}</a>`;
      }
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
  const api = { fromElement, blocks, passage, renderedMath, plain, expressionAnswer };
  if (typeof module !== 'undefined') module.exports = api;
  else root.NathanSatRichText = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
