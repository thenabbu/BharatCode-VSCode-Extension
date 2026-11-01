import { dict as attentionDict } from "./attention/nl"
import { dict as mcpDict } from "./mcp/nl"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
