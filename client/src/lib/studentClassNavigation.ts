import { BarChart3, BookOpen, ClipboardList, GraduationCap, Sparkles, Target } from "lucide-react";
import type { DashboardNavItem } from "../components/CorporateDashboardShell";

export function getStudentClassNavigation(previewQuery = ""): DashboardNavItem[] {
  const separator = previewQuery ? "&" : "?";
  return [
    { id: "classes", label: "My classes", href: `/dashboard${previewQuery}`, icon: GraduationCap },
    { id: "class", label: "SHSAT overview", href: `/study-hall/shsat${previewQuery}`, icon: BookOpen },
    { id: "practice", label: "Practice topics", href: `/study-hall${previewQuery}`, icon: Target },
    { id: "results", label: "Test results", href: `/study-hall${previewQuery}${separator}section=results`, icon: BarChart3 },
    { id: "assessments", label: "Assessments", href: `/study-hall${previewQuery}${separator}section=assessments`, icon: ClipboardList },
    { id: "advanced", label: "Advanced practice", href: `/study-hall${previewQuery}${separator}section=advanced`, icon: Sparkles },
  ];
}
