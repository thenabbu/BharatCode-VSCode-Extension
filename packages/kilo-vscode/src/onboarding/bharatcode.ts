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

type AuthChoice = "oauth" | "api"

/** First-run picker: OAuth (recommended) or a pasted API key — user's call. */
async function choose(): Promise<AuthChoice | undefined> {
  const picked = await vscode.window.showQuickPick(
    [
      {
        label: "$(account) Sign in with BharatCode",
        description: "Recommended - opens your browser, no API key needed",
        choice: "oauth" as const,
      },
      {
        label: "$(key) Use an API key",
        description: "Paste a key from bharatcode.ai instead",
        choice: "api" as const,
      },
    ],
    {
      title: "Connect BharatCode",
      placeHolder: "BharatCode is the primary provider of this extension",
      ignoreFocusOut: true,
    },
  )
  return picked?.choice
}

/**
 * Supabase OAuth via the backend's bharatcode auth method (PKCE + loopback
 * callback). Mirrors the settings-page connect flow: authorize -> open the
 * browser -> block on the callback -> reset the backend so the provider
 * picks the session up immediately.
 */
async function signInWithBrowser(client: () => Promise<KiloClient>): Promise<void> {
  const c = await client()
  const directory = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
  const scope = directory ? { directory } : {}
  const { data: authorization } = await c.provider.oauth.authorize(
    { providerID: "bharatcode", method: 0, ...scope },
    { throwOnError: true },
  )
  if (!authorization?.url) throw new Error("BharatCode sign-in did not return a URL.")
  const opened = await vscode.env.openExternal(vscode.Uri.parse(authorization.url))
  if (!opened) throw new Error("Could not open the browser for BharatCode sign-in.")
  await c.provider.oauth.callback({ providerID: "bharatcode", method: 0, ...scope }, { throwOnError: true })
  await c.global.dispose().catch(() => {})
}

/**
 * First-run flow: nothing stored -> offer OAuth or API key -> run the picked
 * path -> auth (type oauth or api) lands in the backend store.
 */
export async function ensureKey(ctx: vscode.ExtensionContext, client: () => Promise<KiloClient>): Promise<void> {
  if (ctx.globalState.get<boolean>(KEY_SET_FLAG)) return
  for (;;) {
    const choice = await choose()
    if (!choice) return
    try {
      if (choice === "oauth") {
        await signInWithBrowser(client)
      } else {
        const key = await ask()
        if (!key) continue
        const c = await client()
        await c.auth.set({ providerID: "bharatcode", auth: { type: "api", key } }, { throwOnError: true })
      }
      await ctx.globalState.update(KEY_SET_FLAG, true)
      void vscode.window.showInformationMessage("BharatCode connected - open the sidebar chat to start.")
      return
    } catch (error) {
      console.warn("[BharatCode] BharatCode sign-in failed:", error)
      const retry = await vscode.window.showErrorMessage(
        "BharatCode sign-in failed: " + String((error as Error)?.message ?? error),
        "Try again",
      )
      if (retry !== "Try again") return
    }
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
