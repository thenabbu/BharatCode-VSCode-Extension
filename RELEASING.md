# Releasing BharatCode

One script, one command, from the lab host:

```bash
ssh lab 'bash /data/ssd240/bharatcode-vscode-workspace/scripts/release.sh 7.8.8-bc.2'
```

It bumps the version trio (root + extension + CLI `package.json`, plus the ~33 sibling packages that share `7.8.8`), gates with production esbuild, builds both platform VSIXes (win32-x64, linux-x64), audits the zips (no sourcemaps, platform-exclusive `bin/`, LICENSE, manifest id/version), writes SHA256SUMS, tags, and pushes `bc/main` + the tag.

Then from anywhere with `gh`:

```bash
gh release create 7.8.8-bc.2 -R thenabbu/BharatCode-VSCode-Extension \
  --title "BharatCode v7.8.8-bc.2" --notes-file notes.md \
  /data/ssd240/vsix-out/kilo-vscode-win32-x64-7.8.8-bc.2.vsix \
  /data/ssd240/vsix-out/kilo-vscode-linux-x64-7.8.8-bc.2.vsix \
  /data/ssd240/vsix-out/SHA256SUMS-7.8.8-bc.2.txt
```

## Version scheme

- Fork of Kilo Code v7.8.8. BharatCode releases: `7.8.8-bc.N` (upstream X.Y.Z, `-bc` for BharatCode, `N` = our release count). Upstream bumps would be `7.8.9-bc.1`, etc.
- ~36 `package.json` files share the version string; the script's bump replaces the literal `"version": "7.8.8"` → new version, then `git add -A` — any package already moved off `7.8.8` keeps its own version (upgrade drift is visible in the commit diff).
- The embedded CLI reports its version from the same string via `KILO_VERSION` (`packages/opencode/script/build.ts:355`), so extension About and `kilo --version` stay in sync automatically.

## What a release must prove (the script enforces)

- tree clean, branch synced with origin, tag not taken
- esbuild production gate RC=0
- zip audit: zero `*.map`, `bin/kilo.exe` XOR `bin/kilo`, `extension/LICENSE.txt` with the BharatCode line, manifest `bharatcode.bharatcode-vscode` at the new version
- sha256 recorded before anything else touches `out/`

## CI stance

No publish CI. Builds and releases run where the toolchain lives (lab host); the repo keeps marketplace publish config intact for when we list it. Re-run `release.sh` after any merge to `bc/main` that should go out.
