import type { SheetStructure } from "./api";
const uid = () => crypto.randomUUID();
export const emptySheet = (): SheetStructure => ({ id: "", title: "", sourceVersion: "", instructions: "", sourceUrl: "", allowUnanswered: true, sections: [{ id: uid(), title: "English", subject: "english", items: Array.from({ length: 20 }, (_, index) => ({ id: uid(), number: String(index + 1), type: "multiple_choice", options: ["A", "B", "C", "D"].map(label => ({ id: uid(), label })) })) }] });
