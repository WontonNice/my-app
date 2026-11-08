import { useEffect, useState } from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import { getActiveSession } from '../lib/sessionCache';
import { getStudentAssessments, type StudentAssessment } from '../lib/api';
import { worksheetPlacement, worksheetLibraryHref } from '../lib/examLibrary';
import { appendStudentPreview, type StudentPreviewContext } from '../lib/studentPreview';
import { AppLink } from './AppLink';
import { worksheetArea, worksheetMatchesTopic } from '../lib/studyHallNavigation';
import { worksheetCategoryMatches, worksheetTopicMatches, worksheetScope } from '../../../server/src/shared/studyHallWorksheets';

export function StudyHallWorksheetLinks({ subject, category, topic, area, scope, topicAliases, query = '', previewContext }: { subject: 'math' | 'english'; category?: string; topic?: string; area?: 'reading' | 'editing' | 'standalone' | 'advanced'; scope?: 'focused'|'mixed'; topicAliases?: string[]; query?: string; previewContext: StudentPreviewContext }) {
  const [items, setItems] = useState<StudentAssessment[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    getActiveSession().then(session => session ? getStudentAssessments(session.access_token) : Promise.reject(new Error('Sign in to view worksheets')))
      .then(data => { if (active) setItems(data); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [revision]);
  const groups = new Map<string, { title: string; category: string; count: number }>();
  for (const item of items) {
    const placement = worksheetPlacement(item);
    if (!placement || placement.subject !== subject || !worksheetCategoryMatches(placement,category) || !worksheetTopicMatches(placement,topic)) continue;
    if(scope && worksheetScope(placement)!==scope)continue;
    if (area && worksheetArea(placement) !== area || topicAliases && !worksheetMatchesTopic(placement, topicAliases)) continue;
    const title = placement.collection || placement.topic || (worksheetScope(placement)==='mixed'?'General / Mixed Review':placement.category);
    if (!`${title} ${item.title} ${placement.category}`.toLowerCase().includes(query.toLowerCase())) continue;
    const link = new URL(worksheetLibraryHref(placement),window.location.origin);
    if(!placement.collection){
      if(area)link.searchParams.set('area',area);
      link.searchParams.set('scope',worksheetScope(placement));
    }
    const href=link.pathname+link.search;
    const group = groups.get(href) || { title, category: placement.category, count: placement.collection ? items.filter(candidate => {const other=worksheetPlacement(candidate);return other?.subject===subject && other.collection===placement.collection;}).length : 0 };
    if(!placement.collection)group.count++;
    groups.set(href, group);
  }
  if (loading) return <p role="status">Loading worksheets…</p>;
  if (error) return <p role="alert">Worksheets could not be loaded. <button type="button" onClick={() => { setLoading(true); setError(false); setRevision(value => value + 1); }}>Try again</button></p>;
  return <div className="math-study-topic-list">{[...groups].map(([href, group]) => <AppLink className="math-study-topic" key={href} href={appendStudentPreview(href, previewContext)}><FileText size={22} aria-hidden="true" /><strong>{group.title}</strong><span>{!category && `${group.category} · `}{group.count} {group.count === 1 ? 'worksheet' : 'worksheets'}</span><ArrowRight size={18} aria-hidden="true" /></AppLink>)}{!groups.size && <p>No worksheets {query ? 'match your search' : 'in this category yet'}.</p>}</div>;
}
