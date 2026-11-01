import { dict as attentionDict } from "./attention/de"
import { dict as mcpDict } from "./mcp/de"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
