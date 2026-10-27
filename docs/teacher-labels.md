# Teacher Labels (My Tags)

My Tags stores personal teaching preferences by question ID, separately from
question wording, keys, grading, standards, and shared classifications.

- Use the bookmark beside a question for a one-click favorite.
- Open My Tags to apply multiple labels, save a private note, or create/manage
  labels. Names and descriptions can be edited; deleting a label removes its
  associations while retaining notes and favorites. There is no preset label list
  or limit on the number of labels. Names allow 120 characters, descriptions 500,
  and notes 3,000.
- In the Math question bank, combine My Tags (all selected labels must match)
  with categories, difficulty, and assignment history. Search includes private
  notes and label names. Sort by favorites or last-tagged time. My Tags in the
  selection bar applies/removes labels on all selected questions.
- Assignment previews and replacement candidates honor these filters. Private
  labels, notes, and selection filters are not copied into student assignments.
- Reading, Part B, and Math editors have the same contextual control. Passage,
  Part B, math navigation, and Exam Builder library searches include label names,
  private notes, and the word “favorite”. The SHSAT Lab bank supports label and
  favorite filters, private-note search, sorting, and bulk labeling; its practice
  builder uses the filtered questions.
- Classification → Create / edit subcategories adds a subcategory, renames one,
  or creates a main category with its first subcategory. Renaming updates existing
  classifications and skill mappings without editing question content.

## Storage and privacy

The authenticated application derives the owner from the verified teacher/admin
session; it never accepts an owner ID in the request. Each owner's labels and
question annotations are stored under `teacherLabels` in the existing management
store. Only that owner's slice is returned. Students cannot access these routes.
Remote production storage uses the existing `math_command_metadata` table and its
service-role-only RLS policy; there is no additional migration or AI integration.
Writes use revision checks and the existing atomic/compare-and-swap mechanism.

Content Studio is the existing single-user, local authoring service. Its profile
is scoped to the operating-system home directory (hashed, never returned to the
browser). A trusted server environment variable `CONTENT_STUDIO_TEACHER_ID` can
bind it to an existing teacher ID when sharing the same management store. Local
file storage and a hosted Supabase store are not automatically synchronized.
Do not expose the local authoring server as a multi-user hosted service.

Keep the private management sidecar out of student content exports and public
assets. My Tags UI is used only in teacher/editor components, not the shared
student question renderer. Source-version tags remain a separate feature.
