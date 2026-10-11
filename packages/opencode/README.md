# BharatCode Agent Runtime (`packages/opencode/`)

The agent runtime and CLI behind BharatCode: agent loop, tool execution, session management, and an HTTP + SSE server. It is the core engine of the [BharatCode VS Code extension](https://github.com/thenabbu/BharatCode-VSCode-Extension), which bundles the built binary and spawns it as a local backend.

## Lineage

This package is a fork of the [Kilo Code CLI](https://github.com/Kilo-Org/kilocode), itself forked from upstream [OpenCode](https://github.com/anomalyco/opencode). It is rebranded for [bharatcode.ai](https://bharatcode.ai) and serves its two chat models, `qwen-3.8-27b` and `deepseek-v4.1-flash`.

## Publishing

This fork does not publish to npm or any registry. The built binary ships inside the platform `.vsix` files on the [Releases page](https://github.com/thenabbu/BharatCode-VSCode-Extension/releases); install the extension from there.

## Development

Commands run from the repository root unless noted:

| Command | Description |
|---|---|
| `bun install` | Install workspace dependencies |
| `bun dev` | Run the CLI from local source |
| `bun test` | Run this package's tests |
| `bun run typecheck` | Type-check this package |

Build output is written to `dist/**/bin/bharatcode` (`.exe` on Windows), staged into the extension at `packages/kilo-vscode/bin/bharatcode`.

## Documentation

- [Repository README](../README.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [Testing Guide](../TESTING.md)
- [bharatcode.ai](https://bharatcode.ai)

## License

MIT
