# Releasing BharatCode

One script, one command, from the lab host:

```bash
ssh lab 'bash /data/ssd240/bharatcode-vscode-workspace/scripts/release.sh <ver>'
```

It bumps the version (every package.json still at the old literal → new version), gates with production esbuild, builds **win32-x64 and linux-x64** (CLI and VSIX each), audits each zip (no sourcemaps, platform-exclusive `extension/bin/` binary, LICENSE, manifest id/version), writes SHA256SUMS for those two, tags, and pushes `bc/main` + the tag. It does **not** build the other six platforms — those come from the per-platform recipe below.

The full matrix (8 platforms, ~8 min each on the lab box):

| Platform | CLI target (`KILO_CLI_TARGETS`) | binary |
|---|---|---|
| win32-x64 | `win32-x64` | `bin/bharatcode.exe` |
| win32-arm64 | `win32-arm64` | `bin/bharatcode.exe` |
| linux-x64 | `linux-x64` | `bin/bharatcode` |
| linux-arm64 | `linux-arm64` | `bin/bharatcode` |
| alpine-x64 | `linux-x64-musl` | `bin/bharatcode` |
| alpine-arm64 | `linux-arm64-musl` | `bin/bharatcode` |
| darwin-x64 | `darwin-x64` | `bin/bharatcode` |
| darwin-arm64 | `darwin-arm64` | `bin/bharatcode` |

## Building the remaining six platforms

Run per platform (`win32-arm64`, `linux-arm64`, `alpine-x64`, `alpine-arm64`, `darwin-x64`, `darwin-arm64`), with `PATH` including both packages' `node_modules/.bin`:

```bash
# packages/opencode — build the CLI for the target key from the table
KILO_CLI_TARGETS=<key> KILO_SKIP_BUNDLED_BWRAP=1 bun script/build.ts
# stage the built binary (dist/@kilocode/cli-<key>/bin/bharatcode[.exe]) into packages/kilo-vscode/bin/

# packages/kilo-vscode — build the VSIX for the platform
KILO_VSIX_TARGETS=<plat> KILO_SKIP_HEAVY=1 KILO_SKIP_BUNDLED_BWRAP=1 bun script/build.ts
mv out/*.vsix /data/ssd240/vsix-out/bharatcode-vscode-<plat>-<ver>.vsix
# run the zip audit (same rules as the script), then append the file's sha256 to SHA256SUMS
```

Then upload from anywhere with `gh`:

```bash
gh release upload <ver> -R thenabbu/BharatCode-VSCode-Extension --clobber \
  /data/ssd240/vsix-out/bharatcode-vscode-<plat>-<ver>.vsix ... SHA256SUMS
```

(or `gh release create <tag> ... --notes-file notes.md` for a fresh release; the repo flag `-R` is required.)

## Version scheme

- Fork of Kilo Code v7.8.8. BharatCode releases: `7.8.8-bc.N` — upstream X.Y.Z, `-bc` marks ours, `N` counts our releases. An upstream bump lands as `7.8.9-bc.1`, etc.
- ~36 `package.json` files share the version string; the bump replaces the old literal once per file. The embedded CLI inherits it via `KILO_VERSION` (`packages/opencode/script/build.ts`), so extension About and `bharatcode --version` stay in sync.
- Tag the exact final release commit — if you amend after tagging, re-point the tag (`git tag -d` + re-create) or the push ships the old tree.

## What a release must prove (the script enforces)

- tree clean, branch synced with origin, tag not taken
- esbuild production gate RC=0
- zip audit per platform: zero `*.map`, only the target platform's binary under `extension/bin/`, `extension/LICENSE.txt` with the BharatCode line, manifest `bharatcode.bharatcode-vscode` at the new version
- sha256 recorded before anything else touches `out/`

## Pitfalls that bit once

- **Never `git add -A` while builds run** — `bin/` holds the 150-290MB CLI binary; committing it makes GitHub reject the push (100MB hard limit). `bin/bharatcode` and `bin/bharatcode.exe` stay untracked; only `bin/kilodev*` are tracked. If a large blob sneaks into a commit, `git rm --cached <file>` (one pathspec per call — a missing second pathspec fails the whole command), amend, re-point the tag, push.
- The factory emits unsuffixed names (`bharatcode-vscode-<plat>.vsix`); the script renames to `-<version>` suffixes on move.
- Builds rewrite `bun.lock` and flip `bin/kilodev.cmd` mode — fold lockfile drift into the release commit, and `git checkout --` the mode bit.
- `vsce` must be on PATH for the factory (`packages/kilo-vscode/node_modules/.bin`).
- No publish CI: builds run where the toolchain lives. Marketplace publish config stays intact for the future listing.
