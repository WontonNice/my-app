# Graph Report - src  (2026-11-03)


## Extraction limitations and verification

- Scope: all 529 supported files under client/src (526 code, 3 documents). External server and tool references are placeholders, not a scan of those folders.
- Graphify flagged features/math-command/MathCommandWorkspace.tsx as partially parsed (12 symbols). TypeScript's own TSX parser reported zero syntax diagnostics; this is an extraction limitation, not evidence of broken source code.
- The three files without extracted symbols are a component re-export, an exam-type re-export, and Vite's ambient type reference.
- Graph health: 1,240 raw relationships have unresolved endpoints, 12 self-loops, and 230 same-endpoint relationships collapse in the default undirected graph. There are 245 external-reference relationships. The graph is useful for navigation but is not a complete call graph. See graph-health.json for the full diagnostic.
- Semantic token usage was not exposed by the host's helper-agent API. Code extraction itself uses no LLM.
- graphify-out/ was written into the working tree and is not currently ignored. client/src/graphify-out/ contains the local extraction cache. Neither directory was committed.


## Corpus Check
- Large corpus: 529 files · ~1,748,575 words. User authorized proceeding with the full client/src scope. Only three documentation files required semantic extraction; 526 code files used local structural extraction.

## Summary
- 2872 nodes · 8854 edges · 116 communities (108 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.85)
- Token cost: code extraction uses no LLM; semantic helper-agent token usage is unavailable from the host API.

## Community Hubs (Navigation)
- Teacher Dashboard Analytics
- Math Command Workspace
- Answer Sheet Synchronization
- Administration API Requests
- Multiplayer Exam Games
- Exam Review Rendering
- Interactive Math Questions
- Student Portal Navigation
- Exam Content Registry
- Exam Session Interface
- Learning Plans and Passages
- Teacher Exam Management
- Generator Planning and Export
- Practice Studio Organization
- Session Roles and Routing
- Digital Test Passage Sources
- Exam Submission and Persistence
- Board Cards and Annotations
- Application Routes
- Classroom Meal Orders
- Staff Attendance and Tasks
- Infinite Practice Player
- Math Entry and History
- Game World Rendering
- 2017 Form A Content
- 2017 Form B Content
- World Room Connections
- Practice Studio Selection
- Account Profiles and Supabase
- 2024 Form A Content
- Adaptive Topic Practice
- Exam Launch and Loading
- Standalone Questions and Digital Tests
- Student Material Catalog
- Student Performance Summaries
- 2022 Form B Content
- Account Switching and Sessions
- Teacher Library Navigation
- 2018 Form A Content
- 2018 Form B Content
- 2019 Form A Content
- 2019 Form B Content
- 2020 Form A Content
- 2023 Form B Content
- 2026 Form C Content
- Digital Practice Test Five
- Student Achievement Collection
- Collaborative Board Canvas
- Math Study Hall Catalog
- Authentication and Login
- 2021 Form B Content
- 2023 Form A Content
- 2024 Form B Content
- 2026 Form B Content
- Exam Section Navigation
- Results and Correction Navigation
- Student Analytics Workstation
- Student Evidence Details
- Coordinate Response Drawing
- Crystal Defense Game
- Student Assessment Library
- 2020 Form B Content
- 2021 Form A Content
- 2022 Form A Content
- 2025 Form A Content
- 2025 Form B Content
- 2026 Form D Content
- Game World Interaction
- Content Authoring Documentation
- Library Passage Review
- Board Session Recovery
- Library Attempts and Access
- Local Exam Progress
- Analytics Scope Filters
- Login Meadow Animation
- Central Idea Practice Banks
- Passage Library Selection
- Practice Progress and Streaks
- Exam Timer Persistence
- Student Materials Library
- Generator Template Authoring
- Rich Passage Formatting
- Board Drawing Tools
- Question Bank Catalog
- Exam Correction Submission
- App Startup and Errors
- Student Topic Navigation
- Classroom Countdown Timer
- Teacher Plan Editing
- Board API and Pages
- Board Collaboration Transport
- Shared Game Notes
- Prose Passage Content
- Author Viewpoint Practice
- Evidence Support Practice
- Figurative Language Practice
- Inference Practice Banks
- Text Structure Practice
- Tone and Mood Practice
- Word Meaning Practice
- Practice Video Library
- Library Correction Submission
- Advanced Passage Content
- Exam Pencil Workspace
- Correction Canvas Drawing
- Game Avatar Geometry
- Homepage Featured Carousel
- SHSAT Exam Countdown
- Game Room Lifecycle
- Practice Child Visibility
- Miracle Mile Alternate Passage
- Cracking Code Passage
- Tramp Abroad Passage
- Nonnative Species Passage
- Landing Page Content

## God Nodes (most connected - your core abstractions)
1. `createSourcePassage()` - 160 edges
2. `ExamSessionPage()` - 117 edges
3. `createAuthHeaders()` - 101 edges
4. `TeacherDashboardPage()` - 74 edges
5. `AppLink()` - 66 edges
6. `AdminDashboardPage()` - 65 edges
7. `requestApi()` - 61 edges
8. `signOutCurrentAccount()` - 54 edges
9. `useStudentPortalAccess()` - 46 edges
10. `PracticeStudioWorkspace()` - 45 edges

## Surprising Connections (you probably didn't know these)
- `connect()` --indirect_call--> `token()`  [INFERRED]
  features/games/GameCursors.tsx → pages/ProfileSettingsPage.tsx
- `handleInternalNavigation()` --calls--> `navigateTo()`  [EXTRACTED]
  components/CorporateDashboardShell.tsx → lib/navigation.ts
- `generalPracticeStars()` --calls--> `readPracticeProgress()`  [EXTRACTED]
  components/MathStudyHall.tsx → features/math-command/practiceSessionStorage.ts
