import { dict as attentionDict } from "./attention/ru"
import { dict as mcpDict } from "./mcp/ru"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
