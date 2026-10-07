# Historical preimplementation audit

This records the earlier audit and browser failures. It is superseded by [the implementation and rollout report](collaborative-boards.md): the feature is now implemented and the in-app browser reference walkthrough succeeded. Supabase migration and real-account acceptance remain pending.

# Collaborative student boards: audit and implementation gates

Audit date: October 6, 2026. Status: repository/reference-document research completed; Chrome visual walkthrough is blocked by browser-tool initialization. **The board feature is not implemented.** No dependencies, authentication changes, database migrations, or student-data writes have been performed for this request.

## Existing systems to extend

| Area | Existing implementation | Board integration |
| --- | --- | --- |
| Frontend | React 19, TypeScript, Vite; `client/src/App.tsx` | Lazy-loaded board route inside the existing app; retain navigation and session gates. |
| Navigation | `client/src/lib/navigation.ts`, `AppLink`, `StudentPortalShell` | Student Boards entry and full-workspace canvas; preserve preview/return context without treating it as authorization. |
| Student Insights | `StudentDetail` in `TeacherDashboardPage.tsx`; student record workspace tabs | Add Boards within the selected student's context, with a compact library and return link. |
| Authentication | Supabase sessions; `sessionCache.ts`, `useStudentPortalAccess.ts`, server `getAuthenticatedUser` | Reuse verified identities and session refresh; no second login or client-supplied actor identity. |
| Student records | Supabase `auth.users`, enrolled class IDs, archived-account checks | Board foreign keys must use these existing student IDs, not a duplicate roster. |
| Backend | Express; `server/src/app.ts`, `server.ts`; existing authenticated API patterns | New board endpoints and authenticated realtime attachment to the same HTTP server. |
| Database | Supabase Postgres; learning-plan/assignment migrations use server-only access | Private boards, membership, durable collaborative updates, and revisions in the existing project. |
| Educational content | Passage library, shared exam models, `server/data/question-bank.json`, learning catalog and assignments | Store stable content references; resolve content through authorized APIs rather than copying databases into boards. |
| Math | KaTeX, MathLive; `ExamText`/`MathEntryResponse`, shared math-answer conversion | Reuse the existing renderer and notation; no new math engine. |
| Rich text | Content Studio uses contenteditable, sanitization and rich passage formatting | Reuse compatible rendering/sanitization. No reusable collaborative React editor is currently installed. |
| Autosave | Exam-session autosave and cached progress | Reuse save-status conventions, not the single-user last-write-wins storage format for collaborative text. |
| Assets | Content Studio writes `/exam-images/` into `client/public` | These are public educational assets, unsuitable for private student uploads. Use a private Supabase Storage bucket with membership-checked access; persist asset references only. |
| Realtime | No application WebSocket, CRDT, editor-collaboration provider, or Supabase channel implementation found | A genuine collaboration layer must be added, not refresh-based synchronization. |
| State/design | React hooks, existing styles/tokens, compact dashboard controls | Extend established styling; isolate canvas selection/viewport/presence from persisted document state. |

## Security findings and constraints

