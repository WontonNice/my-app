import { useTeacherLabels } from "../client/src/features/math-command/teacherLabelsContext";
import { createRoot, type Root } from 'react-dom/client';
import { useEffect } from 'react';
import { TeacherLabelsProvider, TeacherTags } from '../client/src/features/math-command/TeacherLabels';
import type { MathCommandRequest } from '../client/src/features/math-command/client';

const request: MathCommandRequest = async <T,>(suffix: string, options: RequestInit = {}) => {
  const response = await fetch('/api/math-command' + suffix, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } });
  const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Could not save My Tags.'); return data as T;
};
const roots = new Map<HTMLElement, Root>();
function Snapshot() {
  const { data } = useTeacherLabels();
  useEffect(() => { if (data) window.dispatchEvent(new CustomEvent('studio:teacher-labels', { detail: data })); }, [data]);
  return null;
}
Object.assign(window, { mountTeacherTags(container: HTMLElement, ids: string[]) {
  for (const [node, root] of roots) if (!node.isConnected) { root.unmount(); roots.delete(node); }
  let root = roots.get(container); if (!root) { root = createRoot(container); roots.set(container, root); }
  root.render(<TeacherLabelsProvider request={request} onChange={() => window.dispatchEvent(new Event("studio:teacher-labels-changed"))}><Snapshot/><TeacherTags key={ids.join('|')} ids={ids}/></TeacherLabelsProvider>);
} });
window.dispatchEvent(new Event('studio:teacher-labels-ready'));

request('/teacher-labels').then(data => window.dispatchEvent(new CustomEvent('studio:teacher-labels', {detail: data}))).catch(() => {});
