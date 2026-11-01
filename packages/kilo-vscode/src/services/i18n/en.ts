import { dict as attentionDict } from "./attention/en"
import { dict as mcpDict } from "./mcp/en"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
