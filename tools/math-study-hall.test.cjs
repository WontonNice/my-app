const { test } = require('node:test');
const assert = require('node:assert/strict');
const { resolve } = require('node:path');
const { build } = require('esbuild');
const vm = require('node:vm');
const taxonomy = require('./math-topics.json');

test('Math Study Hall follows the managed hierarchy and reserves topic resource sections', async () => {
  const entry = resolve(__dirname, '../client/src/components/MathStudyHall.tsx');
  const catalog = resolve(__dirname, '../client/src/lib/mathStudyHall.ts');
  const result = await build({ stdin: { contents: `
    import React from 'react'; import {renderToStaticMarkup} from 'react-dom/server';
    import {MathStudyHall} from ${JSON.stringify(entry)};
    import {mathStudyHref} from ${JSON.stringify(catalog)};
    const mathStudyCategories=${JSON.stringify(taxonomy.categories)};
    const previewContext={isPreview:true,mode:'student',query:'?preview=student&teacherTools=1',studentId:'',studentName:'QA Student',returnHref:'/teacher'};
    const render=(path,query='')=>{globalThis.window={location:{search:new URL(path,'https://qa.test').search,origin:'https://qa.test'}};return renderToStaticMarkup(<MathStudyHall query={query} previewContext={previewContext}/>)};
    const category=mathStudyCategories[0], topic=category.topics[0];
    const output={root:render(mathStudyHref()),category:render(mathStudyHref(category.label)),topic:render(mathStudyHref(category.label,topic)),modules:render(mathStudyHref('Algebra','Inequalities')),unknown:render(mathStudyHref('Removed category')),unknownTopic:render(mathStudyHref(category.label,'Removed topic')),search:render(mathStudyHref(),topic),empty:render(mathStudyHref(),'NO MATCH EXISTS'),href:mathStudyHref('Ratios & rates','Percentages & proportions')};
    globalThis.qaTaxonomy=[{label:'Statistics and Probability',topics:['Data Displays','Probability','Set Relationships','Averages & Spread']}];
    output.managed=render(mathStudyHref('Statistics and Probability'));output.customModuleName=render(mathStudyHref('Statistics and Probability','Overlapping Groups'));
    globalThis.qaTaxonomy=null;output.loading=render(mathStudyHref());globalThis.qaTaxonomyError='Categories unavailable';output.failed=render(mathStudyHref());console.log(JSON.stringify(output));
  `, resolveDir: resolve(__dirname, '..'), loader: 'tsx' }, platform: 'node', format: 'cjs', bundle: true, write: false, jsx: 'automatic', loader: { '.css': 'empty' }, define:{'import.meta.env':'{}'},plugins:[{name:'defer-browser-player',setup(plugin){plugin.onLoad({filter:/usePracticeCatalog\.ts$/},()=>({loader:'ts',contents:'import {defaultPracticeCatalog} from '+JSON.stringify(resolve(__dirname,'../server/src/shared/practiceCatalog.ts'))+'; const taxonomy=[{"label":"Algebra","topics":["Algebraic Expressions","Equations & Systems","Inequalities","Functions & Graphs","Patterns & Sequences"]},{"label":"Geometry","topics":["Shapes & Angles","Area & Perimeter","Surface Area & Volume","Coordinate Geometry","Pythagorean Theorem","Scale & Transformations"]},{"label":"Statistics and Probability","topics":["Data Displays","Probability","Overlapping Groups","Averages & Spread"]},{"label":"Ratios and Proportional Relationships","topics":["Ratios & Proportions","Rates & Unit Rates","Percentages"]},{"label":"Arithmetic & Number Sense","topics":["Number Properties","Fractions & Decimals","Number Operations","Exponents, Roots & Scientific Notation","Units & Conversions","Counting & Sets"]}]; export function usePracticeCatalog(){return {catalog:defaultPracticeCatalog(),taxonomy:globalThis.qaTaxonomy===undefined?taxonomy:globalThis.qaTaxonomy,error:globalThis.qaTaxonomyError??"",loading:globalThis.qaTaxonomy===null,reload:async()=>{}};}'}));plugin.onLoad({filter:/InequalityPractice\.tsx$/},()=>({loader:'tsx',contents:'export function InequalityPractice(){return null;}'}));}}] });
  let output;
  vm.runInNewContext(result.outputFiles[0].text, { require, console: { log: value => { output = JSON.parse(value); } }, process, URL, URLSearchParams, TextEncoder, TextDecoder, Buffer, setTimeout, clearTimeout, setImmediate, clearImmediate, queueMicrotask, AbortController, ReadableStream, WritableStream, TransformStream });
  const escape = text => text.replaceAll('&', '&amp;').replaceAll("'", '&#x27;').replaceAll('"', '&quot;').replaceAll('>', '&gt;').replaceAll('<', '&lt;');
  assert.equal((output.root.match(/class="math-study-category"/g) || []).length, taxonomy.categories.length);
  for (const category of taxonomy.categories) assert.ok(output.root.includes(escape(category.label)));
  assert.doesNotMatch(output.root, /\/assessments|No worksheets yet/);
  for (const topic of taxonomy.categories[0].topics) assert.ok(output.category.includes(escape(topic)));
  assert.equal((output.category.match(/class="math-study-topic"/g) || []).length, taxonomy.categories[0].topics.length);
  assert.match(output.category, /category=.*&amp;topic=/);
  assert.match(output.category, /preview=student/);
  assert.match(output.topic, /aria-labelledby="math-worksheets-title"/);
  assert.match(output.topic, /aria-labelledby="math-infinite-title"/);
  assert.match(output.topic, /No practice modules yet/);
  assert.match(output.topic,/YouTube videos/);
  assert.match(output.modules,/aria-label="Infinite practice modules"/);
  assert.match(output.modules,/Start Foundation Building/);assert.match(output.modules,/Start General Practice/);assert.doesNotMatch(output.modules,/Start One-step Inequalities/);
  assert.doesNotMatch(output.modules,/Start Inequalities: Variables on Both Sides|Start Writing Inequalities/);
  assert.equal((output.modules.match(/class="practice-module-group"/g)||[]).length,2);
  assert.doesNotMatch(output.modules,/Start infinite practice|Explore modules/);
  assert.doesNotMatch(output.topic, /Start practice|<button/);
  assert.match(output.unknown, /This topic is no longer available/);
  assert.match(output.unknownTopic, /This topic is no longer available/);
  assert.match(output.search, new RegExp(escape(taxonomy.categories[0].label)));
  assert.match(output.empty, /No math categories match your search/);
  assert.match(output.managed,/Set Relationships/);assert.doesNotMatch(output.managed,/Overlapping Groups|Algebraic Expressions/);
  assert.equal((output.managed.match(/class="math-study-topic"/g)||[]).length,4);
  assert.match(output.customModuleName,/This topic is no longer available/);assert.match(output.loading,/Loading math categories/);assert.doesNotMatch(output.loading,/Overlapping Groups|math-study-category/);assert.match(output.failed,/Categories unavailable/);assert.match(output.failed,/Try again/);
  const params = new URL(output.href, 'https://qa.test').searchParams;
  assert.equal(params.get('category'), 'Ratios & rates');
  assert.equal(params.get('topic'), 'Percentages & proportions');
});

