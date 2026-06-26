import type { ExamPassage, ExamPassageLine } from "./types";

type PlainTextPassageInput = {
  author?: string;
  id: string;
  lineNumberInterval?: number;
  sourceNote?: string;
  text: string;
  title: string;
};

export function createPlainTextPassage({
  author,
  id,
  lineNumberInterval = 5,
  sourceNote,
  text,
  title,
}: PlainTextPassageInput): ExamPassage {
  const passageLines: ExamPassageLine[] = [{ align: "center", kind: "title", text: title }];

  if (author) {
    passageLines.push({ align: "center", kind: "byline", text: `by ${author}` });
  }

  passageLines.push({ text: "" });

  let contentLineNumber = 1;
  const normalizedText = text.trim();

  if (!normalizedText) {
    passageLines.push({ text: "Passage content has not been added for this assessment yet." });

    return {
      format: "poem",
      id,
      lines: passageLines,
      sourceNote,
      title,
    };
  }

  normalizedText
    .split(/\r?\n/)
    .forEach((rawLine) => {
      const nextLine = rawLine.trimEnd();

      if (!nextLine.trim()) {
        passageLines.push({ text: "" });
        return;
      }

      passageLines.push({
        lineNumber:
          contentLineNumber === 1 || contentLineNumber % lineNumberInterval === 0
            ? String(contentLineNumber)
            : "",
        text: nextLine,
      });

      contentLineNumber += 1;
    });

  return {
    format: "poem",
    id,
    lines: passageLines,
    sourceNote,
    title,
  };
}

type ProsePassageInput = {
  author?: string;
  header?: string;
  id: string;
  sourceNote?: string;
  text: string;
  title: string;
};

export function createProsePassage({
  author,
  header,
  id,
  sourceNote,
  text,
  title,
}: ProsePassageInput): ExamPassage {
  const passageLines: ExamPassageLine[] = [];

  if (header) {
    passageLines.push({ kind: "intro", text: header });
  }

  passageLines.push({ align: "center", kind: "title", text: title });

  if (author) {
    passageLines.push({ align: "center", kind: "byline", text: `by ${author}` });
  }

  passageLines.push({ text: "" });
  const normalizedText = text.trim();

  if (!normalizedText) {
    passageLines.push({
      lineNumber: "1",
      text: "Passage content has not been added for this assessment yet.",
    });

    return {
      format: "prose",
      id,
      lines: passageLines,
      sourceNote,
      title,
    };
  }

  normalizedText.split(/\r?\n\s*\r?\n/).forEach((rawParagraph, index) => {
    passageLines.push({
      lineNumber: String(index + 1),
      text: rawParagraph.replace(/\s+/g, " ").trim(),
    });
  });

  return {
    format: "prose",
    id,
    lines: passageLines,
    sourceNote,
    title,
  };
}

type SentenceNumberedPassageInput = {
  id: string;
  sourceNote?: string;
  text: string;
  title: string;
};

export function createSentenceNumberedPassage({
  id,
  sourceNote,
  text,
  title,
}: SentenceNumberedPassageInput): ExamPassage {
  const passageLines: ExamPassageLine[] = [{ align: "center", kind: "title", text: title }, { text: "" }];
  const normalizedText = text.trim();

  if (!normalizedText) {
    passageLines.push({
      text: "(1) Passage content has not been added for this assessment yet.",
    });

    return {
      format: "sentence_prose",
      id,
      lines: passageLines,
      sourceNote,
      title,
    };
  }

  let sentenceNumber = 1;

  normalizedText.split(/\r?\n\s*\r?\n/).forEach((rawParagraph) => {
    const numberedParagraph = (rawParagraph.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [rawParagraph])
      .map((sentence) => {
        const trimmedSentence = sentence.replace(/\s+/g, " ").trim();

        if (!trimmedSentence) {
          return "";
        }

        const nextSentence = `(${sentenceNumber}) ${trimmedSentence}`;
        sentenceNumber += 1;
        return nextSentence;
      })
      .filter(Boolean)
      .join(" ");

    passageLines.push({
      text: numberedParagraph,
    });
  });

  return {
    format: "sentence_prose",
    id,
    lines: passageLines,
    sourceNote,
    title,
  };
}
