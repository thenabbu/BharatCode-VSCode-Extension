import { dict as attentionDict } from "./attention/bs"
import { dict as mcpDict } from "./mcp/bs"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
