import { createServer } from "node:http";
import { resolve, basename } from "node:path";
import { build } from "esbuild";
import { importCaptures, publishQuestion, createBankSet } from "./question-bank.mjs";
const questions = [1, 2].map(number => ({ subject: "English", source: "SHSAT Lab", sourceUrl: "https://www.shsatlab.com/units/unit-7/practice", sourceUnit: 7, sourceTopic: "Evidence & Support", difficulty: "easy",
  prompt: `Synthetic question ${number}: Which detail supports the claim?`, choices: ["A", "B", "C", "D"].map(id => ({ id, text: `Synthetic choice ${id}` })), correctChoiceId: "A", explanation: "A supports the claim.",
  passage: { title: `Synthetic passage ${number}`, text: number === 1 ? "First passage, first paragraph.\n\nFirst passage, second paragraph." : "    Second passage, first line.\n  Second passage, indented line.\n\nLast stanza.", format: number === 1 ? "prose" : "poem" } }));
let bank = importCaptures({ revision: 0, questions: [], sets: [] }, { format: "nathan-tutors-shsatlab-ela-v1", questions }).bank;
for (const question of [...bank.questions]) bank = publishQuestion(bank, { id: question.id, question, verified: true });
bank = createBankSet(bank, { title: "Synthetic ELA QA set", questionIds: bank.questions.map(q => q.id) });
const result = await build({ entryPoints: [resolve("tools/question-bank-student-preview.tsx")], bundle: true, write: false, outdir: resolve("tools/.bank-student-preview"), format: "esm", jsx: "automatic", loader: { ".woff": "file", ".woff2": "file", ".ttf": "file" }, define: { "import.meta.env": "{}" }, plugins: [{ name: "isolated-bank-fixture", setup(plugin) { plugin.onLoad({ filter: /question-bank\.json$/ }, () => ({ contents: JSON.stringify(bank), loader: "json" })); } }] });
const files = new Map(result.outputFiles.map(file => ["/" + basename(file.path), file.contents]));
const port = Number(process.argv.find(arg => arg.startsWith("--port="))?.slice(7) ?? 4327);
createServer((request, response) => { const path = request.url.split("?")[0]; const file = files.get(path); response.setHeader("Content-Type", file ? path.endsWith(".js") ? "text/javascript" : "text/css" : "text/html"); response.end(file || '<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SHSAT Lab · isolated student QA</title><link rel="stylesheet" href="/question-bank-student-preview.css"><div id="root"></div><script type="module" src="/question-bank-student-preview.js"></script></html>'); }).listen(port, "127.0.0.1", () => {
  console.log(`Student QA: http://127.0.0.1:${port}/study-hall/shsat/library/${bank.sets[0].id}?preview=student&teacherTools=1`);
  console.log(`Assignment QA: http://127.0.0.1:${port}/?view=teacher`);
});
