import type {User} from '@supabase/supabase-js';
import {supabase} from './supabase';
import {getActivityRelease} from './examContent';
import {normalizeExamNavigation} from '../shared/examNavigation';

/** Reuse the session's existing JSON bookmark; no new database column is required. */
export async function activitySessionRelease(user:User,assessmentId:string){
  const [dedicated,fallback]=await Promise.all([
    supabase.from('student_exam_sessions').select('navigation,status,updated_at').eq('user_id',user.id).eq('assessment_id',assessmentId).maybeSingle(),
    supabase.from('student_exam_results').select('result').eq('user_id',user.id).eq('assessment_id','__exam_session__:'+assessmentId).maybeSingle(),
  ]);
  if(dedicated.error&&fallback.error)throw Object.assign(new Error('Saved activity version could not be loaded. Please retry.'),{status:503});
  const candidates=[dedicated.data?{navigation:dedicated.data.navigation,status:dedicated.data.status,updatedAt:dedicated.data.updated_at}:null,
    fallback.data?.result,user.user_metadata?.exam_sessions?.[assessmentId]].filter(Boolean).sort((a,b)=>Date.parse(b.updatedAt||'')-Date.parse(a.updatedAt||''));
  const session=candidates[0];
  if(!session||session.status!=='in_progress')return null;
  const id=normalizeExamNavigation(session.navigation)?.activityReleaseId;
  if(!id)return null;
  const content=getActivityRelease(assessmentId,id);
  if(!content)throw Object.assign(new Error('The saved activity version is unavailable. Ask your teacher to restore it.'),{status:409});
  return content;
}
