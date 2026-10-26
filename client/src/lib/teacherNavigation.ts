import { Activity, BarChart3, BookOpen, ClipboardList, Gamepad2, GraduationCap, LayoutDashboard, Trophy, UserRoundCheck, UserRoundPlus } from 'lucide-react';
import type { DashboardNavItem } from '../components/CorporateDashboardShell';

export const teacherNavItems: DashboardNavItem[] = [
  { id: 'overview', label: 'Overview', href: '/teacher', icon: LayoutDashboard },
  { id: 'students', label: 'Student progress', href: '/teacher/students', icon: Activity },
  { id: 'study-hall', label: 'Study Hall', href: '/teacher/study-hall', icon: GraduationCap },
  { id: 'math', label: 'Math Command Center', href: '/teacher/math-command', icon: BarChart3 },
  { id: 'boards', label: 'Boards', href: '/teacher/boards', icon: LayoutDashboard },
  { id: 'enrollment', label: 'Class requests', href: '/teacher/enrollment', icon: UserRoundCheck },
  { id: 'accounts', label: 'Student accounts', href: '/teacher/accounts', icon: UserRoundPlus },
  { id: 'library', label: 'English library', href: '/teacher/library', icon: BookOpen },
  { id: 'assessments', label: 'Assessments & insights', href: '/teacher/assessments', icon: ClipboardList },
  { id: 'games', label: 'Game rooms', href: '/teacher/games', icon: Gamepad2 },
  { id: 'achievements', label: 'Achievements', href: '/teacher/achievements', icon: Trophy },
];

export function teacherStudyPreview(path: string): string {
  return `${path}${path.includes('?') ? '&' : '?'}preview=teacher&teacherTools=1&returnTo=%2Fteacher%2Fstudy-hall`;
}
