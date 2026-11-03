import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('./content-studio-workspace.js',import.meta.url),'utf8');
function setup({dirty=false,blocked=false,failure=false}={}) {
  const opened=[],requests=[],notices=[],links=[];
  const popup={opener:{},location:{href:'about:blank'},closed:false,close(){this.closed=true;}};
  const button={disabled:false,textContent:'Add to planner',parentElement:{querySelector:()=>null},after:link=>links.push(link)};
  const ui=vm.runInNewContext(`${source}\nstudioUI;`,{
    app:{mathDirty:dirty},URLSearchParams,
    window:{addEventListener(){},open(...args){opened.push(args);return blocked?null:popup;}},
    api:async(path,options)=>{requests.push({path,body:JSON.parse(options.body)});if(failure)throw Error('Offline');return {url:'http://localhost:5173/teacher/math-command?'+JSON.parse(options.body).query};},
    setStatus:(...args)=>notices.push(args),
  });
  ui.element=()=>({dataset:{}});
  return {ui,button,popup,opened,requests,notices,links};
}
test('math question handoff keeps the editor open and carries only the exact selected ID',async()=>{
 const fixture=setup();
 await fixture.ui.addMathQuestionToPlanner('question & 2/3',fixture.button);
 assert.equal(fixture.requests.length,1);
 assert.equal(fixture.requests[0].path,'/api/math-command/teacher-workspace');
 const query=new URL(fixture.popup.location.href).searchParams;
 assert.deepEqual([...query],[['tab','planner'],['plannerQuestionId','question & 2/3']]);
 assert.equal(fixture.popup.opener,null);
 assert.equal(fixture.button.disabled,false);
 assert.match(fixture.notices[0][0],/Choose a batch/);
});
test('unsaved math questions cannot silently hand off an older saved snapshot',async()=>{
 const fixture=setup({dirty:true});
 await fixture.ui.addMathQuestionToPlanner('q',fixture.button);
 assert.equal(fixture.opened.length,0);assert.equal(fixture.requests.length,0);
 assert.match(fixture.notices[0][0],/Save the math section/);
});
test('blocked popups get a usable link and failed handoffs close the blank tab and allow retry',async()=>{
 const blocked=setup({blocked:true});await blocked.ui.addMathQuestionToPlanner('q',blocked.button);
 assert.equal(blocked.links.length,1);assert.match(blocked.links[0].href,/plannerQuestionId=q/);
 assert.equal(blocked.links[0].rel,'noopener noreferrer');
 const failed=setup({failure:true});await failed.ui.addMathQuestionToPlanner('q',failed.button);
 assert.equal(failed.popup.closed,true);assert.equal(failed.button.disabled,false);
 assert.match(failed.notices[0][0],/Could not open your planner: Offline/);
});
