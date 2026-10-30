import test from 'node:test';
import assert from 'node:assert/strict';
import {mathMLToLatex,cleanHtml,convertItem,responseSchema} from './testnav-adapter.mjs';
const source={form:'A'},item={number:1,itemId:1,id:'source-id',section:'Math',url:'https://example.test/public/item/1',sha256:'source-hash'};
function data(type,html,cardinality='single'){return {item_id:1,itemBodyHtml:html,itemBodyExtraScript:`var responseSchema=${JSON.stringify([{identifier:'RESPONSE',interactionType:type,cardinality}])};`}}
test('mixed fractions, negative powers and symbols remain valid LaTeX',()=>{
 assert.equal(mathMLToLatex('<math><mn>4</mn><mfrac><mn>1</mn><mn>3</mn></mfrac><mo>≤</mo><msup><mi>x</mi><mn>2</mn></msup></math>'),'4\\frac{1}{3}\\le {x}^{2}');
 assert.equal(mathMLToLatex('<math><mtext>$50&nbsp;±4%</mtext></math>'),'\\text{\\$50 \\pm 4\\%}');
});

test('MathML layout phantoms stay invisible and authored line breaks stay separate',()=>{
 assert.equal(cleanHtml('<p>9<math><mphantom><mfrac><mn>0</mn><mn>0</mn></mfrac></mphantom></math></p>'),'<p>9</p>');
 assert.equal(mathMLToLatex('<math><mn>1</mn><mspace linebreak="newline"></mspace><mn>2</mn></math>'),'\\begin{array}{l}1\\\\2\\end{array}');
});
test('source headings, boxed sentence, bold word, underline and English glossary survive',()=>{
 const h=cleanHtml('<div class="abbi-richtext"><h3 class="semantic-marker passage-subheading">Real heading</h3><p class="boxText">Keep <strong>best</strong> <span class="underline">underlined</span> <span class="glossary-term" data-content="def">cinders</span></p></div><div class="abbi-glossary"><div id="def"><div data-lang="en">residue of burnt coal</div></div></div>');
 assert.match(h,/<h3>Real heading<\/h3>/);assert.match(h,/blockquote data-boxed="true"/);assert.match(h,/<strong>best<\/strong>/);assert.match(h,/<u>underlined<\/u>/);assert.match(h,/data-glossary-definition="residue of burnt coal"/);assert.doesNotMatch(h,/abbi-glossary|data-content=/);
});
test('authored hidden custom-choice controls are captured without running source scripts',()=>{
 const d=data('CHOICEINTERACTION','<div class="row"><div class="span8"><p>Pick three.</p><div class="int-choice-list" data-module="CustomInteraction-Choice" data-maxchoices="3"><span class="visuallyhidden" data-identifier="a"><p>One</p></span><span class="visuallyhidden" data-identifier="b"><p>Two</p></span><span class="visuallyhidden" data-identifier="c"><p>Three</p></span></div></div></div>','multiple');
 const q=convertItem(d,item,{source,assets:new Map(),key:{correctChoiceIds:['A','B','C']}});
 assert.equal(q.type,'multi_select');assert.deepEqual(q.choices.map(c=>c.text),['One','Two','Three']);assert.equal(q.requiredSelections,3);assert.doesNotMatch(q.promptHtml,/visuallyhidden/);
});
test('inline selection keeps source order and only selected phrase spans become controls',()=>{
 const d=data('HOTTEXTINTERACTION','<div class="row"><div class="span6"><div data-module="CustomInteraction-texthighlighter"><p>Before <span data-identifier="x">first</span>, between <span data-identifier="y">second</span>, after.</p></div></div><div class="span6"><p>Select the error.</p></div></div>');
 const q=convertItem(d,item,{source,assets:new Map(),key:{correctChoiceId:'B'}});
 assert.equal(q.correctChoiceId,'B');assert.match(q.selectionHtml,/Before <span data-choice-id="A">first/);assert.match(q.selectionHtml,/between <span data-choice-id="B">second/);
});
test('missing response schema fails closed instead of inventing choices or a key',()=>{
 assert.throws(()=>responseSchema({item_id:1,itemBodyExtraScript:'doSomething()'}),/Missing response schema/);
});