test('student practice lists show parent modules while nested modules remain part of their generation set', async () => {
  const result = await build({stdin:{contents:`
    import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
    import {PracticeModuleList} from ${JSON.stringify(resolve(__dirname,'../client/src/features/math-command/PracticeModuleList.tsx'))};
    import {defaultPracticeCatalog,movePracticeModule} from ${JSON.stringify(resolve(__dirname,'../server/src/shared/practiceCatalog.ts'))};
    globalThis.localStorage={getItem:()=>null};
    const catalog=movePracticeModule(movePracticeModule(defaultPracticeCatalog(),'inequalities','foundation'),'2022-2023-form-b-q70','foundation');
    console.log(renderToStaticMarkup(<PracticeModuleList catalog={catalog} previewContext={{isPreview:true,mode:'student'}} onStart={()=>{}} category="Algebra" topic="Inequalities"/>));
  `,resolveDir:resolve(__dirname,'..'),loader:'tsx'},platform:'node',format:'cjs',bundle:true,write:false,jsx:'automatic',loader:{'.css':'empty'},define:{'import.meta.env':'{}'}});
  let html;
  vm.runInNewContext(result.outputFiles[0].text,{require,console:{log:value=>{html=value;}},process,URL,URLSearchParams,TextEncoder,TextDecoder,Buffer,setTimeout,clearTimeout,setImmediate,clearImmediate,queueMicrotask,AbortController,ReadableStream,WritableStream,TransformStream});
  assert.match(html,/Start Foundation Building/);assert.match(html,/Foundation Building settings/);
  assert.doesNotMatch(html,/Start Writing Inequalities/);assert.match(html,/Start General Practice/);
  assert.doesNotMatch(html,/Start One-step Inequalities|Start Inequalities: Variables on Both Sides|INSIDE FOUNDATION BUILDING|practice-contained-module/);
  assert.match(html,/4 generators/,'The parent still includes its own generators and the nested modules');
});

