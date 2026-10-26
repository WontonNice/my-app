/* Contextual management uses canonical IDs; the exam preview stays the editor. */
const MathCommandStudio = {
  mountInspector(root) {
    const question=app.mathDraft?.questions[app.selectedMathQuestionIndex];
    const stack=root.querySelector('.math-editor-stack');if(!question||!stack)return;
    const panel=document.createElement('details');panel.className='studio-disclosure studio-math-inspector';
    panel.innerHTML='<summary>Math inspector <span>Skills, difficulty, source & review</span></summary><div class="studio-inspector-body"></div>';
    stack.querySelector('#studio-math-classification-state')?.after(panel);
    let loaded=false;
    panel.addEventListener('toggle',async()=>{if(!panel.open||loaded)return;loaded=true;
      const body=panel.querySelector('.studio-inspector-body');body.textContent='Loading question metadata…';
      try{
        const [detail,overview]=await Promise.all([api('/api/math-command/catalog/'+encodeURIComponent(question.id)),api('/api/math-command/overview')]);
        if(app.mathDraft.managementRevision&&app.mathDraft.managementRevision!==overview.revision)throw new Error('Classification changed in another view. Reload the saved math section before editing metadata.');
        const metadata=detail.record.metadata||{};let revision=overview.revision,token='';
        const skills=overview.skills.filter(skill=>skill.category===question.topic&&skill.subcategory===question.subtopic);
        const options=(values,selected)=>'<option value="">Not classified</option>'+values.map(([id,label])=>`<option value="${escapeHtml(id)}" ${selected===id?'selected':''}>${escapeHtml(label)}</option>`).join('');
        body.innerHTML=`<div class="studio-inspector-status"><span>${detail.row.hasAnswer?'Answer keyed':'Missing answer'}</span><span>${detail.row.hasExplanation?'Explanation saved':'Missing explanation'}</span><span>${detail.row.ready?'Ready to assign':detail.row.issues.length+' review issues'}</span></div>
          <div class="studio-inspector-fields">
          <label>Difficulty<select data-inspector="difficulty">${options([['easy','Easy'],['medium','Medium'],['hard','Hard'],['expert','Expert']],metadata.difficulty)}</select></label>
          <label>Diagnostic skill<select data-inspector="diagnosticSkill">${options(skills.map(skill=>[skill.id,skill.label]),metadata.diagnosticSkill)}</select></label>
          <label>Secondary skills<input data-inspector="secondarySkills" value="${escapeHtml((metadata.secondarySkills||[]).join(', '))}" placeholder="Separate tags with commas"></label>
          <label>Source<input data-inspector="source" value="${escapeHtml(metadata.source||detail.row.source)}"></label>
          <label>Source question ID<input data-inspector="sourceQuestionId" value="${escapeHtml(metadata.sourceQuestionId||'')}"></label>
          <label>Review<select data-inspector="reviewStatus"><option value="">Unreviewed</option><option value="needs_review" ${metadata.reviewStatus==='needs_review'?'selected':''}>Needs review</option><option value="reviewed" ${metadata.reviewStatus==='reviewed'?'selected':''}>Reviewed by teacher</option></select></label>
          <label>Standards<input data-inspector="standardCodes" value="${escapeHtml((metadata.standards||[]).map(s=>s.code).join(', '))}" placeholder="Verified codes, separated by commas"></label>
          <label>Standard reference URL<input data-inspector="standardUrl" type="url" value="${escapeHtml(metadata.standards?.[0]?.referenceUrl||'')}" placeholder="https://www.nysed.gov/…"></label>
          <label class="studio-inspector-check"><input type="checkbox" data-inspector="verified" ${metadata.standards?.length&&metadata.standards.every(s=>s.verified)?'checked':''}>I verified these question mappings</label>
          <label class="studio-inspector-check"><input type="checkbox" data-inspector="requiresDiagram" ${metadata.requiresDiagram?'checked':''}>Requires a diagram</label>
          </div><div class="studio-inspector-review" role="status"></div><div class="studio-inspector-actions"><button type="button" class="secondary" data-preview>Preview metadata changes</button><a href="http://localhost:5173/teacher/math-command?questionId=${encodeURIComponent(question.id)}" target="_blank" rel="noreferrer">Question performance & usage ↗</a><button type="button" class="secondary" data-command>Open Math Command Center</button></div>`;
        const status=body.querySelector('[role="status"]'),save=body.querySelector('[data-preview]');
        const value=key=>body.querySelector(`[data-inspector="${key}"]`).value;
        const readForm=()=>({difficulty:value('difficulty'),diagnosticSkill:value('diagnosticSkill'),secondarySkills:value('secondarySkills').split(',').map(s=>s.trim()).filter(Boolean),source:value('source'),sourceQuestionId:value('sourceQuestionId'),reviewStatus:value('reviewStatus'),requiresDiagram:body.querySelector('[data-inspector="requiresDiagram"]').checked,standards:value('standardCodes').split(',').map(code=>code.trim()).filter(Boolean).map(code=>({code,verified:body.querySelector('[data-inspector="verified"]').checked,referenceUrl:value('standardUrl')}))});
        let savedForm=readForm();
        body.addEventListener('input',()=>{token='';save.textContent='Preview metadata changes';status.textContent='';});
        body.querySelector('[data-command]').onclick=()=>switchTab('math-command');
        save.onclick=async()=>{save.disabled=true;try{
          if(!token){
            const patch=Object.fromEntries(Object.entries(readForm()).filter(([key,entry])=>JSON.stringify(entry)!==JSON.stringify(savedForm[key])));
            if(!Object.keys(patch).length){status.textContent='No metadata changes.';return;}
            const preview=await api('/api/math-command/bulk-preview',{method:'POST',body:JSON.stringify({questionIds:[question.id],revision,patch})});token=preview.token;
            status.textContent=preview.changes.flatMap(change=>change.fields.filter(field=>JSON.stringify(field.before)!==JSON.stringify(field.after)).map(field=>`${field.field}: ${typeof field.before==='object'?JSON.stringify(field.before):field.before||'blank'} → ${typeof field.after==='object'?JSON.stringify(field.after):field.after||'blank'}`)).join(' · ')||'No metadata changes.';
            save.textContent='Apply to this question';
          }else{
            const result=await api('/api/math-command/bulk-apply',{method:'POST',body:JSON.stringify({token})});revision=result.revision;token='';
            if(app.mathDraft)app.mathDraft.managementRevision=revision;
            const updated=await api('/api/math-command/catalog/'+encodeURIComponent(question.id));question.commandMetadata=updated.record.metadata||{};
            savedForm=readForm();
            save.textContent='Preview metadata changes';status.textContent='Metadata saved. Question wording and answer key were preserved.';
          }
        }catch(error){status.textContent=error.message;token='';save.textContent='Preview metadata changes';}finally{save.disabled=false;}};
      }catch(error){body.textContent=error.message+' Save new questions before classifying them.';}
    });
  },
};
