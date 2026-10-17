import fs from "node:fs";
import path from "node:path";
import type { PassageBook } from "../shared/libraryBooks";

const filename = path.resolve(__dirname, "../../data/library-books.json");
let cached: { mtimeMs: number; size: number; books: PassageBook[] } | undefined;
function libraryBooks() {
  if (!fs.existsSync(filename)) return [];
  const stat = fs.statSync(filename);
  if (!cached || cached.mtimeMs !== stat.mtimeMs || cached.size !== stat.size) {
    cached = { mtimeMs: stat.mtimeMs, size: stat.size, books: JSON.parse(fs.readFileSync(filename, "utf8")) as PassageBook[] };
  }
  return cached.books;
}
export function getMergedLibraryBook(id: string): PassageBook | undefined {
  return libraryBooks().find(book => book.id === id);
}
/** Access aliases do not change the question sets used by historical attempts. */
export function canonicalLibraryBookId(id: string) {
  return libraryBooks().find(book => book.id === id || book.versions.some(version => version.id === id))?.id ?? id;
}
export function libraryBookAccessIds(id: string) {
  const canonical = canonicalLibraryBookId(id);
  return [...new Set([canonical, ...(getMergedLibraryBook(canonical)?.versions.map(version => version.id) ?? []), id])];
}
