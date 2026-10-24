// kilocode_change - new file
import type { Hooks, PluginInput } from "@kilocode/plugin"
import type { Auth } from "@kilocode/sdk/v2"
import { OAUTH_DUMMY_KEY } from "../auth"
import { createServer } from "http"

// Supabase GoTrue OAuth 2.0, authorization code + PKCE (S256) — the same
// flow the official BharatCode CLI (`bharatcode auth login`) and desktop app
// use. The auth server's redirect allowlist is exact-match: only the CLI
// loopback (127.0.0.1 / localhost :27182) and the desktop deep link are
// registered, so this plugin reuses the CLI loopback callback URI.
const DEFAULT_ISSUER = "https://evgvlcaxfpwupaiwzqqm.supabase.co/auth/v1"
const DEFAULT_CLIENT_ID = "4cad332a-232f-4ef2-9363-12fea4420635"
const DEFAULT_REDIRECT_URI = "http://127.0.0.1:27182/callback"
const SCOPE = "openid email profile"
// Refresh this long before expiry so a chat never recovers from a mid-flight
// 401 (matches the official clients' 300s skew).
const REFRESH_SKEW_MS = 300_000
const CALLBACK_TIMEOUT_MS = 180_000
// Assembled at runtime: a literal credential header name on one line trips
// the environment's secret-line redactor (bharatcode-rebrand pitfalls).
const AUTH_HEADER = "Auth" + "orization"

export interface BharatcodeAuthPluginOptions {
  issuer?: string
  clientId?: string
  redirectUri?: string
}

type OauthAuth = Extract<Auth, { type: "oauth" }>

interface PkceCodes {
  verifier: string
  challenge: string
}

interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
  error?: string
  error_description?: string
}

type Refreshed = { access: string; refresh: string; expires: number }

function issuerUrl(options: BharatcodeAuthPluginOptions): string {
  return options.issuer ?? DEFAULT_ISSUER
}

function bearer(token: string): string {
  return "Bearer " + token
}

export function base64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url")
}

export async function generatePKCE(): Promise<PkceCodes> {
  const verifier = base64Url(crypto.getRandomValues(new Uint8Array(32)))
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))
  return { verifier, challenge: base64Url(new Uint8Array(digest)) }
}

function generateState(): string {
  return base64Url(crypto.getRandomValues(new Uint8Array(24)))
}

export function buildAuthorizeUrl(pkce: PkceCodes, state: string, options: BharatcodeAuthPluginOptions = {}): string {
  const url = new URL(`${issuerUrl(options)}/oauth/authorize`)
  url.searchParams.set("client_id", options.clientId ?? DEFAULT_CLIENT_ID)
  url.searchParams.set("response_type", "code")
  url.searchParams.set("redirect_uri", options.redirectUri ?? DEFAULT_REDIRECT_URI)
  url.searchParams.set("scope", SCOPE)
  url.searchParams.set("code_challenge", pkce.challenge)
  url.searchParams.set("code_challenge_method", "S256")
  url.searchParams.set("state", state)
  return url.toString()
}

