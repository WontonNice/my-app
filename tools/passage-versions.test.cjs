const {test}=require('node:test');
const assert=require('node:assert/strict');
const versions=require('./passage-versions.cjs');
const base={id:'source',fileName:'source.ts',text:'The original passage.',versionLabel:'Form A',questions:[{id:'one',type:'multiple_choice',prompt:'First question?',choices:[{id:'A',text:'Yes'},{id:'B',text:'No'}],correctChoiceId:'A'},{id:'two',type:'short_response',prompt:'Second question?',correctTextAnswers:['2']}]};
test('only the same passage and complete ordered questions count as identical',()=>{
 const clone=structuredClone(base);clone.id='other';clone.versionLabel='Form B';clone.questions[0].id='other-one';clone.questions[0].topic='Tone';
 assert.equal(versions.identical(base,clone),true);
 for(const change of [q=>q.questions.reverse(),q=>q.questions.pop(),q=>q.questions[0].prompt='Different?',q=>q.questions[0].choices.reverse(),q=>q.questions[0].correctChoiceId='B',q=>q.text='Different passage.',q=>q.questions[1].correctTextAnswers=['3']]){const other=structuredClone(base);change(other);assert.equal(versions.identical(base,other),false);}
 assert.equal(versions.identical({...base,questions:[]},{...base,questions:[]}),false);
});
test('conflicting versions get fresh stable identities without changing either question set',()=>{
 const fresh=versions.distinct(base,[base,{id:'source-version-2',fileName:'source-version-2.ts'}]);
 assert.equal(fresh.id,'source-version-3');assert.equal(fresh.fileName,'source-version-3.ts');
 assert.deepEqual(fresh.questions.map(q=>q.prompt),base.questions.map(q=>q.prompt));
 assert.equal(base.questions[0].id,'one');
 assert.deepEqual(versions.labels({versionLabels:['Form A','Form B','Form A']}),['Form A','Form B']);
});

test('typography, HTML spacing and glossary markers do not create different question versions',()=>{
 const left=structuredClone(base),right=structuredClone(base);
 left.text='A word. Another line.';left.richText='<p>A <em>word</em>.</p><p>Another line.</p>';
 right.text='A word¹.\nAnother line.';right.richText='<div>A <span data-glossary-definition="A definition">word</span><sup>1</sup>.</div><div>Another line.</div>';
 left.questions[0].promptHtml='<p>First <strong>question</strong>?</p>';
 right.questions[0].promptHtml='First&nbsp;question?';
 left.questions[0].choices[0].html='<em>Yes</em>';
 right.questions[0].choices[0].html='Yes';
 assert.equal(versions.identical(left,right),true);
 right.questions.reverse();assert.equal(versions.identical(left,right),false);
 right.questions.reverse();right.questions[0].choices.reverse();assert.equal(versions.identical(left,right),false);
 right.questions[0].choices.reverse();right.questions[0].promptHtml='First <sup>2</sup> question?';assert.equal(versions.identical(left,right),false,'Mathematical superscripts remain meaningful');
 right.questions[0].promptHtml=left.questions[0].promptHtml;
 right.questions[0].choices[0].html='Yes<img src="/exam-images/different-diagram.png">';
 assert.equal(versions.identical(left,right),false,'Embedded answer diagrams are part of question identity');
});
