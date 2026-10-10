# Universal document import: audit, contract and workflow

## Reusable prompt

[DOCUMENT_EXTRACTION_PROMPT.txt](DOCUMENT_EXTRACTION_PROMPT.txt) is the complete
copy/paste prompt, including source authorization, exact fields/enums/taxonomy,
source-only answers and explanations, visual requirements and completeness audit.
Upload the authorized student document, any answer key and explanation guide to
ChatGPT; paste that prompt and specify the requested scope. No source document
needs to be uploaded to Content Studio itself. Import the returned raw JSON or file.

The same prompt generator supplies the editor's copy actions. Regenerate it and
the contract after taxonomy/schema changes with `npm run content-editor:prompt`.
`npm run test:document-import` checks that the saved artifacts are synchronized.

## Existing architecture found

Content Studio is a local authoring tool (`tools/content-studio.mjs`, port 4319),
not a Supabase-backed content CMS. It reads passage/question TypeScript with the
TypeScript AST, edits those objects in `content-studio.html`, validates with the
existing passage/Math normalizers, then writes and registers the existing sources.
Question topic lists come from `tools/content-topics.json`; Math topics come from
the existing editor. Existing passage source hashes protect against stale saves.

The original import path accepted `nathan-tutors-official-passage-v1` with one
`passage`, top-level `reviewNotes` and `visuals`. It had transient drafts, title/
version ID duplicate checks, section topic validation, A-D choice normalization,
and required answer keys. Its old prompt instructed the model to infer missing
answers and generate missing explanations. Visual warnings were informational.
The separate existing Math format was `nathan-tutors-math-question-v1`.

The finished pipeline is:

1. Raw ChatGPT-format JSON -> shared `document-import.cjs` parser and checks.
2. Review preview -> **Save all as review drafts**.
3. Private, revision-checked `tools/.content-drafts/document-imports.json` ->
   **Saved import drafts**, review edits, image uploads and source checks.
4. **Publish reviewed passage** -> existing passage validation/source writer and
   library registration; **Publish reviewed Math questions** -> existing Math
   validation/writer and selected assessment registration.
5. Existing content exporters -> `server/data/exam-content.json`, learning/board
   catalogs, and `server/data/library-books.json` -> existing student renderers.
6. Student responses/attempts continue using the existing database routes.

No database migration or separate student content system is introduced. Private
review metadata is not part of student content exports. Source attribution that
belongs in the student document remains in `sourceNote`. Drafts are local to this
checkout and ignored by Git; back up that directory if moving an unfinished import.

## Small compatible extensions

The format/version stays **`nathan-tutors-official-passage-v1`, version 1**. The
payload has no `schemaVersion` field. Keep the single `passage` shape, or use the
optional ordered `passages` array. Optional `mathQuestions` supports an independent
or mixed Math batch; its document-level review is the root `review` object.

The optional `review` and `visuals` fields store source filenames/pages, original
question numbers, separate answer/explanation sources, topic/difficulty confidence
and provenance, source counts and review warnings. Unknown or incomplete source
content can be stored in a draft. Unsupported response formats are retained but
cannot be published through an unsupported grader. Source text is never synthesized
by these authoring APIs.

The editor uses A-D for four-choice questions, mapping E-H source labels and keys
by position. It preserves choice wording, order, two to eight choices,
provided explanations, source numbering, poetry indentation/stanzas, and paragraph
breaks. The source-layout formatter retains the exam viewer’s automatic prose paragraph
number badges, while preserving source text and avoiding duplicated printed labels. English numeric/short responses use existing response/grading fields.
Essays and other unsupported interactions remain drafts until supported authoring/
grading exists. Passage publication still requires at least one question; an
independent question set can have empty passage text.

## Exact contract

[document-import-contract.json](document-import-contract.json) is generated from
the same contract used by parsing/review. It lists actual fields, enums, nullable
values and the exact topic taxonomy. It is a contract reference, not a replacement
content format or a JSON Schema validator.

- Root: `format`; `passage` OR `passages`; optional `mathQuestions`, `review`,
  `reviewNotes` and `visuals`.
