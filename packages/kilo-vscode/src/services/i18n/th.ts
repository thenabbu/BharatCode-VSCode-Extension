import { dict as attentionDict } from "./attention/th"
import { dict as mcpDict } from "./mcp/th"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
