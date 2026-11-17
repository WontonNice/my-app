import { ArrowRight } from 'lucide-react';
import { AppLink } from '../../components/AppLink';
import { appendStudentPreview, type StudentPreviewContext } from '../../lib/studentPreview';
import './adaptive-math.css';

export const adaptiveExamHref = '/study-hall/shsat/assessments/adaptive-math';

/** Entry point shown at the top of the student's Assessments page. */
export function AdaptiveExamCard({ previewContext }: { previewContext: StudentPreviewContext }) {
  return <section className="am-card" aria-labelledby="am-card-title">
    <div>
      <p>Math · Always available</p>
      <h2 id="am-card-title">Adaptive Math Exam</h2>
      <span>SHSAT-style math that adapts to you. It moves past topics you know and keeps working on the ones you miss. Turn on practice mode to check each answer as you go.</span>
    </div>
    <AppLink href={appendStudentPreview(adaptiveExamHref, previewContext)} aria-label="Open the Adaptive Math Exam">Open<ArrowRight size={15} aria-hidden="true" /></AppLink>
  </section>;
}