- Passage: `title`, `author`, optional exact `byline`/`subtitle`, `blurb`, `format`, `passageType`, `passageCategory`,
  `section`, `label`, `versionLabel`, `sourceNote`, `teacherSource`, `text`,
  optional faithful `richText`, ordered `questions`, `review`, `visuals`.
- Question: `id`, `type`, `topic`, `points`, `prompt`, optional `instructions` /
  `stimulus`, ordered `choices` (`id`, `text`, optional `html`/`math`),
  type-specific key, `explanation`, `review`, `visuals`.
- Keys: `correctChoiceId` for one choice, `correctChoiceIds` plus source
  `requiredSelections` for multi-select, `correctTextAnswers` for typed answers.
  Unknown single key/explanation: `""` or `null` (normalized to empty string).
  Unknown multi/typed keys: `[]`. The parser never fills an absent key.
- Formats: `prose`, `poem`, `sentence_prose`. Passage types: `informational`,
  `literary`, `poem`, `long_reading`. Categories: `official_handbook`, `prestige`,
  `miscellaneous`. English sections: `reading`, `revising_editing_a`.
- Review provenance: `source`, `inferred`, `unknown`, `teacher`. Confidence:
  number 0-1 or null. Source pages are 1-based PDF page numbers; printed labels
  can be stored separately in `printedPages`.
- Required arrays must remain arrays, not null. Question IDs must be unique
  lowercase hyphenated identifiers; source choice IDs must be unique within each question; editor IDs are assigned
  A, B, C, D by position. Original source labels remain in `review.sourceChoiceIds`.
  Publication namespaces English question IDs to avoid cross-passage collisions.
- Source title/IDs, supported response structure and unique choices must be valid
  for source writes. The explicit Publish passage action can retain blank answers,
  unfinished question text or unclassified topics for editing afterward. Missing values
  can remain visibly unresolved in a draft. Safe rich HTML is sanitized using the
  editor's existing sanitizers; source plain text remains retained.

## Exact skill taxonomy

Reading (`section=reading`):

- Central Idea & Theme
- Author's Point of View
- Word & Phrase Meaning
- Figurative Language & Imagery
- Tone & Mood
- Text Structure & Purpose
- Evidence & Support
- Inference

Revising/Editing (`section=revising_editing_a`):

- Sentence Structure
- Pronouns
- Verbs
- Modifiers
- Punctuation
- Word Choice & Precision
- Topic & Transitions
- Relevance & Conclusion

Math:

- Arithmetic
- Algebra
- Geometry
- Measurement
- Number Sense
- Percent
- Probability & Statistics
- Rates & Unit Conversion
- Ratios & Proportions
- Uncategorized

`type` is the response format, distinct from `topic`. Unknown/out-of-taxonomy
classification stays blank in a draft. Difficulty is optional source/provenance
metadata; it is not fabricated to satisfy an exam/passage field.

## Warnings, review states and publication

Warning codes:

`IMAGE_REQUIRED`, `ANSWER_KEY_MISSING`, `EXPLANATION_MISSING`,
`LOW_CONFIDENCE_QUESTION_TYPE`, `UNCERTAIN_TEXT_EXTRACTION`,
`POSSIBLE_MISSING_QUESTION`, `POSSIBLE_FORMATTING_LOSS`, `SOURCE_TYPO_SUSPECTED`,
`TABLE_REVIEW_REQUIRED`, `UNRESOLVED_VISUAL`, `SOURCE_KEY_AMBIGUOUS`,
`UNSUPPORTED_RESPONSE_TYPE`, `COUNT_MISMATCH`.

Imported warning state is `unresolved`. Teachers can set `acknowledged` or
`resolved`. Draft records are `draft` or `published`; saving review edits returns
the record to draft. Visual state is `unresolved` or `resolved`; resolved requires
an uploaded image and alt text. The strict review API checks required image files; explicit passage publication
can retain unresolved source-visual descriptions for later attachment.

Teachers confirm `sourceReviewed`, `completenessReviewed`, and each question's
`classificationReviewed`. Known source question/choice counts must match. The strict review API continues checking required keys; the explicit teacher
Publish passage action can retain missing keys without fabricating answers. Missing explanation is displayed
as an informational issue because the existing exam model makes it optional; it
stays blank unless the teacher explicitly supplies one. A declared extraction
warning about an explanation must still be reviewed/acknowledged.

