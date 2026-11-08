# Issue tracker: GitHub

Issues and specs live in https://github.com/WontonNice/my-app/issues.

## Target and authentication

Verify the target with `gh repo view --json nameWithOwner` from the correct checkout. Pass `--repo WontonNice/my-app` explicitly to issue commands.

Prefer the connected GitHub tools when available. GitHub CLI is also installed on this PC at C:\Program Files\GitHub CLI\gh.exe. Its persistent login is not configured: the existing Git credential lacks the read:org scope required by gh auth login, but repository operations were verified using it.

For CLI operations, reuse the configured Git credential helper through a process-local GH_TOKEN if needed. Never print the credential or write it to repository files or a persistent environment variable. Clear the process-local token afterwards. If no usable credential is available, ask the user to sign in.

## Issue workflow

- Read: `gh issue view NUMBER --repo WontonNice/my-app --json number,title,body,labels,comments`.
- List: `gh issue list --repo WontonNice/my-app --state open --json number,title,body,labels`. Apply appropriate label filters.
- Create: `gh issue create --repo WontonNice/my-app --title "..." --body-file BODY_FILE`.
- Comment: `gh issue comment NUMBER --repo WontonNice/my-app --body-file BODY_FILE`.
- Apply or remove labels: `gh issue edit NUMBER --repo WontonNice/my-app --add-label LABEL` or `--remove-label LABEL`.
- Close: post the explanation first, then `gh issue close NUMBER --repo WontonNice/my-app`.
- Preserve actual newlines by writing multiline issue and comment bodies to a temporary UTF-8 file.
- Only publish when authorized by the user or the skill they invoked.
- File issues only in the user's repository. Do not file issues in mattpocock/skills.

When a skill says "publish to the issue tracker," create a GitHub issue. When it says "fetch the relevant ticket," read that issue and its comments.

## Dependencies and wayfinding

Use native GitHub sub-issues and issue dependencies when supported by the available tool. Otherwise, place `Part of #NUMBER` and `Blocked by: #NUMBER` references in the ticket and link children in the parent's task list. A ticket is unblocked when all its blockers are closed.

For wayfinder, the map is one issue labeled wayfinder:map. Child issues use wayfinder:research, wayfinder:prototype, wayfinder:grilling, or wayfinder:task. Create these labels only when the workflow needs them. Claim a ticket by assigning it to the driving developer. Resolve it with a comment and closure, then update the parent map with the result.

## Pull requests as a triage surface

PRs as a request surface: no.

