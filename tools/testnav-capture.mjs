import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export const OFFICIAL_PAGE = 'https://nycshsat.myassessmentsupport.com/practice-tests/';
// URLs observed in the public English/no-TTS/untimed practice tabs on 2026-10-29.
// Requests use ordinary anonymous HTTP: no browser credentials or session state.
export const FORMS = [
  { form: 'A', testId: 5920, appendix: 'SHSAT Practice Test A Explanations Appendix_revised.pdf', printable: 'SHSAT Practice Test A Printable Test_revised.pdf' },
  { form: 'B', testId: 5919, appendix: 'SHSAT Practice Test B Explanations Appendix.pdf', printable: 'SHSAT Practice Test B Printable Test.pdf' },
  { form: 'C', testId: 5933, appendix: 'SHSAT Practice Test C Explanations Appendix.pdf', printable: 'SHSAT Practice Test C Printable Test.pdf' },
  { form: 'D', testId: 5931, appendix: 'SHSAT Practice Test D Explanations Appendix.pdf', printable: 'SHSAT Practice Test D Printable Test.pdf' },
];
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export function inventoryManifest(manifest) {
  const sections = [];
  function visit(node) {
    if (node?.attr?.ntype === 'section') {
      let position = 0;
      sections.push({ ...node.attr, items: (node.children || []).map(item => ({ ...item.attr, question: !item.attr.wc, position: item.attr.wc ? null : ++position })) });
    } else for (const child of node?.children || []) visit(child);
  }
  visit(manifest);
  let number = 0;
  for (const section of sections) for (const item of section.items) if (item.question) item.number = ++number;
  return sections;
}
async function download(url, file, cache = true) {
  if (cache) { try { return await fs.readFile(file); } catch {} }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, bytes);
  return bytes;
}
async function workers(values, count, run) {
  let next = 0;
  await Promise.all(Array.from({ length: count }, async () => { while (next < values.length) await run(values[next++]); }));
}
export async function capture(outputRoot) {
  await fs.mkdir(outputRoot, { recursive: true });
  const pageBytes = await download(OFFICIAL_PAGE, path.join(outputRoot, 'practice-tests.html'));
  const totals = [];
  for (const form of FORMS) {
    const folder = path.join(outputRoot, `testnav-${form.form}`);
    const manifestUrl = `https://nyc.testnav.com/api/8.0/test/${form.testId}/1/testdef`;
    const manifestBytes = await download(manifestUrl, path.join(folder, 'testdef.json'));
    const manifest = JSON.parse(manifestBytes);
    const sections = inventoryManifest(manifest);
    const questions = sections.flatMap(s => s.items.filter(i => i.question));
    if (questions.length !== 100) throw new Error(`Form ${form.form}: expected 100, got ${questions.length}`);
    const itemInventory = [];
    await workers(sections.flatMap(s => s.items.map(i => ({...i, section: s.title}))), 4, async item => {
      const url = `https://nyc.testnav.com/api/8.0/item/${item.itemId}/${item.contentVersion}/flavor/1`;
      const file = `items/${item.itemId}.json`;
      const bytes = await download(url, path.join(folder, file));
      const data = JSON.parse(bytes);
      itemInventory.push({...item, url, file, sha256: sha256(bytes), responseScript: data.itemBodyExtraScript || '', htmlLength: data.itemBodyHtml?.length || 0});
    });
    const documents = [];
    for (const [kind, name] of [['answers', form.appendix], ['printable', form.printable]]) {
      const url = new URL(`resources/${encodeURIComponent(name)}`, OFFICIAL_PAGE.replace('practice-tests/', '')).href;
      const bytes = await download(url, path.join(folder, `${kind}.pdf`));
      documents.push({kind, url, file: `${kind}.pdf`, sha256: sha256(bytes)});
    }
    itemInventory.sort((a,b) => a.itemId-b.itemId);
    const inventory = {sourceFamily:'official_shsat',sourceFormat:'testnav',playerProfile:'testnav',form:form.form,year:2026,
      yearEvidence:'Official landing page: students taking the test in grade 8 in the fall of 2026. Test names themselves do not print a year.',
      sourceUrl:OFFICIAL_PAGE,sourcePageSha256:sha256(pageBytes),manifestUrl,manifestSha256:sha256(manifestBytes),capturedAt:new Date().toISOString(),
      title:manifest.data,testId:form.testId,language:'English',textToSpeech:false,timed:false,sections,documents,items:itemInventory};
    await fs.writeFile(path.join(folder,'inventory.json'),JSON.stringify(inventory,null,2));
    totals.push({form:form.form,questions:questions.length,ela:questions.filter(i=>i.number<=50).length,math:questions.filter(i=>i.number>50).length,itemFiles:itemInventory.length});
    console.log(JSON.stringify(totals.at(-1)));
  }
  await fs.writeFile(path.join(outputRoot,'testnav-inventory-summary.json'),JSON.stringify(totals,null,2));
  return totals;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  if (!process.argv[2]) throw new Error('Usage: node tools/testnav-capture.mjs <scratch output directory>');
  await capture(path.resolve(process.argv[2]));
}
