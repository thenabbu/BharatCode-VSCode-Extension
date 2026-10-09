<p align="center">
  English | <a href="translations/README.zh.md">简体中文</a> | <a href="translations/README.zht.md">繁體中文</a> | <a href="translations/README.ko.md">한국어</a> | <a href="translations/README.de.md">Deutsch</a> | <a href="translations/README.es.md">Español</a> | <a href="translations/README.fr.md">Français</a> | <a href="translations/README.it.md">Italiano</a> | <a href="translations/README.da.md">Dansk</a> | <a href="translations/README.ja.md">日本語</a> | <a href="translations/README.pl.md">Polski</a> | <a href="translations/README.ru.md">Русский</a> | <a href="translations/README.bs.md">Bosanski</a> | <a href="translations/README.ar.md">العربية</a> | <a href="translations/README.no.md">Norsk</a> | <a href="translations/README.br.md">Português (Brasil)</a> | <a href="translations/README.th.md">ไทย</a> | <a href="translations/README.tr.md">Türkçe</a> | <a href="translations/README.uk.md">Українська</a> | <a href="translations/README.bn.md">বাংলা</a> | <a href="translations/README.gr.md">Ελληνικά</a> | <a href="translations/README.vi.md">Tiếng Việt</a>
</p>

<p align="center">
  <a href="https://bharatcode.ai"><img width="250" alt="BharatCode logo" src="packages/kilo-vscode/assets/icons/logo-outline-black.png" /></a>
</p>

<p align="center">The open source AI coding agent for VS Code, powered by bharatcode.ai.</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=bharatcode.bharatcode-vscode"><img src="https://raster.shields.io/badge/VS_Code_Marketplace-007ACC?style=flat&logo=visualstudiocode&logoColor=white" alt="VS Code Marketplace" height="20"></a>
  <a href="https://bharatcode.ai"><img src="https://raster.shields.io/badge/bharatcode.ai-ff6b35?style=flat&logoColor=white" alt="bharatcode.ai" height="20"></a>
  <a href="https://github.com/thenabbu/BharatCode-VSCode-Extension"><img src="https://raster.shields.io/badge/GitHub-BharatCode--VSCode--Extension-111113?style=flat&logo=github&logoColor=white" alt="GitHub" height="20"></a>
</p>

---

BharatCode is an AI coding agent that meets you where you work — in VS Code. It's open source and MIT licensed. You pick from two models — `qwen-3.8-27b` (262k context) and `deepseek-v4.1-flash` (1M context) — through a single API key from [bharatcode.ai](https://bharatcode.ai), and every request goes through the BharatCode API at `https://bharatcode.ai/api/model/v1`.

### Installation

1. Install the [BharatCode extension](vscode:extension/bharatcode.bharatcode-vscode) from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=bharatcode.bharatcode-vscode).
2. On first launch, BharatCode prompts you for your API key — create one at [bharatcode.ai](https://bharatcode.ai).
3. Start coding with AI that adapts to your workflow.

To build from source, see the [Contributing Guide](/CONTRIBUTING.md).

### Agents

BharatCode ships with specialized agents you switch between depending on the task. You can also build your own custom agents.

- **Code** - The default. Implements and edits code from natural language.
- **Plan** - Designs architecture and writes implementation plans before any code gets written.
- **Ask** - Answers questions about your codebase without touching any files.
- **Debug** - Troubleshoots and traces issues.

### What it does

- **Code generation** from natural language, across multiple files.
- **Inline autocomplete** with ghost-text suggestions and tab to accept.
- **Self-checking** so the agent reviews and corrects its own work.
- **Terminal and browser control** to run commands and automate the web.
- **BharatCode Marketplace** to install agents, skills, MCP servers, and plugins that extend what the agent can do.
- **Two models** with mid-task switching between them — `qwen-3.8-27b` (262k context) and `deepseek-v4.1-flash` (1M context) — so you can match latency, cost, and reasoning to the job.

### Documentation

For configuration and everything else, head over to [bharatcode.ai](https://bharatcode.ai).

### Contributing

Contributions are welcome from developers, writers, and everyone in between. Start with the [Contributing Guide](/CONTRIBUTING.md) for environment setup, coding standards, and how to open a pull request. See [RELEASING.md](RELEASING.md) for the VS Code extension release process.

Please review our [Code of Conduct](/CODE_OF_CONDUCT.md) before getting involved.

### License

MIT. You're free to use, modify, and distribute this code, including commercially, as long as you keep the attribution and license notices. See [License](/LICENSE).

### FAQ

<details>
<summary>Where does BharatCode come from?</summary>

BharatCode is a fork of [Kilo Code](https://github.com/Kilo-Org/kilocode), which is itself a fork of [OpenCode](https://github.com/anomalyco/opencode). It is rebranded and reconfigured for the bharatcode.ai provider.

</details>

---

**Repository** [GitHub](https://github.com/thenabbu/BharatCode-VSCode-Extension) · [bharatcode.ai](https://bharatcode.ai)
