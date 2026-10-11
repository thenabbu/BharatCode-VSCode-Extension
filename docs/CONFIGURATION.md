# Configuring BharatCode

Everything you can change, where it lives, and what it does. The out-of-the-box flow needs zero configuration: install, paste your API key, chat.

## API key

On first launch the extension prompts for your API key and validates it live against the endpoint before storing it.

- Create a key at [bharatcode.ai](https://bharatcode.ai)
- Change it any time: Command Palette → `BharatCode: Set API Key`
- The key is stored by the extension backend's auth store — it never appears in `settings.json`, and it is only sent to the provider you are connecting (see [PRIVACY.md](../PRIVACY.md))
- The onboarding prompt is skipped once a key is stored

## Endpoint and models

All requests go to a single OpenAI-compatible endpoint:

| Item | Value |
|---|---|
| Base URL | `https://bharatcode.ai/api/model/v1` |
| Discovery | `GET /models` (answers without auth) |
| Chat | `POST /chat/completions`, `POST /responses` |

| Model | Context | Good for |
|---|---|---|
| `qwen-3.8-27b` | 262k | everyday coding, fast turnaround |
| `deepseek-v4.1-flash` | 1M | very large contexts, long sessions |

Pick the active model from the model picker in the chat header — you can switch mid-task. To change the default for new sessions, edit the VS Code settings searchable as **Default model provider ID / model ID** (setting keys `kilo-code.new.model.providerID` and `kilo-code.new.model.modelID`; the `kilo-code.*` namespace is the extension's stable id namespace and stays for compatibility).

## VS Code settings worth knowing

Open Settings and search `BharatCode`. The most used ones:

| Setting | What it does |
|---|---|
| `BharatCode: Set API Key` (command) | Replace the stored API key |
| Default model provider/model | Model used for new sessions |
| Inline autocomplete provider/model | BYOK completion provider — see below |
| Auto-approve | Start sessions with the main auto-approve toggle on |
| Attention notifications/sounds | Alert when a task completes, errors, or needs input |
| Font size | Webview UI font size |
| Language | Override the BharatCode UI language |

All 40 contributed settings are documented inline in the Settings UI.

## Config files

The backend loads configuration in layers (later wins):

1. **Global config** — `~/.config/kilo/` (honours `$XDG_CONFIG_HOME`; Windows: `%APPDATA%`). Candidate files, in load order: `config.json`, `kilo.json`, `kilo.jsonc`, then legacy `opencode.json` / `opencode.jsonc`.
2. **Project config** — `kilo.json` (or `opencode.json`) discovered from the project root and worktrees. Project config is treated as untrusted: environment substitution and file references are confined to the project.
3. **Environment overrides**:
   - `KILO_CONFIG_DIR` — point the backend at a different global config directory
   - `KILO_CONFIG` — load one explicit config file
   - `KILO_CONFIG_CONTENT` — inline config JSON (used by the extension at spawn)
   - `KILO_DISABLE_PROJECT_CONFIG` — ignore project-level config entirely

Example global `kilo.json`:

```json
{
  "model": { "providerID": "bharatcode", "modelID": "qwen-3.8-27b" }
}
```

Reload after edits: Command Palette → `BharatCode: Reload Config and Skills`.

## Inline autocomplete

BharatCode's two models serve chat completions only — there is no fill-in-the-middle endpoint, so they cannot drive ghost-text suggestions. Inline autocomplete works through a bring-your-own-key provider instead:

1. Settings → search `autocomplete provider` → pick `mistral` or `inception`
2. Pick the matching autocomplete model
3. Connect that provider's API key (the Providers page, or its own auth flow)

The bundled gateway path is intentionally disabled in this build — the provider list shows it as *BharatCode gateway (disabled)*.

## What this build disables on purpose

The extension ships with upstream cloud coupling switched off: telemetry, session sharing, presence, the internal extension marketplace, and Kilo's model-catalog fetch. Only `bharatcode.ai` (plus any BYOK keys you add) is contacted. Details in [PRIVACY.md](../PRIVACY.md).

## Troubleshooting

| Symptom | Fix |
|---|---|
| Key rejected at onboarding | Re-copy the key from bharatcode.ai, run `BharatCode: Set API Key` |
| No models listed | Check network access to `https://bharatcode.ai/api/model/v1/models` (it answers without auth) |
| Autocomplete never appears | Expected without a BYOK provider key — see [Inline autocomplete](#inline-autocomplete) |
| Config edits ignored | Run `BharatCode: Reload Config and Skills`; check for a project `kilo.json` overriding your global file |
