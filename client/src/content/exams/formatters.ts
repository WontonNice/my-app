import type { ExamPassage, ExamPassageLine, ExamQuestionImage } from "./types";

type PlainTextPassageInput = {
  author?: string;
  blurb?: string;
  id: string;
  image?: ExamQuestionImage;
  lineNumberInterval?: number;
  richText?: string;
  sourceNote?: string;
  text: string;
  title: string;
};

type RichTextBlock = {
  html: string;
  text: string;
};

function codePointFromEntity(value: string, radix: number) {
  const codePoint = Number.parseInt(value, radix);
  return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
    ? String.fromCodePoint(codePoint)
    : "\uFFFD";
}

function plainTextFromHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;|&#039;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_entity, value: string) => codePointFromEntity(value, 16))
    .replace(/&#(\d+);/g, (_entity, value: string) => codePointFromEntity(value, 10));
}

function richTextBlocks(value: string): RichTextBlock[] {
  const blocks: RichTextBlock[] = [];
  const normalized = value.trim();
  const blockPattern = /<(p|div)>([\s\S]*?)<\/\1>/gi;
  for (const match of normalized.matchAll(blockPattern)) {
    blocks.push({ html: match[2], text: plainTextFromHtml(match[2]).trim() });
  }
  if (blocks.length) return blocks;
  return normalized.split(/<br\s*\/?>/gi).map((html) => ({
    html,
    text: plainTextFromHtml(html).trim(),
  }));
}

function richTextLines(value: string): RichTextBlock[] {
  return richTextBlocks(value).flatMap((block) => {
    const lines = block.html.split(/<br\s*\/?>/gi);
    if (lines.length > 1 && !lines.at(-1)) lines.pop();
    return lines.map((html) => ({ html, text: plainTextFromHtml(html).trim() }));
  });
}

function numberRichSentences(value: string, firstSentenceNumber: number) {
  let nextSentenceNumber = firstSentenceNumber;
  let needsNumber = true;
  let afterSentenceTerminator = false;

  return value
    .split(/(<[^>]+>)/g)
    .map((token) => {
      if (token.startsWith("<")) return token;
      let output = "";
      for (const character of token) {
        if (needsNumber && !/\s/.test(character)) {
          output += `(${nextSentenceNumber}) `;
          nextSentenceNumber += 1;
          needsNumber = false;
        } else if (afterSentenceTerminator && !/[.!?\s]/.test(character)) {
          output += `(${nextSentenceNumber}) `;
          nextSentenceNumber += 1;
          afterSentenceTerminator = false;
        }
        output += character;
        if (/[.!?]/.test(character)) {
          afterSentenceTerminator = true;
        }
      }
      return output;
    })
    .join("");
}

export function createPlainTextPassage({
  author,
  blurb,
  id,
  image,
  lineNumberInterval = 5,
  richText,
  sourceNote,
  text,
  title,
}: PlainTextPassageInput): ExamPassage {
  const passageLines: ExamPassageLine[] = [];

  if (blurb) {
    passageLines.push({ kind: "intro", text: blurb });
  }

  passageLines.push({ align: "center", kind: "title", text: title });

  if (author) {
    passageLines.push({ align: "center", kind: "byline", text: `by ${author}` });
  }

  if (image) {
    passageLines.push({ image, kind: "image", text: "" });
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

  const richLines = richText?.trim() ? richTextLines(richText) : null;
  (richLines ?? normalizedText.split(/\r?\n/).map((rawLine) => ({ html: "", text: rawLine.trimEnd() })))
    .forEach((line) => {
      const nextLine = line.text;

      if (!nextLine.trim()) {
        passageLines.push({ text: "" });
        return;
      }

      passageLines.push({
        lineNumber:
          contentLineNumber === 1 || contentLineNumber % lineNumberInterval === 0
            ? String(contentLineNumber)
            : "",
        html: line.html || undefined,
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
  blurb?: string;
  header?: string;
  id: string;
  image?: ExamQuestionImage;
  richText?: string;
  sourceNote?: string;
  text: string;
  title: string;
};

export function createProsePassage({
  author,
  blurb,
  header,
  id,
  image,
  richText,
  sourceNote,
  text,
  title,
}: ProsePassageInput): ExamPassage {
  const passageLines: ExamPassageLine[] = [];

  if (blurb || header) {
    passageLines.push({ kind: "intro", text: blurb || header || "" });
  }

  passageLines.push({ align: "center", kind: "title", text: title });

  if (author) {
    passageLines.push({ align: "center", kind: "byline", text: `by ${author}` });
  }

  if (image) {
    passageLines.push({ image, kind: "image", text: "" });
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

  const paragraphs = richText?.trim()
    ? richTextBlocks(richText)
    : normalizedText.split(/\r?\n\s*\r?\n/).map((rawParagraph) => ({
        html: "",
        text: rawParagraph.replace(/\s+/g, " ").trim(),
      }));
  paragraphs.forEach((paragraph, index) => {
    passageLines.push({
      html: paragraph.html || undefined,
      lineNumber: String(index + 1),
      text: paragraph.text,
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
  author?: string;
  blurb?: string;
  id: string;
  image?: ExamQuestionImage;
  richText?: string;
  sourceNote?: string;
  text: string;
  title: string;
};

export function createSentenceNumberedPassage({
  author,
  blurb,
  id,
  image,
  richText,
  sourceNote,
  text,
  title,
}: SentenceNumberedPassageInput): ExamPassage {
  const passageLines: ExamPassageLine[] = [];
  if (blurb) passageLines.push({ kind: "intro", text: blurb });
  passageLines.push({ align: "center", kind: "title", text: title });
  if (author) passageLines.push({ align: "center", kind: "byline", text: `by ${author}` });
  if (image) passageLines.push({ image, kind: "image", text: "" });
  passageLines.push({ text: "" });
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

  const richParagraphs = richText?.trim() ? richTextBlocks(richText) : null;
  (richParagraphs ?? normalizedText.split(/\r?\n\s*\r?\n/).map((text) => ({ html: "", text }))).forEach((paragraph) => {
    const rawParagraph = paragraph.text;
    const paragraphStartNumber = sentenceNumber;
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
      html: paragraph.html ? numberRichSentences(paragraph.html, paragraphStartNumber) : undefined,
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
