import { dict as attentionDict } from "./attention/uk"
import { dict as mcpDict } from "./mcp/uk"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
