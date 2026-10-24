// kilocode_change - new file
import { describe, expect, test } from "bun:test"
import { BharatcodeAuthPlugin, buildAuthorizeUrl, generatePKCE } from "../../src/plugin/bharatcode"
import { OAUTH_DUMMY_KEY } from "../../src/auth"

const TEST_REDIRECT_PORT = 39771
const TEST_REDIRECT_URI = `http://127.0.0.1:${TEST_REDIRECT_PORT}/callback`

function makeInput() {
  const setCalls: Array<Record<string, unknown>> = []
  return {
    client: {
      auth: {
        set: async (request: Record<string, unknown>) => {
          setCalls.push(request)
        },
      },
    } as any,
    setCalls,
  }
}

type TokenRoute = {
  grant_type?: string
  access_token?: string
  refresh_token?: string
  expires_in?: number
  error?: string
}

/** Mock Supabase issuer: token endpoint records form bodies, userinfo answers a sub. */
function makeIssuer(routes: (form: URLSearchParams) => TokenRoute | undefined) {
  const calls: URLSearchParams[] = []
  const server = Bun.serve({
    port: 0,
    fetch: (request) => {
      const url = new URL(request.url)
      if (url.pathname === "/auth/v1/oauth/token") {
        return request.text().then((text) => {
          const form = new URLSearchParams(text)
          calls.push(form)
          const route = routes(form)
          if (!route) return Response.json({ error: "unexpected_grant" }, { status: 400 })
          if (route.error) return Response.json({ error: route.error }, { status: 400 })
          return Response.json(route)
        })
      }
      if (url.pathname === "/auth/v1/oauth/userinfo") {
        return Response.json({ sub: "user-abc", email: "a@b.c" })
      }
      return new Response("not found", { status: 404 })
    },
  })
  return { server, calls, issuer: `http://127.0.0.1:${server.port}/auth/v1` }
}

