import fs from "node:fs";
import path from "node:path";
import type { PassageBook } from "../shared/libraryBooks";
export function getMergedLibraryBook(id: string): PassageBook | undefined {
  const filename = path.resolve(__dirname, "../../data/library-books.json");
  return fs.existsSync(filename) ? (JSON.parse(fs.readFileSync(filename, "utf8")) as PassageBook[]).find(book => book.id === id) : undefined;
}
export function libraryBookAccessIds(id: string) { return [id, ...(getMergedLibraryBook(id)?.versions.map(version => version.id) ?? [])]; }
