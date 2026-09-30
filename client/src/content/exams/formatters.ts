import type { ExamPassage, ExamPassageLine, ExamPassageType, ExamQuestionImage } from "./types";
import { createGlossaryRichText } from "../../../../tools/content-studio-glossary.js";

type PlainTextPassageInput = {
  author?: string;
  blurb?: string;
  coverImage?: ExamQuestionImage;
  id: string;
  image?: ExamQuestionImage;
  lineNumberInterval?: number;
  passageType?: ExamPassageType;
  richText?: string;
  glossary?: { term: string; definition: string }[];
  sourceNote?: string;
  teacherSource?: string;
  text: string;
  title: string;
  versionLabel?: string;
};

type RichTextBlock = {
  align?: ExamPassageLine["align"];
  html: string;
  kind?: "heading" | "list";
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
  const blockPattern = /<(p|div|h[1-6]|ul|ol)([^>]*)>([\s\S]*?)<\/\1>/gi;
  let cursor = 0;
  for (const match of normalized.matchAll(blockPattern)) {
    const prefix = normalized.slice(cursor, match.index);
    if (plainTextFromHtml(prefix).trim()) blocks.push({ html: prefix, text: plainTextFromHtml(prefix).trimEnd() });
    const tag = match[1].toLowerCase();
    const attributes = match[2];
    const body = match[3];
    const rawText = plainTextFromHtml(body).trimEnd();
    const isIndented =
      /data-align\s*=\s*["']indent["']/i.test(attributes) ||
      /class\s*=\s*["'][^"']*\bpoem-indent\b/i.test(attributes) ||
      /^\s{8,}\S/.test(rawText);
    const html = isIndented
      ? body
          .replace(/^(\s*<(?:em|i)>)(?:(?:&nbsp;)|\s){4,}/i, "$1")
          .replace(/^(?:(?:&nbsp;)|\s){4,}/i, "")
      : body;
    const text = plainTextFromHtml(html).trimEnd();
    const isHeading = /^h[1-6]$/.test(tag) || (
      /^\s*<(strong|b)>[\s\S]*<\/\1>\s*$/i.test(html) && text.trim().length <= 100 && !/[.!?]$/.test(text.trim())
    );
    const isList = tag === "ul" || tag === "ol";
    blocks.push({
      ...(isIndented ? { align: "indent" as const } : {}),
      html: isList ? match[0] : html,
      text,
      ...(isHeading ? { kind: "heading" } : isList ? { kind: "list" } : {}),
    });
    cursor = match.index + match[0].length;
  }
  if (blocks.length) {
    const suffix = normalized.slice(cursor);
    if (plainTextFromHtml(suffix).trim()) blocks.push({ html: suffix, text: plainTextFromHtml(suffix).trimEnd() });
    return blocks;
  }
  return normalized.split(/<br\s*\/?>/gi).map((html) => ({
    html,
    text: plainTextFromHtml(html).trimEnd(),
  }));
}

function richTextLines(value: string): RichTextBlock[] {
  return richTextBlocks(value).flatMap((block) => {
    const lines = block.html.split(/<br\s*\/?>/gi);
    if (lines.length > 1 && !lines.at(-1)) lines.pop();
    return lines.map((html) => ({
      ...(block.align ? { align: block.align } : {}),
      html,
      text: plainTextFromHtml(html).trimEnd(),
    }));
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
  coverImage,
  id,
  image,
  lineNumberInterval = 5,
  passageType,
  richText,
  glossary,
  sourceNote,
  text,
  title,
}: PlainTextPassageInput): ExamPassage {
  if (!richText && glossary?.length) richText = createGlossaryRichText(text, glossary, "poem");
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
  const normalizedText = text.replace(/^\s*\n/, "").trimEnd();

  if (!normalizedText) {
    passageLines.push({ text: "Passage content has not been added for this assessment yet." });

    return {
      coverImage,
      format: "poem",
      id,
      lines: passageLines,
      passageType,
      sourceNote,
      title,
    };
  }

  const richLines = richText?.trim() ? richTextLines(richText) : null;
  const sourceLines: RichTextBlock[] = richLines ?? normalizedText
    .split(/\r?\n/)
    .map((rawLine) => ({ html: "", text: rawLine.trimEnd() }));
  sourceLines.forEach((line) => {
    const nextLine = line.text;

    if (!nextLine.trim()) {
      passageLines.push({ text: "" });
      return;
    }

    passageLines.push({
      ...(line.align ? { align: line.align } : {}),
      lineNumber:
        contentLineNumber % Math.max(1, lineNumberInterval) === 0
          ? String(contentLineNumber)
          : "",
      html: line.html || undefined,
      text: nextLine,
    });

    contentLineNumber += 1;
  });

  return {
    coverImage,
    format: "poem",
    id,
    lines: passageLines,
    passageType,
    sourceNote,
    title,
  };
}

type ProsePassageInput = {
  glossary?: { term: string; definition: string }[];
  author?: string;
  blurb?: string;
  coverImage?: ExamQuestionImage;
  header?: string;
  id: string;
  image?: ExamQuestionImage;
  passageType?: ExamPassageType;
  richText?: string;
  sourceNote?: string;
  teacherSource?: string;
  text: string;
  title: string;
  versionLabel?: string;
};

export function createProsePassage({
  glossary,
  author,
  blurb,
  coverImage,
  header,
  id,
  image,
  passageType,
  richText,
  sourceNote,
  text,
  title,
}: ProsePassageInput): ExamPassage {
  if (!richText && glossary?.length) richText = createGlossaryRichText(text, glossary);
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
      coverImage,
      format: "prose",
      id,
      lines: passageLines,
      passageType,
      sourceNote,
      title,
    };
  }

  const paragraphs: RichTextBlock[] = richText?.trim()
    ? richTextBlocks(richText)
    : normalizedText.split(/\r?\n\s*\r?\n/).map((rawParagraph) => ({
        html: "",
        text: rawParagraph.replace(/\s+/g, " ").trim(),
      }));
  let paragraphNumber = 1;
  paragraphs.forEach((paragraph) => {
    passageLines.push({
      html: paragraph.html || undefined,
      ...(paragraph.kind ? { kind: paragraph.kind } : {}),
      lineNumber: paragraph.kind || !paragraph.text.trim() ? undefined : String(paragraphNumber++),
      text: paragraph.text,
    });
  });

  return {
    coverImage,
    format: "prose",
    id,
    lines: passageLines,
    passageType,
    sourceNote,
    title,
  };
}

type SentenceNumberedPassageInput = {
  glossary?: { term: string; definition: string }[];
  author?: string;
  blurb?: string;
  coverImage?: ExamQuestionImage;
  id: string;
  image?: ExamQuestionImage;
  passageType?: ExamPassageType;
  richText?: string;
  sourceNote?: string;
  teacherSource?: string;
  text: string;
  title: string;
  versionLabel?: string;
};

export function createSentenceNumberedPassage({
  glossary,
  author,
  blurb,
  coverImage,
  id,
  image,
  passageType,
  richText,
  sourceNote,
  text,
  title,
}: SentenceNumberedPassageInput): ExamPassage {
  if (!richText && glossary?.length) richText = createGlossaryRichText(text, glossary);
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
      coverImage,
      format: "sentence_prose",
      id,
      lines: passageLines,
      passageType,
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
    coverImage,
    format: "sentence_prose",
    id,
    lines: passageLines,
    passageType,
    sourceNote,
    title,
  };
}
