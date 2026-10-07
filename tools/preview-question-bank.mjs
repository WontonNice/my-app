// Disposable local browser QA. Only bank mutations point to a temporary fixture;
// existing editor content remains read-only, and this harness never uses Supabase.
import { createServer } from "node:http";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
const toolsRoot = dirname(fileURLToPath(import.meta.url)); const root = resolve(toolsRoot, "..");
const fixture = await mkdtemp(join(tmpdir(), "nathan-bank-browser-qa-"));
await mkdir(join(fixture, "server/data"), { recursive: true });
await writeFile(join(fixture, "server/data/question-bank.json"), JSON.stringify({ revision: 0, questions: [], sets: [] }));
const modulePath = join(toolsRoot, `.question-bank-preview-${process.pid}.mjs`);
const source = (await readFile(join(toolsRoot, "content-studio.mjs"), "utf8"))
  .replace('const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");', `const workspaceRoot = ${JSON.stringify(root)};`)
  .replaceAll("readBank(workspaceRoot)", `readBank(${JSON.stringify(fixture)})`)
  .replaceAll("mutateBank(workspaceRoot,", `mutateBank(${JSON.stringify(fixture)},`)
  .split('if (process.argv.includes("--validate"))')[0] + "\nexport { handleRequest };\n";
await writeFile(modulePath, source);
const studio = await import(pathToFileURL(modulePath).href);
const server = createServer((request, response) => {
  // Block every write except the isolated question-bank test endpoints.
  if (request.method !== "GET" && !request.url.startsWith("/api/question-bank/")) { response.writeHead(403); response.end('{"message":"Read-only QA for non-bank content."}'); return; }
  return studio.handleRequest(request, response);
});
server.listen(4326, "127.0.0.1", () => console.log("Isolated Question Bank QA: http://127.0.0.1:4326/?bankTopic=Evidence%20%26%20Support#question-bank"));
async function cleanup() { await new Promise(resolve => server.close(resolve)); await rm(modulePath, { force: true }); await rm(fixture, { recursive: true, force: true }); process.exit(); }
process.on("SIGINT", cleanup); process.on("SIGTERM", cleanup);
