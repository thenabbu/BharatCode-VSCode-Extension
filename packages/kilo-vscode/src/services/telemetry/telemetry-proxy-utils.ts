/**
 * Build the merged properties object for a telemetry event.
 * Provider properties are included first so event-specific properties can override them.
 * Return null for dropped events so no request reaches the CLI or PostHog.
 */
export function buildTelemetryPayload(
  event: string,
  properties: Record<string, unknown> | undefined,
  providerProperties: Record<string, unknown> | undefined,
): { event: string; properties: Record<string, unknown> } | null {
  return {
    event,
    properties: {
      ...providerProperties,
      ...properties,
    },
  }
}

/**
 * Build the Authorization header value for the telemetry endpoint.
 */
export function buildTelemetryAuthHeader(password: string): string {
  return `Basic ${Buffer.from(`kilo:${password}`).toString("base64")}`
}
