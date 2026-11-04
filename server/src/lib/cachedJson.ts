import fs from "node:fs";
import path from "node:path";

const cache = new Map<string, { version: string; value: unknown }>();
/** Authored files only. Each caller receives its own copy; edits invalidate immediately. */
export function readCachedJson<T>(filename: string): T {
  const key = path.resolve(filename);
  const stat = fs.statSync(key);
  const version = `${stat.mtimeMs}:${stat.ctimeMs}:${stat.size}:${stat.ino}`;
  let entry = cache.get(key);
  if (!entry || entry.version !== version) {
    const value: unknown = JSON.parse(fs.readFileSync(key, "utf8"));
    entry = { version, value };
    if (cache.size >= 16) cache.delete(cache.keys().next().value!);
    cache.set(key, entry);
  }
  return structuredClone(entry.value) as T;
}
