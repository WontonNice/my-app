# Math document import

In **Math**, choose the test you want to fill, then click **Import Math questions**.
Upload one or more complete JSON files or paste the returned JSON, check the
**Destination test**, and click **Import into Math test**. Questions are appended
to that test immediately, in source order. The normal Math Content Editor opens
on the first imported question. There is no separate Math review queue or publish
step.

Every new imported question has a red **Needs editing** label in the question
list and a red banner in its editor. Edit the prompt, choices, answer, category,
explanation and images with the existing controls, including MathLive and the
live student preview. **Save math section** keeps the red labels. **Mark finished**
saves your changes and clears the selected question's red label; other imported
questions remain red. The outline's **Filter questions → Needs editing (red)**
checkbox helps you find unfinished imports. Labels survive refreshes and restarts.

Missing answers stay empty. Missing classifications and source figures can be
fixed in the same editor; unfinished imported questions can be saved while these
are incomplete. Mark finished uses the normal Math question and category checks.
Nothing solves questions, generates explanations or invents missing images.
Source question numbers, PDF page references and unresolved figure descriptions
appear in the red banner's source notes. These are teacher-only records in
`tools/.content-drafts/math-import-status.json`; they are not written into exam
source questions or student exports.

Use **Copy extraction prompt** with your source document in ChatGPT. The shared
[extraction prompt](DOCUMENT_EXTRACTION_PROMPT.txt) uses
`nathan-tutors-official-passage-v1` with `mathQuestions` for batches. For one
question, paste the question object directly or use `{"question": {...}}`.
The `format` field may be omitted or use either
`nathan-tutors-official-passage-v1` or `nathan-tutors-math-question-v1`.
No batch metadata is needed. A single question without an ID gets a stable ID,
so exact retries preserve the existing question and any teacher edits. Supplied
IDs are retained. Multiple-question batches still require stable question IDs.
Do not combine `question` with `mathQuestions` or passage fields.
The importer does not directly extract PDFs; it accepts complete JSON from the
existing external extraction workflow.

## Source fidelity and continuation

Keep wording, choices and source order unchanged. Answers and explanations must
come from supplied keys/guides, with blanks when absent or uncertain. `topic` is
the main category and `subtopic` is its specific skill from
`mathSpecificTopics[topic]`. Use **Manage categories** to maintain those values.

For large imports, provide independently valid complete chunks with the same
`batch.sourceId` (exam/form/version) and `batch.jobId`. Keep each original printed
question number in `review.sourceQuestion`, and use `review.sourcePages` for
1-based PDF page positions. Optional `expectedQuestions`, `expectedTotal`,
`inventoryConfirmed`, `completedQuestions`, `unresolvedQuestions` and `nextScope`
track the source inventory. Root `review.expectedQuestionCount` describes only
that complete chunk. No inventory or human-review checkbox blocks insertion.

Exact retries and overlapping chunks do not duplicate questions already in the
test. Teacher edits and cleared red labels are preserved on retries. A changed
copy of an already imported question does not overwrite it; edit its existing
question in the Content Editor. Structurally unusable JSON records are reported
individually while editable neighbors are inserted. The original input is kept
in **Saved import drafts**. Correct an unusable record's JSON and import again;
unpublished unusable records can be repaired by that retry. Saved Math imports
also open the direct destination-test import form.

## Images and supported interactions

Paste a source image at the text cursor, use **Insert image**, or use the existing
question/choice image controls. Preserve static figures as source images rather
than inventing interactive graphs. An unattached figure is listed in source notes
so you can attach its actual crop while editing. SVG and SVGZ source crops are
supported alongside the existing image formats.

Supported Math responses: `multiple_choice`, `multi_select`, `numeric_entry`, `expression_entry`,
`short_response`, `grid_in`, `inline_dropdown`, `math_drag_drop`,
`graph_point_select` and `number_line_response`. Short-answer spelling aliases
normalize to `short_response`; this type omits `entryLayout`. Choice labels and
supplied keys map to A, B, C, D by position while retaining original source labels
privately. Unsupported response types remain in the retained input for manual
authoring rather than being silently converted.

Use `expression_entry` for **Calculator Input (Advanced)**: the five-row keypad
supports arithmetic, fractions, mixed numbers, roots, powers, parentheses,
comparisons, pi, and absolute value. The existing `numeric_entry` keypad stays
separate. Both preserve `correctTextAnswers`, `entryLayout`, and `entryVariable`.
Answer alternatives must be explicitly keyed; the player does not infer algebraic
equivalence.

The direct endpoint is `POST /api/math/import` with `assessmentId` and `source`
(or a saved `entryId`). It reuses the existing Math source writer, test registration
and assessment registry. Existing source-hash checks still protect normal edits.
Legacy private-draft/publication endpoints remain compatible for older clients;
the Math import button no longer uses that workflow. English passage import is
unchanged; see [Document import](DOCUMENT_IMPORT.md).

## Verification

Run `npm run test:document-import`, `npm run content-editor:test`,
`npm run content-editor:validate`, `npm run test:exam-review` and
`npm run typecheck`. Integration tests use isolated copies of exam sources and
check direct insertion, missing keys across supported interactions, red-label
persistence and clearing, corrected retries, partial failures, destination
isolation, private metadata and protection of teacher edits.

For browser QA, run `node tools/preview-content-studio.mjs --port=4320`.
It creates a disposable content copy under `tools/.content-drafts/qa-*` while
serving the repository's UI. `--keep` retains it and `--resume=<absolute path>`
reopens it. `POST /__qa/fail-next-save` makes its next content save fail. This
harness never writes authored exam content.
