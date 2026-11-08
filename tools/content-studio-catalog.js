/* One question index, five banks. Activity drafts retain references, not editable copies. */
window.LearningCatalog = (() => {
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const areas=[['reading','Reading Comprehension'],['math','Math'],['revising_editing_a','Revising/Editing A'],['revising_editing_b','Stand Alone Items']];
  const selections=new Map();
  let filters={bankId:'reading',search:'',categoryId:'',publisher:'',shsatLevel:'',year:'',collection:'',usage:'',review:'',page:0},data,active,revision='',busy=false,dirty=false,requestId=0,timer;
  window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
  const discard=()=>!dirty||window.confirm('Discard unsaved activity changes?');
  const root=()=>document.getElementById('catalog-view');
  const status=(message,error=false)=>{const node=root().querySelector('[data-catalog-status]');if(node){node.textContent=message;node.setAttribute('role',error?'alert':'status');}};
  const categories=area=>(app.state.learningTaxonomy||[]).filter(category=>category.active&&(!area||category.area===area));
  const options=(items,value,blank)=>`<option value="">${esc(blank)}</option>`+items.map(item=>`<option value="${esc(item.id??item)}"${(item.id??item)===value?' selected':''}>${esc(item.label??item)}</option>`).join('');
  function frame(){
    root().classList.add('learning-catalog');
    root().innerHTML=`<header class="lc-heading"><div><h1>Question banks</h1><p>Find the source, classification, and every worksheet or assessment that uses a question.</p></div><div><button type="button" data-import-worksheet>Import Math JSON → New worksheet</button><button type="button" data-add-question>Add a question</button></div></header><nav class="lc-banks" aria-label="Question banks"></nav><div class="lc-controls"><label>Search<input type="search" data-filter="search" value="${esc(filters.search)}" placeholder="Question, ID, passage, or source"></label><label>Category<select data-filter="categoryId"></select></label><label>Source<select data-filter="publisher"></select></label><label>SHSAT level<select data-filter="shsatLevel">${options([{id:"8",label:"SHSAT 8"},{id:"9",label:"SHSAT 9"}],filters.shsatLevel,"All levels")}</select></label><label>Year<select data-filter="year"></select></label><label>Worksheet collection<select data-filter="collection"></select></label><label>Used in<select data-filter="usage">${options([{id:'worksheet',label:'Worksheets'},{id:'assessment',label:'Assessments'},{id:'unused',label:'Not used yet'}],filters.usage,'All usages')}</select></label><label>Classification<select data-filter="review">${options([{id:'needs-classification',label:'Needs classification'}],filters.review,'All questions')}</select></label><button type="button" class="secondary" data-clear>Clear filters</button></div><p data-catalog-status role="status"></p><div class="lc-selection"><strong data-selection-count></strong><button type="button" data-create="worksheet">Create worksheet</button><button type="button" data-create="assessment">Create assessment</button><button type="button" class="secondary" data-selected-clear>Clear selection</button><span>Select individual questions; required passages come with them.</span></div><div class="lc-layout"><section class="lc-results"><div class="lc-table" tabindex="0" aria-label="Question results"><table><thead><tr><th><input type="checkbox" data-select-page aria-label="Select all questions on this page"></th><th>Question</th><th>Source</th><th>Classification</th><th>Used in</th><th>Details</th></tr></thead><tbody></tbody></table></div><div class="lc-pagination"><button type="button" class="secondary" data-prev>Previous</button><span data-page></span><button type="button" class="secondary" data-next>Next</button></div></section><aside class="lc-inspector" hidden aria-label="Question details"></aside></div><section class="lc-activity" hidden aria-label="Activity builder"></section>`;
    root().querySelectorAll('[data-filter]').forEach(control=>{const changed=()=>{filters[control.dataset.filter]=control.value;filters.page=0;clearTimeout(timer);timer=setTimeout(load,control.type==='search'?220:0);};control.addEventListener(control.type==='search'?'input':'change',changed);});
    root().querySelector('[data-clear]').onclick=()=>{if(!discard())return;dirty=false;filters={...filters,search:'',categoryId:'',publisher:'',shsatLevel:'',year:'',collection:'',usage:'',review:'',page:0};frame();load();};
    root().querySelector('[data-selected-clear]').onclick=()=>{selections.clear();renderRows();};
    root().querySelector('[data-prev]').onclick=()=>{filters.page--;load();};root().querySelector('[data-next]').onclick=()=>{filters.page++;load();};
    root().querySelectorAll('[data-create]').forEach(button=>button.onclick=()=>newActivity(button.dataset.create));
    root().querySelector('[data-import-worksheet]').onclick=()=>MathBatchStudio.importDialog('',true);
    root().querySelector('[data-add-question]').onclick=()=>{
      const tab={reading:'passages',math:'math',revising_editing_a:'part-a',revising_editing_b:'standalone',shsat_lab:'question-bank'}[filters.bankId];
      switchTab(tab);
      if(tab==='passages'||tab==='part-a')startNewPassage();
      else if(tab==='standalone')document.getElementById('new-standalone')?.click();
      else if(tab==='math')MathBatchStudio.importDialog('',true);
    };
  }
  async function load(){
    const ticket=++requestId;status('Loading questions…');
    try{const result=await api('/api/question-catalog?'+new URLSearchParams({...filters,limit:50}));if(ticket!==requestId)return;data=result;
      root().querySelector('.lc-banks').innerHTML=result.banks.map(bank=>`<button type="button" data-bank="${esc(bank.id)}" aria-pressed="${filters.bankId===bank.id}">${esc(bank.label)} <span>${bank.count}</span></button>`).join('');
      root().querySelectorAll('[data-bank]').forEach(button=>button.onclick=()=>{filters={...filters,bankId:button.dataset.bank,categoryId:'',page:0};load();});
      root().querySelector('[data-filter="categoryId"]').innerHTML=options(categories(filters.bankId==='shsat_lab'?undefined:filters.bankId),filters.categoryId,'All categories');
      root().querySelector('[data-filter="publisher"]').innerHTML=options(result.publishers,filters.publisher,'All sources');
      for(const key of ['year','collection'])root().querySelector(`[data-filter="${key}"]`).innerHTML=options(result[key==='year'?'years':'collections']||[],filters[key],key==='year'?'All years':'All collections');
      renderRows();status(`${result.matching} matching questions · ${result.classificationNeeded} across all banks need classification. Counts include all authored records; Math Command Center combines confirmed duplicate sources.`);
    }catch(error){if(ticket===requestId)status(error.message+' Use Clear filters to retry.',true);}
  }
  function renderRows(){
    if(!data)return;
    root().querySelector('tbody').innerHTML=data.questions.map(question=>`<tr><td><input type="checkbox" data-select="${esc(question.id)}" aria-label="Select ${esc(question.id)}"${selections.has(question.id)?' checked':''}></td><th scope="row"><span>${question.area==='math'?renderMathTextHtml(question.question.prompt||'Question with formatted content'):esc(question.question.prompt?.replace(/<[^>]+>/g,'').slice(0,180)||'Question with formatted content')}</span><small>${esc(question.id)}${question.passageTitle?' · '+esc(question.passageTitle):''}</small></th><td>${esc(question.publisher)}<small>${esc([question.shsatLevel?"SHSAT "+question.shsatLevel:"",question.year,question.collection].filter(Boolean).join(" · "))}</small><small>${question.sourceLocator?'Original source: '+esc(question.sourceLocator):''}</small></td><td>${esc([question.topic,question.subtopic].filter(Boolean).join(' / '))}<small>${esc(question.classificationIssues.join(' · '))}</small></td><td>${question.usages.length?question.usages.map(usage=>`<span class="lc-usage">${usage.kind==='worksheet'?'Worksheet':'Assessment'} · ${esc(usage.title)}${usage.status==='draft'?' · Draft':''} · ${usage.sectionNumber?'Math Q'+usage.sectionNumber+' · ':''}Activity Q${usage.number}</span>`).join(''):'Not used yet'}</td><td><button class="secondary" type="button" data-inspect="${esc(question.id)}">Details</button></td></tr>`).join('')||'<tr><td colspan="6">No questions match. Clear filters or add a question to this bank.</td></tr>';
    const selectPage=root().querySelector('[data-select-page]');selectPage.checked=Boolean(data.questions.length)&&data.questions.every(question=>selections.has(question.id));selectPage.indeterminate=data.questions.some(question=>selections.has(question.id))&&!selectPage.checked;selectPage.onchange=()=>{for(const question of data.questions){if(selectPage.checked)selections.set(question.id,question);else selections.delete(question.id);}renderRows();};
    root().querySelectorAll('[data-select]').forEach(input=>input.onchange=()=>{const question=data.questions.find(q=>q.id===input.dataset.select);if(input.checked)selections.set(question.id,question);else selections.delete(question.id);selectionStatus();});
    root().querySelectorAll('[data-inspect]').forEach(button=>button.onclick=()=>inspect(data.questions.find(q=>q.id===button.dataset.inspect)));
    root().querySelector('[data-prev]').disabled=filters.page===0;root().querySelector('[data-next]').disabled=(filters.page+1)*50>=data.matching;
    root().querySelector('[data-page]').textContent=`Page ${filters.page+1} of ${Math.max(1,Math.ceil(data.matching/50))}`;selectionStatus();
  }
  function selectionStatus(){const append=root().querySelector('[data-append]');if(append)append.textContent=`Add ${selections.size} selected questions`;root().querySelector('[data-selection-count]').textContent=`${selections.size} selected`;root().querySelectorAll('[data-create]').forEach(button=>button.disabled=!selections.size);}
  function inspect(question){
    const panel=root().querySelector('.lc-inspector');panel.hidden=false;
    panel.innerHTML=`<header><h2>Question details</h2><button type="button" class="secondary" data-close>Close</button></header><p>${esc(question.id)}</p><div class="lc-question-preview">${question.area==='math'?renderMathTextHtml(question.question.prompt||''):esc(question.question.prompt)}</div><p>Content version <code>${esc(question.contentVersion)}</code></p><form><label>Source<input name="publisher" maxlength="120" required value="${esc(question.publisher==='Unspecified'?'':question.publisher)}" list="lc-sources"></label><datalist id="lc-sources">${['Official Handbook','Prestige','Kaplan','SHSAT Lab','Nathan Tutors'].map(source=>`<option>${esc(source)}</option>`).join('')}</datalist><label>Source family<select name="sourceFamily">${options([{id:"official_shsat",label:"Official SHSAT"},{id:"sat_crash_course",label:"SAT Crash Course"}],question.sourceFamily,"Other / unspecified")}</select></label><label>SHSAT level<select name="shsatLevel">${options([{id:"8",label:"SHSAT 8"},{id:"9",label:"SHSAT 9"}],question.shsatLevel,"Unspecified")}</select></label><label>Year / edition<input name="year" value="${esc(question.year)}"></label><label>Original page / question<input name="sourceLocator" maxlength="300" value="${esc(question.sourceLocator)}"></label><p>Bank: ${esc(data.banks.find(bank=>bank.id===question.bankId)?.label)}<br>Area: ${esc(areas.find(area=>area[0]===question.area)?.[1])}</p><label>Category<select name="categoryId" required>${options(categories(question.area),question.categoryId,'Choose category')}</select></label>${question.area==='math'?'<label>Math topic<select name="topicId" required></select></label><label>Math skill (optional)<select name="mathSkillId"></select></label>':''}<button type="submit">Save classification</button><p role="status" data-detail-status></p></form><button type="button" class="secondary" data-source-editor>Edit question content</button>${question.area==='math'?'<button type="button" class="secondary" data-plan-practice>Plan infinite practice from this question</button>':''}<h3>Used in</h3>${question.usages.length?'<ul>'+question.usages.map(usage=>`<li>${usage.kind==='worksheet'?'Worksheet':'Assessment'}: ${esc(usage.title)}${usage.status==='draft'?' (draft)':''}, ${usage.sectionNumber?'Math Q'+usage.sectionNumber+' · ':''}Activity Q${usage.number}</li>`).join('')+'</ul>':'<p>This question has not been added to a worksheet or assessment.</p>'}`;
    panel.querySelector('[data-close]').onclick=()=>{panel.hidden=true;};
    const form=panel.querySelector('form');
    function refreshTopics(){const category=categories(question.area).find(item=>item.id===form.elements.categoryId.value);if(question.area!=='math')return;form.elements.topicId.innerHTML=options((category?.topics||[]).filter(item=>item.active),question.topicId,'Choose topic');refreshSkills();}
    function refreshSkills(){const category=categories('math').find(item=>item.id===form.elements.categoryId.value),topic=category?.topics.find(item=>item.id===form.elements.topicId.value);form.elements.mathSkillId.innerHTML=options((app.state.mathManagement.classificationSkills||[]).filter(skill=>skill.category===category?.label&&skill.subcategory===topic?.label),question.mathSkillId,'Uncategorized');}
    form.elements.categoryId.onchange=refreshTopics;if(question.area==='math'){form.elements.topicId.onchange=refreshSkills;refreshTopics();}
    form.onsubmit=async event=>{event.preventDefault();const button=form.querySelector('button');button.disabled=true;try{const result=await api(`/api/question-catalog/${encodeURIComponent(question.id)}/organization`,{method:'PUT',body:JSON.stringify({...Object.fromEntries(new FormData(form)),bank:question.bankId,area:question.area,contentVersion:question.contentVersion})});app.state=await api('/api/state');await load();inspect(result.question);status('Classification saved. Existing student snapshots retain their original metadata.');}catch(error){panel.querySelector('[data-detail-status]').textContent=error.message;}finally{button.disabled=false;}};
    const plannerButton=panel.querySelector('[data-plan-practice]');if(plannerButton)plannerButton.onclick=()=>studioUI.addMathQuestionToPlanner(question.id,plannerButton);
    panel.querySelector('[data-source-editor]').onclick=()=>{
      if(question.kind==='passage'){switchTab(question.area==='reading'?'passages':'part-a');selectPassage(question.editor.passageId);}
      else if(question.kind==='standalone'){switchTab('standalone');selectStandaloneItem(question.canonicalId);}
      else if(question.kind==='math'){const match=resolveMathQuestionLink(app.state.assessments,linkedMathSection,question.id);if(match){switchTab('math');selectMathAssessment(match.assessmentId,{selectedQuestionId:question.id,revealSelected:true});}else status('This question is not attached to an editable math collection.',true);}
      else switchTab('question-bank');
    };
  }
  function newActivity(kind){if(!discard())return;dirty=false;switchTab(kind==='worksheet'?'worksheets':'tests');active=null;revision='';renderActivity({kind,title:'',durationMinutes:kind==='worksheet'?30:180,studyHallWorksheet:{area:filters.bankId==='shsat_lab'?'reading':filters.bankId,scope:'focused'},assembly:{draftQuestionIds:[...selections.keys()],reviewed:false}});}
  let activityRequest=0, editingActivityId='', editingAssessmentId='', editingActivityLabel='worksheet';
  function decorateReturn(){
    if(!editingActivityId||app.selectedMathAssessmentId!==editingAssessmentId)return;
    const host=document.getElementById('math-builder');
    if(!host||host.querySelector('[data-return-worksheet]'))return;
    const back=document.createElement('button');back.type='button';back.className='secondary';back.dataset.returnWorksheet='';back.textContent='Return to '+editingActivityLabel;
    back.onclick=async()=>{if(app.mathDirty){await saveMath();if(app.mathDirty)return;}await openActivity(editingActivityId);};
    host.prepend(back);
  }
  function renderActivity(activity){
    activityRequest++;
    const host=document.getElementById('test-builder');host.classList.add('learning-catalog');host.innerHTML='<section class="lc-activity" aria-label="Activity builder"></section>';
    const panel=host.querySelector('.lc-activity');
    const questionLabels=new Map([...(app.state.passages||[]).flatMap(set=>set.questions||[]),...(app.state.mathSections||[]).flatMap(set=>set.questions||[]),...(app.state.standaloneItems||[])].map(question=>[question.id,question.prompt]));
    let previewHash=activity.assembly.reviewed?activity.assembly.reviewedContentHash||'':'';
    let previewIssues=[],failedAction='';
    const placement=activity.studyHallWorksheet||{},kind=activity.kind||(placement.subject?'worksheet':'assessment');
    const area=placement.area||(placement.subject==='math'?'math':'reading');
    panel.innerHTML=`
      <header class="lc-activity-heading"><h2>${esc(activity.title || (kind==='worksheet'?'New worksheet':'New assessment'))}</h2><button type="button" class="secondary" data-close-activity>Close builder</button></header>
      <form>
        <section class="lc-workflow" aria-label="Review and publish">
          <section class="lc-publication" aria-label="Publication status" data-publication-status></section>
          <ol class="lc-publish-steps" aria-label="Publishing progress">
            <li data-step="draft">1. Save draft</li><li data-step="review">2. Preview & review</li><li data-step="publish">3. Publish</li>
          </ol>
          <p class="lc-next-step" data-next-step></p>
          <div class="lc-actions">
            <button type="submit" class="secondary">Save draft</button>
            <button type="button" class="primary" data-preview>Preview & review</button>
          </div>
          <p data-activity-status role="status" hidden></p>
          <button type="button" class="secondary" data-retry-activity hidden>Retry</button>
          <button type="button" class="secondary" data-reload-activity hidden>Reload saved draft</button>
          <div data-access></div>
        </section>
        <section class="lc-preview" data-readiness hidden aria-label="Student preview and checks" tabindex="-1"></section>
        <section class="lc-publish-confirmation" data-confirm-review hidden aria-label="Confirm review and publish">
          <label class="lc-review"><input type="checkbox" name="reviewed"${activity.assembly.reviewed?' checked':''}> I reviewed the student preview, answer key, and formatting.</label>
          <p>${kind==='worksheet'?'Publishing saves the student version. You can then open student access in Study Hall.':'Publishing saves the assessment version. Assign it or open a session from the teacher dashboard.'}</p>
          <button type="button" class="primary" data-publish>Publish ${kind==='worksheet'?'worksheet':'assessment'}</button>
        </section>
        <details class="lc-settings"${activity.id?'':' open'}><summary>${kind==='worksheet'?'Worksheet':'Assessment'} settings <span>Title, timing, classification & source</span></summary><div class="lc-settings-content"><div class="lc-controls lc-settings-grid">${!activity.assembly.publishedReleaseId?`<label>Activity type<select name="kind"><option value="worksheet" ${kind==='worksheet'?'selected':''}>Worksheet</option><option value="assessment" ${kind==='assessment'?'selected':''}>Assessment</option></select></label>`:''}<label class="lc-title-field">Title<input name="title" required maxlength="160" value="${esc(activity.title)}"></label><label>Minutes<input name="durationMinutes" type="number" min="1" max="600" value="${activity.durationMinutes}"></label></div><label class="lc-description-field">Description<textarea name="description" maxlength="2000">${esc(activity.description)}</textarea></label>${kind==='worksheet'?`<div class="lc-controls lc-settings-grid"><label>Educational area<select name="area">${areas.map(([id,label])=>`<option value="${id}"${id===area?' selected':''}>${label}</option>`).join('')}</select></label><label>Worksheet scope<select name="scope"><option value="focused"${placement.scope!=='mixed'?' selected':''}>Focused practice</option><option value="mixed"${placement.scope==='mixed'?' selected':''}>General / Mixed Review</option></select></label><label>Category<select name="categoryId"></select></label><label>Math topic<select name="topicId"></select></label><label>Collection (optional)<input name="collection" maxlength="160" value="${esc(studioUI.canonicalWorksheetCollection(placement.collection))}" list="worksheet-collection-options"></label><datalist id="worksheet-collection-options">${[...new Set(app.state.assessments.map(item=>studioUI.worksheetPlacement(item)?.collection).filter(Boolean))].map(value=>`<option value="${esc(value)}"></option>`).join('')}</datalist></div>`:''}<details><summary>Source identity</summary><p>Keep publisher and exam identity separate from the worksheet collection.</p><div class="lc-controls lc-settings-grid"><label>Publisher<input name="publisher" value="${esc(placement.source?.publisher || (placement.source?.sourceFamily==='official_shsat'?'Official Handbook':''))}"></label><label>Source family<select name="sourceFamily">${options([{id:'official_shsat',label:'Official SHSAT'},{id:'sat_crash_course',label:'SAT Crash Course'}],placement.source?.sourceFamily,'Other / unspecified')}</select></label><label>SHSAT level<select name="shsatLevel">${options([{id:'8',label:'SHSAT 8'},{id:'9',label:'SHSAT 9'}],placement.source?.shsatLevel||(/Grade 9/i.test(placement.source?.form||'')?'9':''),'Unspecified')}</select></label><label>Year / edition<input name="year" value="${esc(placement.source?.year)}"></label></div></details></div></details>
        <section class="lc-questions" aria-label="Selected questions">
          <header><h3>Selected questions <span data-question-count></span></h3><div class="lc-question-actions"><button type="button" class="secondary" data-browse-bank>Choose from bank</button><button type="button" class="secondary" data-import-activity>Import Math JSON</button><button type="button" class="secondary" data-append${selections.size?'':' hidden'}>Add ${selections.size} selected questions</button></div></header>
          <p data-question-review role="status"></p>
          <button type="button" class="secondary" data-finish-review>Mark reviewed questions finished</button>
          <ol data-assembly-questions></ol>
        </section>
      </form>`;
    const form=panel.querySelector('form');form.addEventListener('input',event=>{dirty=true;if(event.target.name!=='reviewed')invalidatePreview();publicationStatus();});form.addEventListener('change',()=>{dirty=true;publicationStatus();});let ids=[...activity.assembly.draftQuestionIds];
    if(form.elements.kind)form.elements.kind.onchange=()=>{const values=Object.fromEntries(new FormData(form));renderActivity({...activity,title:values.title,description:values.description,durationMinutes:Number(values.durationMinutes),kind:values.kind,studyHallWorksheet:values.kind==='worksheet'?(activity.studyHallWorksheet||{subject:'math',area:'math',scope:'mixed',category:'Math'}):null,assembly:{...activity.assembly,draftQuestionIds:ids,reviewed:false}});dirty=true;};
    const message=(text,error=false)=>{
      const target=panel.querySelector('[data-activity-status]');
      target.textContent=text;target.hidden=!text;target.setAttribute('role',error?'alert':'status');
      if(!error){failedAction='';panel.querySelector('[data-retry-activity]').hidden=true;panel.querySelector('[data-reload-activity]').hidden=true;}
    };
    function invalidatePreview(){
      previewHash='';previewIssues=[];form.elements.reviewed.checked=false;
      panel.querySelector('[data-readiness]').hidden=true;
      message('Draft changed. Preview & review again before publishing.');
    }
    function publicationStatus(){
      const state=dirty&&active?.assembly.publishedReleaseId?{key:'changes',label:'Unsaved changes',summary:'Students use the published version'}:studioUI.publicationStatus(active||activity);
      const host=panel.querySelector('[data-publication-status]');
      host.className='lc-publication is-'+state.key;
      host.innerHTML='<strong><span class="studio-publication-badge is-'+state.key+'">'+esc(state.label)+'</span> '+esc(state.summary)+'</strong>';
      form.querySelectorAll('.lc-actions button').forEach(button=>button.disabled=busy);
      const published=!dirty&&state.key==='published';
      const canReview=Boolean(previewHash)&&!previewIssues.length;
      form.elements.reviewed.disabled=busy||!canReview||published;
      panel.querySelector('[data-confirm-review]').hidden=!previewHash||published;
      panel.querySelector('[data-publish]').disabled=busy||!canReview||!form.elements.reviewed.checked||published;
      panel.querySelector('[data-finish-review]').disabled=busy||!canReview||!form.elements.reviewed.checked;
      const step=published?'publish':!active?'draft':canReview&&form.elements.reviewed.checked?'publish':'review';
      panel.querySelectorAll('[data-step]').forEach(item=>{if(item.dataset.step===step)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');});
      const previewButton=panel.querySelector('[data-preview]');
      previewButton.className=canReview&&form.elements.reviewed.checked||published?'secondary':'primary';
      previewButton.textContent=previewHash?'Reopen preview':'Preview & review';
      panel.querySelector('[data-next-step]').textContent=published?'Published. '+(kind==='worksheet'?'Manage student access in Study Hall.':'Assign this assessment from the teacher dashboard.'):previewIssues.length?'Resolve the content issues below, then preview again.':!previewHash?'Check the student version and answer key. Your draft saves when you open the preview.':!form.elements.reviewed.checked?'Review the student version, then confirm your review to publish.':'Review confirmed. Publish when you are ready.';
      panel.querySelector('[data-reload-activity]').disabled=busy;
      panel.querySelector('[data-retry-activity]').disabled=busy;
    }
    panel.querySelector('[data-reload-activity]').onclick=()=>openActivity(active.id).catch(error=>message(error.message,true));
    panel.querySelector('[data-retry-activity]').onclick=()=>run(failedAction);
    form.addEventListener('invalid',()=>{panel.querySelector('.lc-settings').open=true;},true);
    publicationStatus();
    function categoryOptions(){const area=form.elements.area.value;form.elements.categoryId.innerHTML=options(categories(area),placement.categoryId||filters.categoryId,form.elements.scope.value==='mixed'?'Entire area':'Choose category');topicOptions();}
    function topicOptions(){const category=categories(form.elements.area.value).find(item=>item.id===form.elements.categoryId.value);form.elements.topicId.innerHTML=options(category?.topics.filter(topic=>topic.active)||[],placement.topicId,'All topics');form.elements.topicId.closest('label').hidden=form.elements.area.value!=='math';form.elements.categoryId.required=form.elements.scope.value==='focused';}
    if(kind==='worksheet'){form.elements.area.onchange=categoryOptions;form.elements.scope.onchange=categoryOptions;form.elements.categoryId.onchange=topicOptions;categoryOptions();}
    function reviewStatus(){
      const pending=ids.filter(id=>app.state.mathSections.some(section=>section.questions.some(q=>q.id===id&&q.importNeedsEditing)));
      panel.querySelector('[data-question-review]').hidden=!pending.length;
      panel.querySelector('[data-question-review]').textContent=pending.length?pending.length+' questions have review flags. After checking the preview, you can clear these flags here.':'';
      panel.querySelector('[data-finish-review]').hidden=!pending.length;
    }
    function accessUrl(){
      const url=new URL(kind==='worksheet'?'/study-hall/shsat/worksheets':'/teacher/assessments',document.querySelector('a[href*="/teacher/answer-sheets"]')?.href||'http://localhost:5173');
      if(kind!=='worksheet')return url;
      url.search=new URLSearchParams({subject:active.studyHallWorksheet?.subject||'math',...(active.studyHallWorksheet?.collection?{collection:active.studyHallWorksheet.collection}:{}),preview:'teacher',teacherTools:'1',returnTo:'/teacher'}).toString();
      return url;
    }
    function accessLink(){
      const target=panel.querySelector('[data-access]');if(!active?.assembly.publishedReleaseId)return;
      const url=accessUrl();
      target.innerHTML='<a target="_blank" rel="noopener" href="'+esc(url.href)+'">'+(kind==='worksheet'?'Manage student access in Study Hall':'Open assessments in the teacher dashboard')+'</a>';
    }
    async function editQuestion(id){
      try{
        message('Opening question editor…');if(dirty)await save();editingActivityId=active.id;
        const match=resolveMathQuestionLink(app.state.assessments,linkedMathSection,id);
        if(match){editingAssessmentId=match.assessmentId;editingActivityLabel=active.studyHallWorksheet?'worksheet':'assessment';switchTab('math');selectMathAssessment(match.assessmentId,{selectedQuestionId:id,revealSelected:true});decorateReturn();}
        else {const passage=app.state.passages.find(set=>set.questions.some(q=>q.id===id));if(passage){switchTab(passage.section==='reading'?'passages':'part-a');selectPassage(passage.id);}else{switchTab('standalone');selectStandaloneItem(id);}}
      }catch(error){message(error.message);}
    }
    function renderIds(){panel.querySelector('[data-question-count]').textContent=ids.length;publicationStatus();reviewStatus();accessLink();panel.querySelector('[data-assembly-questions]').innerHTML=ids.map((id,index)=>`<li><div class="lc-selected-question"><strong>Question ${index+1}</strong><div>${renderMathTextHtml(selections.get(id)?.question.prompt||questionLabels.get(id)||id)}</div></div><div class="lc-row-actions"><button type="button" class="secondary" data-edit-question="${esc(id)}" aria-label="Edit question ${index+1}">Edit</button><button type="button" class="secondary" data-up="${index}" aria-label="Move question ${index+1} up"${index===0?' disabled':''}>Up</button><button type="button" class="secondary" data-down="${index}" aria-label="Move question ${index+1} down"${index===ids.length-1?' disabled':''}>Down</button><button type="button" class="secondary" data-remove="${index}" aria-label="Remove question ${index+1}">Remove</button></div></li>`).join('')||'<li>No questions selected.</li>';panel.querySelectorAll('[data-edit-question]').forEach(button=>button.onclick=()=>editQuestion(button.dataset.editQuestion));panel.querySelectorAll('[data-remove]').forEach(button=>button.onclick=()=>{ids.splice(Number(button.dataset.remove),1);invalidatePreview();dirty=true;renderIds();});for(const [direction,step] of [['up',-1],['down',1]])panel.querySelectorAll(`[data-${direction}]`).forEach(button=>button.onclick=()=>{const index=Number(button.dataset[direction]);[ids[index],ids[index+step]]=[ids[index+step],ids[index]];invalidatePreview();dirty=true;renderIds();});}
    panel.querySelector('[data-browse-bank]').onclick=async()=>{try{await save();filters={...filters,bankId:form.elements.area?.value||area,categoryId:'',page:0};switchTab('catalog');await mount();let back=root().querySelector('[data-return-activity]');if(!back){back=document.createElement('button');back.dataset.returnActivity='';root().querySelector('.lc-heading').append(back);}back.textContent='Return to '+(kind==='worksheet'?'worksheet':'assessment');back.onclick=()=>openActivity(active.id);}catch(error){message(error.message);}};
    panel.querySelector('[data-import-activity]').onclick=async()=>{try{message('Opening JSON import…');if(dirty||!active)await save();app.selectedMathAssessmentId=active.id;await MathBatchStudio.importDialog();message('Import into this worksheet, or choose another destination in the import dialog.');}catch(error){message(error.message);}};
    renderIds();panel.querySelector('[data-append]').onclick=()=>{ids=[...new Set([...ids,...selections.keys()])];invalidatePreview();dirty=true;renderIds();};
    panel.querySelector('[data-close-activity]').onclick=()=>{if(discard()){dirty=false;panel.hidden=true;studioUI.openBuilderLibrary();}};
    async function save(){
      if(!form.checkValidity())panel.querySelector('.lc-settings').open=true;
      if(!form.reportValidity())throw new Error('Complete the required activity fields.');
      const values=Object.fromEntries(new FormData(form));let placement;
      if(kind==='worksheet'){const category=categories(values.area).find(item=>item.id===values.categoryId),topic=category?.topics.find(topic=>topic.id===values.topicId);placement={subject:values.area==='math'?'math':'english',area:values.area,scope:values.scope,category:category?.label||areas.find(item=>item[0]===values.area)[1],categoryId:values.categoryId||undefined,topic:topic?.label,topicId:values.topicId||undefined,collection:values.collection,source:{...activity.studyHallWorksheet?.source,publisher:values.publisher,sourceFamily:values.sourceFamily,shsatLevel:values.shsatLevel,year:values.year}};}
      const result=await api('/api/learning-activities'+(active?'/'+encodeURIComponent(active.id):''),{method:active?'PUT':'POST',body:JSON.stringify({...values,kind,studyHallWorksheet:placement,questionIds:ids,reviewed:form.elements.reviewed.checked,reviewedContentHash:previewHash,revision})});active=result.activity;revision=result.revision;dirty=false;const index=app.state.assessments.findIndex(item=>item.id===active.id);if(index<0)app.state.assessments.push(active);else app.state.assessments[index]=active;publicationStatus();renderAssessmentList();return result;
    }
    async function run(action){
      if(busy)return;
      busy=true;publicationStatus();message(action==='preview'?'Saving draft and preparing preview…':action==='publish'?'Publishing reviewed version…':'Saving…');
      let completed=false;
      try{
        if(action==='preview'&&form.elements.reviewed.checked){form.elements.reviewed.checked=false;dirty=true;}
        if(dirty||!active)await save();
        if(action==='preview'){
          const preview=await api('/api/learning-activities/'+encodeURIComponent(active.id)+'/preview',{method:'POST',body:JSON.stringify({revision})});
          active=preview.activity;revision=preview.revision;previewHash=preview.contentVersion;
          const readiness=panel.querySelector('[data-readiness]');
          // Review confirmation is a separate step, not a failed content check.
          const issues=preview.issues.filter(issue=>issue!=='Review the student preview and confirm the answer key and formatting.');
          previewIssues=issues;
          const url='/exam-preview/?assessmentId='+encodeURIComponent(active.id)+'&draft=1&subject='+(placement.subject==='math'||form.elements.area?.value==='math'?'math':'english');
          readiness.hidden=false;
          readiness.innerHTML=`<header><h3>Student preview</h3><button type="button" class="secondary" data-close-preview>Close preview</button></header>${issues.length?'<div role="alert"><h4>Before publication</h4><ul>'+issues.map(issue=>`<li>${esc(issue)}</li>`).join('')+'</ul></div>':'<p>Content checks passed. Check the questions and answer key, then confirm your review below.</p>'}<p><a href="${esc(url)}" target="_blank" rel="noopener">Open student preview in a full window</a></p><iframe title="Student activity preview" src="${esc(url)}"></iframe>`;
          readiness.querySelector('[data-close-preview]').onclick=()=>{readiness.hidden=true;panel.querySelector('[data-preview]').focus();};
          message(issues.length?'Preview ready. Resolve the listed content issues before publishing.':'Preview ready. Check the questions and answer key, then confirm your review.');
        }else if(action==='finish'){
          await api('/api/learning-activities/'+encodeURIComponent(active.id)+'/finish-review',{method:'POST',body:JSON.stringify({revision})});
          await reloadState();reviewStatus();message('Reviewed questions marked finished. Source notes remain available in the question editor.');
        }else if(action==='publish'){
          await api('/api/learning-activities/'+encodeURIComponent(active.id)+'/publish',{method:'POST',body:JSON.stringify({revision})});
          completed=true;
          const result=await api('/api/learning-activities/'+encodeURIComponent(active.id));active=result.activity;revision=result.revision;
          panel.querySelector('[data-readiness]').hidden=true;
          accessLink();message(kind==='worksheet'?'Worksheet published. Next: manage student access in Study Hall.':'Assessment published. Next: assign it from the teacher dashboard.');
          if(root().querySelector('.lc-heading'))await load();
        }else message('Draft saved.');
        app.state.assessments=(await api('/api/learning-activities')).activities;renderAssessmentList();
      }catch(error){
        message(completed?'Publication succeeded, but the refreshed status could not be loaded. Reload the saved draft to check it.':error.message,true);
        const reload=completed||error.status===409;
        failedAction=reload?'':action;
        panel.querySelector('[data-reload-activity]').hidden=!reload||!active;
        const retry=panel.querySelector('[data-retry-activity]');retry.hidden=reload;retry.textContent=action==='publish'?'Retry publication':action==='preview'?'Retry preview':'Retry save';
      }
      finally{busy=false;publicationStatus();}
    }
    form.onsubmit=event=>{event.preventDefault();run('save');};panel.querySelector('[data-preview]').onclick=()=>run('preview');panel.querySelector('[data-publish]').onclick=()=>run('publish');panel.querySelector('[data-finish-review]').onclick=()=>run('finish');if(matchMedia('(max-width: 959px)').matches){studioUI.setLibraryPinned(false);studioUI.setLibraryExpanded(false);}
    host.scrollTop=0;
  }
  async function mount(){if(!root().querySelector('.lc-heading'))frame();await load();}
  async function openActivity(id,navigate=true){if(!discard())return;dirty=false;const request=++activityRequest;const result=await api('/api/learning-activities/'+encodeURIComponent(id));if(request!==activityRequest)return;active=result.activity;revision=result.revision;if(navigate){switchTab(active.studyHallWorksheet?'worksheets':'tests');selectAssessment(id);return;}renderActivity(active);}
  function begin(kind){newActivity(kind);}
  return {mount,openActivity,begin,decorateReturn,leave(){if(busy||!discard())return false;dirty=false;return true;}};
})();
