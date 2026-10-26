export type PoemRichBlock = {
  html: string;
  text: string;
  align?: "left" | "center" | "indent";
  kind?: "heading" | "list";
  numbered?: boolean;
};
export function poemRichBlocks(blocks: PoemRichBlock[], sourceText?: string): PoemRichBlock[];