- `step()` --indirect_call--> `position()`  [INFERRED]
  features/games/world/worldRenderer.ts → components/auth/MeadowScene.tsx
- `save()` --calls--> `createAuthHeaders()`  [EXTRACTED]
  features/achievements/Achievements.tsx → lib/api.ts

## Import Cycles
- None detected.

## Communities (116 total, 8 thin omitted)

### Community 0 - "Teacher Dashboard Analytics"
Cohesion: 0.04
Nodes (84): percent(), resultStatus(), TeacherAssessmentInsights(), AccountActivity(), Activity, useAccountActivity(), AssessmentStatus, createTeacherManualExamResult() (+76 more)

### Community 1 - "Math Command Workspace"
Cohesion: 0.04
Nodes (40): downloadMathCsv(), jsonRequest(), MathBulkPreview, MathCollection, MathCommandOverview, MathCommandRequest, mathDate(), mathLabel() (+32 more)

### Community 2 - "Answer Sheet Synchronization"
Cohesion: 0.06
Nodes (29): answerSheetApi(), Attempt, Change, ReleasedResult, Save, Submission, Task, emptySheet() (+21 more)

### Community 3 - "Administration API Requests"
Cohesion: 0.05
Nodes (70): personalPracticeRequest(), assignStaffAccount(), createAuthHeaders(), createStaffTask(), deleteRosterStudent(), deleteStaffAttendanceEntry(), deleteStaffTask(), getGoogleSheetsAttendanceSettings() (+62 more)

### Community 4 - "Multiplayer Exam Games"
Cohesion: 0.07
Nodes (30): gameApi(), GameAnswerStatus(), anchorElement(), GameCursors(), connect(), panels, gameExamContent(), Action (+22 more)

### Community 5 - "Exam Review Rendering"
Cohesion: 0.09
Nodes (28): CorrectionExamPlayer(), Props, answerIncludesChoice(), ChoiceContent(), ExamAnswer(), ExamReviewPassage(), ExamReviewQuestion(), ExamText() (+20 more)

### Community 6 - "Interactive Math Questions"
Cohesion: 0.07
Nodes (41): ExamMathQuestion(), ExamNumberLineGraphic(), GraphPointResponse(), isInlineDropdownQuestion(), isTextEntryQuestion(), MathDragDropResponse(), endPointer(), move() (+33 more)

### Community 7 - "Student Portal Navigation"
Cohesion: 0.10
Nodes (31): AppLink(), handleClick(), AppLinkProps, getInitials(), StudentPortalShell(), handleSearch(), StudentPortalShellProps, WontonCompanion() (+23 more)

### Community 8 - "Exam Content Registry"
Cohesion: 0.05
Nodes (32): createPlainTextPassage(), createCategoryItems(), createChoices(), createFallbackExamContent(), createFallbackQuestions(), examContentByAssessmentId, isChoiceBasedQuestion(), parseAnswerIds() (+24 more)

### Community 9 - "Exam Session Interface"
Cohesion: 0.05
Nodes (35): ExamGeneralDirections(), generalDirectionsParts(), ExamSectionSubmission(), ExamTimeExpiredDialog(), PassageGlossary(), testnavMathDirections, testnavPartADirections, testnavPartBDirections (+27 more)

### Community 10 - "Learning Plans and Passages"
Cohesion: 0.08
Nodes (19): StudentPlanClient, StudentPassageProgress(), kindLabel, PlanView, getStudentLearningPlan(), getStudentPlanAssignments(), updateStudentPlanAssignment(), AssignmentPage (+11 more)

### Community 11 - "Teacher Exam Management"
Cohesion: 0.06
Nodes (40): BankPracticeInsights(), setError(), TeacherExamReentry(), update(), PaperAnswerEntry(), save(), TeacherExamTools(), toggleAccess() (+32 more)

### Community 12 - "Generator Planning and Export"
Cohesion: 0.11
Nodes (31): AddToGeneratorPlanner(), add(), load(), mathCommandRequest(), generatorBatchExport(), plannerEntryIssue(), CatalogData, download() (+23 more)

### Community 13 - "Practice Studio Organization"
Cohesion: 0.09
Nodes (22): generationSetEntries(), GenerationSetFilters, emptyFilters, GenerationSetEditor(), Props, generatorCodingBrief(), GeneratorBulkActions(), GeneratorLibraryTools() (+14 more)

### Community 14 - "Session Roles and Routing"
Cohesion: 0.10
Nodes (36): ClassAccessError(), ClassAccessGate(), checkAccess(), MathCommandPage(), MathPracticePage(), ExamSessionProgress, getExamCorrectionSubmissions(), getStudentClassAccess() (+28 more)

### Community 15 - "Digital Test Passage Sources"
Cohesion: 0.06
Nodes (32): codePointFromEntity(), createSourcePassage(), plainTextFromHtml(), richTextBlocks(), richTextLines(), digitalShsatPracticeTest4MathSection, excerptFromExcerptFromTheVoyageOfTheBeagleDigitalShsatPracticeTest4PassageSet, excerptFromExcerptFromTheVoyageOfTheBeagleDigitalShsatPracticeTest4Questions (+24 more)

### Community 16 - "Exam Submission and Persistence"
Cohesion: 0.08
Nodes (38): getBoldFormattedText(), renderInlineMathText(), renderMathPlainText(), saveCloudExamResult(), saveExamSessionProgress(), getExamResults(), getStorageKey(), saveExamResult() (+30 more)

### Community 17 - "Board Cards and Annotations"
Cohesion: 0.09
Nodes (17): BoardAnnotations(), colors, highlights, paint(), textRange(), BoardCard, CanvasCard, CollaborativeEditor() (+9 more)

