# BharatCode Privacy Policy

Last Updated: October 11, 2026

BharatCode is a local VS Code extension. This page is a plain breakdown of where your data goes — and where it doesn't.

## Where your data goes (and where it doesn't)

- **Code and files**: The agent reads files in your workspace when you ask it to. The relevant context is transmitted to the model endpoint you are using — `https://bharatcode.ai/api/model/v1` by default — to generate responses.
- **Prompts and chat**: Your prompts and the project context they reference are sent to that same endpoint. If you configure an additional bring-your-own-key provider (for example for inline autocomplete), context is sent to that provider instead when it is active.
- **Commands**: Commands the agent runs execute on your local machine. Output that the agent needs in order to continue may be included in requests to the model endpoint.
- **API keys**: Your API key is stored locally by the extension backend and is only sent to the provider it belongs to. It is never written to `settings.json`, never sent to us as a publisher, and never shared with third parties.
- **Telemetry and cloud features**: This build ships with upstream telemetry, session sharing, presence, and extension-marketplace traffic switched off at spawn time. No usage data is uploaded.
- **Transcripts of this policy**: If this policy changes, we will update this page and note the change in the release notes.

## Your choices and control

- You can delete your stored API key at any time from the extension (Command Palette → `BharatCode: Set API Key`) or by clearing the backend's auth store.
- You choose what the agent reads: it operates inside your workspace and asks before acting unless you enable auto-approve.
- Bring-your-own-key providers are governed by their own privacy policies — read those before connecting a key.

## Security and updates

No system is 100% secure. We take reasonable measures to protect what we do handle, and this policy will be updated if our practices change.

## Contact

Questions about privacy: open an issue on [GitHub](https://github.com/thenabbu/BharatCode-VSCode-Extension/issues).

---

By using BharatCode, you agree to this Privacy Policy.
