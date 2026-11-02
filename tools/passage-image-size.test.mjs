import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const server=await readFile(new URL('./content-studio.mjs',import.meta.url),'utf8');
const normalize=vm.runInNewContext(server.slice(server.indexOf('function normalizePassageImage('),server.indexOf('function defaultDirectionsForSection('))+'\nnormalizePassageImage;',{
 EditorError:class extends Error{constructor(status,message){super(message);this.status=status;}},requiredText:value=>value,
});
test('passage image sizing retains width through native normalization and keeps automatic sizing optional',()=>{
 const image={src:'/exam-images/source.png',alt:'Source diagram',caption:'Source caption'};
 assert.deepEqual(JSON.parse(JSON.stringify(normalize(image,'Passage image'))),image);
 for(const width of [40,280,1200])assert.equal(normalize({...image,width},'Passage image').width,width);
 assert.equal(normalize({...image,width:''},'Passage image').width,undefined);
 for(const width of [0,39,1201,-1,1.5,'not a number',Infinity])assert.throws(()=>normalize({...image,width},'Passage image'),/width must be a whole number/);
});
test('the shared passage preview emits the saved width and keeps the source image and caption',async()=>{
 const source=await readFile(new URL('./content-studio.html',import.meta.url),'utf8');
 const render=vm.runInNewContext(source.slice(source.indexOf('function studentPassageMarkup('),source.indexOf('function studentQuestionMarkup('))+'\nstudentPassageMarkup;',{
  escapeHtml:value=>String(value??''),location:{origin:'http://fixture.test'},richBlocksFromPassage:()=>null,
 });
 for(const format of ['poem','prose','sentence_prose']){
  const image={src:'/exam-images/source.png',alt:'Source diagram',caption:'Source caption',width:280};
  const passage={title:'Source passage',text:'Source body.',format,preserveSourceLayout:true,image};
  const html=render(passage);
  assert.match(html,/<img[^>]*width="280"/);assert.match(html,/<figcaption>Source caption<\/figcaption>/);
  assert.equal((html.match(/source\.png/g)||[]).length,1);
  assert.doesNotMatch(render({...passage,image:{...image,width:undefined}}),/width="/);
 }
});
