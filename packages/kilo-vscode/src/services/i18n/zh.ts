import { dict as attentionDict } from "./attention/zh"
import { dict as mcpDict } from "./mcp/zh"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
