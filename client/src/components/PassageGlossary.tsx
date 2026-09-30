import { useEffect, useRef, type ReactNode } from "react";
import { mountPassageGlossary } from "../../../tools/content-studio-glossary.js";

export function PassageGlossary({ children, contextKey }: { children: ReactNode; contextKey: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    const glossary = mountPassageGlossary(root.current);
    return () => glossary.destroy();
  }, [contextKey]);
  return <div ref={root} className="exam-passage-glossary-content">{children}</div>;
}
