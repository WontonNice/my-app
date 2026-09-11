/* Visual math authoring. Stored content remains ordinary HTML plus LaTeX delimiters. */
const studioMath = {
  active: null,
  contexts: new WeakMap(),
  histories: new WeakMap(),
  categories: ["Basic", "Algebra", "Calculus", "Geometry", "Statistics", "Greek", "Symbols", "Templates"],
  catalog: [
    ["frac", "Fraction", "Basic", String.raw`\frac{#0}{\placeholder{}}`, "numerator denominator ratio"],
    ["exp", "Exponent", "Basic", String.raw`x^{\placeholder{}}`, "power superscript square"],
    ["sqrt", "Square root", "Basic", String.raw`\sqrt{#0}`, "radical"],
    ["sub", "Subscript", "Basic", String.raw`#0_{\placeholder{}}`, "index"],
    ["mixed", "Mixed number", "Basic", String.raw`#0\frac{\placeholder{}}{\placeholder{}}`, "fraction whole"],
    ["root", "Nth root", "Basic", String.raw`\sqrt[\placeholder{}]{#0}`, "cube radical"],
    ["paren", "Parentheses", "Basic", String.raw`\left(#0\right)`, "wrap group"],
    ["bracket", "Brackets", "Basic", String.raw`\left[#0\right]`, "wrap group"],
    ["abs", "Absolute value", "Basic", String.raw`\left|#0\right|`, "modulus wrap"],
    ["pm", "Plus / minus", "Basic", String.raw`\pm`, "+-"],
    ["times", "Multiplication", "Basic", String.raw`\times`, "multiply product"],
    ["divide", "Division", "Basic", String.raw`\div`, "divide"],
    ["le", "Less than or equal", "Basic", String.raw`\le`, "inequality <="],
    ["ge", "Greater than or equal", "Basic", String.raw`\ge`, "inequality >="],
    ["neq", "Not equal", "Basic", String.raw`\ne`, "inequality !="],
    ["pi", "Pi", "Basic", String.raw`\pi`, "circle"],
    ["infinity", "Infinity", "Basic", String.raw`\infty`, "unbounded"],
    ["degree", "Degrees", "Basic", String.raw`#0^{\circ}`, "angle temperature"],
    ["function", "Function", "Algebra", String.raw`f\left(x\right)=#0`, "notation"],
    ["log", "Logarithm", "Algebra", String.raw`\log_{\placeholder{}}\left(#0\right)`, "base"],
    ["ln", "Natural logarithm", "Algebra", String.raw`\ln\left(#0\right)`, "log"],
    ["scientific", "Scientific notation", "Algebra", String.raw`#0\times10^{\placeholder{}}`, "standard form"],
    ["matrix", "Matrix", "Algebra", String.raw`\begin{pmatrix}\placeholder{}&\placeholder{}\\\placeholder{}&\placeholder{}\end{pmatrix}`, "array rows columns"],
    ["piecewise", "Piecewise function", "Algebra", String.raw`f(x)=\begin{cases}\placeholder{}&x<\placeholder{}\\\placeholder{}&x\ge\placeholder{}\end{cases}`, "cases"],
    ["system", "System of equations", "Algebra", String.raw`\begin{cases}\placeholder{}x+\placeholder{}y=\placeholder{}\\\placeholder{}x+\placeholder{}y=\placeholder{}\end{cases}`, "simultaneous"],
    ["vector", "Vector", "Algebra", String.raw`\vec{#0}`, "arrow"],
    ["sum", "Summation", "Calculus", String.raw`\sum_{n=\placeholder{}}^{\placeholder{}}#0`, "sigma series"],
    ["product", "Product", "Calculus", String.raw`\prod_{n=\placeholder{}}^{\placeholder{}}#0`, "sequence"],
    ["integral", "Definite integral", "Calculus", String.raw`\int_{\placeholder{}}^{\placeholder{}}#0\,dx`, "integration area"],
    ["int", "Indefinite integral", "Calculus", String.raw`\int #0\,dx`, "antiderivative"],
    ["limit", "Limit", "Calculus", String.raw`\lim_{x\to\placeholder{}}#0`, "lim approaches"],
    ["derivative", "Derivative", "Calculus", String.raw`\frac{d}{dx}\left(#0\right)`, "differentiation"],
    ["partial", "Partial derivative", "Calculus", String.raw`\frac{\partial #0}{\partial x}`, "differentiation"],
    ["sin", "Sine", "Geometry", String.raw`\sin\left(#0\right)`, "trigonometry"],
    ["cos", "Cosine", "Geometry", String.raw`\cos\left(#0\right)`, "trigonometry"],
    ["tan", "Tangent", "Geometry", String.raw`\tan\left(#0\right)`, "trigonometry"],
    ["coordinate", "Coordinates", "Geometry", String.raw`\left(#0,\placeholder{}\right)`, "ordered pair point"],
    ["angle", "Angle", "Geometry", String.raw`\angle #0`, "geometry"],
    ["triangle", "Triangle", "Geometry", String.raw`\triangle #0`, "geometry"],
    ["parallel", "Parallel", "Geometry", String.raw`\parallel`, "lines"],
    ["perp", "Perpendicular", "Geometry", String.raw`\perp`, "right angle"],
    ["segment", "Line segment", "Geometry", String.raw`\overline{#0}`, "length"],
    ["ray", "Ray", "Geometry", String.raw`\overrightarrow{#0}`, "line"],
    ["congruent", "Congruent", "Geometry", String.raw`\cong`, "equal shapes"],
    ["similar", "Similar", "Geometry", String.raw`\sim`, "shapes"],
    ["probability", "Probability", "Statistics", String.raw`P\left(#0\right)`, "event"],
    ["conditional", "Conditional probability", "Statistics", String.raw`P\left(#0\mid\placeholder{}\right)`, "given event"],
    ["binomial", "Binomial coefficient", "Statistics", String.raw`\binom{#0}{\placeholder{}}`, "choose combinations"],
    ["combination", "Combinations", "Statistics", String.raw`{}_{#0}C_{\placeholder{}}`, "ncr counting"],
    ["permutation", "Permutations", "Statistics", String.raw`{}_{#0}P_{\placeholder{}}`, "npr counting"],
    ["mean", "Mean", "Statistics", String.raw`\overline{#0}`, "average bar"],
    ["factorial", "Factorial", "Statistics", String.raw`#0!`, "counting"],
    ["set", "Set", "Symbols", String.raw`\left\{#0\right\}`, "braces elements"],
    ["union", "Union", "Symbols", String.raw`\cup`, "sets or"],
    ["intersection", "Intersection", "Symbols", String.raw`\cap`, "sets and"],
    ["in", "Element of", "Symbols", String.raw`\in`, "belongs membership"],
    ["subset", "Subset", "Symbols", String.raw`\subseteq`, "sets"],
    ["empty", "Empty set", "Symbols", String.raw`\varnothing`, "null"],
    ["real", "Real numbers", "Symbols", String.raw`\mathbb{R}`, "set"],
    ["integer", "Integers", "Symbols", String.raw`\mathbb{Z}`, "set"],
    ["natural", "Natural numbers", "Symbols", String.raw`\mathbb{N}`, "set"],
    ["approx", "Approximately equal", "Symbols", String.raw`\approx`, "estimate"],
    ["arrow", "Implies", "Symbols", String.raw`\Rightarrow`, "arrow logic"],
    ["iff", "If and only if", "Symbols", String.raw`\Leftrightarrow`, "equivalent logic"],
    ["dot", "Dot product", "Symbols", String.raw`\cdot`, "multiply"],
    ["linear", "Linear equation", "Templates", String.raw`\placeholder{}x+\placeholder{}=\placeholder{}`, "algebra"],
    ["quadratic", "Quadratic equation", "Templates", String.raw`\placeholder{}x^2+\placeholder{}x+\placeholder{}=0`, "algebra"],
    ["quadratic-formula", "Quadratic formula", "Templates", String.raw`x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`, "roots algebra"],
    ["rational", "Rational function", "Templates", String.raw`f(x)=\frac{x^2-\placeholder{}}{x-\placeholder{}}`, "fraction algebra"],
    ["slope", "Slope between points", "Templates", String.raw`m=\frac{y_2-y_1}{x_2-x_1}`, "coordinate geometry"],
    ["circle", "Circle area", "Templates", String.raw`A=\pi r^2`, "geometry formula"],
    ["pythagoras", "Pythagorean theorem", "Templates", String.raw`a^2+b^2=c^2`, "geometry triangle"],
    ["probability-rule", "Probability ratio", "Templates", String.raw`P(A)=\frac{\placeholder{}}{\placeholder{}}`, "statistics"],
    ["average", "Sample mean", "Templates", String.raw`\bar{x}=\frac{1}{n}\sum_{i=1}^{n}x_i`, "statistics average"],
    ["trig-identity", "Trigonometric identity", "Templates", String.raw`\sin^2\theta+\cos^2\theta=1`, "trigonometry"],
    ["limit-template", "Evaluate a limit", "Templates", String.raw`\lim_{x\to2}\frac{x^2-4}{x-2}`, "calculus rational"],
    ["nested", "Root over a power", "Templates", String.raw`\frac{\sqrt{x^2+4}}{2x^3}`, "nested fraction radical"],
  ],
  escape(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); },
  entries() {
    const greek = "alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omicron rho sigma tau upsilon phi chi psi omega Gamma Delta Theta Lambda Xi Pi Sigma Upsilon Phi Psi Omega".split(" ");
    return [...this.catalog, ...greek.map((name) => [name, name, "Greek", `\\${name}`, "greek letter"])];
  },
  search(query = "", category = "") {
    query = query.toLowerCase().replace(/^[\\/]/, "");
    const words = query.split(/\s+/).filter(Boolean);
    return this.entries().filter((entry) => (!category || entry[2] === category) && words.every((word) => entry.join(" ").toLowerCase().includes(word)))
      .sort((a, b) => Number(b[0] === query) - Number(a[0] === query));
  },
  template(id, selected = "", hasContent = false) {
    if (id === "exp") return selected ? `\\placeholder{}^{${selected}}` : `${hasContent ? "" : "x"}^{\\placeholder{}}`;
    const entry = this.entries().find((item) => item[0] === id);
    return (entry?.[3] || selected || String.raw`\placeholder{}`).replaceAll("#0", selected || String.raw`\placeholder{}`);
  },
  previewLatex(value) { return value.replace(/\\placeholder(?:\[[^\]]*\])?\{[^{}]*\}/g, String.raw`\square{}`); },
  validate(value) {
    if (!value.trim()) return "";
    try { window.katex.renderToString(this.previewLatex(value), { throwOnError: true, trust: false, strict: "ignore" }); }
    catch (error) { return error.message.replace(/^KaTeX parse error:\s*/, ""); }
    return /\\placeholder\b/.test(value) ? "Fill the outlined placeholders to finish this equation." : "";
  },
  token(value, display = false) {
    const token = document.createElement("span");
    token.className = `math-visual-token${display ? " is-display" : ""}`;
    token.contentEditable = "false";
    token.dataset.mathExpression = value;
    token.dataset.mathDisplay = String(display);
    token.innerHTML = `<math-field aria-label="Editable equation" math-virtual-keyboard-policy="manual">${this.escape(value)}</math-field>`;
    return token;
  },
  hydrate(editor) {
    // Accept pasted display equations without interpreting currency amounts as math.
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (!walker.currentNode.parentElement.closest(".math-visual-token")) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const normalized = node.nodeValue.replace(/\$\$([\s\S]+?)\$\$/g, (_match, latex) => `\\[${latex}\\]`);
      if (normalized !== node.nodeValue) node.nodeValue = normalized;
    });
    hydrateMathPromptEditor(editor);
    editor.querySelectorAll(".math-visual-token").forEach((token) => {
      let field = token.querySelector("math-field");
      if (!field) { token.innerHTML = ""; field = document.createElement("math-field"); token.append(field); }
      this.bindField(field, editor, token);
    });
  },
  toolbar(target, compact = false, raw = false) {
    const button = (action, label, title = label) => `<button type="button" data-equation-action="${action}" title="${title}" aria-label="${title}">${label}</button>`;
    return `<div class="equation-toolbar${compact ? " is-compact" : ""}" data-equation-target="${this.escape(target)}" data-equation-raw="${raw}" role="toolbar" aria-label="Math authoring">
      ${raw ? "" : button("inline", "ƒx", "Insert inline equation (Ctrl+M)") + button("block", "▤", "Insert block equation (Ctrl+Shift+M)")}
      ${button("frac", "<b>½</b> Fraction", "Fraction")}${button("exp", "xⁿ", "Exponent")}${button("sqrt", "√", "Square root")}
      ${button("palette", "Insert math…", "Search symbols, structures, and templates (/)")}
      ${button("templates", "Templates", "Math templates")}
      <span class="equation-toolbar-spacer"></span>${button("source", "LaTeX", "Show LaTeX for the active equation")}
      ${button("help", "?", "Math keyboard help")}
    </div>`;
  },
  mount(root) {
    if (!window.MathfieldElement) return;
    if (!this.configured) {
      window.MathfieldElement.fontsDirectory = "/vendor/mathlive/fonts";
      window.MathfieldElement.soundsDirectory = null;
      this.configured = true;
    }
    root.querySelectorAll("[contenteditable='true'][data-rich-kind^='math-']").forEach((editor, index) => {
      editor.id ||= `equation-rich-${index}`;
      editor.setAttribute("aria-label", editor.getAttribute("aria-label") || editor.closest("label")?.querySelector("span")?.textContent || editor.dataset.richKind.replace("math-", "Math "));
      if (!root.querySelector(`[data-equation-target='${editor.id}']`)) editor.closest(".rich-editor-shell").insertAdjacentHTML("afterend", this.toolbar(editor.id, true));
    });
    root.querySelectorAll("[data-math-drag-item-index], #math-drag-content-rows").forEach((input, index) => {
      input.id ||= `equation-answer-${index}`;
      if (root.querySelector(`[data-equation-target='${input.id}']`)) return;
      const wrap = document.createElement("div"); wrap.className = "equation-answer-input";
      input.before(wrap); wrap.append(input);
      wrap.insertAdjacentHTML("beforeend", this.toolbar(input.id, true));
    });
    root.querySelectorAll(".equation-toolbar").forEach((toolbar) => {
      if (toolbar.dataset.bound) return;
      toolbar.dataset.bound = "true";
      const original = document.getElementById(toolbar.dataset.equationTarget);
      if (!original) return;
      let editor = original;
      const raw = toolbar.dataset.equationRaw === "true";
      if (!original.isContentEditable) {
        editor = document.createElement("div");
        editor.className = "rich-editor-content equation-mirror";
        editor.contentEditable = "true";
        editor.setAttribute("role", "textbox");
        editor.setAttribute("aria-label", original.closest("label")?.querySelector("span")?.textContent || original.getAttribute("aria-label") || original.placeholder || "Math and text");
        if (raw) editor.append(this.token(original.value));
        else editor.innerHTML = this.escape(original.value).replaceAll("\n", "<br>");
        original.hidden = true;
        original.after(editor);
        // Keep original event handlers and data contracts; this view is only an input adapter.
        editor.addEventListener("input", () => {
          this.hydrate(editor);
          original.value = raw ? editor.querySelector(".math-visual-token")?.dataset.mathExpression || "" : serializeMathPromptEditor(editor, { trim: false }).text;
          original.dispatchEvent(new Event("input", { bubbles: true }));
        });
      }
      const context = { editor, original, toolbar, raw, field: null, range: null };
      this.contexts.set(editor, context);
      this.hydrate(editor);
      this.bindEditor(context);
      toolbar.addEventListener("mousedown", (event) => { if (event.target.closest("button")) event.preventDefault(); });
      toolbar.addEventListener("click", (event) => {
        const action = event.target.closest("[data-equation-action]")?.dataset.equationAction;
        if (action) this.action(context, action);
      });
      // Put the prompt's math tools with its text toolbar, above the writing surface.
      if (editor.dataset.richKind === "math-prompt") editor.before(toolbar);
      const dock = document.createElement("div");
      dock.className = "equation-dock";
      dock.hidden = true;
      dock.innerHTML = `<div class="equation-context"><strong>Equation</strong><button type="button" data-equation-action="visual" aria-pressed="true">Visual</button><button type="button" data-equation-action="source" aria-pressed="false">LaTeX</button>${raw ? "" : '<button type="button" data-equation-action="display">Inline ⇄ Block</button>'}<button type="button" data-equation-action="duplicate">Duplicate</button><button type="button" data-equation-action="keyboard">Keyboard</button><button type="button" data-equation-action="undo" aria-label="Undo math edit">↶</button><button type="button" data-equation-action="redo" aria-label="Redo math edit">↷</button><button type="button" data-equation-action="remove">Remove</button><button type="button" data-equation-action="done">Done ↵</button></div>
        <div class="equation-source" hidden><label>LaTeX source<textarea spellcheck="false" aria-label="Active equation LaTeX"></textarea></label><div class="equation-source-preview" aria-label="Student equation preview"></div></div>
        <p class="equation-feedback" role="status"></p>`;
      (editor.closest(".rich-editor-shell") || toolbar).after(dock);
      context.dock = dock;
      dock.addEventListener("mousedown", (event) => { if (event.target.closest("button")) event.preventDefault(); });
      dock.addEventListener("click", (event) => { const action = event.target.closest("[data-equation-action]")?.dataset.equationAction; if (action) this.action(context, action); });
      dock.querySelector("textarea").addEventListener("input", (event) => {
        const field = context.field;
        if (!field?.isConnected) return;
        const token = field.parentElement;
        token.dataset.mathExpression = event.target.value;
        // Keep the exact source, including invalid/unsupported LaTeX, until the author fixes it.
        field.setValue(event.target.value, { silenceNotifications: true });
        this.feedback(context);
        editor.dispatchEvent(new Event("input", { bubbles: true }));
      });
      const hints = document.createElement("p");
      hints.className = "equation-help";
      hints.hidden = true;
      hints.textContent = "Ctrl/⌘+M inserts inline math; add Shift for a block. / starts a command at a new word or placeholder: /frac, /sqrt, /matrix. Ctrl/⌘+K opens search anywhere. In math, x/2 builds a fraction, ^ starts a power, _ starts a subscript, and \\theta then Space inserts θ. Tab / Shift+Tab visit placeholders; arrows move inside structures. Enter returns to text; Shift+Enter adds a matrix row. Select terms before Fraction, Root, or parentheses. Ctrl/⌘+Z undoes; Ctrl/⌘+Shift+Z redoes. Use the equation menu for matrix rows and columns.";
      dock.after(hints); context.help = hints;
      original.closest(".math-choice-formula")?.querySelector(".math-choice-formula-preview")?.setAttribute("hidden", "");
    });
  },
  bindField(field, editor, token) {
    if (field.dataset.bound) return;
    field.dataset.bound = "true";
    field.setAttribute("aria-label", "Editable equation");
    field.mathVirtualKeyboardPolicy = "manual";
    field.smartFence = true;
    field.smartSuperscript = true;
    field.value = token.dataset.mathExpression || "";
    field.onExport = (_sender, latex) => latex;
    field.addEventListener("focusin", () => {
      const context = this.contexts.get(editor);
      if (!context) return;
      context.field = field; this.active = context;
      context.dock.hidden = false;
      this.feedback(context);
    });
    field.addEventListener("input", (event) => {
      event.stopPropagation();
      token.dataset.mathExpression = field.value;
      this.feedback(this.contexts.get(editor));
      editor.dispatchEvent(new Event("input", { bubbles: true }));
    });
    field.addEventListener("paste", (event) => event.stopPropagation());
    field.addEventListener("move-out", (event) => { event.preventDefault(); this.leaveField(this.contexts.get(editor), event.detail.direction === "backward" ? -1 : 1); });
    field.addEventListener("keydown", (event) => {
      const context = this.contexts.get(editor);
      if (event.key === "/" && !event.ctrlKey && !event.metaKey) {
        const selected = field.getValue(field.selection, "latex");
        // Preserve MathLive's x/2 fraction shortcut and selection-to-fraction behavior.
        if (!field.value || /\\placeholder/.test(selected) || field.position === 0) {
          event.preventDefault(); event.stopPropagation(); this.palette(context);
        }
      }
      if (event.key === "Enter" && field.mode !== "latex") {
        event.preventDefault(); event.stopPropagation();
        if (event.shiftKey) field.executeCommand("addRowAfter");
        else this.leaveField(context);
      }
    }, true);
  },
  bindEditor(context) {
    const { editor } = context;
    const remember = () => {
      const sel = window.getSelection();
      if (sel?.rangeCount && editor.contains(sel.anchorNode)) context.range = sel.getRangeAt(0).cloneRange();
    };
    editor.addEventListener("keyup", remember);
    editor.addEventListener("mouseup", remember);
    editor.addEventListener("focus", () => { this.active = context; context.field = null; if (context.dock) context.dock.hidden = true; });
    editor.addEventListener("keydown", (event) => {
      const mod = event.ctrlKey || event.metaKey;
      if (mod && (event.key.toLowerCase() === "z" || event.key.toLowerCase() === "y")) {
        event.preventDefault(); event.stopPropagation();
        this.undo(context, event.shiftKey || event.key.toLowerCase() === "y"); return;
      }
      if (mod && event.key.toLowerCase() === "m") { event.preventDefault(); event.stopPropagation(); this.insert(context, "", event.shiftKey); return; }
      if (mod && event.key.toLowerCase() === "k") { event.preventDefault(); event.stopPropagation(); this.palette(context); return; }
      if (event.target.closest("math-field")) return;
      if (event.key === "/" && !mod) {
        remember();
        const before = context.range?.cloneRange();
        if (before) { before.selectNodeContents(editor); before.setEnd(context.range.startContainer, context.range.startOffset); }
        if (!before || !before.toString() || /\s$/.test(before.toString())) { event.preventDefault(); this.palette(context); }
      }
      if (["ArrowLeft", "ArrowRight"].includes(event.key)) this.enterAdjacent(context, event);
    }, true);
    editor.addEventListener("input", () => {
      this.hydrate(editor);
      this.record(context);
    });
    if (!editor.dataset.richKind) {
      editor.addEventListener("paste", (event) => {
        if (event.target.closest("math-field")) return;
        event.preventDefault();
        const text = event.clipboardData?.getData("text/plain") || "";
        document.execCommand("insertHTML", false, this.escape(text).replaceAll("\n", "<br>"));
        editor.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
    this.histories.set(editor, { entries: [this.snapshot(context)], index: 0, time: 0, restoring: false });
  },
  snapshot(context) {
    const value = serializeMathPromptEditor(context.editor).html;
    const fields = [...context.editor.querySelectorAll("math-field")];
    return { value, field: fields.indexOf(context.field), position: context.field?.position ?? 0 };
  },
  record(context, boundary = false) {
    const h = this.histories.get(context.editor);
    if (!h || h.restoring) return;
    const next = this.snapshot(context);
    if (next.value === h.entries[h.index].value) { if (boundary) h.time = 0; return; }
    h.entries.splice(h.index + 1);
    if (!boundary && h.index > 0 && Date.now() - h.time < 550) h.entries[h.index] = next;
    else { h.entries.push(next); h.index++; }
    if (h.entries.length > 120) { h.entries.shift(); h.index--; }
    h.time = boundary ? 0 : Date.now();
  },
  undo(context, redo = false) {
    const h = this.histories.get(context.editor);
    if (!h) return;
    const index = h.index + (redo ? 1 : -1);
    if (index < 0 || index >= h.entries.length) return;
    h.index = index; h.restoring = true; h.time = 0;
    const entry = h.entries[index];
    context.editor.innerHTML = entry.value;
    this.hydrate(context.editor);
    context.field = context.editor.querySelectorAll("math-field")[entry.field] || null;
    context.editor.dispatchEvent(new Event("input", { bubbles: true }));
    h.restoring = false;
    if (context.field) { context.field.focus(); context.field.position = Math.min(entry.position, context.field.lastOffset); }
    else { context.range = null; this.caretAtEnd(context.editor); context.dock.hidden = true; }
  },
  caretAtEnd(editor) { editor.focus(); const range = document.createRange(); range.selectNodeContents(editor); range.collapse(false); const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range); },
  enterAdjacent(context, event) {
    const sel = window.getSelection();
    if (!sel?.isCollapsed || !sel.anchorNode) return;
    const node = sel.anchorNode;
    const backward = event.key === "ArrowLeft";
    let sibling;
    if (node.nodeType === Node.TEXT_NODE) {
      if (backward ? sel.anchorOffset !== 0 : sel.anchorOffset !== node.length) return;
      sibling = backward ? node.previousSibling : node.nextSibling;
    } else sibling = node.childNodes[sel.anchorOffset + (backward ? -1 : 0)];
    const field = sibling?.querySelector?.("math-field");
    if (field) { event.preventDefault(); field.focus(); field.position = backward ? field.lastOffset : 0; }
  },
  leaveField(context, direction = 1) {
    context?.field?.executeCommand("hideVirtualKeyboard");
    if (!context?.field?.isConnected || context.raw) { context?.toolbar.querySelector("button")?.focus(); return; }
    const token = context.field.parentElement;
    let text = direction < 0 ? token.previousSibling : token.nextSibling;
    if (!text || text.nodeType !== Node.TEXT_NODE) { text = document.createTextNode(" "); direction < 0 ? token.before(text) : token.after(text); }
    context.editor.focus();
    const range = document.createRange(); range.setStart(text, direction < 0 ? text.length : Math.min(1, text.length)); range.collapse(true);
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    context.range = range.cloneRange(); context.field = null; context.dock.hidden = true;
  },
  selectedText(context) {
    const selection = window.getSelection();
    if (selection?.rangeCount && context.editor.contains(selection.anchorNode)) context.range = selection.getRangeAt(0).cloneRange();
    return context.range?.toString().trim() || "";
  },
  insert(context, id = "", display = false) {
    if (!context) return;
    this.record(context, true);
    let field = context.field?.isConnected ? context.field : null;
    if (context.raw) field ||= context.editor.querySelector("math-field");
    if (field && !id) {
      if (context.raw) { field.focus(); return; }
      this.leaveField(context);
      field = null;
    }
    if (field && id) {
      const selected = field.getValue(field.selection, "latex");
      field.insert(this.template(id, selected, Boolean(field.value)), { selectionMode: "placeholder", focus: true, format: "latex" });
      field.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
      const selected = this.selectedText(context);
      const latex = id ? this.template(id, selected) : selected || String.raw`\placeholder{}`;
      const range = context.range?.cloneRange() || document.createRange();
      if (!context.range || !context.editor.contains(range.commonAncestorContainer)) { range.selectNodeContents(context.editor); range.collapse(false); }
      range.deleteContents();
      const token = this.token(latex, display);
      range.insertNode(token);
      token.after(document.createTextNode(" "));
      this.hydrate(context.editor);
      field = token.querySelector("math-field"); context.field = field;
      context.editor.dispatchEvent(new Event("input", { bubbles: true }));
      field.focus(); field.position = 0; field.executeCommand("moveToNextPlaceholder");
    }
    this.record(context, true);
    this.feedback(context);
  },
  action(context, action) {
    this.active = context;
    if (action === "palette" || action === "templates") return this.palette(context, action === "templates" ? "Templates" : "");
    if (action === "help") { context.help.hidden = !context.help.hidden; return; }
    if (action === "undo" || action === "redo") return this.undo(context, action === "redo");
    if (action === "inline" || action === "block") return this.insert(context, "", action === "block");
    if (!["source", "visual", "display", "duplicate", "keyboard", "remove", "done"].includes(action)) return this.insert(context, action);
    if (!context.field?.isConnected) context.field = context.editor.querySelector("math-field");
    if (!context.field) this.insert(context);
    const field = context.field;
    const token = field.parentElement;
    if (action === "keyboard") { field.focus(); field.executeCommand("showVirtualKeyboard"); return; }
    if (action === "done") return this.leaveField(context);
    if (action === "source" || action === "visual") {
      context.dock.hidden = false;
      const source = action === "source";
      context.dock.querySelector(".equation-source").hidden = !source;
      context.dock.querySelectorAll("[aria-pressed]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.equationAction === action)));
      this.feedback(context);
      source ? context.dock.querySelector("textarea").focus() : field.focus();
      return;
    }
    this.record(context, true);
    if (action === "display") { token.classList.toggle("is-display"); token.dataset.mathDisplay = String(token.classList.contains("is-display")); }
    if (action === "duplicate") {
      if (context.raw) { field.position = field.lastOffset; field.insert(token.dataset.mathExpression, { selectionMode: "item", focus: true }); field.dispatchEvent(new Event("input", { bubbles: true })); }
      else { const next = this.token(token.dataset.mathExpression, token.dataset.mathDisplay === "true"); token.after(document.createTextNode(" "), next, document.createTextNode(" ")); this.hydrate(context.editor); context.field = next.querySelector("math-field"); context.field.focus(); }
    }
    if (action === "remove") {
      if (context.raw) { field.value = ""; token.dataset.mathExpression = ""; }
      else { this.leaveField(context); token.remove(); }
    }
    context.editor.dispatchEvent(new Event("input", { bubbles: true }));
    this.record(context, true);
    this.feedback(context);
  },
  feedback(context) {
    if (!context?.dock || !context.field?.isConnected) return;
    const value = context.field.parentElement.dataset.mathExpression || "";
    const source = context.dock.querySelector("textarea");
    if (document.activeElement !== source) source.value = value;
    const issue = this.validate(value);
    const message = context.dock.querySelector(".equation-feedback");
    message.textContent = issue || "Tab between placeholders · Enter returns to text · / to insert math";
    message.classList.toggle("has-issue", Boolean(issue));
    context.field.parentElement.classList.toggle("has-issue", Boolean(issue) && !/placeholder/.test(issue));
    const preview = context.dock.querySelector(".equation-source-preview");
    preview.innerHTML = renderKatexExpression(this.previewLatex(value), context.field.parentElement.dataset.mathDisplay === "true");
  },
  palette(context, category = "") {
    if (!context) return;
    this.selectedText(context);
    let dialog = document.getElementById("equation-palette");
    if (!dialog) {
      dialog = document.createElement("dialog"); dialog.id = "equation-palette"; dialog.className = "equation-palette";
      dialog.setAttribute("aria-labelledby", "equation-palette-title");
      dialog.innerHTML = `<header><div><h2 id="equation-palette-title">Insert math</h2><p>Find a symbol, build a structure, or start with a template.</p></div><button type="button" aria-label="Close math palette">×</button></header><input type="search" aria-label="Search math notation" placeholder="Search ‘fraction’, ‘theta’, ‘matrix’…" autocomplete="off"><nav aria-label="Math categories"></nav><div class="equation-palette-grid" role="group" aria-label="Matching notation"></div><footer>↑ ↓ choose · Enter insert · Esc close <span>Everything stays editable</span></footer>`;
      document.body.append(dialog);
    }
    const search = dialog.querySelector("input"); search.value = "";
    const nav = dialog.querySelector("nav");
    nav.innerHTML = ["All", ...this.categories].map((label) => `<button type="button" aria-pressed="${label === (category || "All")}">${label}</button>`).join("");
    let selected = 0;
    const draw = () => {
      const entries = this.search(search.value, search.value ? "" : category);
      const grid = dialog.querySelector(".equation-palette-grid");
      grid.innerHTML = entries.map((entry, index) => `<button type="button" aria-label="Insert ${this.escape(entry[1])}" data-insert="${entry[0]}" class="${index === selected ? "is-selected" : ""}"><span class="equation-example" aria-hidden="true">${renderKatexExpression(this.previewLatex(this.template(entry[0])))}</span><strong>${this.escape(entry[1])}</strong><small>/${entry[0]}</small></button>`).join("") || '<p class="equation-no-results">No matches. Try a name such as “root” or “greater than”.</p>';
      grid.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => { dialog.close(); this.insert(context, button.dataset.insert); }));
    };
    nav.onclick = (event) => { if (event.target.tagName !== "BUTTON") return; category = event.target.textContent === "All" ? "" : event.target.textContent; search.value = ""; selected = 0; nav.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(button === event.target))); draw(); search.focus(); };
    search.oninput = () => { selected = 0; draw(); };
    search.onkeydown = (event) => {
      const buttons = [...dialog.querySelectorAll("[data-insert]")];
      if (["ArrowDown", "ArrowUp"].includes(event.key)) { event.preventDefault(); selected = Math.max(0, Math.min(buttons.length - 1, selected + (event.key === "ArrowDown" ? 1 : -1))); buttons.forEach((button, index) => button.classList.toggle("is-selected", index === selected)); buttons[selected]?.scrollIntoView({ block: "nearest" }); }
      if (event.key === "Enter") { event.preventDefault(); buttons[selected]?.click(); }
    };
    const close = () => { dialog.close(); context.field?.isConnected ? context.field.focus() : context.editor.focus(); };
    dialog.querySelector("header button").onclick = close;
    dialog.oncancel = (event) => { event.preventDefault(); close(); };
    draw(); dialog.showModal(); search.focus();
  },
};
