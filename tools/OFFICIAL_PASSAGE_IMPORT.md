# Official Passage Importer

The Content Studio can turn one passage from an official exam PDF into an
editable, unsaved passage draft without manually retyping the passage or its
questions.

## Workflow

1. Open **Exam passages** and choose **Import official passage**.
2. Enter one exact passage title or its original question range. Add the
   official form label when known.
3. Choose **Copy PDF extraction prompt**.
4. Paste the prompt into ChatGPT and attach the official PDF.
5. Paste ChatGPT's JSON response into the importer, or upload the response as a
   `.json` or `.txt` file.
6. Choose **Validate and review**. Check the complete transcription, the
   question count, every answer, and any visual warnings.
7. Choose **Create unsaved passage draft**, review it in Student view, and save
   only when it is correct.

The generated prompt is intentionally passage-specific. It tells ChatGPT to
stop at the next passage, remove recurring PDF headers and footers, preserve
paragraphs, poem lines, numbered sentences, and footnotes, and normalize
printed E-H answer labels to A-D in their original order. It also embeds the
Content Studio's section-specific question-topic lists. Reading Comprehension
imports can use only the eight reading topics; Revising/Editing imports can use
only Sentence Structure, Pronouns, Verbs, Modifiers, Punctuation, Word Choice &
Precision, Topic & Transitions, or Relevance & Conclusion.

Official PDFs do not always contain answer keys. The prompt requires ChatGPT to
label solved answers as inferred, and the Studio always displays an answer-key
verification warning during review. Required diagrams, tables, and other
visuals are described in review warnings and must be uploaded separately.
