import type { SheetStructure } from "./api";
const uid = () => crypto.randomUUID();
export const emptySheet = (): SheetStructure => ({ id: "", title: "", sourceVersion: "", instructions: "", sourceUrl: "", allowUnanswered: true, sections: [{ id: uid(), title: "Section 1", subject: "english", items: [] }] });
