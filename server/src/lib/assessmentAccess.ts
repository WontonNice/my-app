import { mapConcurrent } from "./mapConcurrent";
import type { Assessment } from '../config/assessments';
import { supabase } from './supabase';
import type { ErrorRequestHandler } from 'express';
import { isStudyHallWorksheet } from '../shared/studyHallWorksheets';

type AccessRow = { assessment_id: string; english_open: boolean | null; math_open: boolean | null; allow_completed_access: boolean | null; corrections_open: boolean | null };
export type AssessmentAccessPatch = Partial<Omit<AccessRow, 'assessment_id'>>;
// Reserved runtime settings row; never part of the authored assessment catalog.
const allExamCorrectionsId = '__all_exams_corrections__';
type AccessAssessment = Pick<Assessment, 'id' | 'status' | 'sectionAccess' | 'allowCompletedAccess' | 'studyHallWorksheet' | 'examLabel' | 'correctionsOpen' | 'correctionsOpenForAllExams'>;
const unavailable = () => Object.assign(new Error('Exam access is temporarily unavailable. Please retry. Your access settings were not changed.'), { status: 503, code: 'ASSESSMENT_ACCESS_UNAVAILABLE' });
export const assessmentAccessErrorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  if (error?.code !== 'ASSESSMENT_ACCESS_UNAVAILABLE') { next(error); return; }
  response.status(503).json({ message: error.message });
};
function overlay<T extends Pick<Assessment, 'id' | 'status' | 'sectionAccess' | 'allowCompletedAccess'> & { correctionsOpen?: boolean }>(assessment: T, row?: AccessRow): T {
  if (!row) return assessment;
  const sectionAccess = { english: row.english_open ?? assessment.sectionAccess.english, math: row.math_open ?? assessment.sectionAccess.math };
  return { ...assessment, sectionAccess, status: sectionAccess.english || sectionAccess.math ? 'open' : 'locked', allowCompletedAccess: row.allow_completed_access ?? assessment.allowCompletedAccess, correctionsOpen: row.corrections_open ?? assessment.correctionsOpen };
}
export async function getAllExamCorrectionsAccess(): Promise<boolean> {
  const result = await supabase.from('assessment_access').select('corrections_open').in('assessment_id', [allExamCorrectionsId]);
  if (result.error) throw unavailable();
  return result.data?.[0]?.corrections_open === true;
}
export async function setAllExamCorrectionsAccess(open: boolean): Promise<boolean> {
  const result = await supabase.rpc('set_assessment_access', { p_assessment_id: allExamCorrectionsId, p_patch: { corrections_open: open }, p_initial: {} });
  if (result.error || !result.data) throw unavailable();
  return result.data.corrections_open === true;
}
export async function resolveAssessmentAccessList<T extends AccessAssessment>(assessments: T[]): Promise<T[]> {
  if (!assessments.length) return assessments;
  const batches = Array.from({ length: Math.ceil(assessments.length / 100) }, (_, i) => assessments.slice(i * 100, i * 100 + 100));
  // Bound query size while keeping teacher and student lists consistent.
  const pages = await mapConcurrent(batches, 4, async batch => {
    const ids = batch.map(item => item.id);
    if (batch === batches[0]) ids.push(allExamCorrectionsId);
    const result = await supabase.from('assessment_access').select('assessment_id,english_open,math_open,allow_completed_access,corrections_open').in('assessment_id', ids);
    if (result.error) throw unavailable();
    return (result.data ?? []) as AccessRow[];
  });
  const byId = new Map(pages.flat().map(row => [row.assessment_id, row]));
  const allOpen = byId.get(allExamCorrectionsId)?.corrections_open === true;
  return assessments.map(item => ({ ...overlay(item, byId.get(item.id)), correctionsOpenForAllExams: allOpen && !isStudyHallWorksheet(item) }));
}
export async function resolveAssessmentAccess<T extends AccessAssessment>(assessment: T | undefined): Promise<T | undefined> {
  return assessment ? (await resolveAssessmentAccessList([assessment]))[0] : undefined;
}
export async function setPersistentAssessmentAccess(assessment: Assessment, patch: AssessmentAccessPatch): Promise<Assessment> {
  const allOpen = !isStudyHallWorksheet(assessment) && await getAllExamCorrectionsAccess();
  const result = await supabase.rpc('set_assessment_access', { p_assessment_id: assessment.id, p_patch: patch, p_initial: { english_open: assessment.sectionAccess.english, math_open: assessment.sectionAccess.math, allow_completed_access: assessment.allowCompletedAccess, corrections_open: assessment.correctionsOpen === true } });
  if (result.error || !result.data) throw unavailable();
  return { ...overlay(assessment, result.data as AccessRow), correctionsOpenForAllExams: allOpen, updatedAt: new Date().toISOString() };
}
