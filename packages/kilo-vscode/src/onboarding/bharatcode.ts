import * as vscode from "vscode"
import type { KiloClient } from "@kilocode/sdk/v2/client"

export const BHARATCODE_BASE_URL = "https://bharatcode.ai/api/model/v1"
const SET_KEY_COMMAND = "kilo-code.new.setBharatcodeKey"
const KEY_SET_FLAG = "bharatcode.apiKeySet"

// GET /models on bharatcode.ai answers without auth, so it cannot verify a
// key; a 1-token chat completion can (bad key -> 401 invalid_credentials).
async function valid(key: string): Promise<boolean> {
  try {
    const res = await fetch(BHARATCODE_BASE_URL + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify({
        model: "qwen-3.8-27b",
        messages: [{ role: "user", content: "hi" }],
        max_tokens: 1,
      }),
      signal: AbortSignal.timeout(20_000),
    })
    return res.ok
  } catch (error) {
    console.warn("[BharatCode] BharatCode key validation failed:", error)
    return false
  }
}

async function ask(): Promise<string | undefined> {
  for (;;) {
    const raw = await vscode.window.showInputBox({
      title: "BharatCode API key",
      prompt: "Paste your API key from https://bharatcode.ai - stored by the extension backend, never in settings.",
      password: true,
      ignoreFocusOut: true,
      validateInput: (value) => (value.trim().length >= 8 ? undefined : "That does not look like an API key"),
    })
    if (!raw) return undefined
    const key = raw.trim()
    if (await valid(key)) return key
    const retry = await vscode.window.showErrorMessage(
      "BharatCode rejected that key (401). Copy the key from your BharatCode account and try again.",
      "Retry",
    )
    if (retry !== "Retry") return undefined
  }
}

/** First-run flow: no key stored -> prompt -> validate live -> auth.set("bharatcode"). */
export async function ensureKey(ctx: vscode.ExtensionContext, client: () => Promise<KiloClient>): Promise<void> {
  if (ctx.globalState.get<boolean>(KEY_SET_FLAG)) return
  const key = await ask()
  if (!key) return
  try {
    const c = await client()
    await c.auth.set({ providerID: "bharatcode", auth: { type: "api", key } }, { throwOnError: true })
    await ctx.globalState.update(KEY_SET_FLAG, true)
    void vscode.window.showInformationMessage("BharatCode connected - open the sidebar chat to start.")
  } catch (error) {
    console.warn("[BharatCode] BharatCode key save failed:", error)
    void vscode.window.showErrorMessage("Could not save the BharatCode key: " + String(error))
  }
}

/** Registers the palette command and kicks off the first-run prompt. */
export function start(ctx: vscode.ExtensionContext, client: () => Promise<KiloClient>): void {
  ctx.subscriptions.push(
    vscode.commands.registerCommand(SET_KEY_COMMAND, async () => {
      await ctx.globalState.update(KEY_SET_FLAG, false)
      await ensureKey(ctx, client)
    }),
  )
  void ensureKey(ctx, client).catch((error) => console.warn("[BharatCode] BharatCode onboarding:", error))
}
