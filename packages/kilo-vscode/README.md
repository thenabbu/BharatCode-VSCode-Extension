<div align="center">

<img src="https://raw.githubusercontent.com/thenabbu/BharatCode-VSCode-Extension/bc/main/docs/assets/hero.png" alt="BharatCode for VS Code — the VS Code extension for bharatcode.ai" width="100%">

<br>

### Your coding agent, ready in one click

**BharatCode for VS Code** installs the whole agent for you — runtime, provider, endpoint and models included. Sign in, and you are writing with it. MIT licensed, no telemetry, no second account.

</div>

---

## Three steps to your first task

**1. Click install.** VS Code downloads the extension and adds the agent to your editor — around 160–180 MB, because the whole runtime travels inside it.

**2. Open a folder.** `File → Open Folder`. Your project is what the agent reads and edits.

**3. Sign in.** BharatCode greets you on first launch with **both** ways in:

| | **Sign in with BharatCode** | **API key** |
|---|---|---|
| **Best for** | Nearly everyone | Scripts, shared machines, CI |
| **How** | A browser tab opens; click approve; done | Paste a key from your bharatcode.ai account |
| **Typing** | None | One paste |

Either path works on first run. Your credential stays in the extension backend, out of `settings.json` and out of your repo.

Missed the prompt? `BharatCode: Connect Account` brings it back.

That is the entire setup: the base URL, provider, endpoint and model list all come preconfigured.

---

## What it does

**Writes across your project.** Describe the change; it edits the files, shows a diff, and you approve what lands.

**Switches hats with you.** *Code* implements, *Plan* designs before writing, *Ask* answers from your codebase, *Debug* traces a failure to its cause. Custom agents are plain-text definitions you write yourself.

**Runs several tasks at once.** Agent Manager puts sessions side by side, each in its own git worktree, so parallel work stays out of its own way.

**Runs what it wrote.** It has the terminal and a browser, so it can execute the build, read the error, and fix it before handing back.

**Checks its own work.** It re-reads what it produced and corrects before you see it.

**Learns your project.** MCP servers, skills and rules live in plain text and can be scoped per project.

**Handles the small stuff.** Commit messages written from your staged diff, plus inline actions on any selection: explain, fix, improve, add to context.

---

## The models

Two models ship with your BharatCode account, and the extension wires both up for you. Switch mid-task from the picker in the chat header.

| Model | Context | Best at |
|---|---|---|
| `qwen-3.8-27b` | 262k | Everyday edits and fast iteration |
| `deepseek-v4.1-flash` | 1M | Whole-repo reasoning and long sessions |

Both come from one OpenAI-compatible endpoint at `https://bharatcode.ai/api/model/v1`, and the list is read live from it.

**Prefer another model?** Add it yourself. Settings → Providers → **Custom provider** takes a base URL, a key and a model list, with OpenAI, OpenAI-compatible and Anthropic endpoints all supported. Your own key for OpenAI, Anthropic or anything else you run sits alongside the BharatCode models you already have.

---

## Settings worth knowing

| Setting | What it does |
|---|---|
| `kilo-code.defaultModel` | Model new tasks start on |
| `kilo-code.autoApprove` | Whether edits and commands run without asking |
| `kilo-code.language` | Interface language |
| `kilo-code.fontSize` | Chat text size |

35 settings ship in total, documented inline in the Settings UI. Agent config — permissions, instructions, MCP servers, custom agents — lives in `kilo.json`, project-level or global at `~/.config/kilo/`.

Full reference: [docs/CONFIGURATION.md](https://github.com/thenabbu/BharatCode-VSCode-Extension/blob/bc/main/docs/CONFIGURATION.md).

---

## Where this comes from

A fork of [Kilo Code](https://github.com/Kilo-Org/kilocode), itself a fork of [OpenCode](https://github.com/anomalyco/opencode). Those projects and their contributors built the agent this package runs, and the credit is theirs — MIT licensed, attribution preserved in the licence. This fork brings that agent to the BharatCode provider and reconfigures the provider layer so bharatcode.ai is wired in from the start.

Read-only questions, bug reports and feature ideas: [GitHub Issues](https://github.com/thenabbu/BharatCode-VSCode-Extension/issues). Full docs, contribution guide and privacy statement are in the [repository](https://github.com/thenabbu/BharatCode-VSCode-Extension).

## License

[MIT](https://github.com/thenabbu/BharatCode-VSCode-Extension/blob/bc/main/LICENSE) — use it, modify it, ship it commercially, keeping the attribution and licence notices.

<div align="center">
<sub><a href="https://bharatcode.ai">bharatcode.ai</a> · <a href="https://github.com/thenabbu/BharatCode-VSCode-Extension">GitHub</a> · <a href="https://marketplace.visualstudio.com/items?itemName=thenabbu.bharatcode-vscode">Marketplace</a></sub>
</div>
