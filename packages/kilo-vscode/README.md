<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=bharatcode.bharatcode-vscode"><img src="https://raster.shields.io/badge/VS_Code_Marketplace-007ACC?style=flat&logo=visualstudiocode&logoColor=white" alt="VS Code Marketplace" height="20"></a>
  <a href="https://bharatcode.ai"><img src="https://raster.shields.io/badge/bharatcode.ai-ff6b35?style=flat&logoColor=white" alt="bharatcode.ai" height="20"></a>
</p>

<p align="center">
  <strong>BharatCode is an AI coding agent for VS Code.</strong><br>
  Generate code, automate tasks, and run terminal commands with qwen-3.8-27b and deepseek-v4.1-flash, the two models served by bharatcode.ai.
</p>

## Key Features

- **Code Generation:** BharatCode can generate code using natural language.
- **Inline Autocomplete:** Get intelligent code completions as you type, powered by AI.
- **Task Automation:** BharatCode can automate repetitive coding tasks to save time.
- **Automated Refactoring:** BharatCode can refactor and improve existing code efficiently.
- **MCP Server Marketplace:** BharatCode can find and use MCP servers to extend the agent's capabilities.
- **Multi Mode**: Plan, Code, Debug, Ask, and Architect modes built in, plus your own custom modes.

## Get Started

1. Install the BharatCode extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=bharatcode.bharatcode-vscode).
2. On first launch, BharatCode prompts you for your API key. Create one at [bharatcode.ai](https://bharatcode.ai) — all model requests go through the BharatCode API at `https://bharatcode.ai/api/model/v1`.
3. Start coding with AI that adapts to your workflow.

## Developer Setup

If you want to contribute or modify the extension locally, see the [DEVELOPMENT.md](/DEVELOPMENT.md) file for build and setup instructions.

### Snapshot Builds

To build and share a development snapshot of the extension:

```bash
# Run from packages/kilo-vscode/

# Build only (outputs VSIX to system temp dir)
bun run snapshot:build

# Build and install directly into VS Code
bun run snapshot:install
```

The snapshot version embeds the current commit SHA and your git username (from `git config user.name`), e.g. `7.0.47-snapshot+8ff7f2d02.yourname`.

## Contributing

We welcome contributions from developers, writers, and enthusiasts!
To get started, please read our [Contributing Guide](/CONTRIBUTING.md). It includes details on setting up your environment, coding standards, types of contribution and how to submit pull requests.

## Code of Conduct

Our community is built on respect, inclusivity, and collaboration. Please review our [Code of Conduct](/CODE_OF_CONDUCT.md) to understand the expectations for all contributors and community members.

## License

This project is licensed under the [MIT License](/LICENSE).
You're free to use, modify, and distribute this code, including for commercial purposes as long as you include proper attribution and license notices. See [License](/LICENSE).

Thanks to all the contributors who help make BharatCode better!

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/mcowger">
        <img src="https://avatars.githubusercontent.com/u/1929548?size=100" width="100" height="100" alt="mcowger" style="border-radius: 50%;" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/bhaktatejas922">
        <img src="https://avatars.githubusercontent.com/u/26863466?size=100" width="100" height="100" alt="bhaktatejas922" style="border-radius: 50%;" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/NyxJae">
        <img src="https://avatars.githubusercontent.com/u/52313587?size=100" width="100" height="100" alt="NyxJae" style="border-radius: 50%;" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Aikiboy123">
        <img src="https://avatars.githubusercontent.com/u/161741275?size=100" width="100" height="100" alt="Aikiboy123" style="border-radius: 50%;" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/cobra91">
        <img src="https://avatars.githubusercontent.com/u/1060585?size=100" width="100" height="100" alt="cobra91" style="border-radius: 50%;" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/ivanarifin">
        <img src="https://avatars.githubusercontent.com/u/111653938?size=100" width="100" height="100" alt="ivanarifin" style="border-radius: 50%;" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/PeterDaveHello">
        <img src="https://avatars.githubusercontent.com/u/3691490?size=100" width="100" height="100" alt="PeterDaveHello" style="border-radius: 50%;" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/possible055">
        <img src="https://avatars.githubusercontent.com/u/38576169?size=100" width="100" height="100" alt="possible055" style="border-radius: 50%;" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/seuros">
        <img src="https://avatars.githubusercontent.com/u/2394703?size=100" width="100" height="100" alt="seuros" style="border-radius: 50%;" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/thenabbu/BharatCode-VSCode-Extension/graphs/contributors">
        <b>more ...</b>
      </a>
    </td>
  </tr>
</table>
