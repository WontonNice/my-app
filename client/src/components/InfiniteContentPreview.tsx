import { useState } from 'react';
import type { PlanContent } from '../lib/learningPlan';
import { generateCatalogQuestion } from '../../../server/src/shared/practiceCatalog';
import { ExamMathQuestion } from './ExamMathQuestion';
import { ExamAnswer } from './ExamReviewQuestion';
import { mathCorrectAnswer } from '../../../server/src/shared/mathCommandAnalytics';
import { QuestionExplanation } from '../features/math-command/QuestionExplanation';

export function InfiniteContentPreview({ content }: { content: PlanContent }) {
  const [sample, setSample] = useState<{ id: string; index: number }>();
  const generator = content.generators?.find(item => item.id === sample?.id);
  let question, error = '';
  try { if (generator && sample) question = generateCatalogQuestion(generator, sample.index, 'teacher-module-preview', 2); }
  catch { error = 'This sample could not be generated. Review this family in Practice studio before assigning.'; }
  return <div className="lp-infinite-preview">
    <p>{content.description}</p>
    <small>{content.moduleKind === 'focused' ? 'Focused module' : 'Practice group'} · Unlimited variants · {content.generators?.length ?? 0} generator{content.generators?.length === 1 ? '' : 's'}</small>
    <p>Students receive the families below. Review the samples for the specific reasoning and answer format you want to target.</p>
    <ul>{content.generators?.map(item => <li key={item.id}><div><strong>{item.title}</strong><p>{item.description}</p><small>{!item.difficulty || item.difficulty === 'unassigned' ? 'Difficulty not labeled' : item.difficulty} · {item.reviewStatus || 'Unreviewed'}</small></div><button type="button" onClick={() => setSample({ id: item.id, index: item.id === sample?.id ? sample.index + 1 : 0 })}>{item.id === sample?.id ? 'Another sample' : 'Preview question'}</button></li>)}</ul>
    {error && <p role="alert">{error}</p>}
    {question && <div className="lp-infinite-sample"><h4>{generator?.title} · Sample</h4><ExamMathQuestion question={question} answer={undefined} onChange={() => undefined}/><p>Correct answer:</p><ExamAnswer question={question} answer={mathCorrectAnswer(question) ?? undefined}/><QuestionExplanation question={question}/></div>}
    {!content.generators?.length && <p>Generator details are unavailable. Reload the content list before choosing this module.</p>}
  </div>;
}
