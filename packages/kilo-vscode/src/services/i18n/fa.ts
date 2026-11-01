import { dict as attentionDict } from "./attention/fa"
import { dict as mcpDict } from "./mcp/fa"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
