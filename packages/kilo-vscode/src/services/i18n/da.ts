import { dict as attentionDict } from "./attention/da"
import { dict as mcpDict } from "./mcp/da"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