### Community 18 - "Application Routes"
Cohesion: 0.09
Nodes (36): AccountEmailPage, AdminDashboardPage, AdvancedPassagePage, AnswerSheetsPage, App(), AuthPage, BoardPage, ClassroomMealsPage (+28 more)

### Community 19 - "Classroom Meal Orders"
Cohesion: 0.09
Nodes (12): MealCustomizationDialog(), MealCustomizationEditor(), MealImageField(), load(), paste(), resizeMealImage(), MealOrderHistory(), MealPhoto() (+4 more)

### Community 20 - "Staff Attendance and Tasks"
Cohesion: 0.10
Nodes (39): getSquidGames(), getStaffDashboard(), getStaffSchedules(), getStaffTasks(), saveSquidGamesPoints(), saveStaffAttendance(), saveStaffDismissal(), updateStaffTask() (+31 more)

### Community 21 - "Infinite Practice Player"
Cohesion: 0.14
Nodes (19): PracticeContent(), PracticeProps, checkPracticeAnswer(), createPracticeState(), currentPracticeGeneratorId(), formatPracticeTime(), hidePracticeGenerator(), nextPracticeQuestion() (+11 more)

### Community 22 - "Math Entry and History"
Cohesion: 0.10
Nodes (20): AdvancedTemplateIcon(), EditIcon(), keypadRows, MathEntryResponse(), insert(), MathKey, TemplateIcon(), AdvancedMathKey (+12 more)

### Community 23 - "Game World Rendering"
Cohesion: 0.11
Nodes (18): AvatarRig, disposeObject(), createCrystalArena(), remove(), removeItem(), createCrystalPortal(), CRYSTAL_INTERACT_DISTANCE, CRYSTAL_PORTAL (+10 more)

### Community 24 - "2017 Form A Content"
Cohesion: 0.10
Nodes (20): content20172018FormAMathSection, grade9MiniFormMathSection, pursuingAHobby20172018FormAPassageSet, pursuingAHobby20172018FormAQuestions, readingPassage120172018FormAPassageSet, readingPassage120172018FormAQuestions, readingPassage220172018FormAPassageSet, readingPassage220172018FormAQuestions (+12 more)

### Community 25 - "2017 Form B Content"
Cohesion: 0.09
Nodes (21): content20172018FormBMathSection, atDusk20242025FormAPassageSet, atDusk20242025FormAQuestions, movingThroughMountains20172018FormBPassageSet, movingThroughMountains20172018FormBQuestions, readingPassage120172018FormBPassageSet, readingPassage120172018FormBQuestions, readingPassage220172018FormBPassageSet (+13 more)

### Community 26 - "World Room Connections"
Cohesion: 0.10
Nodes (14): SpectatorCameraControls(), TeacherWorldControls(), useWorldConnection(), WorldSceneInteractions, WorldSceneState, Props, savedCharacter(), WorldRoom() (+6 more)

### Community 27 - "Practice Studio Selection"
Cohesion: 0.15
Nodes (31): generatorPreviewCatalog(), modulePreviewCatalog(), row(), filterStudioGenerators(), studioLocation(), studioMatches(), studioResourceGroups(), updateStudioGenerators() (+23 more)

### Community 28 - "Account Profiles and Supabase"
Cohesion: 0.13
Nodes (18): accountCall(), AccountContext, AccountProfile, AccountProvider(), useAccountProfile(), LoginStreak(), getSupabaseClient(), isSupabaseConfigured (+10 more)

### Community 29 - "2024 Form A Content"
Cohesion: 0.10
Nodes (19): content20242025FormAMathSection, content5ReasonsPhysicalBooksMightBeBetterThanEBooks20242025FormAPassageSet, content5ReasonsPhysicalBooksMightBeBetterThanEBooks20242025FormAQuestions, atDusk2024FormAPassageSet, atDusk2024FormAQuestions, championOfTheChannel20242025FormAPassageSet, championOfTheChannel20242025FormAQuestions, excerptFromImpressionsOfAnIndianChildhood20242025FormAVersion2PassageSet (+11 more)

### Community 30 - "Adaptive Topic Practice"
Cohesion: 0.11
Nodes (26): PracticeDifficulty, saveCloudPracticeProgress(), createEmptyTopicProgress(), emptyLevelProgress, formatPracticeTime(), getIncorrectChoiceExplanation(), getProgressStorageKey(), getTopicSlugFromPath() (+18 more)

### Community 31 - "Exam Launch and Loading"
Cohesion: 0.22
Nodes (27): resolveExamContent(), getExamSessionProgress(), getLearningProgress(), getStudentAssessment(), TeacherAssessment, createAssessmentSectionLines(), ExamSectionLine, formatDuration() (+19 more)

### Community 32 - "Standalone Questions and Digital Tests"
Cohesion: 0.09
Nodes (19): digitalShsatPracticeTest3MathSection, doverBeachDigitalShsatPracticeTest3PassageSet, doverBeachDigitalShsatPracticeTest3Questions, excerptFromOnWomenSRightToVoteDigitalShsatPracticeTest3PassageSet, excerptFromOnWomenSRightToVoteDigitalShsatPracticeTest3Questions, excerptFromTheKeyOfTheGardenDigitalShsatPracticeTest3PassageSet, excerptFromTheKeyOfTheGardenDigitalShsatPracticeTest3Questions, sixtySummersOnKestrelGlacierDigitalShsatPracticeTest3PassageSet (+11 more)

### Community 33 - "Student Material Catalog"
Cohesion: 0.08
Nodes (27): examLibraryBooks, examPassageLibrary, practiceTopics, revisingEditingTopics, advancedPassageMaterials, coverTones, editingPracticeMaterials, englishLibraryMaterials (+19 more)

