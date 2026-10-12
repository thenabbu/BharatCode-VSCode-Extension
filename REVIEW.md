# REVIEW.md

Guidance for PR reviewers — human or agent — on pull requests in this repo.

This repo has no review-bot integration: CI runs lint, guards, format, tests, and typecheck, so treat those as covered. The goal of review is to catch what those checks cannot: bugs, design issues, and judgment calls about style and fork hygiene. Be helpful, not pedantic — frame everything as a suggestion the human can accept or reject.

## Don't duplicate the local checks

CI reruns lint, guards, format, tests, and typecheck on every push; treat a green run as the mechanical baseline rather than re-running checks in review. Confirm the PR description names any additional checks that were run manually; do not comment on their output:

- Lint, formatting, or typecheck errors (root `bun run lint`, `bun run typecheck`)
- Test failures (CLI tests, vscode tests)
- `knip` unused exports (`bun run knip` in `packages/kilo-vscode/`)
- `kilocode_change` marker rules — both directions:
  - Missing markers on shared opencode files (`bun run script/check-opencode-annotations.ts`)
  - Markers present in kilo-only paths like `packages/kilo-vscode/`, `packages/kilo-ui/`, `packages/opencode/src/kilocode/` (`bun run check-kilocode-change` in `packages/kilo-vscode/`)
- Workflow allowlist drift (`bun run script/check-workflows.ts`)
- Stale `packages/kilo-docs/source-links.md` (`bun run script/extract-source-links.ts`)
- Markdown table padding (`bun run script/check-md-table-padding.ts`)
- Visual snapshot drift (`bun run test:visual` in `packages/kilo-vscode/`)
- SDK regeneration drift (`bun run script/generate.ts`)
- Generated artifact freshness (`bun run script/check-kilo-generated-artifacts.ts`)

If the only issue you'd raise is one of the above, just say `lgtm`.

## What to focus on

### 1. Bugs and correctness

Read enough of the surrounding file to actually understand the change — diffs alone hide context. Look for:

- Logic errors, off-by-one, wrong conditions, swapped arguments
- Unhandled error paths, swallowed promises, missing `await`
- Race conditions, especially around session/process lifecycle in the CLI and Agent Manager
- Resource leaks (unclosed file handles, child processes, subscriptions)
- Inputs that aren't validated where they cross trust boundaries (server routes, IPC, config loading)

### 2. Style guide judgment calls

The full guide is in `AGENTS.md`. Don't be a zealot — only flag actual violations, and recognize when the existing code already complies through a different mechanism.

- **No `let`**: prefer `const` with ternary or IIFE (`packages/opencode/src/util/iife.ts`). But `let` is fine when it's genuinely the simplest option; don't demand IIFE rewrites for trivial cases.
- **No `else`**: prefer early returns. Don't complain about `else` if the code already uses early returns elsewhere. You **may** flag excessive nesting regardless.
- **No empty `catch`**: always flag — empty catches hide bugs.
- **Avoid `try`/`catch` where possible**: if a try/catch is added, consider whether it's needed at all.
- **Avoid `any`**: flag new `any` usage unless there's a clear reason.
- **Single-word names**: prefer `cfg`, `pid`, `dir`, `opts`, `err` over `inputPID`, `connectTimeout`. Only flag newly introduced multi-word names where a clear single-word alternative exists.
- **Avoid unnecessary destructuring**: prefer `obj.a` over `const { a } = obj` to preserve context.
- **Bun APIs**: prefer `Bun.file()` etc. over node equivalents in CLI code.
- **Type inference**: avoid explicit annotations unless needed for exports/clarity.

When suggesting fixes, ensure the suggestion is valid TypeScript (matched braces, correct syntax). Prefer prose comments over `suggestion` blocks unless the fix is trivially mechanical.

### 3. Fork merge hygiene

This repo is a rebrand fork of Kilo Code v7.8.8 (itself a fork of opencode), pinned at the `upstream-pristine` tag with no upstream sync workflow — `bc/main` only. Minimizing diff against upstream still matters: `kilocode_change` markers and the local check scripts keep the upstream diff auditable.

- If a change modifies a shared opencode file (anything under `packages/opencode/` not in a path containing `kilocode`), ask whether the logic could live in a Kilo-only directory instead (`packages/opencode/src/kilocode/`, `packages/kilo-gateway/`, etc.) or be reduced to a smaller hook.
- Refactors or reorganizations of upstream code are a red flag — flag them unless clearly justified.
- See `.kilo/skills/kilocode-merge-minimizer/SKILL.md` for the decision rules.

### 4. Test quality

- Tests should exercise real implementation, not duplicate logic into the test.
- Mocks should be avoided where reasonable; flag mock-heavy tests that look like they're testing the mock rather than the code.
- New behavior in `packages/opencode/` should generally come with a test under `packages/opencode/test/`.

### 5. User-facing changes

- Features, bug fixes, and breaking changes should include a changeset (`.changeset/*.md`). If a PR clearly changes user-visible behavior and has no changeset, mention it.
- Changeset descriptions are read by end users — if one is present but written as implementation notes ("Add a new export handler that serializes…"), suggest a user-facing rewrite ("Support exporting conversations as markdown").
- PR descriptions should explain **why**, not enumerate files. Skip file-by-file inventories.

### 6. UI changes

For changes under `packages/kilo-vscode/webview-ui/`:

- Significant visual or layout changes should have a Storybook story added under `webview-ui/src/stories/`. Minor tweaks and i18n-only changes don't need one.
- Don't ask for locally generated baseline PNGs — regenerating visual baselines is the author's local step (`bun run test:visual:update`), not something a reviewer must obtain.

## How to comment

- Leave comments on the exact line via `gh api .../pulls/{n}/comments` — this applies where a reviewing bot or agent is wired to the repo; humans can comment through the GitHub UI.
- Make it clear suggestions are suggestions; the human decides.
- If the PR is clean against the above, comment `lgtm` and nothing else.
