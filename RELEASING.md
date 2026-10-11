# Releasing BharatCode

One script, one command, from the lab host:

```bash
ssh lab 'bash /data/ssd240/bharatcode-vscode-workspace/scripts/release.sh 7.8.8-bc.3'
```

It bumps the version (every package.json still at the old literal → new version), gates with production esbuild, builds the VSIX per platform, audits each zip (no sourcemaps, platform-exclusive `extension/bin/` binary, LICENSE, manifest id/version), writes SHA256SUMS, tags, and pushes `bc/main` + the tag. Per-platform (8 total, ~8 min each on the lab box):

| Platform | CLI target (`KILO_CLI_TARGETS`) | binary |
|---|---|---|
| win32-x64 | `win32-x64` | `bin/kilo.exe` |
| win32-arm64 | `win32-arm64` | `bin/kilo.exe` |
| linux-x64 | `linux-x64` | `bin/kilo` |
| linux-arm64 | `linux-arm64` | `bin/kilo` |
| alpine-x64 | `linux-x64-musl` | `bin/kilo` |
| alpine-arm64 | `linux-arm64-musl` | `bin/kilo` |
| darwin-x64 | `darwin-x64` | `bin/kilo` |
| darwin-arm64 | `darwin-arm64` | `bin/kilo` |

Then upload from anywhere with `gh`:

```bash
gh release upload <ver> -R thenabbu/BharatCode-VSCode-Extension --clobber \
  /data/ssd240/vsix-out/bharatcode-vscode-<plat>-<ver>.vsix ... SHA256SUMS
```
(or `gh release create <tag> ... --notes-file notes.md` for a fresh release; the repo flag `-R` is required.)

## Version scheme

- Fork of Kilo Code v7.8.8. BharatCode releases: `7.8.8-bc.N` — upstream X.Y.Z, `-bc` marks ours, `N` counts our releases. An upstream bump lands as `7.8.9-bc.1`, etc.
- ~36 `package.json` files share the version string; the bump replaces the old literal once per file. The embedded CLI inherits it via `KILO_VERSION` (`packages/opencode/script/build.ts`), so extension About and `kilo --version` stay in sync.
- Tag the exact final release commit — if you amend after tagging, re-point the tag (`git tag -d` + re-create) or the push ships the old tree.

## What a release must prove (the script enforces)

- tree clean, branch synced with origin, tag not taken
- esbuild production gate RC=0
- zip audit per platform: zero `*.map`, only the target platform's binary under `extension/bin/`, `extension/LICENSE.txt` with the BharatCode line, manifest `bharatcode.bharatcode-vscode` at the new version
- sha256 recorded before anything else touches `out/`

## Pitfalls that bit once

- **Never `git add -A` while builds run** — `bin/` holds the 150-290MB CLI binary; committing it makes GitHub reject the push (100MB hard limit). `bin/kilo` and `bin/kilo.exe` stay untracked; only `bin/kilodev*` are tracked. If a large blob sneaks into a commit, `git rm --cached <file>` (one pathspec per call — a missing second pathspec fails the whole command), amend, re-point the tag, push.
- The factory emits unsuffixed names (`bharatcode-vscode-<plat>.vsix`); the script renames to `-<version>` suffixes on move.
- Builds rewrite `bun.lock` and flip `bin/kilodev.cmd` mode — fold lockfile drift into the release commit, and `git checkout --` the mode bit.
- `vsce` must be on PATH for the factory (`packages/kilo-vscode/node_modules/.bin`).
- No publish CI: builds run where the toolchain lives. Marketplace publish config stays intact for the future listing.
