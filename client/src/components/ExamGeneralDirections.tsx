import { Fragment } from 'react';

export function generalDirectionsParts(english: number, math: number, first: 'english' | 'math') {
  const sections = first === 'math' ? [{name:'Mathematics',count:math},{name:'English Language Arts',count:english}] : [{name:'English Language Arts',count:english},{name:'Mathematics',count:math}];
  let next = 1;
  return sections.filter(section => section.count > 0).map(section => {
    const part = {...section,start:next,end:next+section.count-1}; next += section.count; return part;
  });
}

/** One TestNav-format cover for every source, with the actual exam's counts/time. */
export function ExamGeneralDirections({english,math,total,durationMinutes,firstSubject}: {english:number;math:number;total:number;durationMinutes:number;firstSubject:'english'|'math'}) {
  const parts = generalDirectionsParts(english,math,firstSubject);
  return <section className="exam-session-document exam-general-directions-document" aria-labelledby="exam-session-title">
    <article className="exam-session-page">
      <header className="exam-session-page-header">
        <p><span>The New York City Department of Education</span></p>
        <h1 id="exam-session-title"><strong>Specialized High Schools Admissions Test</strong></h1>
        <p className="exam-general-grade"><span>Grade 8</span></p>
      </header>
      <section className="exam-session-content-block">
        <h2>&nbsp;General Directions</h2>
        <p>This test consists of {total} questions across {parts.length === 2 ? 'two subjects' : 'one subject'}, {parts.map(part => part.name).join(' and ')}.</p>
        <div className="exam-session-section-list">
          {parts.map((part,index) => <Fragment key={part.name}>
            <p className="exam-general-part">{index === 0 && <br />}<strong>PART {index+1} — {part.name.toUpperCase()}<br />{part.count} QUESTIONS</strong></p>
            <p className="exam-session-question-range">Questions {part.start}–{part.end}{index === parts.length-1 && <><br /><br /></>}</p>
          </Fragment>)}
        </div>
      </section>
      <p className="exam-general-divider">&nbsp;</p>
      <section className="exam-session-content-block exam-general-planning">
        <h2>&nbsp;Planning Your Time</h2>
        <ul>
          <li>For practice tests with the timer enabled, your test session will end after {durationMinutes} minutes.<br /><br /></li>
          <li>In a computer adaptive test (CAT), you must answer every question. For Math and stand-alone revising and editing questions, you will not be able to return to a question once you have advanced to the next question.<br /><br /></li>
          <li>ELA Reading Comprehension and Revising &amp; Editing passage sets only:<br /><br />
            <ul><li>For each passage set (a text and its related questions), you can return to the questions within the set and alter your responses; however, once you advance forward from the last question of that set, you will be unable to return to any questions in the set or change your answers.<br /><br /></li></ul>
          </li>
          <li>Do not spend too much time on any one question. If you are unsure, choose the response you think is best.<br /><br /></li>
          <li>You must complete the subject area you started with before moving on to the next subject area. Once you submit a subject area, you will be unable to return to it.</li>
        </ul>
      </section>
    </article>
  </section>;
}
