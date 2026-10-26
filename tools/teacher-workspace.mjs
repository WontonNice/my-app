import { spawn } from 'node:child_process';
import { readFile, mkdir, open } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let starting;
export function teacherDestination(origin, query = '') {
  const base = new URL(origin);
  if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password) throw new Error('Teacher app URL must be an http(s) address without credentials.');
  const destination = new URL('/teacher/math-command', base);
  destination.search = query;
  return destination.href;
}
async function configuredOrigin() {
  if (process.env.CONTENT_STUDIO_TEACHER_URL) return process.env.CONTENT_STUDIO_TEACHER_URL;
  for (const file of ['.env', 'server/.env']) {
    try { const contents = await readFile(join(root, file), 'utf8'); const match = contents.match(/^CONTENT_STUDIO_TEACHER_URL\s*=\s*["']?([^\r\n"']+)/m); if (match) return match[1].trim(); } catch { /* Optional local setting. */ }
  }
  return null;
}
async function findLocalApp() {
  const origins = Array.from({ length: 11 }, (_, i) => `http://localhost:${5173 + i}`);
  const matches = await Promise.all(origins.map(async origin => {
    try {
      const response = await fetch(origin + '/@vite/client', { signal: AbortSignal.timeout(600), redirect: 'error' });
      if (!response.ok || !(await response.text()).includes('vite')) return null;
      // Avoid sending the teacher to an unrelated Vite project on the first port.
      const entry = await fetch(origin + '/src/features/math-command/MathCommandPage.tsx', { signal: AbortSignal.timeout(1500), redirect: 'error' });
      if (entry.ok && (await entry.text()).includes('MathCommandWorkspace')) return origin;
    } catch { /* A stopped server is expected. */ }
    return null;
  }));
  return matches.find(Boolean);
}
async function startLocalApp() {
  const existing = await findLocalApp();
  if (existing) return existing;
  await mkdir(join(root, 'tools/.content-drafts'), { recursive: true });
  const log = await open(join(root, 'tools/.content-drafts/teacher-workspace.log'), 'a');
  const child = process.platform === 'win32'
    ? spawn(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'npm run dev'], { cwd: root, windowsHide: true, detached: true, stdio: ['ignore', log.fd, log.fd] })
    : spawn('npm', ['run', 'dev'], { cwd: root, detached: true, stdio: ['ignore', log.fd, log.fd] });
  let failure;
  child.on('error', error => { failure = error; });
  child.unref();
  await log.close();
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (failure) throw failure;
    await delay(800);
    const origin = await findLocalApp();
    if (origin) return origin;
  }
  throw new Error('The teacher app could not start. Run npm run dev in the project folder, then retry. Startup details: tools/.content-drafts/teacher-workspace.log.');
}
export async function openTeacherWorkspace(query = '') {
  const configured = await configuredOrigin();
  if (configured) return { url: teacherDestination(configured, query) };
  starting ||= startLocalApp().finally(() => { starting = undefined; });
  return { url: teacherDestination(await starting, query) };
}