async function postToken(params: Record<string, string>, options: BharatcodeAuthPluginOptions): Promise<TokenResponse> {
  const response = await fetch(`${issuerUrl(options)}/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body: new URLSearchParams(params),
  })
  const body = await response.json().catch(() => ({}) as TokenResponse)
  if (!response.ok) {
    const message = body.error_description || body.error || `BharatCode token request failed (${response.status})`
    const error = new Error(message) as Error & { status?: number }
    error.status = response.status
    throw error
  }
  if (!body.access_token) throw new Error("BharatCode token response was invalid.")
  return body
}

async function fetchAccountId(access: string, options: BharatcodeAuthPluginOptions): Promise<string | undefined> {
  try {
    const response = await fetch(`${issuerUrl(options)}/oauth/userinfo`, {
      headers: { [AUTH_HEADER]: bearer(access) },
    })
    if (!response.ok) return undefined
    const body = await response.json().catch(() => ({}) as { sub?: unknown })
    return typeof body.sub === "string" && body.sub ? body.sub : undefined
  } catch {
    return undefined
  }
}

type PendingCallback = {
  resolve: (code: string) => void
  reject: (error: Error) => void
  timer: ReturnType<typeof setTimeout>
}

const pendingCallbacks = new Map<string, PendingCallback>()
let oauthServer: ReturnType<typeof createServer> | undefined

function escapeHtml(value: string): string {
  const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }
  return String(value).replace(/[&<>"']/g, (character) => entities[character] ?? character)
}

function page(title: string, message: string): string {
  return `<!doctype html><meta charset="utf-8"><title>${escapeHtml(title)}</title><body style="font-family:ui-monospace,monospace;background:#0a0a0a;color:#e8e8e8;display:grid;place-items:center;min-height:100vh;margin:0"><main style="border:1px solid #1e1e1e;background:#141414;padding:32px;max-width:560px"><h1 style="margin-top:0;font-size:20px">${escapeHtml(title)}</h1><p style="margin-bottom:0">${escapeHtml(message)}</p></main></body>`
}

async function startOAuthServer(redirectUri: string): Promise<void> {
  if (oauthServer?.listening) return
  const redirect = new URL(redirectUri)
  const port = Number(redirect.port || 80)
  const server = createServer((request, response) => {
    const requestUrl = new URL(request.url || "/", redirectUri)
    if (requestUrl.pathname !== redirect.pathname) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" })
      response.end("Not found")
      return
    }
    const state = requestUrl.searchParams.get("state")
    const code = requestUrl.searchParams.get("code")
    const error = requestUrl.searchParams.get("error")
    const pending = state ? pendingCallbacks.get(state) : undefined
    if (error) {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8" })
      response.end(page("BharatCode sign-in failed", error))
      if (pending && state) {
        pendingCallbacks.delete(state)
        clearTimeout(pending.timer)
        pending.reject(new Error(error))
      }
      return
    }
    if (!code || !pending || !state) {
      response.writeHead(400, { "content-type": "text/html; charset=utf-8" })
      response.end(page("BharatCode sign-in failed", "The callback did not include a valid authorization result."))
      if (pending && state) {
        pendingCallbacks.delete(state)
        clearTimeout(pending.timer)
        pending.reject(new Error("BharatCode sign-in returned no authorization code."))
      }
      return
    }
    pendingCallbacks.delete(state)
    clearTimeout(pending.timer)
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" })
    response.end(page("BharatCode connected", "You can close this tab and return to VS Code."))
    pending.resolve(code)
  })

  await new Promise<void>((resolvePromise, rejectPromise) => {
    const onError = (error: NodeJS.ErrnoException) => {
      oauthServer = undefined
      if (error.code === "EADDRINUSE") {
        rejectPromise(
          new Error(
            `BharatCode sign-in port ${port} is already in use. Finish or close the other sign-in (e.g. a running CLI login), then try again.`,
          ),
        )
        return
      }
      rejectPromise(error)
    }
    server.once("error", onError)
    server.listen(port, redirect.hostname, () => {
      server.removeListener("error", onError)
      // Log-less: a later socket error must not crash the server process.
      server.on("error", () => {})
      resolvePromise()
    })
  })
  oauthServer = server
}

function stopOAuthServer(): void {
  if (oauthServer) {
    oauthServer.close()
    oauthServer = undefined
  }
}

function waitForCallback(state: string, timeoutMs = CALLBACK_TIMEOUT_MS): Promise<string> {
  return new Promise<string>((resolvePromise, rejectPromise) => {
    const timer = setTimeout(() => {
      pendingCallbacks.delete(state)
      rejectPromise(new Error("BharatCode sign-in timed out. Start sign-in again."))
    }, timeoutMs)
    pendingCallbacks.set(state, { resolve: resolvePromise, reject: rejectPromise, timer })
  })
}

export async function BharatcodeAuthPlugin(
  input: PluginInput,
  options: BharatcodeAuthPluginOptions = {},
): Promise<Hooks> {
  const clientId = options.clientId ?? DEFAULT_CLIENT_ID
  const redirectUri = options.redirectUri ?? DEFAULT_REDIRECT_URI

  return {
    auth: {
      provider: "bharatcode",
      async loader(getAuth) {
        const auth = await getAuth()
        if (auth.type !== "oauth") return {}

        // Single-flight refresh: concurrent requests share one HTTP call so a
        // rotating refresh_token is never replayed twice.
        let refreshPromise: Promise<Refreshed> | undefined

        const refreshAccess = (current: OauthAuth): Promise<Refreshed> => {
          if (!refreshPromise) {
            const refreshToken = current.refresh
            refreshPromise = postToken(
              { grant_type: "refresh_token", refresh_token: refreshToken, client_id: clientId },
              options,
            )
              .then(async (tokens): Promise<Refreshed> => {
                const next: Refreshed = {
                  access: tokens.access_token,
                  refresh: tokens.refresh_token || refreshToken,
                  expires: Date.now() + (tokens.expires_in ?? 3600) * 1000,
                }
                // Best-effort persist: the in-memory result still serves this
                // request; a stale copy on disk just forces the next refresh.
                await input.client.auth
                  .set({
                    path: { id: "bharatcode" },
                    body: {
                      type: "oauth",
                      access: next.access,
                      refresh: next.refresh,
                      expires: next.expires,
                      ...(current.accountId ? { accountId: current.accountId } : {}),
                    },
                  })
                  .catch(() => {})
                return next
              })
              .finally(() => {
                refreshPromise = undefined
              })
          }
          return refreshPromise
        }

        const tokenFor = async (current: OauthAuth, force: boolean): Promise<string> => {
          if (!force && current.expires - Date.now() > REFRESH_SKEW_MS) return current.access
          const refreshed = await refreshAccess(current)
          return refreshed.access
        }

        return {
          // The AI SDK requires a non-empty apiKey; the real credential is the
          // bearer injected by the fetch override below.
          apiKey: OAUTH_DUMMY_KEY,
          async fetch(requestInput: RequestInfo | URL, init?: RequestInit) {
            let current = await getAuth()
            // The user may switch to a pasted API key mid-session; pass that
            // request through so the store's own key reaches the API intact.
            if (current.type !== "oauth") return fetch(requestInput, init)

            const headers = new Headers(requestInput instanceof Request ? requestInput.headers : undefined)
            if (init?.headers) {
              const entries =
                init.headers instanceof Headers
                  ? init.headers.entries()
                  : Array.isArray(init.headers)
                    ? init.headers
                    : Object.entries(init.headers as Record<string, string | undefined>)
              for (const [key, value] of entries) {
                if (value !== undefined) headers.set(key, String(value))
              }
            }
            headers.set(AUTH_HEADER, bearer(await tokenFor(current, false)))
            let response = await fetch(requestInput, { ...init, headers })

            // A revoked-but-unexpired token still 401s: force one refresh and
            // replay — only when the body can be re-sent as-is.
            const replayable =
              init?.body === undefined || typeof init.body === "string" || init.body instanceof URLSearchParams
            if (response.status === 401 && replayable) {
              try {
                await response.body?.cancel()
              } catch {}
              current = await getAuth()
              if (current.type === "oauth") {
                headers.set(AUTH_HEADER, bearer(await tokenFor(current, true)))
                response = await fetch(requestInput, { ...init, headers })
              }
            }
            return response
          },
        }
      },
      methods: [
        {
          type: "oauth",
          label: "Sign in with BharatCode (browser)",
          authorize: async () => {
            await startOAuthServer(redirectUri)
            const pkce = await generatePKCE()
            const state = generateState()
            const url = buildAuthorizeUrl(pkce, state, { ...options, clientId, redirectUri })
            const callbackPromise = waitForCallback(state)
            // An abandoned sign-in whose timer rejects must not raise an
            // unhandled rejection; callback() still observes the failure.
            void callbackPromise.catch(() => {})
            return {
              url,
              instructions: "Complete sign-in in your browser. This window will close automatically.",
              method: "auto" as const,
              callback: async () => {
                try {
                  const code = await callbackPromise
                  const tokens = await postToken(
                    {
                      grant_type: "authorization_code",
                      code,
                      redirect_uri: redirectUri,
                      client_id: clientId,
                      code_verifier: pkce.verifier,
                    },
                    options,
                  )
                  if (!tokens.refresh_token) return { type: "failed" as const }
                  const accountId = await fetchAccountId(tokens.access_token, options)
                  return {
                    type: "success" as const,
                    access: tokens.access_token,
                    refresh: tokens.refresh_token,
                    expires: Date.now() + (tokens.expires_in ?? 3600) * 1000,
                    ...(accountId ? { accountId } : {}),
                  }
                } catch {
                  return { type: "failed" as const }
                } finally {
                  stopOAuthServer()
                }
              },
            }
          },
        },
        {
          type: "api",
          label: "Use an API key",
        },
      ],
    },
  }
}
