import { dict as attentionDict } from "./attention/pl"
import { dict as mcpDict } from "./mcp/pl"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
