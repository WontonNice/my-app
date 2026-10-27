# SAT Crash Course Reader

## Version 0.7.1: Math and TEI imports

Select **Mathematics** on the source page, then **All 50 math questions** in the
extension. Short-answer prompts use a different source container; the reader now
handles those without stopping at question 3. It captures source answer keys for
short responses, expression entry, multi-select, inline dropdowns, and sentence
blanks with multiple drag targets. The importer retains these as editable Math
question types. Unsupported interactions or unreadable keys remain flagged drafts,
never guessed answers. Complex MathLive expression keys that cannot be recovered
faithfully from rendered markup are left blank for teacher review.

In Content Studio, use **Math → Import → SAT Crash Course Reader · All 50 math
questions** and paste the complete Reader JSON. Restart Content Studio to load the
updated importer. Reload the extension in `chrome://extensions` and refresh the
source test tab before scanning; the popup should show **0.7.1**.

For **Part B**, choose English Language Arts on the source page and the extension's
Part B range option (Practice Test 3: 47–50). Use the SAT Crash Course option in
the Part B import dialog. Each question retains its own paragraph.

Run the TEI regression suite with:
`node --test extensions/sat-crash-course-reader/tei.test.cjs`

A read-only Chrome extension for extracting structured information from
`https://tutor.thesatcrashcourse.com/` while using the session that is already signed in
in Chrome.

## What it reads

- Links to individual tests and the surrounding card or table-row text
- Label/value fields found near each test
- Visible tables, headings, links, and optionally all visible page text
- On an SHSAT test preview: the test title, module, canonical passage, glossary terms,
  all questions sharing the passage, choices, correct answers,
  explanations, and media references

The extension does not request Chrome's cookie permission, export cookies, make API
requests, submit responses, or edit the website's content.

When **Include the correct answer** is enabled, the extension briefly clicks the preview
page's **Show answer** control, reads the selected choice, and restores the original
answer visibility. It does not submit an answer or alter the test content.

**Include explanations** is enabled by default and works independently of the answer
checkbox. For every captured question, the reader opens the site's separate **Explanation**
panel and waits up to three seconds for its text to load. The exported `explanation` goes
into the Content Editor's answer explanation field. JSON and CSV both include it, and the
popup reports how many explanations were captured. Missing explanations stay blank with
a question-specific warning; the question and its neighbors are still included. JSON also
records `explanationStatus` as `captured`, `missing`, or `not-requested`.

**Include all questions for this passage** is enabled by default. The reader uses
the preview's **BACK** button to find the first question, then **NEXT** until the passage
changes or the module ends. It returns to your starting question and restores its answer
visibility and explanation panel. For example,
starting on Question 1 of Digital SHSAT Practice Test 1 v2 captures Questions 1–7;
Question 8 belongs to the next passage and is excluded. Starting on Question 4 captures
Questions 1–7 too, then returns to Question 4. Uncheck the option for the original single-question behavior.

Keep the popup open and avoid navigating while reading. Capture is bounded to 50 questions
and a 60-second passage traversal. If navigation fails, the export includes the captured
questions and a warning rather than silently claiming a complete capture.

## Install locally

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this `sat-crash-course-reader` directory.
5. Open or reload the signed-in Tests page and click the extension icon.
6. Click **Read current page**, then copy or download the result.

Installing an unpacked extension gives its content script access to pages on the host
listed in `manifest.json`. Review the manifest and source before loading it.

If already installed, click **Reload** on the reader's card in `chrome://extensions`, then
refresh the signed-in preview tab to replace its old content script. No new permissions
are needed for version 0.6.1. The popup checks `readerVersion` and rejects stale page
scripts with refresh instructions instead of reporting a misleading one-question success.

## Output

JSON schema version 3 adds `testPreview.questions` (the captured question array) and
`testPreview.capture` (mode, stop reason, restoration status, and warnings). The existing
`testPreview.question` field remains the starting question for older consumers.
Every question includes its passage, so each is also usable independently.

Version 0.6.1 also captures safe bold, italic, underline, superscript/subscript and
paragraph formatting. It recognizes the source's KaTeX text styling, removes printed
paragraph-number markers from formatted body blocks, and retains source math as LaTeX
when a public annotation is available. New exports include `passage.formattedBlocks`,
`promptHtml`, choice `html`, and `explanationHtml`. Old plain-text exports remain accepted;
recapture the source to recover emphasis that an older export did not record.

Column-based KaTeX poems export as `passage.format: "poem"`. Verse rows retain their
line breaks and stanza gaps; the printed number column is excluded. Content Studio
automatically selects poem formatting and places its own line numbers beside verse.

## Import into Content Studio

In **Exam passages**, choose **Import SAT Crash Course passage**. Paste the complete
reader JSON or upload the JSON/TXT file. Choose the passage's section, format, library type,
and initial question topic, then click **Validate and review**. Review the passage, all
questions, keyed answers, explanations, and warnings; click **Import into Content Editor**.
The passage is saved as a draft and opens at the first question needing manual editing.
SAT Crash Course imports default to the **Prestige** passage category, which you can
change later in passage options. Source emphasis is preserved in passage bodies,
question prompts, answer choices and explanations.

Legacy single-question JSON is accepted with an incomplete-capture warning. Missing or
ambiguous correct answers stay blank for manual editing; mixed-passage batches are rejected. Media references are
flagged for manual image upload, not fetched. The importer does not infer answers or topics.

CSV exports produce one row per captured preview question. On other pages they use test
records when found, otherwise the first table, and finally the page's links as a fallback.

## Regression tests

Run from the repository root:

```powershell
node --test extensions/sat-crash-course-reader/reader.test.cjs
```

The tests use synthetic DOM fixtures matching the live preview controls and passage IDs.
They cover passage boundaries, midway starts, single-question mode, answer visibility,
separate explanation controls, delayed/missing explanations, explanation opt-out, panel
restoration, module endings, timeouts, restoration failure, safety limits, concurrent scans,
and CSV.

The page is a JavaScript application and its private DOM may change. If a test is missing
from the export, share a redacted sample of the generated JSON or the relevant page HTML
so the site adapter in `content.js` can be tuned to the exact markup.
