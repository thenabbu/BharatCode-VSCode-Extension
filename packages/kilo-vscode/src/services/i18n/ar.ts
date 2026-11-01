import { dict as attentionDict } from "./attention/ar"
import { dict as mcpDict } from "./mcp/ar"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
