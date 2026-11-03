import katex from "katex";
/** Render only explicit math delimiters; other response text stays escaped by React. */
export function CompactAnswer({ text }: { text: string }) {
  const parts = text.split(/(\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\]|\$\$[\s\S]+?\$\$)/g);
  return <span>{parts.map((part,index) => index % 2 ? <span key={index} dangerouslySetInnerHTML={{ __html: katex.renderToString(part.slice(2,-2), { throwOnError: false, trust: false, displayMode: false }) }} /> : <span key={index}>{part}</span>)}</span>;
}