- The current server role helper falls back from `app_metadata.role` to `user_metadata.role`. Public registration currently sets the student role in user metadata. Privileged board access must not trust editable profile metadata. Verify trusted role provisioning before enabling teacher ownership/sharing; do not automatically promote accounts from user-provided role claims. [Supabase authorization guidance](https://supabase.com/docs/guides/database/postgres/row-level-security#authjwt).
- Existing teacher APIs permit teacher/admin access to the active SHSAT roster; an assigned-teacher relationship was not found. Roster access is not blanket access to private boards. Board membership must be explicit. Teacher creation can add that teacher and the selected student; student-created boards must not silently invite every teacher.
- Check membership for reads, uploads, realtime joins, edits, history, restore, duplication and participant management. Derive identity and role on the server. Revalidate expiration/revocation and archived-student access on active connections.
- Enforce viewer and node-lock rules on the server, including malformed collaborative updates and indirect movement of locked nodes through groups. Client-side disabled controls are insufficient.
- Never place teacher-only answer keys or restricted assignment/exam data in a shared document and merely hide them in the student UI. Resolve linked content with the existing access rules.
- Private images/files must not be placed in the public exam folder or embedded as large data URLs. Reject unsafe URLs/content types, limit uploads, and authorize signed asset access by board membership.
- Offline data must be scoped to the authenticated user and board generation. A revoked participant or old pre-restore document must not replay updates into a restored board. Preserve rejected work as an explicit recovery path rather than silently dropping it.

## Official reference research

Sources inspected through web tools:

- [Obsidian Canvas](https://obsidian.md/canvas)
- [Official Canvas help](https://obsidian.md/help/plugins/canvas)

Observable interaction checklist to verify in Chrome and compare repeatedly against the implementation:

- Infinite coordinates; compact floating creation/selection/navigation controls.
- Wheel/trackpad panning, Shift horizontal pan, Space/middle-button drag; modifier-wheel zoom; fit, selection fit, reset.
- Double-click background creation, toolbar/context creation, toolbar drag placement, text/URL/image paste.
- Double-click card editing, click-away/Escape exit; editable Markdown-style notes with existing math rendering.
- Drag and resize cards; selected-card emphasis; shift selection, marquee, select-all, axis-constrained movement.
- Edge handles, attached directional connections, editable labels/colors, reconnect/disconnect, connect-and-create.
- Labeled spatial groups, nested membership, group movement/resize, grouping and ungrouping without constraining the canvas.
- Multi-item copy/paste/duplicate/delete/color/group; compact context menus and layer controls.
- Undo/redo that targets local meaningful operations without undoing another user's independent work.
- Source locks, viewer navigation, find/search, focus mode, optional unobtrusive minimap.

**Chrome gate is not passed:** initial attempts failed before browser initialization with `failed to write kernel assets: The system cannot find the path specified (os error 3)`. After the user resumed and the computer-use package updated to `26.930.41038`, the runtime initialized, but both new-page and existing-tab requests failed with `Unable to load browser request-header policy`. A clean runtime reset and final retry produced the same failure. No Chrome reference page was successfully inspected. Integration discovery previously found no connected replacement appropriate for the requested local Chrome workflow. Do not bypass the unavailable browser safety policy or substitute a claim of hands-on comparison for document research.

## Provisional architecture (confirm after visual walkthrough)

- Evaluate React Flow for infinite viewport, selection, resize and connector geometry, with custom notebook cards/groups rather than a flowchart product. Memoize node components and keep pointer/viewport updates out of unrelated React trees. [Official performance guidance](https://reactflow.dev/learn/advanced-use/performance).
- Evaluate Yjs shared maps for structural fields and collaborative text types with a proven editor binding for same-note editing. Use local-origin-scoped undo. Do not synchronize whole note strings using last-write-wins. [Shared types](https://docs.yjs.dev/getting-started/working-with-shared-types), [UndoManager](https://docs.yjs.dev/api/undo-manager).
- Use authenticated realtime rooms on the existing server, durable database persistence, and per-user offline recovery. Tokens should not appear in board URLs. A deployment with multiple server instances needs an explicit shared-room/pubsub strategy; do not assume process-local rooms synchronize across instances.
- Keep cursors, live selections and drag previews ephemeral. Batch durable operations and checkpoints; do not write a full board snapshot for every pointer movement.
- Store title/membership/archive state separately from untrusted collaborative payloads. Version restore needs an explicit generation barrier and a pre-restore recovery snapshot.
- Add a private Storage bucket in the same Supabase project, with asset records tied to boards and membership-based retrieval. [Storage access control](https://supabase.com/docs/guides/storage/security/access-control).

## Required completion gates

1. Restore Chrome automation; inspect official page/tip demonstrations and continue the reference/implementation comparison loop.
2. Finish trusted-role provisioning and private asset/board membership design before exposing real student content.
3. Implement core canvas, structure, editing, durable persistence, then realtime and student integration; add linked educational content only after core stability.
4. Exercise at least 50 notes, 10 image/link nodes, groups and many connectors across the full requested interaction checklist; profile 100 and 500 nodes.
5. Test separate verified teacher and student sessions on the same board: creation, concurrent same/different-note editing, movement, connections, image upload, grouping, locks, disconnect/reconnect and reload convergence. Isolated fixtures do not prove the actual deployed student workflow.
6. Test Andrew's Student Insights → Boards → shared board and the student's portal workflow. Do not claim this gate without verified sessions and permitted test data.
7. Verify authorization bypass attempts, viewer mutations, locked-group movement, stale restore generations, participant revocation and private asset access.
8. Run existing auth, student records, analytics, assignments, content editor, bank, passage, question rendering, type checks, lint and build regressions.

Next action: recover the supplied Chrome/browser tools, or obtain an explicit user adjustment allowing document-based implementation while Chrome comparisons and interactive acceptance tests remain pending. Existing application code and user changes remain untouched.
