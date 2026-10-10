# Passage import compatibility

The former Official Passage Importer is now **Import documents** in Content Studio.
The format remains `nathan-tutors-official-passage-v1` (version 1); existing
single-`passage` imports remain accepted. Optional `passages`, `mathQuestions`,
`review`, and per-item `visuals` fields support complete document packages.

Use [the complete reusable prompt](DOCUMENT_EXTRACTION_PROMPT.txt) and follow
[the universal document workflow](DOCUMENT_IMPORT.md).

The extraction prompt now uses only supplied keys and explanations. Missing
answers remain blank; it never solves a question or generates an explanation.
Content is saved as a teacher-only review draft before publication.
