<div align="center">

<img src="https://raw.githubusercontent.com/thenabbu/BharatCode-VSCode-Extension/bc/main/docs/assets/hero.png" alt="BharatCode for VS Code — the VS Code extension for bharatcode.ai" width="100%">

<br>

**The VS Code extension for BharatCode.** Sign in once and an agent is running against your BharatCode models — provider, endpoint and model list already configured. MIT licensed, no telemetry.

</div>

## What this is

BharatCode ([bharatcode.ai](https://bharatcode.ai)) is an LLM inference provider: one OpenAI-compatible endpoint, one key, two chat models. It serves models — it is not an agent.

This extension is the half that turns those models into a working agent in your editor. It ships the agent runtime inside the package and configures the provider for you, so there is no base URL to paste, no custom-provider block to write, no model list to maintain and no separate CLI to install.

> **Fork notice.** This extension is a fork of [Kilo Code](https://github.com/Kilo-Org/kilocode), itself a fork of [OpenCode](https://github.com/anomalyco/opencode). Upstream and its contributors did the heavy lifting — this fork brings their agent to the BharatCode provider. MIT licensed, attribution preserved. We do not claim their work as ours.

## Get started in three steps

1. **Install** — `ext install thenabbu.bharatcode-vscode` (VS Code 1.105.1+). Prefer a platform build? Grab the `.vsix` from [Releases](https://github.com/thenabbu/BharatCode-VSCode-Extension/releases/latest).
2. **Open a folder** — `File → Open Folder`. The agent runtime works against a workspace root, and sign-in starts from it.
3. **Connect** — BharatCode asks on first launch: **Sign in with BharatCode** (opens your browser, nothing to copy) or **paste an API key** from your account. Either works; the credential is stored by the extension backend, never in `settings.json`.

That is the whole onboarding. No second account, no CLI to install.

## What you get

- **Code generation across files**, applied as real edits you review as a diff.
- **Agents** — switch by intent: **Code** (implements), **Plan** (designs first), **Ask** (answers without touching files), **Debug** (traces failures). Custom agents as plain-text definitions.
- **Agent Manager** — several sessions side by side, each isolated in its own git worktree, so parallel work cannot collide.
- **Terminal and browser control** — it can run what it wrote and look at the result.
- **Self-checking** — the agent re-reads its own output and corrects before handing back.
- **MCP servers, skills and rules** in plain text, shaped per project.
- **Generated commit messages** from your actual staged diff, plus inline actions on any selection: explain, fix, improve, add to context.

## Two models, one key

| Model | Context | Reach for it when |
|---|---|---|
| `qwen-3.8-27b` | 262k | Everyday edits, fast turnaround, most tasks |
| `deepseek-v4.1-flash` | 1M | Whole-repo reasoning, long sessions, large files |

Switch mid-task from the model picker in the chat header. Both are served from a single OpenAI-compatible endpoint at `https://bharatcode.ai/api/model/v1`, and the list is read from that endpoint rather than a hardcoded catalogue.

## What this build does not do

- **No inline autocomplete.** BharatCode's models are chat-only (no fill-in-the-middle endpoint), so there is no ghost-text completion here. VS Code's own suggestions keep working beside the agent.
- **No telemetry, no session sharing, no presence.** Upstream's cloud coupling is removed, not hidden.
- **No 500-model catalogue.** One provider, two models. If you want a broad catalogue, upstream Kilo Code is a better fit.

Only `bharatcode.ai` is contacted, plus any BYOK provider you configure yourself. Full inventory: [PRIVACY.md](https://github.com/thenabbu/BharatCode-VSCode-Extension/blob/bc/main/PRIVACY.md).

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

Configuration, gates and per-package commands: [AGENTS.md](https://github.com/thenabbu/BharatCode-VSCode-Extension/blob/bc/main/AGENTS.md). Contributing: [CONTRIBUTING.md](https://github.com/thenabbu/BharatCode-VSCode-Extension/blob/bc/main/CONTRIBUTING.md). Please read the [Code of Conduct](https://github.com/thenabbu/BharatCode-VSCode-Extension/blob/bc/main/CODE_OF_CONDUCT.md) first.

## License

[MIT](https://github.com/thenabbu/BharatCode-VSCode-Extension/blob/bc/main/LICENSE) — use it, modify it, ship it commercially, keeping the attribution and licence notices.

<div align="center">
<sub><a href="https://bharatcode.ai">bharatcode.ai</a> · <a href="https://github.com/thenabbu/BharatCode-VSCode-Extension">GitHub</a> · <a href="https://marketplace.visualstudio.com/items?itemName=thenabbu.bharatcode-vscode">Marketplace</a></sub>
</div>