test('YouTube references render in-site play buttons with thumbnails and optional metadata', async () => {
  const result=await build({stdin:{contents:`
    import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
    import {PracticeVideoList,PracticeVideoPlayer,youtubeEmbedUrl,videoViewsLabel,videoPublishedLabel} from ${JSON.stringify(resolve(__dirname,'../client/src/features/math-command/PracticeVideoList.tsx'))};
    const base={id:'video',title:'Solving Inequalities Using Multiplication or Division',description:'',url:'https://www.youtube.com/watch?v=abcdefghijk',category:'Algebra',topic:'Inequalities',published:true};
    console.log(JSON.stringify({full:renderToStaticMarkup(<PracticeVideoList videos={[{...base,channelTitle:'The Magic Of Math',duration:'14:02',viewCount:22000,publishedAt:'2022-10-26'}]}/>),minimal:renderToStaticMarkup(<PracticeVideoList videos={[base]}/>),player:renderToStaticMarkup(<PracticeVideoPlayer video={base} onClose={()=>{}}/>),embed:youtubeEmbedUrl(base.url),invalid:youtubeEmbedUrl('https://evil.test/watch?v=abcdefghijk'),views:videoViewsLabel(22000),age:videoPublishedLabel('2022-10-26',Date.parse('2026-10-26T12:00:00Z'))}));
  `,resolveDir:resolve(__dirname,'..'),loader:'tsx'},platform:'node',format:'cjs',bundle:true,write:false,jsx:'automatic',loader:{'.css':'empty'}});
  let output;
  vm.runInNewContext(result.outputFiles[0].text,{require,console:{log:value=>{output=JSON.parse(value);}},process,URL,URLSearchParams,TextEncoder,TextDecoder,Buffer,setTimeout,clearTimeout,setImmediate,clearImmediate,queueMicrotask,AbortController,ReadableStream,WritableStream,TransformStream});
  assert.match(output.full,/math-study-video-card/);assert.match(output.full,/https:\/\/i.ytimg.com\/vi\/abcdefghijk\/mqdefault.jpg/);
  assert.match(output.full,/aria-label="Play Solving Inequalities/);assert.doesNotMatch(output.full,/<a\b|target="_blank"/);
  assert.match(output.full,/loading="lazy"/);assert.match(output.full,/The Magic Of Math/);assert.match(output.full,/14:02/);assert.match(output.full,/22K views/);
  assert.equal(output.age,'4 years ago');assert.equal(output.views,'22K views');
  assert.doesNotMatch(output.minimal,/math-study-video-duration|math-study-video-metadata|<iframe/);
  assert.match(output.minimal,/YouTube/);
  assert.match(output.player,/<dialog/);assert.match(output.player,/Close video/);assert.match(output.player,/<iframe/);
  assert.match(output.player,/strict-origin-when-cross-origin/);assert.doesNotMatch(output.player,/<a\b|Watch on YouTube/);
  assert.match(output.player,/sandbox="allow-scripts allow-same-origin allow-presentation"/);assert.doesNotMatch(output.player,/allow-popups|allow-top-navigation/);
  assert.equal(output.embed,'https://www.youtube-nocookie.com/embed/abcdefghijk?autoplay=1&rel=0&playsinline=1');assert.equal(output.invalid,null);
});
