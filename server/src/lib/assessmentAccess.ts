import type { Assessment } from '../config/assessments';
import { supabase } from './supabase';
import type { ErrorRequestHandler } from 'express';

type AccessRow = { assessment_id: string; english_open: boolean | null; math_open: boolean | null; allow_completed_access: boolean | null; corrections_open: boolean | null };
export type AssessmentAccessPatch = Partial<Omit<AccessRow, 'assessment_id'>>;
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
export async function resolveAssessmentAccessList<T extends Pick<Assessment, 'id' | 'status' | 'sectionAccess' | 'allowCompletedAccess'> & { correctionsOpen?: boolean }>(assessments: T[]): Promise<T[]> {
  if (!assessments.length) return assessments;
  const rows: AccessRow[] = [];
  // Bound query size while keeping teacher and student lists consistent.
  for (let offset = 0; offset < assessments.length; offset += 100) {
    const result = await supabase.from('assessment_access').select('assessment_id,english_open,math_open,allow_completed_access,corrections_open').in('assessment_id', assessments.slice(offset, offset + 100).map(item => item.id));
    if (result.error) throw unavailable();
    rows.push(...(result.data ?? []) as AccessRow[]);
  }
  const byId = new Map(rows.map(row => [row.assessment_id, row]));
  return assessments.map(item => overlay(item, byId.get(item.id)));
}
export async function resolveAssessmentAccess<T extends Pick<Assessment, 'id' | 'status' | 'sectionAccess' | 'allowCompletedAccess'> & { correctionsOpen?: boolean }>(assessment: T | undefined): Promise<T | undefined> {
  return assessment ? (await resolveAssessmentAccessList([assessment]))[0] : undefined;
}
export async function setPersistentAssessmentAccess(assessment: Assessment, patch: AssessmentAccessPatch): Promise<Assessment> {
  const result = await supabase.rpc('set_assessment_access', { p_assessment_id: assessment.id, p_patch: patch, p_initial: { english_open: assessment.sectionAccess.english, math_open: assessment.sectionAccess.math, allow_completed_access: assessment.allowCompletedAccess, corrections_open: assessment.correctionsOpen === true } });
  if (result.error || !result.data) throw unavailable();
  return { ...overlay(assessment, result.data as AccessRow), updatedAt: new Date().toISOString() };
}