### Community 34 - "Student Performance Summaries"
Cohesion: 0.20
Nodes (17): Score(), StudentAssessmentHistory(), dateLabel(), StudentScorePlot(), StudentSessionOverview(), activityLabel(), rawScore(), recordDate() (+9 more)

### Community 35 - "2022 Form B Content"
Cohesion: 0.10
Nodes (17): content20222023FormBMathSection, excerptFromHowExerciseCouldHelpYouLearnANewLanguage2023FormBPassageSet, excerptFromHowExerciseCouldHelpYouLearnANewLanguage2023FormBQuestions, excerptFromImpressionsOfAnIndianChildhood20222023FormBPassageSet, excerptFromImpressionsOfAnIndianChildhood20222023FormBQuestions, excerptFromTheHighestTide20222023FormBPassageSet, excerptFromTheHighestTide20222023FormBQuestions, excerptFromTheWorldHasAnEWasteProblem20222023FormBPassageSet (+9 more)

### Community 36 - "Account Switching and Sessions"
Cohesion: 0.18
Nodes (20): AccountMenu(), AccountSwitcher(), handleAddAccount(), handleRemoveAccount(), handleSwitch(), CorporateDashboardShellProps, DashboardNavItem, getInitials() (+12 more)

### Community 37 - "Teacher Library Navigation"
Cohesion: 0.14
Nodes (23): CorporateDashboardShell(), handleInternalNavigation(), getTeacherLibraryBook(), setTeacherLibraryStudentAccess(), TeacherLibraryAttempt, TeacherLibraryStudent, getEnglishLibraryMaterial(), getLibraryBookId() (+15 more)

### Community 38 - "2018 Form A Content"
Cohesion: 0.10
Nodes (17): content20182019FormAMathSection, anEarlyWarning20182019FormAPassageSet, anEarlyWarning20182019FormAQuestions, championOfTheChannel20182019FormAPassageSet, championOfTheChannel20182019FormAQuestions, crossPurposes20182019FormAPassageSet, crossPurposes20182019FormAQuestions, excerptFromATrampAbroad20182019FormAPassageSet (+9 more)

### Community 39 - "2018 Form B Content"
Cohesion: 0.10
Nodes (17): content20182019FormBMathSection, excerptFromAVoiceInTheWilderness20182019FormBPassageSet, excerptFromAVoiceInTheWilderness20182019FormBQuestions, excerptFromNiagaraFalls20182019FormBPassageSet, excerptFromNiagaraFalls20182019FormBQuestions, inventionOfTheTelegraph20182019FormBPassageSet, inventionOfTheTelegraph20182019FormBQuestions, snowyMountains20182019FormBPassageSet (+9 more)

### Community 40 - "2019 Form A Content"
Cohesion: 0.10
Nodes (17): content20192020FormAMathSection, aMiracleMile20192020FormAPassageSet, aMiracleMile20192020FormAQuestions, crackingTheCode20192020FormAPassageSet, crackingTheCode20192020FormAQuestions, excerptFromHowWeMadeTheFirstFlight20192020FormAPassageSet, excerptFromHowWeMadeTheFirstFlight20192020FormAQuestions, excerptFromInSearchOfTheUnknown20192020FormAPassageSet (+9 more)

### Community 41 - "2019 Form B Content"
Cohesion: 0.10
Nodes (17): content20192020FormBMathSection, aMemoryRevolution20192020FormBPassageSet, aMemoryRevolution20192020FormBQuestions, excerptFromTheSpiritOfTheHerd20192020FormBPassageSet, excerptFromTheSpiritOfTheHerd20192020FormBQuestions, lookingForTheSmallestSparkOfEverything20192020FormBPassageSet, lookingForTheSmallestSparkOfEverything20192020FormBQuestions, martialArtsForTheMindAndBody20192020FormBPassageSet (+9 more)

### Community 42 - "2020 Form A Content"
Cohesion: 0.10
Nodes (17): content20202021FormAMathSection, content5ReasonsPhysicalBooksMightBeBetterThanEBooks20202021FormAPassageSet, content5ReasonsPhysicalBooksMightBeBetterThanEBooks20202021FormAQuestions, championOfTheChannel20202021FormAPassageSet, championOfTheChannel20202021FormAQuestions, excerptFromAVoiceInTheWilderness20202021FormAPassageSet, excerptFromAVoiceInTheWilderness20202021FormAQuestions, findTimeToVolunteer20202021FormAPassageSet (+9 more)

### Community 43 - "2023 Form B Content"
Cohesion: 0.10
Nodes (17): content20232024FormBMathSection, crossPurposes20232024FormBPassageSet, crossPurposes20232024FormBQuestions, excerptFromHowWeMadeTheFirstFlight20232024FormBPassageSet, excerptFromHowWeMadeTheFirstFlight20232024FormBQuestions, excerptFromInSearchOfTheUnknown20232024FormBPassageSet, excerptFromInSearchOfTheUnknown20232024FormBQuestions, excerptFromNiagaraFalls20232024FormBPassageSet (+9 more)

### Community 44 - "2026 Form C Content"
Cohesion: 0.10
Nodes (17): content20262027FormCMathSection, birdTalk20262027FormCPassageSet, birdTalk20262027FormCQuestions, excerptFromGrowingPeppersOnTheIssIsJustTheStartOfSpaceFarming20262027FormCPassageSet, excerptFromGrowingPeppersOnTheIssIsJustTheStartOfSpaceFarming20262027FormCQuestions, excerptFromImpressionsOfAnIndianChildhood20262027FormCPassageSet, excerptFromImpressionsOfAnIndianChildhood20262027FormCQuestions, excerptFromNiagaraFalls20262027FormCPassageSet (+9 more)

