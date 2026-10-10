# Math document import

Use the same [universal extraction prompt](DOCUMENT_EXTRACTION_PROMPT.txt) for
Math and English documents. In **Exam math**, the copy action uses this shared
prompt. Returned `nathan-tutors-official-passage-v1` payloads are saved as review
drafts; select the destination exam in review before publishing Math questions.
Existing `nathan-tutors-math-question-v1` single-question JSON is still accepted
by the legacy Math import review endpoint.

See [Document import](DOCUMENT_IMPORT.md) for the exact contract, topic taxonomy,
review gates, source-only answer/explanation rules, and fixture verification.

Math uses the existing question fields: `type`, `topic`, `prompt`, `instructions`,
`choices`, `correctChoiceId`, `correctChoiceIds`, `requiredSelections`,
`correctTextAnswers`, `entryLayout`, `explanation`, and optional visual/math
presentation. Choice order is preserved; editor IDs and supplied answer keys are mapped to A-D by position. Numeric answer grading performs
format normalization, not algebraic evaluation; only supplied accepted answers
belong in `correctTextAnswers`. Unknown keys remain empty arrays/strings in drafts.

Static source diagrams and tables remain source images; they must not be turned
into interactive graph responses. Upload the supplied image or prepared crop in
review, including visual choices. Multiple visuals for a single question/choice
must be combined into one faithful crop because that existing slot holds one image.
