/** Recognize imported pipe tables without changing the saved slot identifiers. */
export function parseMathDragTable(lines: string[] = []) {
  const headerIndex = lines[0]?.includes("|") ? 0 : 1;
  if (lines.length < headerIndex + 2) return null;
  const cells = lines.slice(headerIndex).map((line) => line.split("|").map((cell) => cell.trim()));
  const headers = cells[0];
  if (headers.length < 2 || headers.some((cell) => !cell || cell.includes("{{"))) return null;
  if (cells.some((row) => row.length !== headers.length || row.some((cell) => !cell))) return null;
  const rows = cells.slice(1);
  if (!rows.some((row) => row.some((cell) => /\{\{[\w-]+\}\}/.test(cell)))) return null;
  return { caption: headerIndex ? lines[0] : undefined, headers, rows };
}