### Community 45 - "Digital Practice Test Five"
Cohesion: 0.10
Nodes (17): digitalShsatPracticeTest5MathSection, excerptFromFirstIceDigitalShsatPracticeTest5PassageSet, excerptFromFirstIceDigitalShsatPracticeTest5Questions, excerptFromMessageAtTheSpeedOfAirDigitalShsatPracticeTest5PassageSet, excerptFromMessageAtTheSpeedOfAirDigitalShsatPracticeTest5Questions, excerptFromRipVanWinkleDigitalShsatPracticeTest5PassageSet, excerptFromRipVanWinkleDigitalShsatPracticeTest5Questions, excerptFromRoomToRoamDigitalShsatPracticeTest5PassageSet (+9 more)

### Community 46 - "Student Achievement Collection"
Cohesion: 0.13
Nodes (14): AchievementCard(), AchievementCollection(), Achievements(), save(), BadgeArt(), formatDays(), formatPercent(), icons (+6 more)

### Community 47 - "Collaborative Board Canvas"
Cohesion: 0.09
Nodes (8): Canvas(), CollaboratorCursors(), edgeTypes, Menu, nodeTypes, Overrides, routingOptions, typing()

### Community 48 - "Math Study Hall Catalog"
Cohesion: 0.17
Nodes (13): MathStudyHall(), generalPracticeStars(), PracticePlayer, CatalogPracticePlayer(), InequalityPractice(), PracticeModuleList(), practiceProgressEvent, Player (+5 more)

### Community 49 - "Authentication and Login"
Cohesion: 0.16
Nodes (15): MeadowScene(), useReducedMotion(), WaterPortrait(), disturb(), draw(), resize(), visibilityChanged(), registerStudent() (+7 more)

### Community 50 - "2021 Form B Content"
Cohesion: 0.11
Nodes (15): content20212022FormBMathSection, aMemoryRevolution20212022FormBPassageSet, aMemoryRevolution20212022FormBQuestions, aMiracleMile20212022FormBPassageSet, aMiracleMile20212022FormBQuestions, excerptFromHowWeMadeTheFirstFlight20212022FormBPassageSet, excerptFromHowWeMadeTheFirstFlight20212022FormBQuestions, martialArtsForTheMindAndBody20212022FormBPassageSet (+7 more)

### Community 51 - "2023 Form A Content"
Cohesion: 0.11
Nodes (15): content20232024FormAMathSection, aMemoryRevolution20232024FormAPassageSet, aMemoryRevolution20232024FormAQuestions, excerptFromDoThemNoHarm20232024FormAPassageSet, excerptFromDoThemNoHarm20232024FormAQuestions, excerptFromWinterWheat20232024FormAPassageSet, excerptFromWinterWheat20232024FormAQuestions, letterFromBrooklyn20232024FormAPassageSet (+7 more)

### Community 52 - "2024 Form B Content"
Cohesion: 0.11
Nodes (15): content20242025FormBMathSection, excerptFromHowExerciseCouldHelpYouLearnANewLanguage20242025FormBPassageSet, excerptFromHowExerciseCouldHelpYouLearnANewLanguage20242025FormBQuestions, excerptFromThePastAndTheFutureOfTheEarthSOldestTrees20242025FormBPassageSet, excerptFromThePastAndTheFutureOfTheEarthSOldestTrees20242025FormBQuestions, findTimeToVolunteer20242025FormBPassageSet, findTimeToVolunteer20242025FormBQuestions, inventionOfTheTelegraph20242025FormBPassageSet (+7 more)

### Community 53 - "2026 Form B Content"
Cohesion: 0.11
Nodes (15): content20262027FormBMathSection, aMiracleMile20262027FormBPassageSet, aMiracleMile20262027FormBQuestions, excerptFromInSearchOfTheUnknown20262027FormBPassageSet, excerptFromInSearchOfTheUnknown20262027FormBQuestions, excerptFromThePastAndTheFutureOfTheEarthSOldestTrees20262027FormBPassageSet, excerptFromThePastAndTheFutureOfTheEarthSOldestTrees20262027FormBQuestions, letterFromBrooklyn20262027FormBPassageSet (+7 more)

### Community 54 - "Exam Section Navigation"
Cohesion: 0.13
Nodes (23): createRandomQuestionAnswer(), clearTransientExamUi(), finishMathSection(), handleEndSectionSubmit(), handleMathNext(), handleMathPrevious(), handlePassageEndNext(), handlePassageNext() (+15 more)

### Community 55 - "Results and Correction Navigation"
Cohesion: 0.21
Nodes (14): getStudentAssessments(), getStudentPreviewResults(), examCorrectionsHref(), replaceExamResults(), filterResults(), resultDate(), ResultSort, appendStudentPreview() (+6 more)

### Community 56 - "Student Analytics Workstation"
Cohesion: 0.18
Nodes (16): CompactAnswer(), dateLabel(), delta(), pct(), skillAccuracy(), StudentAnalyticsWorkstation(), typeLabel(), createGeneratorHref() (+8 more)

### Community 57 - "Student Evidence Details"
Cohesion: 0.26
Nodes (16): pct(), StudentAnalysisDetails(), StudentEvidenceMatrix(), StudentProgressRoster(), analysisDay(), AnalysisFilters, analyticsCsv(), defaultAnalysisFilters (+8 more)

### Community 58 - "Coordinate Response Drawing"
Cohesion: 0.17
Nodes (12): CoordinateResponse(), end(), keyDelta(), keyPoint(), move(), pointerPoint(), putPoint(), putShape() (+4 more)

### Community 59 - "Crystal Defense Game"
Cohesion: 0.14
Nodes (11): Action, crossingTime(), CrystalAdminControls(), CrystalAdminDialog(), CrystalDefensePanel(), CrystalQuestion(), CrystalSetup(), PlaytestControl (+3 more)

