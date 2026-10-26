export type DropdownTemplatePart = { kind: 'text' | 'math' | 'dropdown'; value: string; display?: boolean };

/** Answer slots are interactions even when authored inside a math span. */
export function parseInlineDropdownTemplate(template: string): DropdownTemplatePart[] {
  return template.split(/(\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g).filter(Boolean).flatMap(part => {
    const math = part.startsWith('\\(') || part.startsWith('\\[');
    const source = math ? part.slice(2, -2) : part;
    return source.split(/(\{\{[\w-]+\}\})/g).filter(Boolean).map(value => value.startsWith('{{') && value.endsWith('}}')
      ? { kind: 'dropdown' as const, value: value.slice(2, -2) }
      : { kind: math ? 'math' as const : 'text' as const, value, display: math && part.startsWith('\\[') });
  });
}
