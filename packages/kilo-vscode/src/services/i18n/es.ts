import { dict as attentionDict } from "./attention/es"
import { dict as mcpDict } from "./mcp/es"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
