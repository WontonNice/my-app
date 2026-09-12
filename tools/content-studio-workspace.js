/* Layout and navigation only. Content drafts, validation, and writes remain in content-studio.html. */
const studioUI = {
  passageContext: "",
  passageSection: "content",
  selectedQuestionId: "",
  selectedQuestionIndex: 0,
  showAllQuestions: false,
  mathSection: "question",
  testSection: "0",
  previewVisible: true,
  pages: new Map(),
  filters: new Map(),
  folds: new Map(),

  element(tag, className, html = "") {
    const node = document.createElement(tag);
    node.className = className;
    node.innerHTML = html;
    return node;
  },

  updateDialogStatus(message, tone) {
    const status = document.querySelector(".studio-import-dialog[open] .studio-dialog-status");
    if (!status) return;
    status.textContent = message;
    status.hidden = false;
    status.classList.toggle("is-error", tone === "error");
  },

  preparePassage() {
    const context = `${app.passageMode}:${app.selectedPassageId || "new"}`;
    if (this.passageContext === context) return;
    this.passageContext = context;
    this.passageSection = "content";
    this.selectedQuestionId = "";
    this.selectedQuestionIndex = 0;
  },

  initialize() {
    const header = document.querySelector(".app-header");
    if (!document.querySelector("#studio-library-toggle")) {
      const toggle = this.element("button", "studio-library-toggle", "☰ <span>Library</span>");
      toggle.id = "studio-library-toggle";
      toggle.type = "button";
      toggle.title = "Show or hide the content library";
      toggle.setAttribute("aria-expanded", "true");
      toggle.addEventListener("click", () => {
        const hidden = document.body.classList.toggle("studio-library-hidden");
        toggle.setAttribute("aria-expanded", String(!hidden));
      });
      header.insertBefore(toggle, header.firstChild);
      document.querySelector(".brand small").textContent = "CONTENT EDITOR";
      document.querySelector(".brand strong").textContent = "Nathan Tutors";
    }
    for (const [id, label] of [["passage-search", "Search passages by title, ID, topic, or question"], ["standalone-search", "Search Part B questions"]]) {
      document.getElementById(id).setAttribute("aria-label", label);
    }
    this.mountPractice();
    this.addAssessmentSearch("assessment-list");
    this.addAssessmentSearch("math-assessment-list");
    this.activateWorkspace("passages");
    document.addEventListener("keydown", (event) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "s") return;
      // Preserve dialog-specific save flows and the practice validation gate.
      if (document.querySelector("dialog[open]") || !document.getElementById("student-preview-modal").hidden) return;
      event.preventDefault();
      const save = document.querySelector(".view.is-active #save-passage, .view.is-active #save-standalone, .view.is-active #save-test, .view.is-active #save-math, .view.is-active #practice-write-button");
      if (save && !save.disabled) save.click();
      else if (document.querySelector("#practice-view.is-active")) document.getElementById("practice-preview-button").click();
    });
  },

  activateWorkspace(tab) {
    document.querySelectorAll("[data-tab]").forEach((button) => button.setAttribute("aria-current", button.dataset.tab === tab ? "page" : "false"));
    document.body.dataset.workspace = tab;
    const toggle = document.getElementById("studio-library-toggle");
    if (toggle) toggle.hidden = tab === "practice";
    // Open the first item only on initial entry; switching workspaces keeps drafts intact.
    if (tab === "standalone" && !app.standaloneDraft && app.state.standaloneItems[0]) selectStandaloneItem(app.state.standaloneItems[0].id);
    if (tab === "tests" && !app.testDraft && app.state.assessments[0]) selectAssessment(app.state.assessments[0].id);
    if (tab === "math" && !app.mathDraft && app.state.assessments[0]) selectMathAssessment(app.state.assessments[0].id);
    const messages = {
      passages: app.passageDirty ? "Unsaved passage changes." : "Exam passages · edit text, questions, settings, or media.",
      advanced: app.passageDirty ? "Unsaved advanced-practice changes." : "Advanced practice · passage, library card, and questions.",
      standalone: app.standaloneDirty ? "Unsaved Part B changes." : "Part B · reusable stand-alone questions.",
      tests: "Exam builder · arrange Reading, Part A, and Part B.",
      math: app.mathDirty ? "Unsaved math changes." : "Exam math · questions, answer keys, and student preview.",
      practice: "Practice drafts save on this device. Preview to validate before publishing.",
    };
    setStatus(messages[tab] || "Ready.");
  },

  getLibrarySlice(items, key, signature, type = "", sort = "source") {
    const filtered = items.filter((item) => !type || (key === "passages" ? item.format : item.type) === type);
    if (sort !== "source") filtered.sort((a, b) => (a.title || a.prompt || a.id).localeCompare(b.title || b.prompt || b.id) * (sort === "za" ? -1 : 1));
    const queryKey = `${signature}:${type}:${sort}`;
    const previous = this.pages.get(key);
    const pageCount = Math.max(1, Math.ceil(filtered.length / 50));
    const page = previous?.signature === queryKey ? Math.max(0, Math.min(previous.page, pageCount - 1)) : 0;
    this.pages.set(key, { page, signature: queryKey });
    return { items: filtered.slice(page * 50, (page + 1) * 50), total: filtered.length, page, pageCount, queryKey };
  },

  libraryPage(items, key, signature, rerender) {
    const isPassage = key === "passages";
    const list = document.getElementById(isPassage ? "passage-list" : "standalone-list");
    let controls = document.getElementById(`${key}-filters`);
    if (!controls) {
      controls = this.element("div", "studio-library-filters", `
        <select aria-label="${isPassage ? "Filter passage format" : "Filter question type"}">
          <option value="">${isPassage ? "All formats" : "All types"}</option>
          ${isPassage ? '<option value="prose">Prose</option><option value="poem">Poem</option><option value="sentence_prose">Sentence numbered</option>' : '<option value="multiple_choice">Multiple choice</option><option value="category_sort">Drag and drop</option>'}
        </select>
        <select aria-label="Sort library"><option value="source">Source order</option><option value="az">Title A–Z</option><option value="za">Title Z–A</option></select>`);
      controls.id = `${key}-filters`;
      list.before(controls);
      controls.addEventListener("change", rerender);
    }
    const [type, sort] = controls.querySelectorAll("select");
    const { items: visible, total, page, pageCount, queryKey } = this.getLibrarySlice(items, key, signature, type.value, sort.value);
    let footer = document.getElementById(`${key}-pager`);
    if (!footer) {
      footer = this.element("div", "studio-library-pager");
      footer.id = `${key}-pager`;
      list.after(footer);
    }
    footer.innerHTML = `<span role="status">${total ? `${page * 50 + 1}–${Math.min(total, (page + 1) * 50)}` : "0"} of ${total}</span><button aria-label="Previous library page" class="icon-button" type="button" ${page === 0 ? "disabled" : ""}>‹</button><button aria-label="Next library page" class="icon-button" type="button" ${page === pageCount - 1 ? "disabled" : ""}>›</button>`;
    footer.querySelectorAll("button").forEach((button, index) => button.addEventListener("click", () => {
      this.pages.set(key, { page: page + (index ? 1 : -1), signature: queryKey });
      rerender();
      list.scrollTop = 0;
    }));
    return visible;
  },

  addAssessmentSearch(id) {
    const list = document.getElementById(id);
    if (document.getElementById(`${id}-search`)) return;
    const search = this.element("input", "search studio-exam-search");
    search.id = `${id}-search`;
    search.type = "search";
    search.placeholder = "Find an exam…";
    search.setAttribute("aria-label", "Find an exam");
    search.addEventListener("input", () => this.filterAssessmentList(id));
    list.before(search);
  },

  filterAssessmentList(id) {
    const query = document.getElementById(`${id}-search`)?.value.trim().toLowerCase() || "";
    const list = document.getElementById(id);
    let count = 0;
    list.querySelectorAll("button").forEach((button) => {
      button.hidden = !`${button.textContent} ${button.dataset.assessmentId || button.dataset.mathAssessmentId}`.toLowerCase().includes(query);
      if (!button.hidden) count++;
    });
    let empty = list.querySelector(".studio-search-empty");
    if (!empty) { empty = this.element("p", "field-note studio-search-empty", "No exams match this search."); list.append(empty); }
    empty.hidden = count > 0;
  },

  mountPassage() {
    const root = document.getElementById("passage-editor");
    const main = root.querySelector(".content-editor-main");
    const identity = document.getElementById("passage-information");
    const content = document.getElementById("passage-content");
    const [settings, media] = main.querySelectorAll(":scope > details");
    const titleGrid = this.element("div", "studio-title-grid");
    for (const field of ["title", "author"]) titleGrid.append(root.querySelector(`[data-field='${field}']`).closest("label.field"));
    content.insertBefore(titleGrid, content.firstChild);
    const metadata = this.element("div", "studio-tab-panel studio-settings");
    metadata.dataset.passagePanel = "settings";
    metadata.id = "studio-passage-settings";
    main.prepend(metadata);
    metadata.append(identity, settings);
    settings.open = true;
    identity.querySelector("h2").textContent = "Identity & introduction";
    media.id = "studio-passage-media";
    media.dataset.passagePanel = "media";
    media.open = true;
    content.dataset.passagePanel = "content";
    document.getElementById("passage-questions").dataset.passagePanel = "questions";
    // The original source path stays available next to the source settings.
    const source = root.querySelector(".source-path");
    source.title = source.textContent;
    metadata.append(source);
    const heading = root.querySelector(".editor-head");
    heading.querySelector("h1").textContent = app.passageDraft.title || "Untitled passage";
    heading.querySelector("p").className = "studio-record-summary";
    const nav = root.querySelector(".content-editor-command-bar nav");
    nav.innerHTML = [ ["content", "Passage"], ["questions", "Questions"], ["settings", "Settings"], ["media", "Media"] ].map(([key, label]) => `<button data-passage-tab="${key}" type="button">${label}${key === "questions" ? ` <span data-question-count>${app.passageDraft.questions.length}</span>` : ""}</button>`).join("");
    nav.setAttribute("aria-label", "Passage editing sections");
    nav.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => this.showPassageSection(button.dataset.passageTab)));
    const preview = document.getElementById("passage-preview-panel");
    const previewHeading = preview.querySelector(".panel-head");
    const refresh = document.getElementById("refresh-preview");
    refresh.textContent = "↻";
    refresh.title = "Refresh passage preview";
    refresh.setAttribute("aria-label", "Refresh passage preview");
    previewHeading.append(refresh);
    const toggle = this.element("button", "secondary", "Preview");
    toggle.type = "button";
    toggle.id = "studio-preview-toggle";
    toggle.setAttribute("aria-controls", "passage-preview-panel");
    toggle.addEventListener("click", () => { this.previewVisible = !this.previewVisible; this.updatePreviewVisibility(); });
    nav.after(toggle);
    document.getElementById("save-passage").textContent = app.saving ? "Saving…" : "Save passage";
    document.getElementById("save-passage").title = "Save passage (Ctrl / ⌘ + S)";
    this.showPassageSection(this.passageSection);
    this.updatePreviewVisibility();
    this.updatePassageSummary();
  },

  showPassageSection(section) {
    this.passageSection = section;
    const root = document.getElementById("passage-editor");
    root.querySelectorAll("[data-passage-panel]").forEach((panel) => { panel.hidden = panel.dataset.passagePanel !== section; });
    root.querySelectorAll("[data-passage-tab]").forEach((button) => {
      const active = button.dataset.passageTab === section;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const scroll = root.querySelector(".content-editor-main");
    if (scroll) scroll.scrollTop = 0;
  },

  updatePreviewVisibility() {
    const root = document.getElementById("passage-editor");
    root.classList.toggle("studio-preview-hidden", !this.previewVisible);
    document.getElementById("passage-preview-panel").hidden = !this.previewVisible;
    const toggle = document.getElementById("studio-preview-toggle");
    toggle.setAttribute("aria-pressed", String(this.previewVisible));
    toggle.textContent = this.previewVisible ? "Hide preview" : "Show preview";
  },

  updatePassageSummary() {
    const draft = app.passageDraft;
    if (!draft) return;
    const heading = document.querySelector("#passage-editor .editor-head h1");
    if (heading) heading.textContent = draft.title || "Untitled passage";
    const summary = document.querySelector(".studio-record-summary");
    if (summary) summary.textContent = `${app.passageMode === "advanced" ? "Advanced practice" : "Exam passage"} · ${draft.questions.length} question${draft.questions.length === 1 ? "" : "s"} · ${draft.text.trim() ? draft.text.trim().split(/\s+/).length : 0} words · ${app.passageDirty ? "Unsaved changes" : draft.sourceHash ? "Saved in repository" : "New draft"}`;
    document.querySelectorAll("[data-question-count]").forEach((node) => { node.textContent = draft.questions.length; });
    // Update only the affected outline text; typing never rebuilds an active editor.
    const question = draft.questions.find((q) => q.id === this.selectedQuestionId);
    const active = document.querySelector(".studio-question-outline [aria-current='true']");
    if (question && active) {
      active.querySelector("strong").textContent = question.prompt || "Untitled question";
      active.title = question.prompt || question.id;
      active.querySelector("small").textContent = `${question.topic} · ${studioCorrectAnswer(question) || "No answer key"}`;
    }
  },

  schedulePassagePreview() {
    window.clearTimeout(this.passagePreviewTimer);
    this.passagePreviewTimer = window.setTimeout(() => {
      const preview = document.getElementById("passage-preview");
      if (!preview || !app.passageDraft) return;
      const scrollTop = preview.scrollTop;
      renderPreview();
      preview.scrollTop = scrollTop;
    }, 100);
  },

  ensureQuestionSelection() {
    const questions = app.passageDraft.questions;
    const index = questions.findIndex((q) => q.id === this.selectedQuestionId);
    this.selectedQuestionIndex = index < 0 ? Math.min(this.selectedQuestionIndex, Math.max(0, questions.length - 1)) : index;
    this.selectedQuestionId = questions[this.selectedQuestionIndex]?.id || "";
  },

  mountQuestions() {
    const panel = document.getElementById("passage-questions");
    if (!panel) return;
    let navigation = panel.querySelector(".studio-question-navigation");
    if (!navigation) { navigation = this.element("div", "studio-question-navigation"); panel.querySelector(".panel-head").after(navigation); }
    const heading = panel.querySelector(".panel-head > div");
    heading.innerHTML = '<h2>Question editor</h2>';
    const questions = app.passageDraft.questions;
    navigation.innerHTML = `<div class="studio-question-tools">
      <button class="icon-button" data-question-step="-1" type="button" aria-label="Previous question" ${this.selectedQuestionIndex === 0 ? "disabled" : ""}>‹</button>
      <label class="studio-question-jump">Question <select aria-label="Jump to question">${questions.map((q, i) => `<option value="${i}" ${q.id === this.selectedQuestionId ? "selected" : ""}>${i + 1} of ${questions.length}</option>`).join("")}</select></label>
      <button class="icon-button" data-question-step="1" type="button" aria-label="Next question" ${!questions.length || this.selectedQuestionIndex >= questions.length - 1 ? "disabled" : ""}>›</button>
      <button class="secondary studio-all-questions" aria-pressed="${this.showAllQuestions}" type="button">${this.showAllQuestions ? "Focus one question" : "All questions"}</button>
    </div>
    <details class="studio-question-outline" ${this.folds.get("outline") ? "open" : ""}><summary>Question outline <span>${questions.length} items · prompts, topics & answers</span></summary><div class="studio-outline-list">${questions.map((q, i) => `<button type="button" data-select-question="${i}" aria-current="${q.id === this.selectedQuestionId}" title="${escapeHtml(q.prompt || q.id)}"><b>${i + 1}</b><span><strong>${escapeHtml(q.prompt || "Untitled question")}</strong><small>${escapeHtml(q.topic)} · ${escapeHtml(studioCorrectAnswer(q) || "No answer key")}</small></span></button>`).join("") || '<p class="field-note">Add a question to start this set.</p>'}</div></details>`;
    const select = (index) => {
      if (!questions[index]) return;
      this.selectedQuestionId = questions[index].id;
      this.selectedQuestionIndex = index;
      this.showAllQuestions = false;
      renderQuestionsV2();
      panel.closest(".content-editor-main")?.scrollTo({ top: 0 });
    };
    navigation.querySelector("select").addEventListener("change", (event) => select(Number(event.target.value)));
    navigation.querySelectorAll("[data-question-step]").forEach((button) => button.addEventListener("click", () => select(this.selectedQuestionIndex + Number(button.dataset.questionStep))));
    navigation.querySelectorAll("[data-select-question]").forEach((button) => button.addEventListener("click", () => select(Number(button.dataset.selectQuestion))));
    navigation.querySelector(".studio-all-questions").addEventListener("click", () => { this.showAllQuestions = !this.showAllQuestions; renderQuestionsV2(); });
    navigation.querySelector("details").addEventListener("toggle", (event) => this.folds.set("outline", event.target.open));
    document.querySelectorAll("[data-question-count]").forEach((node) => { node.textContent = questions.length; });
    if (!questions.length) document.getElementById("question-list").innerHTML = '<div class="studio-empty"><strong>No questions yet</strong><p>Use + Add question to build the first question in this set.</p></div>';
    // Bring type, topic, and points together; keep text formatting adjacent to the prompt.
    panel.querySelectorAll(".question-card[data-question-index]").forEach((card) => {
      card.querySelectorAll("[contenteditable='true']").forEach((editor) => {
        if (editor.hasAttribute("aria-label")) return;
        const kind = editor.dataset.richKind;
        editor.setAttribute("aria-label", kind === "prompt" ? `Question ${Number(card.dataset.questionIndex) + 1} prompt` : `Answer choice ${Number(editor.dataset.choiceIndex) + 1}`);
      });
      const row = card.querySelector(".question-type-row");
      const topic = card.querySelector("[data-question-field='topic']");
      const points = card.querySelector("[data-question-field='points']");
      if (!row || !topic || !points) return;
      const id = card.querySelector(".question-code-id");
      card.querySelector("header").title = id.textContent;
      row.append(topic.closest("label"), points.closest("label"));
      card.append(id);
    });
  },

  moveSaveBar(root, label) {
    const bar = root.querySelector(":scope > .save-row");
    const head = root.querySelector(":scope > header, :scope > .panel-head");
    if (!bar || !head) return;
    bar.classList.add("studio-save-bar");
    const save = bar.querySelector(".primary");
    if (save) { save.textContent = app.saving ? "Saving…" : label; save.title = `${label} (Ctrl / ⌘ + S)`; }
    head.after(bar);
  },

  mountStandalone() {
    const root = document.querySelector(".standalone-bank-editor");
    if (!root?.querySelector(".standalone-bank-form")) return;
    this.moveSaveBar(root, "Save Part B question");
    const split = this.element("div", "studio-standalone-split");
    root.append(split);
    split.append(root.querySelector(".standalone-bank-form"), root.querySelector(".standalone-bank-preview"));
  },

  searchablePicker(container, key, placeholder, itemSelector = ":scope > article") {
    if (!container) return;
    const tools = this.element("div", "studio-picker-tools", `<input aria-label="${placeholder}" type="search" placeholder="${placeholder}"><span role="status"></span>`);
    const input = tools.querySelector("input");
    input.value = this.filters.get(key) || "";
    container.before(tools);
    const filter = () => {
      this.filters.set(key, input.value);
      const query = input.value.toLowerCase().trim();
      let count = 0;
      container.querySelectorAll(itemSelector).forEach((card) => { card.hidden = !card.textContent.toLowerCase().includes(query); if (!card.hidden) count++; });
      tools.querySelector("span").textContent = `${count} results`;
    };
    input.addEventListener("input", filter);
    filter();
  },

  mountTestBuilder() {
    const root = document.getElementById("test-builder");
    this.moveSaveBar(root, "Save English test");
    const sections = root.querySelector(".english-section-stack");
    const library = root.querySelector(".passage-version-groups");
    const standalone = root.querySelector(".standalone-picker");
    if (!sections || !library || !standalone) return;
    const libraryTitle = library.previousElementSibling?.previousElementSibling;
    const libraryNote = library.previousElementSibling;
    const bankHead = standalone.previousElementSibling;
    if (!libraryTitle || !libraryNote || !bankHead) return;
    const passageDetails = this.element("details", "studio-disclosure", '<summary>Passage library <span>Add to Reading or Part A</span></summary>');
    passageDetails.open = this.folds.get("test-passages") ?? true;
    libraryTitle.before(passageDetails);
    passageDetails.append(libraryTitle, libraryNote, library);
    const bankDetails = this.element("details", "studio-disclosure", '<summary>Part B bank <span>Add stand-alone questions</span></summary>');
    bankDetails.open = this.folds.get("test-bank") ?? false;
    bankHead.before(bankDetails);
    bankDetails.append(bankHead, standalone);
    const columns = this.element("div", "studio-builder-columns");
    passageDetails.before(columns);
    const banks = this.element("aside", "studio-builder-banks");
    columns.append(sections, banks);
    banks.append(passageDetails, bankDetails);
    passageDetails.addEventListener("toggle", () => this.folds.set("test-passages", passageDetails.open));
    bankDetails.addEventListener("toggle", () => this.folds.set("test-bank", bankDetails.open));
    this.searchablePicker(library, "test-passages", "Search passage library…", ":scope > .passage-version-group");
    this.searchablePicker(standalone, "test-bank", "Search Part B bank…");
    const sectionNav = this.element("nav", "studio-practice-nav studio-test-nav", ["Reading", "Part A", "Part B", "All sections"].map((label, index) => `<button type="button" data-test-section="${index}">${label}</button>`).join(""));
    sectionNav.setAttribute("aria-label", "English test sections");
    columns.before(sectionNav);
    const showSection = (selected) => {
      this.testSection = selected;
      [...sections.children].forEach((section, index) => { section.hidden = selected !== "3" && String(index) !== selected; });
      passageDetails.hidden = selected === "2";
      bankDetails.hidden = selected !== "2" && selected !== "3";
      if (selected === "2") bankDetails.open = true;
      sectionNav.querySelectorAll("button").forEach((button) => { const active = button.dataset.testSection === selected; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
    };
    sectionNav.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => showSection(button.dataset.testSection)));
    showSection(this.testSection);
  },

  mountMath() {
    const root = document.getElementById("math-builder");
    this.moveSaveBar(root, "Save math section");
    const importButton = document.getElementById("open-math-import");
    root.querySelector(".studio-save-bar")?.prepend(importButton);
    const stack = root.querySelector(".math-editor-stack");
    if (stack) {
      const grid = stack.querySelector(".question-grid");
      const metadata = this.element("div", "studio-math-metadata");
      ["type", "topic", "points"].forEach((key) => metadata.append(grid.querySelector(`[data-math-field='${key}']`).closest("label")));
      const codeId = grid.querySelector(".question-code-id");
      stack.querySelector(":scope > .panel-head").after(metadata);
      const optional = this.element("details", "studio-disclosure wide", '<summary>Directions & supporting text <span>Optional</span></summary>');
      const instructions = grid.querySelector("[data-rich-kind='math-instructions']").closest(".wide");
      const stimulus = grid.querySelector("[data-rich-kind='math-stimulus']").closest(".wide");
      grid.append(optional); optional.append(instructions, stimulus, codeId);
      optional.open = this.folds.get("math-directions") ?? false;
      optional.addEventListener("toggle", () => this.folds.set("math-directions", optional.open));
      const studentView = document.getElementById("open-math-student-preview");
      studentView.className = "secondary";
      studentView.textContent = "Student view";
      root.querySelector(".studio-save-bar").insertBefore(studentView, document.getElementById("add-math-question"));
      const nav = this.element("nav", "studio-practice-nav studio-math-tabs", '<button type="button" data-math-section="question">Question</button><button type="button" data-math-section="answers">Answers & scoring</button><button type="button" data-math-section="preview">Live preview</button>');
      nav.setAttribute("aria-label", "Math editing sections");
      metadata.after(nav);
      grid.dataset.mathPanel = "question";
      const preview = document.getElementById("math-live-preview").parentElement;
      preview.dataset.mathPanel = "preview";
      stack.querySelectorAll(":scope > .math-answer-editor, :scope > .unsupported").forEach((section) => { section.dataset.mathPanel = "answers"; });
      stack.querySelectorAll(":scope > .math-answer-editor").forEach((section) => {
        if (!section.querySelector("[data-rich-kind='math-choice']")) return;
        const toolbar = this.element("div", "question-rich-toolbar", richToolbarHtml("Answer text formatting"));
        section.prepend(toolbar);
        bindRichEditors(toolbar);
      });
      // Optional visuals no longer occupy a full upload panel on every text-only question.
      const image = stack.querySelector(".math-question-image");
      if (image) {
        const details = this.element("details", "studio-disclosure studio-math-image", '<summary>Question image <span>Upload, caption & accessibility</span></summary>');
        details.open = Boolean(app.mathDraft.questions[app.selectedMathQuestionIndex]?.image) || (this.folds.get("math-image") ?? false);
        details.dataset.mathPanel = "question";
        image.before(details); details.append(image);
        details.addEventListener("toggle", () => this.folds.set("math-image", details.open));
      }
      const show = (section) => {
        this.mathSection = section;
        const question = app.mathDraft.questions[app.selectedMathQuestionIndex];
        let reference = stack.querySelector(".studio-math-reference");
        if (!reference) {
          reference = this.element("details", "studio-disclosure studio-math-reference", '<summary>Question reference</summary><div class="studio-reference-text"></div>');
          reference.dataset.mathPanel = "answers";
          reference.open = true;
          nav.after(reference);
        }
        reference.querySelector("div").innerHTML = renderMathRichTextHtml(question.promptHtml, question.prompt || "Write the question in the Question panel.");
        stack.querySelectorAll("[data-math-panel]").forEach((panel) => { panel.hidden = panel.dataset.mathPanel !== section; });
        nav.querySelectorAll("button").forEach((button) => { const active = button.dataset.mathSection === section; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
        stack.parentElement.scrollTop = 0;
      };
      nav.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => show(button.dataset.mathSection)));
      show(this.mathSection);
    }
    const questionNav = root.querySelector(".math-question-nav");
    if (questionNav) {
      const search = this.element("input", "search studio-math-search");
      search.type = "search";
      search.placeholder = "Find question or #…";
      search.setAttribute("aria-label", "Find a math question by number, prompt, or type");
      search.value = this.filters.get("math-questions") || "";
      questionNav.prepend(search);
      const filter = () => {
        this.filters.set("math-questions", search.value);
        const query = search.value.trim().toLowerCase().replace(/^#/, "");
        questionNav.querySelectorAll("[data-math-question-index]").forEach((button) => {
          button.hidden = /^\d+$/.test(query)
            ? query !== String(Number(button.dataset.mathQuestionIndex) + 1)
            : !button.textContent.toLowerCase().includes(query);
        });
        let empty = questionNav.querySelector(".studio-search-empty");
        if (!empty) { empty = this.element("p", "field-note studio-search-empty", "No questions match. Clear the search to see all questions."); questionNav.append(empty); }
        empty.hidden = Boolean(questionNav.querySelector("[data-math-question-index]:not([hidden])"));
      };
      search.addEventListener("input", filter);
      filter();
    }
    const importPanel = root.querySelector(".math-import-panel");
    if (importPanel) {
      const dialog = this.element("dialog", "studio-import-dialog");
      dialog.setAttribute("aria-label", "Import math question");
      root.append(dialog); dialog.append(importPanel);
      const status = this.element("div", "studio-dialog-status");
      status.setAttribute("role", "status");
      status.hidden = true;
      importPanel.querySelector(".panel-head").after(status);
      dialog.addEventListener("cancel", (event) => { event.preventDefault(); app.mathImportOpen = false; renderMathBuilder(); });
      dialog.showModal();
    }
  },

  mountPractice() {
    const form = document.getElementById("practice-question-form");
    if (form.querySelector(".studio-practice-nav")) return;
    const nav = this.element("nav", "studio-practice-nav", '<button type="button" data-practice-section="write">Question & answers</button><button type="button" data-practice-section="explain">Explanations</button><button type="button" data-practice-section="all">All fields</button>');
    nav.setAttribute("aria-label", "Practice editing sections");
    form.querySelector(".save-row").after(nav);
    const edit = this.element("div", "studio-practice-body");
    form.append(edit);
    ["practice-basics", "practice-content", "practice-answers", "practice-explanations"].forEach((id) => edit.append(document.getElementById(id)));
    const select = (section) => {
      document.getElementById("practice-explanations").hidden = section === "write";
      ["practice-content", "practice-answers"].forEach((id) => { document.getElementById(id).hidden = section === "explain"; });
      nav.querySelectorAll("button").forEach((button) => { const active = button.dataset.practiceSection === section; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
      edit.scrollTop = 0;
    };
    nav.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => select(button.dataset.practiceSection)));
    // Native form validation must reveal required fields before the browser focuses them.
    form.addEventListener("invalid", () => select("all"), true);
    const preview = document.querySelector(".practice-preview-panel");
    const paste = document.querySelector(".practice-paste-panel");
    const side = document.querySelector(".practice-side-column");
    const sideNav = this.element("nav", "studio-practice-nav", '<button type="button" data-practice-tool="paste">One-box paste</button><button type="button" data-practice-tool="preview">Publish preview</button>');
    sideNav.setAttribute("aria-label", "Practice tools");
    side.prepend(sideNav);
    this.showPracticeTool = (tool) => {
      paste.hidden = tool !== "paste"; preview.hidden = tool !== "preview";
      sideNav.querySelectorAll("button").forEach((button) => { const active = button.dataset.practiceTool === tool; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
    };
    sideNav.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => this.showPracticeTool(button.dataset.practiceTool)));
    this.showPracticeTool("paste");
    select("write");
  },
};
