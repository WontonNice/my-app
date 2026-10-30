export type PoemRichBlock = {
  html: string;
  text: string;
  align?: "left" | "center" | "right" | "justify" | "indent";
  kind?: "heading" | "list";
  numbered?: boolean;
  poetryLine?: boolean;
};
export function poemRichBlocks(blocks: PoemRichBlock[], sourceText?: string): PoemRichBlock[];
