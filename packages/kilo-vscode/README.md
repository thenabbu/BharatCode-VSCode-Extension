<div align="center">

<img src="https://raw.githubusercontent.com/thenabbu/BharatCode-VSCode-Extension/bc/main/docs/assets/hero.svg" alt="BharatCode — AI coding agent for VS Code" width="100%">

<br>

<img src="https://vsmarketplacebadges.dev/version-short/thenabbu.bharatcode-vscode.svg" alt="Marketplace version">
<img src="https://vsmarketplacebadges.dev/installs-short/thenabbu.bharatcode-vscode.svg" alt="Installs">
<img src="https://img.shields.io/badge/license-MIT-5e5652?labelColor=1c1410" alt="MIT licensed">

</div>

**BharatCode is an AI coding agent that lives inside VS Code.** It reads your project, edits files across it, runs terminal commands, and drives a browser to check its own work — powered by [bharatcode.ai](https://bharatcode.ai) with two models: `qwen-3.8-27b` (262k context) and `deepseek-v4.1-flash` (1M context).

> **Fork notice.** BharatCode is a fork of [Kilo Code](https://github.com/Kilo-Org/kilocode), itself a fork of [OpenCode](https://github.com/anomalyco/opencode). Upstream and its contributors did the heavy lifting — this fork brings their agent to the BharatCode platform. MIT licensed, attribution preserved. We do not claim their work as ours.

## Get started in three steps

1. **Install** — `ext install thenabbu.bharatcode-vscode` from the Extensions view (VS Code 1.105.1+). Prefer a platform build? Grab the `.vsix` from [Releases](https://github.com/thenabbu/BharatCode-VSCode-Extension/releases/latest).
2. **Connect** — create a key at [bharatcode.ai](https://bharatcode.ai) and paste it when BharatCode asks. That is the entire onboarding: no second account, no CLI to install.
3. **Chat** — open the BharatCode sidebar and describe what you want.

## What it does

- **Code generation** across multiple files, applied as real edits you review as a diff.
- **Agents** — switch by intent: **Code** (implements), **Plan** (designs first), **Ask** (answers without touching files), **Debug** (traces failures). Bring your own custom agents as plain-text definitions.
- **Agent Manager** — several sessions side by side, each isolated in its own git worktree, so parallel work cannot collide.
- **Terminal and browser control** — it can run what it wrote and look at the result.
- **Self-checking** — the agent re-reads its own output and corrects before handing back.
- **MCP servers, skills and rules** in plain text, shaped per project.
- **Generated commit messages** from your actual staged diff.
- **Inline actions** on any selection: explain, fix, improve, add to context.

## Inline autocomplete — the honest version

BharatCode's two models are **chat-only**; there is no fill-in-the-middle endpoint, so they cannot drive ghost text. Inline autocomplete works only if you connect your own completion provider — **Mistral** or **Inception** — through Settings → autocomplete provider. Your BharatCode key still covers all chat, editing and agent work.

## Two models, one key

| Model | Context | Reach for it when |
|---|---|---|
| `qwen-3.8-27b` | 262k | Everyday edits, fast turnaround, most tasks |
| `deepseek-v4.1-flash` | 1M | Whole-repo reasoning, long sessions, large files |

Switch mid-task from the model picker in the chat header. Both are served from a single OpenAI-compatible endpoint at `https://bharatcode.ai/api/model/v1`.

## Private by default

This build strips upstream's cloud coupling rather than hiding it: no telemetry, no session sharing, no presence, no upstream model-catalogue fetch. Only `bharatcode.ai` is contacted — plus any BYOK provider you configure yourself. Your API key lives in the extension backend's auth store, never in `settings.json`. Details: [PRIVACY.md](https://github.com/thenabbu/BharatCode-VSCode-Extension/blob/bc/main/PRIVACY.md).

## Developer setup

```bash
bun install
bun run extension           # build + launch VS Code in dev mode
bun run extension:isolated  # same, in a clean profile under .kilo-dev/
```

Building a single-platform `.vsix`:

```bash
cd packages/kilo-vscode
bun run package
```

Snapshot builds for sharing a development cut:

```bash
cd packages/kilo-vscode
bun run snapshot:build      # VSIX into your temp dir
bun run snapshot:install    # build and install into VS Code
```

The snapshot version embeds the commit SHA and your git username, e.g. `7.0.47-snapshot+8ff7f2d02.yourname`.

Configuration, gates and per-package commands: [AGENTS.md](https://github.com/thenabbu/BharatCode-VSCode-Extension/blob/bc/main/AGENTS.md).

## Contributing

Contributions are welcome from developers and writers alike. Start with the [Contributing Guide](https://github.com/thenabbu/BharatCode-VSCode-Extension/blob/bc/main/CONTRIBUTING.md), and please read the [Code of Conduct](https://github.com/thenabbu/BharatCode-VSCode-Extension/blob/bc/main/CODE_OF_CONDUCT.md) first.

## License

[MIT](https://github.com/thenabbu/BharatCode-VSCode-Extension/blob/bc/main/LICENSE) — use it, modify it, ship it commercially, keeping the attribution and licence notices.

<div align="center">
<sub><a href="https://bharatcode.ai">bharatcode.ai</a> · <a href="https://github.com/thenabbu/BharatCode-VSCode-Extension">GitHub</a> · <a href="https://marketplace.visualstudio.com/items?itemName=thenabbu.bharatcode-vscode">Marketplace</a></sub>
</div>