### Community 60 - "Student Assessment Library"
Cohesion: 0.20
Nodes (14): ExamLibraryFilters(), AccessFilter, durationLabel(), Props, Sort, StudentAssessmentLibrary(), StudentAssessment, compareExamLibrary() (+6 more)

### Community 61 - "2020 Form B Content"
Cohesion: 0.13
Nodes (13): content20202021FormBMathSection, crossPurposesFormBPassageSet, crossPurposesFormBQuestions, excerptFromNiagaraFalls20202021ShsatSampleTestFormBPassageSet, excerptFromNiagaraFalls20202021ShsatSampleTestFormBQuestions, massachusettsLowellNationalHistoricalPark20202021FormBPassageSet, massachusettsLowellNationalHistoricalPark20202021FormBQuestions, theFreeCollegeDebate20202021FormBPassageSet (+5 more)

### Community 62 - "2021 Form A Content"
Cohesion: 0.13
Nodes (13): content20212022FormAMathSection, excerptFromResearchRiddleResolved20212022FormAPassageSet, excerptFromResearchRiddleResolved20212022FormAQuestions, excerptFromWinterWheat20212022FormAPassageSet, excerptFromWinterWheat20212022FormAQuestions, massachusettsPassageSet, massachusettsQuestions, odeToFireworks20212022FormAPassageSet (+5 more)

### Community 63 - "2022 Form A Content"
Cohesion: 0.13
Nodes (13): content20222023FormAMathSection, birdTalk2023FormAPassageSet, birdTalk2023FormAQuestions, excerptFromScribeLikeAnEgyptian2023FormAPassageSet, excerptFromScribeLikeAnEgyptian2023FormAQuestions, excerptFromTheFoodBusinessIncubator2023FormAPassageSet, excerptFromTheFoodBusinessIncubator2023FormAQuestions, excerptFromThePastAndTheFutureOfTheEarthSOldestTrees2023FormAPassageSet (+5 more)

### Community 64 - "2025 Form A Content"
Cohesion: 0.13
Nodes (13): content20252026FormAMathSection, dothemnoharmPassageSet, dothemnoharmQuestions, indoorPlantsPassageSet, indoorPlantsQuestions, scribeLikeAnEgyptianPassageSet, scribeLikeAnEgyptianQuestions, SnowyMountainsPassageSet (+5 more)

### Community 65 - "2025 Form B Content"
Cohesion: 0.13
Nodes (13): content20252026FormBMathSection, atDusk20252026FormBPassageSet, atDusk20252026FormBQuestions, excerptFromInSearchOfTheUnknownPassageSet, excerptFromInSearchOfTheUnknownQuestions, letterFromBrooklyn20252026FormBPassageSet, letterFromBrooklyn20252026FormBQuestions, theEndOfAnEraPassageSet (+5 more)

### Community 66 - "2026 Form D Content"
Cohesion: 0.13
Nodes (13): content20262027FormDMathSection, aMemoryRevolution20262027FormDPassageSet, aMemoryRevolution20262027FormDQuestions, excerptFromHowWeMadeTheFirstFlight20262027FormDPassageSet, excerptFromHowWeMadeTheFirstFlight20262027FormDQuestions, excerptFromTheHighestTide20262027FormDPassageSet, excerptFromTheHighestTide20262027FormDQuestions, odeToFireworks20262027FormDPassageSet (+5 more)

### Community 67 - "Game World Interaction"
Cohesion: 0.19
Nodes (12): createCrystalPickupCollector(), createWorldScene(), animate(), cancelEmote(), clearInput(), floorHeight(), interactMonster(), interactNearest() (+4 more)

### Community 68 - "Content Authoring Documentation"
Cohesion: 0.14
Nodes (14): Assessment ID Registration, Exam Content Studio Authoring, Exam Content, Exam Specific Math Sets, Passage Formatters, Passage Sets, Revising Editing Part B Bank, 2025-2026 Form A (+6 more)

### Community 69 - "Library Passage Review"
Cohesion: 0.17
Nodes (10): StudentLibraryAttempt, StudentLibraryCorrectionView, AdvancedTool, CorrectionDraft, formatAttemptDate(), formatDuration(), LibraryCorrectionsWorkspace(), renderFormattedText() (+2 more)

### Community 71 - "Library Attempts and Access"
Cohesion: 0.18
Nodes (13): getStudentLibraryAttempts(), getStudentLibraryBookAccess(), saveStudentLibraryAttempt(), libraryCorrectionsHref(), AdvancedExamToolbar(), AdvancedPassagePage(), handleCheckAccess(), handleNext() (+5 more)

### Community 72 - "Local Exam Progress"
Cohesion: 0.17
Nodes (6): clearLocalExamSession(), ExamSection, hasSavedAnswer(), loadLocalExamSession(), saveLocalExamSession(), storageKey()

### Community 73 - "Analytics Scope Filters"
Cohesion: 0.20
Nodes (12): categorySource(), contentScope(), ContentSource, editingTopics, evidenceArea(), explicitSource(), matchesContentSource(), metricArea() (+4 more)

### Community 74 - "Login Meadow Animation"
Cohesion: 0.26
Nodes (12): Deer(), animate(), draw(), onFormBlur(), onFormFocus(), onVisibility(), position(), resize() (+4 more)

### Community 75 - "Central Idea Practice Banks"
Cohesion: 0.23
Nodes (8): authorsPointOfViewQuestions, centralIdeaThemeEasyQuestions, centralIdeaThemeEliteQuestions, centralIdeaThemeHardQuestions, centralIdeaThemeQuestions, centralIdeaThemeMediumQuestions, PracticeChoice, PracticeTopic