test('table-based gap targets preserve table semantics and slot order',()=>{
 const d=data('GAPMATCHINTERACTION','<div class="row"><div class="span8"><p>Complete the table.</p><ul class="sourcechoices"><li data-maxlimit="1">2</li><li data-maxlimit="1">3</li></ul><div class="gapmatch-content"><table><caption>Costs</caption><tbody><tr><th scope="col">Weight</th><th scope="col">Cost</th></tr><tr><td>2</td><td><span class="gap"></span></td></tr><tr><td><span class="gap"></span></td><td>2.50</td></tr></tbody></table></div></div></div>','multiple');
 const q=convertItem(d,item,{source,assets:new Map(),key:{slots:['item-1','item-2']}});
 assert.equal(q.allowReuse,false);assert.match(q.dragDropContentHtml,/<caption>Costs<\/caption>/);assert.match(q.dragDropContentHtml,/<th scope="col">Weight/);assert.match(q.dragDropContentHtml,/<td>2<\/td><td>{{slot-1}}<\/td>/);assert.match(q.dragDropContentHtml,/<td>{{slot-2}}<\/td><td>2.50<\/td>/);
 assert.deepEqual(q.dragDropSlots.map(s=>s.correctItemId),['item-1','item-2']);
});

test('graph hotspots retain exact source image geometry and reviewed semantic coordinates',()=>{
 const d=data('HOTSPOTINTERACTION','<div class="row"><div class="span8"><p>Select a point.</p><div class="int-hotspot-holder" style="width:400px;height:80px;background-image:url(https://example.test/grid.svg)"><span data-coords="37.5,40,8"></span><span data-coords="77.5,40,8"></span></div></div></div>');
 const q=convertItem(d,item,{source,assets:new Map([['https://example.test/grid.svg',{destination:'/exam-images/grid.svg'}]]),key:{points:[2],graphCoordinates:[[0.1,0],[0.2,0]]}});
 assert.deepEqual(q.graph.sourceImage,{src:'/exam-images/grid.svg',alt:'',width:400,height:80});assert.deepEqual(q.graph.points[1],{id:'point-2',x:0.2,y:0,sourceX:77.5,sourceY:40});assert.deepEqual(q.correctPointIds,['point-2']);
});

test('matching tasks permit the source-required subset and retain unused choices',()=>{
 const d=data('MATCHINTERACTION','<div class="row"><div class="span8"><p>Move one sentence.</p><ul class="sourcechoices" data-minassociations="1"><li>First</li><li>Second</li><li>Third</li></ul><ul class="targetchoices"><li>Paragraph</li></ul></div></div>','multiple');
 const q=convertItem(d,item,{source,assets:new Map(),key:{placements:[null,1,null]}});
 assert.equal(q.requiredPlacements,1);assert.equal(q.items.length,3);assert.deepEqual(q.correctPlacements,{'item-2':'category-1'});
});

test('unknown graphic gap layouts fail closed instead of receiving the reviewed absolute-value expression',()=>{
 const d=data('GRAPHICGAPMATCHINTERACTION','<div class="row"><div class="span8"><p>New graphic layout.</p></div></div>','multiple');
 assert.throws(()=>convertItem(d,item,{source,assets:new Map(),key:{slots:[]}}),/Unreviewed graphic-gap layout/);
});

test('inline dropdown imports preserve source no-break groups and native control widths',()=>{
 const d=data('INLINECHOICEINTERACTION','<div class="row"><div class="span8"><p>Choose.</p><div class="abbi-inlineChoice"><p><span class="nobreak">L = <select class="input-mini"><option value="">Choose...</option><option value="a">2</option></select> K.</span></p></div></div></div>');
 const q=convertItem(d,item,{source,assets:new Map(),key:{dropdowns:['A']}});
 assert.match(q.dropdownContentHtml,/data-no-break="true"/);
 assert.match(q.dropdownContentHtml,/data-dropdown-width="60"/);
 assert.match(q.dropdownContentHtml,/\{\{dropdown-1\}\}/);
 assert.doesNotMatch(q.dropdownContentHtml,/<select/);
});
