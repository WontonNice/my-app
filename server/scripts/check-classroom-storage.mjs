import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)), quiet: true });

const url = process.env.SUPABASE_URL?.trim() || process.env.VITE_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !key) {
  console.error('Set the server Supabase URL and service-role key before checking storage.');
  process.exit(1);
}

const migrations = 'supabase/migrations/';
const checks = [
  ['student_exam_results', 'assessment_id,result', '202607050001_student_progress.sql'],
  ['student_exam_sessions', 'assessment_id,answers,completed_sections,status,updated_at,submitted_at,navigation', '202607230001_exam_answer_records.sql, then 202610280004_exam_navigation.sql'],
  ['assessment_access', 'assessment_id,english_open,math_open,allow_completed_access,corrections_open', '202610280003_persistent_exam_access.sql'],
  ['classroom_meal_sessions', 'id,title,menu,open,revision,created_at,class_id', '202610280002_classroom_meals.sql'],
  ['classroom_meal_orders', 'session_id,student_id,data,status,revision,updated_at', '202610280002_classroom_meals.sql'],
  ['classroom_meal_order_history', 'session_id,student_id,revision,data,updated_at', '202610280005_repeat_meal_requests.sql'],
];
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
let failures = 0;
for (const [table, columns, migration] of checks) {
  // Use GET, not HEAD: missing relations can otherwise appear as successful 204s.
  // A zero row limit verifies the API schema without retrieving student records.
  try {
    const { error } = await client.from(table).select(columns).limit(0).abortSignal(AbortSignal.timeout(10_000));
    if (error) {
      failures++;
      console.error(`FAIL ${table} (${error.code || 'connection error'}). Check the connection and apply ${path.posix.join(migrations, migration)}.`);
    } else {
      console.log(`OK ${table}`);
    }
  } catch {
    failures++;
    console.error(`FAIL ${table}: database request failed or timed out.`);
  }
}
console.log(`${checks.length - failures}/${checks.length} exam and meal storage checks passed. No records were read or changed.`);
process.exitCode = failures ? 1 : 0;
