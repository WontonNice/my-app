# Math document import

Use the same [universal extraction prompt](DOCUMENT_EXTRACTION_PROMPT.txt) for
Math and English documents. In **Exam math**, the copy action uses this shared
prompt. Returned `nathan-tutors-official-passage-v1` payloads are saved as review
drafts; select the destination exam in review before publishing Math questions.
Existing `nathan-tutors-math-question-v1` single-question JSON is still accepted
by the legacy Math import review endpoint.

See [Document import](DOCUMENT_IMPORT.md) for the exact contract, topic taxonomy,
review gates, source-only answer/explanation rules, and fixture verification.

Math uses `topic` for the main sorting category and `subtopic` for its specific
skill. Both must be configured under **Math → Manage categories** before a new
question can be saved or published. The editable taxonomy lives in
`tools/math-topics.json`; the extraction contract includes `mathSpecificTopics`
grouped under each main category. Leave uncertain classifications blank for
teacher review. Existing questions without a detail are marked Unclassified.

Math uses the question fields: `type`, `topic`, `subtopic`, `prompt`, `instructions`,
`choices`, `correctChoiceId`, `correctChoiceIds`, `requiredSelections`,
`correctTextAnswers`, `entryLayout`, `explanation`, and optional visual/math
presentation. Choice order is preserved; editor IDs and supplied answer keys are mapped to A-D by position. Numeric answer grading performs
format normalization, not algebraic evaluation; only supplied accepted answers
belong in `correctTextAnswers`. Unknown keys remain empty arrays/strings in drafts.

Static source diagrams and tables remain source images; they must not be turned
into interactive graph responses. Upload the supplied image or prepared crop in
review, including visual choices. In the math editor, paste images directly at
the text cursor with Ctrl+V / Command+V, or use Insert image / Paste image. Inline
images can sit between paragraphs in prompts, supporting text and choices; click
an image to change its description, width or remove it. The separate question
image and choice image controls remain available.

Supported math responses are `multiple_choice`, `multi_select`, `numeric_entry`,
`short_response`, `grid_in`, `inline_dropdown`, `math_drag_drop`,
`graph_point_select`, and `number_line_response`. The import accepts
`short_answer` / `short answer` / `short-answer` as aliases for `short_response`.
When changing numeric entry to short response, keep `correctTextAnswers`; the
obsolete `entryLayout` is removed. The generated extraction prompt describes the
keyed fields for every structured interaction. Dropdown templates may contain
multiple menus on a line and math between them.

Manage categories can remove used main categories and specific topics after you
choose a replacement main category and specific topic. Save categories applies
the reassignment; closing the manager discards pending changes.
