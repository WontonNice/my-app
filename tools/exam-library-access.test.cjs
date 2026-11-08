const { test } = require('node:test');
const assert = require('node:assert/strict');
const { build } = require('esbuild');
const { resolve } = require('node:path');

async function renderLibrary(mode, status = 'locked', worksheetMode = false) {
  const result = await build({
    stdin: { contents: `
      import React from 'react';
      import { renderToStaticMarkup } from 'react-dom/server';
      import { StudentAssessmentLibrary } from ${JSON.stringify(resolve(__dirname, '../client/src/components/StudentAssessmentLibrary.tsx'))};
      const mode = ${JSON.stringify(mode)};
      const previewContext = { isPreview: Boolean(mode), mode, query: mode ? '?preview='+mode+'&teacherTools=1' : '', returnHref:'/teacher', studentId:'', studentName:'' };
      const exam = { id:'grade-9-2018-2019', title:'Grade 9 2018-2019', examLabel:'Grade 9 Mathematics Sample Questions', status:${JSON.stringify(status)}, sectionAccess:{english:false,math:${status === 'open'}}, questionCount:13, passageCount:0, durationMinutes:25 };
      console.log(renderToStaticMarkup(<StudentAssessmentLibrary assessments={[exam]} previewContext={previewContext} worksheetMode={${worksheetMode}}/>));
    `, resolveDir: resolve(__dirname, '..'), loader: 'tsx' },
    platform:'node', format:'cjs', bundle:true, write:false, jsx:'automatic', external:['react','react-dom','react/jsx-runtime','react-dom/server'], loader:{'.css':'empty'}, define:{'import.meta.env':'{}'},
  });
  const output = [];
  require('node:vm').runInNewContext(result.outputFiles[0].text, { require, process, URL, URLSearchParams, TextEncoder, TextDecoder, Buffer, setTimeout, clearTimeout, queueMicrotask, window:{location:{origin:'http://localhost:5173'}}, console:{log:value=>output.push(value)} });
  return output.join('');
}

test('a teacher can preview a locked exam and reach its existing access controls', async () => {
  const html = await renderLibrary('teacher');
  assert.match(html, /aria-label="View test Grade 9 2018-2019"/);
  assert.match(html, /href="\/exam\/grade-9-2018-2019\/session\?preview=teacher/);
  assert.match(html, /href="\/teacher\/assessments\?manage=grade-9-2018-2019/);
  assert.match(html, />Manage access</);
});

test('locked student views cannot open the exam or see teacher management links', async () => {
  for (const mode of ['', 'student']) {
    const html = await renderLibrary(mode);
    assert.match(html, /Teacher opens/);
    assert.doesNotMatch(html, /Manage access|View test|href="\/exam\//);
  }
});

test('an open student exam keeps the existing exam entry link', async () => {
  const html = await renderLibrary('', 'open');
  assert.match(html, /href="\/exam\/grade-9-2018-2019\?worksheetReturn=/);
  assert.doesNotMatch(html, /Manage access|View test/);
});

test('worksheets expose their own teacher access switch and editor instead of assessment management', async () => {
 const html = await renderLibrary('teacher', 'locked', true);
 assert.match(html, /Student access for Grade 9 2018-2019/);
 assert.match(html, /Open for students/); assert.match(html, /Edit worksheet/);
 assert.doesNotMatch(html, /Manage access|All exams|Your exam library/);
});
