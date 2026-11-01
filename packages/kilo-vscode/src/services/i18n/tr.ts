import { dict as attentionDict } from "./attention/tr"
import { dict as mcpDict } from "./mcp/tr"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