The shared parser resets imported approval flags. Nothing is published by parsing
or saving a draft. Reimporting identical content reuses its existing draft;
fingerprints plus existing title/version checks prevent duplicate copies. A
changed source/version requires review instead of silently replacing existing work.

## Teacher workflow

Run `npm run content-editor`, open **Exam passages -> Import documents**, copy the
prompt, and attach the authorized source files in ChatGPT. Paste/upload its JSON,
validate, and choose **Save all as review drafts**. Open the saved draft, review
one question at a time, inspect counts/source pages and classification confidence,
and resolve required visuals using **Upload original image / prepared crop**.

Prepare/crop the actual source image before upload; the review UI accepts the
prepared crop. Existing image slots support one image per question/choice, so
combine multiple related visual parts into one faithful crop when needed. Passage
visuals support multiple images. Images are not generated from source descriptions.

**Open passage editor / Student view** reuses the established passage editor and
preview. Use **Save review draft** for unfinished work, then **Review warnings /
images** to return to review. Choose Publish passage to save immediately and continue editing in the normal
passage editor.
For Math, select the destination exam and publish the reviewed questions through
the existing Math writer. Existing assessment/source hashes continue protecting
against stale writes.

## Verification and practical limits

`npm run test:document-import` checks prompt/contract synchronization, the actual
Content Studio HTTP import/save/reload/publish paths, draft isolation/revision
conflicts/duplicates, missing-data and image gates, Math writer reuse, and actual
student React component rendering. Other content-editor/library regression suites
cover the existing content authoring and server grading paths.

Original public-domain QA fixtures live in `tools/fixtures/document-import`:
`questions.pdf` (four pages), `answers.pdf`, `explanations.pdf`, plus an independently
checked expected import. They contain prose, an intentionally unusual possessive,
poetry with indentation/stanzas, headings, a multipage passage, a source table and
diagram, seven questions and twenty-eight E-H choices. One question deliberately
has no key/explanation and low classification confidence. PDF page text and rendered
pages are checked against the expected source; tests compare imported text and
choices character-for-character and retain separate key/guide references.

This verifies ChatGPT-format payloads, not a live ChatGPT document-extraction run.
The browser automation runtime failed to start during verification, so live editor
click-through remains unverified. The prompt cannot guarantee perfect OCR/model
output for every document; counts, warnings and source review make discrepancies
visible without discarding successful extraction. No real student data or published
fixture content is written by the isolated tests.

## Publish first, edit afterward

**Publish passage** saves the imported passage immediately and opens its saved
source in the normal passage editor. Review checkboxes, warning acknowledgements,
classification review, source-count warnings, missing answers and unattached
visual warnings do not block this explicit teacher action. Missing values stay
blank; the importer does not solve questions or invent images. Private review
notes and unresolved visual descriptions remain in Saved import drafts for later.
Math publication retains its existing review checks.

The existing valid source-file/ID, supported-format/type, unique-question/choice
and concurrent-edit checks still protect repository writes. Changes after
publication are made using the saved passage and its current source hash.

Imported Student view uses the same passage-title and paragraph classes as the
student renderer. A single imported passage visual uses the existing main image
slot; additional distinct visuals remain supported. Saving deduplicates identical
passage image files across the main and extra-image slots by file-content hash,
including when the same crop was uploaded under different filenames. Question
images are kept in their own question scopes.

The live passage preview uses the full Student view's passage-markup function
and student stylesheet in an isolated frame. Imported prose and student exam
content both number nonempty body paragraphs; titles, bylines, headings, lists and
spacers do not consume paragraph numbers. Stored source wording remains unchanged.

Paragraph numbering can be controlled in the prose passage toolbar with Number
paragraph, No paragraph number, and Subheading. These use the existing rich HTML
model: `<p data-numbered="false">` excludes a body block, `true` explicitly
includes it, and heading tags exclude subheadings even when they end with a period.
The sanitizer retains only the bounded true/false setting. Excluded blocks do not
advance the body paragraph counter. Printed labels that form a consistent body
paragraph sequence are represented by the number badges while source text stays
unchanged; meaningful values such as years remain in the paragraph.
