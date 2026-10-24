# Live game rooms

Teachers open **Game rooms** from the teacher dashboard. Students open **Game rooms** in the SHSAT portal and enter the six-character code. Teachers create and start both modes. Rooms, rosters, questions, scores, shared selections, timers and boosters persist in the database; browser refreshes and server restarts do not reset a game.

## Installation

Apply `supabase/migrations/202610240001_live_game_rooms.sql` before using this feature. It adds `live_game_rooms`, protected by RLS with no browser/anonymous table access. The existing service-role server connection handles authenticated API requests. No additional environment variables or third-party game service are needed. This migration was applied to the configured Nathan Tutors Supabase project on October 24, 2026; new environments still need it.

The server mounts `/api/game-rooms`. The client uses `GameRooms` for the teacher workspace and `StudentGameRoomsPage` at `/study-hall/shsat/games`.

## Solo teacher playtests

Choose either game, configure it normally, and select **Playtest solo** instead of **Create class lobby**. Survival starts with four simulated players; team races create two players per team and balance them automatically. Press **Start game** and answer as **You · Pilot**. No second account or student device is needed.

The **Play as** selector switches between the teacher view and any simulated player, including teammates and audience members. Opposing players move approximately every 12 seconds while the room is open. Toggle **Automatic opponents** off to control the pace, or press **Other players answer** for one simulation step. Bots leave your selected team under your control.

**Try a scenario** can submit a correct/wrong checkpoint, show a teammate's shared selection, or expire the timer. During an exam, open **Game controls & standings** to switch simulated players and use the **Booster test bench**. Party mode can be toggled on during a private playtest, even if it was off when created. **Give me Blackout** adds inventory to the controlled team; **Test Blackout on me** applies the real 10-second effect to that team. The normal inventory lets you choose an opposing team and use the booster. **Restart playtest** clears scores, drafts, inventory and effects, then returns a fresh balanced roster to the lobby.

Both games render the existing `ExamSessionPage`, including its passage layout, navigation, math entry, highlights, pencil, notepad and review controls. The compact game bar opens standings and game controls. Math locks and scores on each question's **Next**. English retains answers across the complete passage and posts points only after its passage-completion screen. Teammates see draft changes within the passage. Blackout disables the whole exam surface, and server checks prevent answering or using boosters during the effect.

Only the original teacher host can access a playtest. Class students cannot join by code or access its test controls. Simulated players are excluded from student room membership, exams, analytics, and achievement progress. Answers and sabotage use the same server grading and transitions as class games; test controls cannot be enabled in an ordinary room. No additional migration is required.

## Last one standing

- The server takes a shuffled snapshot of published SHSAT Lab questions. At least three published questions are needed. Choose 3–50 questions; a smaller bank uses its available questions without repeats. Default round time is 90 seconds, adjustable from 15 to 600.
- At least two students join before the teacher starts. A round is one math/standalone question or a complete English passage. Passages stay together when sampled, so a requested question count can be exceeded to include a whole passage. Passage time is the configured seconds per question multiplied by its question count. A round reveals after everyone submits the checkpoint or its server deadline passes. Any missing or incorrect answer eliminates the player from the standing group; correct answers still earn individual points at reveal.
- Eliminated players remain in the audience, answer every subsequent question, and continue earning points. There is no knockout screen that stops their participation.
- The teacher advances after each reveal. When zero or one players remain standing, the next question is the final. If multiple players survive the entire question selection, its last question is still the final.
- In the final, correct standing players have priority. The highest-scoring correct finalist wins. If every standing finalist misses (or no one remains standing), the highest-scoring correct audience player steals the win. Ties share victory. If everyone misses, there is no champion.
- The teacher may end a room early; an interrupted survival game declares no champion.

The game uses an original classroom survival presentation. It includes no Jackbox artwork, sounds, scripts, or proprietary content.

## Team test race

