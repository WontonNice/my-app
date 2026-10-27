import assert from 'node:assert/strict';
import {test} from 'node:test';
import {resolve} from 'node:path';
import vm from 'node:vm';
import {mathPreviewAsset} from './math-preview-bundle.mjs';

test('preview bootstrap shows a useful failure when the player script cannot load', async()=>{
  const {body}=await mathPreviewAsset(resolve('.'),'/math-student-preview/');
  assert.match(body,/role="status"[^>]*>Loading student player/);
  const scripts=[...body.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  let receive, shown;
  const root={querySelector:()=>null,textContent:'Loading',append:node=>{shown=node;}};
  vm.runInNewContext(scripts[0][1],{
    window:{addEventListener:(name,callback)=>{if(name==='error')receive=callback;}},
    document:{getElementById:()=>root,createElement:()=>({style:{},setAttribute(name,value){this[name]=value;}})}
  });
  receive({target:{tagName:'SCRIPT'}});
  assert.equal(shown.role,'alert');
  assert.match(shown.textContent,/preview could not load.*question is still in the editor/);
  shown=null;root.querySelector=()=>({});receive({target:{tagName:'SCRIPT'}});
  assert.equal(shown,null,'A rendered player must not be replaced by an unrelated resource failure');
});

test('preview bootstrap references buildable JavaScript and CSS assets',async()=>{
  const root=resolve('.');
  for(const [name,type] of [['math-student-preview.js','text/javascript'],['math-student-preview.css','text/css']]){
    const asset=await mathPreviewAsset(root,'/math-student-preview/'+name);
    assert.equal(asset.type,type);
    assert.ok(asset.body.length>1000,`${name} must contain the real player bundle`);
  }
  assert.equal(await mathPreviewAsset(root,'/math-student-preview/missing.js'),null);
});
