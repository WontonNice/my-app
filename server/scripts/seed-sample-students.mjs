import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE;
if (!url || !serviceRole) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE are required.");

const admin = createClient(url, serviceRole, { auth: { autoRefreshToken: false, persistSession: false } });
const samples = [
  {
    email: "erin.choi@student.nathantutors.local",
    fullName: "Erin Choi",
    password: "ErinSHSAT26!",
    exams: [
      { assessmentId: "shsat-diagnostic-1", completedAt: "2026-06-18T19:35:00.000Z", correct: 47, percentage: 78, title: "SHSAT Diagnostic 1", total: 60 },
      { assessmentId: "shsat-practice-2", completedAt: "2026-06-29T18:20:00.000Z", correct: 51, percentage: 85, title: "SHSAT Practice Test 2", total: 60 },
    ],
    practice: {
      "central-idea-theme": { attempts: 4, correct: 31, questionsAnswered: 40, total: 40, updatedAt: "2026-07-02T21:05:00.000Z" },
      inference: { attempts: 3, correct: 25, questionsAnswered: 32, total: 32, updatedAt: "2026-07-03T20:14:00.000Z" },
    },
  },
  {
    email: "david.kim@student.nathantutors.local",
    fullName: "David Kim",
    password: "DavidSHSAT26!",
    exams: [
      { assessmentId: "shsat-diagnostic-1", completedAt: "2026-06-19T20:10:00.000Z", correct: 43, percentage: 72, title: "SHSAT Diagnostic 1", total: 60 },
      { assessmentId: "shsat-practice-2", completedAt: "2026-06-30T17:55:00.000Z", correct: 48, percentage: 80, title: "SHSAT Practice Test 2", total: 60 },
      { assessmentId: "shsat-practice-3", completedAt: "2026-07-04T19:42:00.000Z", correct: 50, percentage: 83, title: "SHSAT Practice Test 3", total: 60 },
    ],
    practice: {
      "evidence-support": { attempts: 5, correct: 36, questionsAnswered: 48, total: 48, updatedAt: "2026-07-03T22:10:00.000Z" },
      "word-phrase-meaning": { attempts: 3, correct: 22, questionsAnswered: 30, total: 30, updatedAt: "2026-07-04T16:30:00.000Z" },
    },
  },
];

const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listed.error) throw listed.error;

for (const sample of samples) {
  const existing = listed.data.users.find((user) => user.email?.toLowerCase() === sample.email);
  const attributes = {
    app_metadata: { ...(existing?.app_metadata ?? {}), class_ids: ["shsat"], role: "student" },
    email: sample.email,
    email_confirm: true,
    password: sample.password,
    user_metadata: {
      ...(existing?.user_metadata ?? {}),
      full_name: sample.fullName,
      learning_progress: { examResults: sample.exams, practice: sample.practice },
      role: "student",
    },
  };
  const saved = existing
    ? await admin.auth.admin.updateUserById(existing.id, attributes)
    : await admin.auth.admin.createUser(attributes);
  if (saved.error || !saved.data.user) throw saved.error ?? new Error(`Could not save ${sample.fullName}.`);
  const userId = saved.data.user.id;

  const exams = sample.exams.map((result) => ({ assessment_id: result.assessmentId, completed_at: result.completedAt, result, updated_at: new Date().toISOString(), user_id: userId }));
  const examWrite = await admin.from("student_exam_results").upsert(exams, { onConflict: "user_id,assessment_id" });
  if (examWrite.error && examWrite.error.code !== "PGRST205") throw examWrite.error;

  const practice = Object.entries(sample.practice).map(([topic, progress]) => ({ progress, topic_slug: topic, updated_at: progress.updatedAt, user_id: userId }));
  const practiceWrite = await admin.from("student_practice_progress").upsert(practice, { onConflict: "user_id,topic_slug" });
  if (practiceWrite.error && practiceWrite.error.code !== "PGRST205") throw practiceWrite.error;

  const loginClient = createClient(url, serviceRole, { auth: { autoRefreshToken: false, persistSession: false } });
  const login = await loginClient.auth.signInWithPassword({ email: sample.email, password: sample.password });
  if (login.error) console.warn(`Created ${sample.fullName}, but could not set a sample last-login time: ${login.error.message}`);
  await loginClient.auth.signOut();
  console.log(`${sample.fullName}: ${sample.email}`);
}