- The teacher assigns an existing assessment, chooses 2–10 teams, and sets a 1–240 minute time limit (180 by default). All automatically graded question types are supported, including passages, multiple selection, numeric responses, matching, graphs and dropdowns. Tests containing essays are excluded with an explanation.
- After students join, assign individuals to teams or use **Balance teams**. Every student must have a team and at least two teams must be populated before starting. Empty teams are removed when the game starts.
- Teammates share their question position and answer selection. Selections autosave after a short typing pause. Any teammate can lock the agreed answer, advancing the entire team. A locked answer cannot be changed. If two teammates submit at once, only the first accepted submission counts.
- Each correct question earns one point, regardless of question weight. Math points post per question; English passage points and streaks commit together when the complete passage is submitted. An incomplete or stale checkpoint cannot partially change scores. Teams can proceed at different speeds; the live standings show score and the current checkpoint's first question. Students see their team's previous correctness and streak; opponents' draft choices remain private during play.
- The highest score wins when all teams finish, the time expires, or the teacher ends the race. Unanswered questions earn no points. Ties share victory; speed does not break a tie.
- Optional **Party mode** awards one sabotage booster for every three consecutive correct answers. An incorrect answer resets the streak. Teams can bank up to three boosters. A booster freezes a chosen opposing active team for 10 seconds. Already frozen teams cannot be targeted again, and completed teams cannot attack or be attacked.
- The blackout is visual and also enforced by the server: frozen teams cannot save selections, submit answers, or use boosters, including after a refresh. The countdown and unlock time use persisted server timestamps.

Games do not submit ordinary assessment results, change exam access, or award test achievements. Their scores represent the separate multiplayer activity.

## Adding boosters and ending rooms

`GAME_BOOSTERS` in `server/src/shared/gameRooms.ts` defines booster IDs, names, descriptions, earning cadence, inventory caps and duration. `server/src/lib/gameBoosters.ts` maps those IDs to server effects. Client inventory and playtest buttons are generated from the definitions; new effects belong in this registry rather than in a single sabotage action. Inventory and effect timestamps persist with the room. Legacy numeric booster counts are normalized on access.

**End room** and **Delete room** archive the room with `closedAt`. It immediately disappears from the host's list, and connected students return to their room list on the next poll. Archived IDs and join codes cannot reopen it. This is a reversible database archive, not a permanent record deletion; there is no restore button. Normally completed games show final results to connected participants and are omitted from recent-room lists.

## Persistence, access and operational limits

- Every request verifies current Supabase identity, role, enrollment and archived status. Students must be active SHSAT members. Only the original teacher host controls a room. Join codes allow students into a waiting lobby; only existing members can reconnect after it starts.
- Rooms support up to 100 students. The recent list shows up to 30 joined/hosted rooms. There is no automated retention/deletion job in this version.
- Active room clients poll every 1.5 seconds. This is a small-classroom implementation, not a high-scale game service. It does not require sticky sessions or an in-memory broadcast process. Browser network throttling may delay visual updates, but server deadlines and scores remain authoritative.
- Room updates use database revision compare-and-swap, retrying conflicts up to 12 times. The same protections cover joins, shared answers, team progress and booster usage. Future question content and nested answer keys are removed from client responses; only the current checkpoint is sent. Single-question survival keys/explanations appear after the round closes.
- Deadlines are evaluated on room reads and actions. If everyone disconnects, the first reconnect finalizes the expired round/race before accepting another answer. The host can reconnect through their recent room list; teachers must advance survival reveals.
- A game snapshots source content when created, so later edits to the question bank or assessment do not change an ongoing game. No participant emails are exposed to other players.

## Verification

Run `node --test server/tests/game-rooms.test.cjs` for authentication/membership, teacher controls, private answer payloads, elimination/audience finale, deadline handling, team assignment, concurrent submission, shared/stale draft protection, reconnect state and server-enforced sabotage tests.

Run `node tools/preview-game-rooms.cjs` for an isolated browser harness at `http://127.0.0.1:4343`. It renders the real UI and uses the real router, grading, room store and transitions with fictional users and an in-memory Supabase fixture. Use `/?user=teacher`, `/?user=maya`, `/?user=jordan`, and `/?user=alex` in separate tabs. All six fixture questions have answer A. `/qa/mobile?user=teacher` embeds a real 390px viewport. This preview uses no production credentials or records.

Browser QA verified teacher lobby creation, independent student joins, team balancing, shared selection from Maya to Alex, teammate submission advancing both, live teacher progress, three-answer booster awards, visible 10-second sabotage, reconnect, early race completion with a shared victory, survival elimination, the audience final round, and an audience player stealing the win.
