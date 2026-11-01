import { dict as attentionDict } from "./attention/ko"
import { dict as mcpDict } from "./mcp/ko"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
