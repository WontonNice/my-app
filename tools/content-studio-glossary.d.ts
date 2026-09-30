export function createGlossaryRichText(text: string, definitions: { term: string; definition: string }[], format?: string): string;
export function mountPassageGlossary(root: HTMLElement): {
  close(restoreFocus?: boolean): void;
  destroy(): void;
};
