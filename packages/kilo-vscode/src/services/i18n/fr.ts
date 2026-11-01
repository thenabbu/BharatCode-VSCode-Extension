import { dict as attentionDict } from "./attention/fr"
import { dict as mcpDict } from "./mcp/fr"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
