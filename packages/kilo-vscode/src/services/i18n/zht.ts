import { dict as attentionDict } from "./attention/zht"
import { dict as mcpDict } from "./mcp/zht"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
