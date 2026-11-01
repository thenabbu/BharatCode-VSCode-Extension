import { dict as attentionDict } from "./attention/br"
import { dict as mcpDict } from "./mcp/br"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
