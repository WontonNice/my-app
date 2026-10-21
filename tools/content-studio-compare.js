/* Read-only comparison of saved test content. */
const ComparisonStudio = {
  report:null, busy:false, error:'', filter:'all', query:'', sequence:0,
  mount() {
    const root=document.getElementById('compare-workspace');
    if(root.dataset.mounted)return;
    root.dataset.mounted='true';
    const tests=app.state.tests;
    const options=tests.map(test=>`<option value="${escapeHtml(test.assessmentId)}">${escapeHtml(test.title)}</option>`).join('');
    root.innerHTML=`<header class="compare-heading"><div><span class="studio-eyebrow">Content library · Repeat checker</span><h1>Compare tests</h1><p>Find questions and passages reused across two exams.</p></div><span class="compare-readonly">Saved content · read only</span></header>
      <section class="compare-picker"><label>Test A<select id="compare-left">${options}</select></label><button type="button" id="compare-swap" aria-label="Swap tests">⇄</button><label>Test B<select id="compare-right">${options}</select></label><button type="button" class="primary" id="compare-run">Compare tests</button></section>
      <p class="compare-method">Formatting, question IDs, answer letters, choice order, and teacher classifications do not create new questions. English questions are checked with their passage context. Diagrams must match their saved image content. Save edits before comparing.</p>
      <div id="compare-status" role="status" aria-live="polite"></div><div id="compare-summary"></div>
      <section class="compare-results" hidden><div class="compare-result-toolbar"><h2>Matching content</h2><label>Show<select id="compare-filter"><option value="all">All confirmed matches</option><option value="math">Math questions</option><option value="english">English questions</option><option value="passages">Passages</option><option value="possible">Possible repeats · check manually</option></select></label><input id="compare-search" aria-label="Search matches" placeholder="Search matching content" type="search"><button type="button" class="secondary" id="compare-export">Export CSV</button></div><p id="compare-result-count"></p><div id="compare-matches"></div></section>`;
    const left=root.querySelector('#compare-left'),right=root.querySelector('#compare-right');
    left.value=tests.some(test=>test.assessmentId===studioUI.readPreference('compare-left',''))?studioUI.readPreference('compare-left',''):tests[0]?.assessmentId || '';
    right.value=tests.some(test=>test.assessmentId===studioUI.readPreference('compare-right',''))?studioUI.readPreference('compare-right',''):tests.find(test=>test.assessmentId!==left.value)?.assessmentId || '';
    const invalidate=()=>{this.sequence++;this.report=null;this.error='';this.render();};
    left.onchange=right.onchange=invalidate;
    root.querySelector('#compare-swap').onclick=()=>{[left.value,right.value]=[right.value,left.value];invalidate();};
    root.querySelector('#compare-run').onclick=()=>this.compare();
    root.querySelector('#compare-filter').onchange=event=>{this.filter=event.target.value;this.renderMatches();};
    root.querySelector('#compare-search').oninput=event=>{this.query=event.target.value;this.renderMatches();};
    root.querySelector('#compare-export').onclick=()=>this.export();
    if(tests.length<2)this.error='Save at least two tests in Exam builder to compare them.';
    this.render();
  },
  async compare() {
    const left=document.getElementById('compare-left').value,right=document.getElementById('compare-right').value;
    if(!left||!right||left===right){this.error='Choose two different saved tests.';this.report=null;this.render();return;}
    const sequence=++this.sequence;this.busy=true;this.error='';this.report=null;this.render();
    try {
      const report=await api(`/api/tests/compare?left=${encodeURIComponent(left)}&right=${encodeURIComponent(right)}`);
      if(sequence!==this.sequence)return;
      this.report=report;studioUI.remember('compare-left',left);studioUI.remember('compare-right',right);
    } catch(error){if(sequence===this.sequence)this.error=error.message;}
    finally{if(sequence===this.sequence){this.busy=false;this.render();}}
  },
  render() {
    const root=document.getElementById('compare-workspace');
    root.querySelectorAll('.compare-picker select,.compare-picker button').forEach(element=>element.disabled=this.busy);
    document.getElementById('compare-run').textContent=this.busy?'Comparing saved content…':'Compare tests';
    const status=document.getElementById('compare-status');status.className=this.error?'compare-error':'';
    status.textContent=this.error || (this.busy?'Reading both tests and checking their text and diagrams…':this.report?`Compared ${new Date(this.report.comparedAt).toLocaleString()}. Expand a match to inspect both tests.`:'Choose two tests, then compare. Your content will stay in place.');
    document.getElementById('compare-summary').innerHTML=this.report ? `<div class="compare-metrics">${[['math','Math questions'],['english','English questions'],['passages','Passages']].map(([key,label])=>{
      const s=this.report.stats[key];return `<article><span>Shared ${label}</span><strong>${s.groups}</strong><small>Unique content matches</small><div><b>A</b> ${s.leftMatched} / ${s.leftTotal} <b>B</b> ${s.rightMatched} / ${s.rightTotal}</div></article>`;
    }).join('')}<article class="compare-possible"><span>Possible repeats</span><strong>${this.report.possibleTotal}</strong><small>Separate from confirmed counts</small><button type="button" id="compare-show-possible">Inspect possible repeats →</button></article></div>
      <p class="compare-count-note">Counts show unique matching content. A and B show how many items in each test are covered, including multiple copies within a test. Passages are counted separately from their questions.</p>${this.report.warnings.map(warning=>`<p class="compare-warning">${escapeHtml(warning)}</p>`).join('')}`:'';
    root.querySelector('.compare-results').hidden=!this.report;
    root.querySelector('#compare-show-possible')?.addEventListener('click',()=>{document.getElementById('compare-filter').value='possible';this.filter='possible';this.renderMatches();});
    if(this.report)this.renderMatches();
  },
  items() {
    if(!this.report)return [];
    const source=this.filter==='possible'?this.report.possible:this.report.matches;
    return source.filter(match=>(['all','possible'].includes(this.filter)||match.kind===this.filter)&&(!this.query||JSON.stringify([match.left,match.right]).toLowerCase().includes(this.query.toLowerCase())));
  },
  renderMatches() {
    const matches=this.items(),label=kind=>({math:'Math question',english:'English question',passages:'Passage'})[kind];
    document.getElementById('compare-result-count').textContent=`${matches.length} ${this.filter==='possible'?'possible repeat pairs':'matching groups'}${this.filter==='possible'&&this.report.possibleTotal>200?` shown of ${this.report.possibleTotal}; showing the 200 closest pairs`:''}.`;
    document.getElementById('compare-matches').innerHTML=matches.length?matches.map((match,index)=>`<details class="compare-match"><summary><span class="compare-kind ${match.kind}">${label(match.kind)}</span><div><strong>${escapeHtml(match.left[0].content.title || this.plain(match.left[0].content.prompt,match.left[0].content.promptHtml) || match.left[0].label).slice(0,230)}</strong><small>${escapeHtml(match.left.map(item=>item.label).join(' · '))} ↔ ${escapeHtml(match.right.map(item=>item.label).join(' · '))}</small></div><span class="compare-match-badge">${this.filter==='possible'?`${match.score}% similar`:'Content match'}</span></summary>${match.reason?`<p class="compare-warning">${escapeHtml(match.reason)} Check both originals before treating these as duplicates.</p>`:''}<div class="compare-match-columns"><section><header><b>A</b><strong>${escapeHtml(this.report.left.title)}</strong></header>${match.left.map(item=>this.preview(item,match.kind)).join('')}</section><section><header><b>B</b><strong>${escapeHtml(this.report.right.title)}</strong></header>${match.right.map(item=>this.preview(item,match.kind)).join('')}</section></div></details>`).join(''):`<div class="compare-empty"><strong>${this.query?'No matches fit your search.':this.filter==='possible'?'No possible repeats found.':'No confirmed duplicates found in this view.'}</strong><p>${this.filter==='possible'?'Possible matches are suggestions for manual checking.':'You can inspect Possible repeats for close wording or different diagrams.'}</p></div>`;
  },
  plain(text,html) {return html?new DOMParser().parseFromString(html,'text/html').body.textContent || text || '':text || '';},
  preview(item,kind) {
    const q=item.content;
    const body=kind==='passages'?this.plain(q.text,q.richText):[this.plain(q.instructions,q.instructionsHtml),this.plain(q.stimulus,q.stimulusHtml),this.plain(q.prompt,q.promptHtml)].filter(Boolean).join('\n\n');
    return `<article class="compare-item"><h3>${escapeHtml(item.label)}</h3><div class="compare-source-text">${renderMathTextHtml(body)}</div>${q.choices?.length?`<ol class="compare-choices">${q.choices.map(c=>`<li><b>${escapeHtml(c.id)}.</b><span>${c.math?renderKatexExpression(c.math):renderMathTextHtml(this.plain(c.text,c.html))}</span></li>`).join('')}</ol>`:''}${item.images.length?`<div class="compare-diagrams"><small>Referenced diagrams, in source order</small>${item.images.filter(src=>/^\/exam-images\/[a-zA-Z0-9._-]+$/.test(src)).map(src=>`<img loading="lazy" src="${escapeHtml(src)}" alt="Source diagram">`).join('')}</div>`:''}${!q.choices?.length&&kind!=='passages'&&['inline_dropdown','math_drag_drop','number_line_response','graph_point_select','category_sort','matrix_choice','table_match'].includes(q.type)?`<details class="compare-interaction"><summary>Interaction details</summary><pre>${escapeHtml(JSON.stringify(Object.fromEntries(Object.entries(q).filter(([key])=>['dropdownContent','dropdowns','dragDropContent','dragDropSlots','items','categories','graph','numberLineResponse'].includes(key))),null,2))}</pre></details>`:''}</article>`;
  },
  export() {
    const quote=value=>'"'+String(value ?? '').replaceAll('"','""')+'"';
    const rows=[['Status','Content type','Test A','Locations A','Test B','Locations B','Similarity','Notes'],...this.items().map(match=>[this.filter==='possible'?'Possible repeat':'Confirmed content match',match.kind,this.report.left.title,match.left.map(item=>item.label).join('; '),this.report.right.title,match.right.map(item=>item.label).join('; '),match.score || 100,match.reason || ''])];
    const csv=rows.map(row=>row.map(value=>quote(/^[=+@\-\t\r]/.test(String(value))?"'"+value:value)).join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='test-repeat-comparison.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  },
};
