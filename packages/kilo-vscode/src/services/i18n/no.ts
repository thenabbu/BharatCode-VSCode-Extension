import { dict as attentionDict } from "./attention/no"
import { dict as mcpDict } from "./mcp/no"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