### Community 76 - "Passage Library Selection"
Cohesion: 0.19
Nodes (8): excerptFromDoThemNoHarm2023FormAPassageSet, excerptFromDoThemNoHarm2023FormAQuestions, excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvil20222023FormAPassageSet, excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvil20222023FormAQuestions, excerptFromTheRoadNotTakenPassageSet, excerptFromTheRoadNotTakenQuestions, usingFireToKeepAPrairieHealthy20262027FormBPassageSet, usingFireToKeepAPrairieHealthy20262027FormBQuestions

### Community 77 - "Practice Progress and Streaks"
Cohesion: 0.34
Nodes (12): addPracticeTime(), parsePracticeState(), PracticeState, validAnswer(), bestKey(), prefix(), readPracticeProgress(), readSavedPractice() (+4 more)

### Community 78 - "Exam Timer Persistence"
Cohesion: 0.21
Nodes (13): getExamResumePosition(), EXAM_DURATION_MS, ExamTimerState, getExamElapsedMs(), getExamTimerDisplay(), getExamTimerStorageKey(), isExamTimeExpired(), isValidTimerState() (+5 more)

### Community 79 - "Student Materials Library"
Cohesion: 0.26
Nodes (12): EmptyState(), EnglishLibrary(), EnglishLibraryProps, getInitialQuery(), getInitialSubject(), LibraryBook(), materialMatchesQuery(), PassageFilter (+4 more)

### Community 80 - "Generator Template Authoring"
Cohesion: 0.18
Nodes (3): parseGeneratorImport(), templateExample, TemplateGeneratorEditor()

### Community 81 - "Rich Passage Formatting"
Cohesion: 0.17
Nodes (6): createSentenceNumberedPassage(), numberRichSentences(), PlainTextPassageInput, ProsePassageInput, RichTextBlock, SentenceNumberedPassageInput

### Community 82 - "Board Drawing Tools"
Cohesion: 0.29
Nodes (7): BoardDrawing(), colors, DrawingSurface(), sample(), DrawingTool, boardStrokeHit(), boardStrokePath()

### Community 83 - "Question Bank Catalog"
Cohesion: 0.17
Nodes (4): getBankPassage(), questionBank, questionBankCatalog, sets

### Community 84 - "Exam Correction Submission"
Cohesion: 0.25
Nodes (5): getExamCorrectionView(), submitExamCorrections(), examCorrectionId(), ExamCorrectionsPage(), submit()

### Community 85 - "App Startup and Errors"
Cohesion: 0.20
Nodes (4): AppErrorBoundary, AppErrorBoundaryProps, AppErrorBoundaryState, rootElement

### Community 86 - "Student Topic Navigation"
Cohesion: 0.29
Nodes (9): StudentLearningPlan(), getPracticeTopicBySlug(), getTopicBankSets(), difficultyOrder, getTopicSlugFromPath(), StudentTopicHubPage(), handleSignOut(), TopicEmptyState() (+1 more)

### Community 87 - "Classroom Countdown Timer"
Cohesion: 0.35
Nodes (8): TeacherCountdown(), applyDuration(), update(), classroomRemaining(), ClassroomTimerState, defaultClassroomTimer, formatClassroomTime(), readClassroomTimer()

### Community 88 - "Teacher Plan Editing"
Cohesion: 0.29
Nodes (11): blankDraft(), date(), errorMessage(), PlanningSettings(), save(), TeacherLearningPlan(), act(), openDetail() (+3 more)

### Community 89 - "Board API and Pages"
Cohesion: 0.27
Nodes (5): boardApi(), BoardVersion, BoardCanvas(), AssetCard(), BoardPage()

### Community 90 - "Board Collaboration Transport"
Cohesion: 0.20
Nodes (3): fromBase64(), SessionState, toBase64()

### Community 91 - "Shared Game Notes"
Cohesion: 0.22
Nodes (5): SharedToolNotes(), Action, mergeToolLists(), SharedExamTools, toolSetter()

### Community 92 - "Prose Passage Content"
Cohesion: 0.20
Nodes (7): createProsePassage(), aMiracleMilePassageSet, aMiracleMileQuestions, excerptFromImpressionsOfAnIndianChildhood20202021ShsatSampleTestFormBPassageSet, excerptFromImpressionsOfAnIndianChildhood20202021ShsatSampleTestFormBQuestions, excerptFromThePuzzleOfTheRiderlessBicyclePassageSet, excerptFromThePuzzleOfTheRiderlessBicycleQuestions

### Community 93 - "Author Viewpoint Practice"
Cohesion: 0.36
Nodes (5): authorsPointOfViewEasyQuestions, authorsPointOfViewEliteQuestions, authorsPointOfViewHardQuestions, authorsPointOfViewMediumQuestions, PracticeQuestion

### Community 94 - "Evidence Support Practice"
Cohesion: 0.29
Nodes (5): evidenceSupportEasyQuestions, evidenceSupportEliteQuestions, evidenceSupportHardQuestions, evidenceSupportQuestions, evidenceSupportMediumQuestions

### Community 95 - "Figurative Language Practice"
Cohesion: 0.29
Nodes (5): figurativeLanguageImageryEasyQuestions, figurativeLanguageImageryEliteQuestions, figurativeLanguageImageryHardQuestions, figurativeLanguageImageryQuestions, figurativeLanguageImageryMediumQuestions

### Community 96 - "Inference Practice Banks"
Cohesion: 0.29
Nodes (5): inferenceEasyQuestions, inferenceEliteQuestions, inferenceHardQuestions, inferenceQuestions, inferenceMediumQuestions

### Community 97 - "Text Structure Practice"
Cohesion: 0.29
Nodes (5): textStructureEasyQuestions, textStructureEliteQuestions, textStructureHardQuestions, textStructureQuestions, textStructureMediumQuestions

