import { dict as attentionDict } from "./attention/ja"
import { dict as mcpDict } from "./mcp/ja"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