describe("plugin.bharatcode", () => {
  test("generatePKCE produces a fresh S256 challenge per verifier", async () => {
    const first = await generatePKCE()
    const second = await generatePKCE()
    expect(first.verifier.length).toBeGreaterThanOrEqual(43)
    expect(first.verifier).not.toBe(second.verifier)
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(first.verifier))
    expect(first.challenge).toBe(Buffer.from(digest).toString("base64url"))
  })

  test("buildAuthorizeUrl carries every Supabase parameter", async () => {
    const pkce = await generatePKCE()
    const url = new URL(buildAuthorizeUrl(pkce, "state-123", { redirectUri: TEST_REDIRECT_URI }))
    expect(url.origin + url.pathname).toBe("https://evgvlcaxfpwupaiwzqqm.supabase.co/auth/v1/oauth/authorize")
    expect(url.searchParams.get("client_id")).toBe("4cad332a-232f-4ef2-9363-12fea4420635")
    expect(url.searchParams.get("response_type")).toBe("code")
    expect(url.searchParams.get("redirect_uri")).toBe(TEST_REDIRECT_URI)
    expect(url.searchParams.get("scope")).toBe("openid email profile")
    expect(url.searchParams.get("code_challenge")).toBe(pkce.challenge)
    expect(url.searchParams.get("code_challenge_method")).toBe("S256")
    expect(url.searchParams.get("state")).toBe("state-123")
  })

  test("browser flow: loopback callback exchanges the code and returns a renewable session", async () => {
    const { server, calls, issuer } = makeIssuer((form) => {
      if (form.get("grant_type") === "authorization_code") {
        return { access_token: "access-1", refresh_token: "refresh-1", expires_in: 3600 }
      }
      return undefined
    })
    try {
      const input = makeInput()
      const hooks = await BharatcodeAuthPlugin(input as any, { issuer, redirectUri: TEST_REDIRECT_URI })
      const methods = hooks.auth!.methods
      expect(methods.map((m) => m.type)).toEqual(["oauth", "api"])

      const oauth = methods[0] as Extract<(typeof methods)[number], { type: "oauth" }>
      const authorization = await oauth.authorize()
      expect(authorization.method).toBe("auto")
      const state = new URL(authorization.url).searchParams.get("state")!

      // Simulate the browser landing on our loopback listener.
      const redirect = await fetch(`${TEST_REDIRECT_URI}?code=authcode-1&state=${state}`)
      expect(redirect.status).toBe(200)

      if (authorization.method !== "auto") throw new Error("expected auto callback method")
      const outcome = await (authorization as any).callback()
      expect(outcome.type).toBe("success")
      if (outcome.type !== "success" || !("access" in outcome)) throw new Error("expected oauth success")
      expect(outcome.access).toBe("access-1")
      expect(outcome.refresh).toBe("refresh-1")
      expect(outcome.expires).toBeGreaterThan(Date.now())
      expect(outcome.accountId).toBe("user-abc")

      const form = calls.find((entry) => entry.get("grant_type") === "authorization_code")!
      expect(form.get("code")).toBe("authcode-1")
      expect(form.get("redirect_uri")).toBe(TEST_REDIRECT_URI)
      expect(form.get("code_verifier")).toBeTruthy()
      expect(form.get("client_id")).toBe("4cad332a-232f-4ef2-9363-12fea4420635")
    } finally {
      server.stop(true)
    }
  })

  test("loopback rejects a mismatched state", async () => {
    const { server, issuer } = makeIssuer(() => undefined)
    try {
      const hooks = await BharatcodeAuthPlugin(makeInput() as any, { issuer, redirectUri: TEST_REDIRECT_URI })
      const methods = hooks.auth!.methods
      const oauth = methods[0] as Extract<(typeof methods)[number], { type: "oauth" }>
      const authorization = await oauth.authorize()
      const redirect = await fetch(`${TEST_REDIRECT_URI}?code=evil&state=not-the-state`)
      expect(redirect.status).toBe(400)
      // Release the real pending entry so the module state stays clean.
      const state = new URL(authorization.url).searchParams.get("state")!
      await fetch(`${TEST_REDIRECT_URI}?code=release&state=${state}`)
      if (authorization.method !== "auto") throw new Error("expected auto callback method")
      await (authorization as any).callback()
    } finally {
      server.stop(true)
    }
  })

  test("loader with an api-key session returns no options (store key passes through)", async () => {
    const hooks = await BharatcodeAuthPlugin(makeInput() as any, {})
    const loader = hooks.auth!.loader!
    const options = await loader(() => Promise.resolve({ type: "api", key: "sk-pasted" } as any), {} as any)
    expect(options).toEqual({})
  })

  test("loader refreshes an expiring token, persists the rotation, and sends the bearer", async () => {
    const { server, calls, issuer } = makeIssuer((form) => {
      if (form.get("grant_type") === "refresh_token") {
        expect(form.get("refresh_token")).toBe("refresh-old")
        return { access_token: "access-new", refresh_token: "refresh-new", expires_in: 3600 }
      }
      return undefined
    })
    try {
      const input = makeInput()
      const hooks = await BharatcodeAuthPlugin(input as any, { issuer, redirectUri: TEST_REDIRECT_URI })
      const loader = hooks.auth!.loader!
      const stale = {
        type: "oauth",
        access: "access-stale",
        refresh: "refresh-old",
        expires: Date.now() - 1000,
        accountId: "user-abc",
      } as any
      const options = await loader(() => Promise.resolve(stale), {} as any)
      expect(options.apiKey).toBe(OAUTH_DUMMY_KEY)

      // One call through the fetch override: stale token forces a refresh first.
      const seen: (string | undefined)[] = []
      const apiServer = Bun.serve({
        port: 0,
        fetch: (request) => {
          seen.push(request.headers.get("authorization") ?? undefined)
          return Response.json({ ok: true })
        },
      })
      try {
        const response = await (options.fetch as Function)(`${apiServer.url}chat`, { headers: {} })
        expect(response.status).toBe(200)
        expect(seen[0]).toBe("Bearer access-new")
      } finally {
        apiServer.stop(true)
      }

      const refresh = calls.find((entry) => entry.get("grant_type") === "refresh_token")
      expect(refresh).toBeTruthy()
      expect(input.setCalls).toHaveLength(1)
      const persisted = input.setCalls[0] as any
      expect(persisted.path).toEqual({ id: "bharatcode" })
      expect(persisted.body).toMatchObject({
        type: "oauth",
        access: "access-new",
        refresh: "refresh-new",
        accountId: "user-abc",
      })
    } finally {
      server.stop(true)
    }
  })

  test("loader retries once after a 401 with a forced refresh", async () => {
    let apiHits = 0
    const { server, issuer } = makeIssuer((form) => {
      if (form.get("grant_type") === "refresh_token") {
        return { access_token: "access-fresh", refresh_token: "refresh-fresh", expires_in: 3600 }
      }
      return undefined
    })
    // Separate API server: 401 while the stored token looks fresh, then 200.
    const seen: (string | undefined)[] = []
    const apiServer = Bun.serve({
      port: 0,
      fetch: (request) => {
        apiHits += 1
        seen.push(request.headers.get("authorization") ?? undefined)
        return apiHits === 1 ? new Response("expired", { status: 401 }) : Response.json({ ok: true })
      },
    })
    try {
      const input = makeInput()
      const hooks = await BharatcodeAuthPlugin(input as any, { issuer, redirectUri: TEST_REDIRECT_URI })
      const loader = hooks.auth!.loader!
      const fresh = {
        type: "oauth",
        access: "access-current",
        refresh: "refresh-current",
        expires: Date.now() + 3_600_000,
      } as any
      const options = await loader(() => Promise.resolve(fresh), {} as any)
      const response = await (options.fetch as Function)(`${apiServer.url}chat/completions`, {
        method: "POST",
        body: JSON.stringify({ model: "m" }),
        headers: { "content-type": "application/json" },
      })
      expect(response.status).toBe(200)
      expect(apiHits).toBe(2)
      expect(seen[0]).toBe("Bearer access-current")
      expect(seen[1]).toBe("Bearer access-fresh")
      expect(input.setCalls).toHaveLength(1)
      expect((input.setCalls[0] as any).body.access).toBe("access-fresh")
    } finally {
      apiServer.stop(true)
      server.stop(true)
    }
  })
})