### Community 98 - "Tone and Mood Practice"
Cohesion: 0.29
Nodes (5): toneMoodEasyQuestions, toneMoodEliteQuestions, toneMoodHardQuestions, toneMoodQuestions, toneMoodMediumQuestions

### Community 99 - "Word Meaning Practice"
Cohesion: 0.29
Nodes (5): wordPhraseMeaningEasyQuestions, wordPhraseMeaningEliteQuestions, wordPhraseMeaningHardQuestions, wordPhraseMeaningQuestions, wordPhraseMeaningMediumQuestions

### Community 100 - "Practice Video Library"
Cohesion: 0.36
Nodes (6): PracticeVideoList(), PracticeVideoPlayer(), videoPublishedLabel(), VideoRow(), videoViewsLabel(), youtubeEmbedUrl()

### Community 101 - "Library Correction Submission"
Cohesion: 0.44
Nodes (8): getAdvancedPracticePassage(), getExamLibraryPassage(), getBankSet(), getStudentLibraryCorrections(), submitStudentLibraryCorrections(), libraryCorrectionLocation(), LibraryCorrectionsPage(), submit()

### Community 102 - "Advanced Passage Content"
Cohesion: 0.39
Nodes (5): advancedPracticePassages, theCatSTable, theCatSTableQuestions, AdvancedPassageGenre, AdvancedPracticePassage

### Community 103 - "Exam Pencil Workspace"
Cohesion: 0.32
Nodes (4): PencilWorkspace(), handlePointerDown(), handlePointerMove(), pointFromEvent()

### Community 104 - "Correction Canvas Drawing"
Cohesion: 0.52
Nodes (7): CorrectionCanvas(), commit(), erase(), finish(), move(), point(), start()

### Community 105 - "Game Avatar Geometry"
Cohesion: 0.52
Nodes (7): createAvatar(), mesh(), sphere(), createMemeAvatar(), curve(), material(), mesh()

### Community 106 - "Homepage Featured Carousel"
Cohesion: 0.47
Nodes (5): FeaturedCarousel(), FeaturedCarouselProps, FeaturedSlide, getNextIndex(), getPreviousIndex()

### Community 107 - "SHSAT Exam Countdown"
Cohesion: 0.53
Nodes (4): ShsatCountdown(), getShsatCountdown(), SHSAT_TEST_DAY, SHSAT_TEST_DAY_MS

### Community 109 - "Practice Child Visibility"
Cohesion: 0.60
Nodes (4): changePracticeChild(), choiceStrings(), practiceChildIsHidden(), PracticeChoices

## Knowledge Gaps
- **5 isolated node(s):** `Passage Formatters`, `Matching Server Assessment Record`, `2025-2026 Form A`, `Practice Question Validation`, `Labeled Question Paste Template`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 732 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ExamSessionPage()` connect `Exam Submission and Persistence` to `Multiplayer Exam Games`, `Exam Review Rendering`, `Interactive Math Questions`, `Student Portal Navigation`, `Local Exam Progress`, `Exam Session Interface`, `Shared Game Notes`, `Exam Pencil Workspace`, `Session Roles and Routing`, `Exam Timer Persistence`, `Infinite Practice Player`, `Exam Section Navigation`, `Results and Correction Navigation`, `Crystal Defense Game`, `Account Profiles and Supabase`, `Exam Launch and Loading`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ExamSessionPage()` (e.g. with `confirmBeforeLeaving()` and `handlePauseTimer()`) actually correct?**
  _`ExamSessionPage()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Passage Formatters`, `Matching Server Assessment Record`, `2025-2026 Form A` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Teacher Dashboard Analytics` be split into smaller, more focused modules?**
  _Cohesion score 0.043673012318029114 - nodes in this community are weakly interconnected._
- **Why does `AppLink()` connect `Student Portal Navigation` to `Teacher Dashboard Analytics`, `Math Command Workspace`, `Answer Sheet Synchronization`, `Administration API Requests`, `Exam Review Rendering`, `Teacher Library Navigation`, `Learning Plans and Passages`, `Teacher Exam Management`, `Practice Studio Organization`, `Session Roles and Routing`, `Student Materials Library`, `Math Study Hall Catalog`, `Classroom Meal Orders`, `Exam Correction Submission`, `Student Topic Navigation`, `Results and Correction Navigation`, `Practice Studio Selection`, `Student Assessment Library`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `Math Command Workspace` be split into smaller, more focused modules?**
  _Cohesion score 0.04371201496026181 - nodes in this community are weakly interconnected._
- **Why does `getSupabaseClient()` connect `Account Profiles and Supabase` to `Teacher Dashboard Analytics`, `Answer Sheet Synchronization`, `Administration API Requests`, `Account Switching and Sessions`, `Board Collaboration Transport`, `Board Session Recovery`, `Student Portal Navigation`, `Exam Session Interface`, `Teacher Exam Management`, `Session Roles and Routing`, `Exam Submission and Persistence`, `Authentication and Login`, `Application Routes`, `Staff Attendance and Tasks`, `World Room Connections`, `Adaptive Topic Practice`, `Exam Launch and Loading`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._

## Artifact verification

Exported graph JSON has unique node IDs, valid edge endpoints, and community labels for every node. Embedded HTML JavaScript passed Node syntax checking. The interactive visualization loads vis-network from unpkg.com and therefore needs internet access for that library. Browser rendering was not tested.

## Graphify benchmark (estimate)

Graphify reported a 143,600-word comparison baseline (~191,466 tokens), an average query cost of ~1,617 tokens, and 118.4x token reduction. This is its benchmark estimate, not a measured speedup or the detected source word count.
