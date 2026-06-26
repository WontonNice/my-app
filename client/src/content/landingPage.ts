export const featuredSlides = [
  {
    accent: "emerald",
    category: "Assignments",
    description: "A command center for homework, due dates, and what each student should attack next.",
    eyebrow: "Hot",
    href: "/study-hall",
    label: "Practice",
    metric: "3 tasks",
    title: "Mission Board",
  },
  {
    accent: "blue",
    category: "Classes",
    description: "Adaptive practice, diagnostics, topic targets, and a sharper plan for SHSAT prep.",
    eyebrow: "Open",
    href: "/study-hall",
    label: "Class",
    metric: "SHSAT",
    title: "Study Hall",
  },
  {
    accent: "violet",
    category: "Rewards",
    description: "XP, streaks, levels, and badges that make steady practice feel like progress.",
    eyebrow: "Level up",
    href: "/study-hall",
    label: "Rewards",
    metric: "Lv. 8",
    title: "XP Ladder",
  },
  {
    accent: "orange",
    category: "Progress",
    description: "A clean snapshot of wins, weak spots, and the next step in the learning path.",
    eyebrow: "Focus",
    href: "/study-hall",
    label: "Stats",
    metric: "14 day",
    title: "Growth Tracker",
  },
] as const;

export const navItems = [
  { href: "/dashboard", label: "Classes" },
  { href: "/study-hall", label: "Study Hall" },
  { href: "/study-hall", label: "Practice" },
  { href: "/study-hall", label: "Progress" },
] as const;
