export type AdvancedPassageGenre = "Fiction" | "History" | "Science" | "Social Science";

export type AdvancedPracticePassage = {
  author: string;
  difficulty: "Medium" | "Hard" | "Challenge";
  excerpt: string;
  genre: AdvancedPassageGenre;
  id: string;
  paragraphs: string[];
  practiceSlug: string;
  questionCount: number;
  readingMinutes: number;
  skills: string[];
  thumbnail?: string;
  thumbnailAlt: string;
  tone: "blue" | "coral" | "emerald" | "gold";
  title: string;
};

export const advancedPracticePassages: AdvancedPracticePassage[] = [
  {
    id: "signals-in-the-fog",
    title: "Signals in the Fog",
    author: "Nathan Tutors Editorial",
    genre: "Science",
    difficulty: "Medium",
    readingMinutes: 7,
    questionCount: 6,
    skills: ["Central Idea", "Evidence", "Text Structure"],
    excerpt:
      "Along crowded coastlines, a new generation of sensors is helping ships read weather that human eyes cannot yet see.",
    paragraphs: [
      "At the entrance to one of the world's busiest harbors, a narrow tower flashes a white light into the fog. The light is useful, but it is no longer the harbor's only warning system. Small weather stations now measure wind, moisture, and temperature every few seconds, sending their readings to ships before the shoreline becomes visible.",
      "Fog forms when water vapor cools into tiny droplets suspended near the ground. Because the change can happen quickly, a clear channel may become difficult to navigate within minutes. Older forecasts described conditions across an entire region. The newer sensors collect information from precise locations, allowing crews to compare the air near open water with the air beside cliffs and docks.",
      "The sensors do not steer ships or replace experienced pilots. Instead, they reveal patterns that would otherwise remain hidden. A sudden temperature drop at one station, for example, can warn pilots that dense fog may soon move across the channel. That extra time gives a crew a chance to reduce speed and prepare its instruments.",
      "Researchers are now testing whether the same network can predict other hazards, including strong crosswinds. Their goal is not to make the harbor effortless to navigate. It is to give skilled people better evidence at the moment when good judgment matters most.",
    ],
    practiceSlug: "central-idea-theme",
    thumbnailAlt: "A harbor signal light standing above a foggy coastline",
    tone: "blue",
  },
  {
    id: "the-clockmakers-window",
    title: "The Clockmaker's Window",
    author: "Mara Ellison",
    genre: "Fiction",
    difficulty: "Hard",
    readingMinutes: 9,
    questionCount: 7,
    skills: ["Inference", "Character", "Tone & Mood"],
    excerpt:
      "Every afternoon, Lena stopped beneath the clockmaker's window, though the clocks inside never agreed on the hour.",
    paragraphs: [
      "Every afternoon, Lena stopped beneath the clockmaker's window, though the clocks inside never agreed on the hour. One hurried ahead; another lingered behind. A brass watch no larger than a coin rested in the center, its hands perfectly still.",
      "The shop had been closed since Mr. Vale left town in early spring. Dust gathered around the doorframe, yet the display changed from week to week. A silver alarm clock appeared beside the brass watch. Then a wooden metronome arrived, angled toward the street as though listening for footsteps.",
      "Lena told herself that a relative must be tending the shop. Still, she began arriving earlier, hoping to catch the person at work. On the fourth day, she noticed a folded card beneath the motionless watch. Her name was written across it in the narrow handwriting her grandfather had taught her to recognize.",
      "She did not enter. Instead, Lena stood on the sidewalk until the town clock struck four. At the final chime, the little brass watch shivered and began to tick. The sound was too faint to hear through the glass, but she saw the second hand move and understood that the invitation would wait until she was ready.",
    ],
    practiceSlug: "inference",
    thumbnailAlt: "An old clockmaker shop window filled with antique clocks",
    tone: "coral",
  },
  {
    id: "maps-beneath-the-city",
    title: "Maps Beneath the City",
    author: "Nathan Tutors Editorial",
    genre: "History",
    difficulty: "Hard",
    readingMinutes: 8,
    questionCount: 6,
    skills: ["Author's Purpose", "Evidence", "Word Meaning"],
    excerpt:
      "Before subway maps became familiar, engineers had to chart a second city beneath the streets people already knew.",
    paragraphs: [
      "When construction crews began digging New York's early subway tunnels, they encountered a crowded underground landscape. Water pipes, gas lines, building foundations, and old streams occupied the space below the pavement. Engineers could not simply draw a straight route from one station to the next.",
      "Surveyors created detailed maps showing both the planned tunnels and the obstacles around them. Some records were remarkably precise, while others relied on notes made decades earlier. When a map proved incomplete, crews dug narrow test shafts to learn what lay below before opening a larger section of street.",
      "These maps were working documents rather than finished works of art. Engineers crossed out routes, added measurements, and attached sheets of tracing paper as plans changed. The marks reveal how often construction depended on revision. A tunnel's final path was not always the first path imagined by its designers.",
      "Today, historians study the maps for a different reason. Beyond explaining where tunnels were built, the documents preserve evidence of neighborhoods transformed by construction. They show vanished buildings, redirected waterways, and street names that no longer appear above ground.",
    ],
    practiceSlug: "evidence-support",
    thumbnailAlt: "Historic engineering maps spread across a drafting table",
    tone: "gold",
  },
  {
    id: "why-groups-change-their-minds",
    title: "Why Groups Change Their Minds",
    author: "Nathan Tutors Editorial",
    genre: "Social Science",
    difficulty: "Challenge",
    readingMinutes: 10,
    questionCount: 8,
    skills: ["Point of View", "Text Structure", "Inference"],
    excerpt:
      "A group can collect more information than one person, but more information does not automatically produce a better decision.",
    paragraphs: [
      "Groups are often formed because no single person has all the knowledge needed to solve a problem. A committee may include people with different experiences, technical skills, and priorities. In theory, combining those perspectives should improve the final decision.",
      "In practice, group members do not always share what they know. People tend to repeat facts that everyone already accepts because agreement feels productive. Unfamiliar evidence may receive less attention, especially when presenting it could slow the discussion or challenge a popular proposal.",
      "Researchers have found that a simple procedural change can help. Before discussion begins, each member writes down the most important information they possess. The group then reviews those notes one at a time. This method does not guarantee agreement, but it makes unique evidence harder to ignore.",
      "The value of the procedure lies in its sequence. Members record their ideas before hearing the group's dominant opinion, so their first judgments are less likely to be shaped by social pressure. The group may still choose the original proposal, but it does so after examining a wider range of evidence.",
      "Good group decisions, then, depend on more than gathering capable people in one room. They depend on creating conditions in which disagreement can contribute information rather than merely create friction.",
    ],
    practiceSlug: "text-structure",
    thumbnailAlt: "Students comparing notes during a focused group discussion",
    tone: "emerald",
  },
];

export function getAdvancedPracticePassage(passageId: string) {
  return advancedPracticePassages.find((passage) => passage.id === passageId);
}
