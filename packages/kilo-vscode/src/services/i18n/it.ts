import { dict as attentionDict } from "./attention/it"
import { dict as mcpDict } from "./mcp/it"

export const dict = {
  ...attentionDict,
  ...mcpDict,
} as const
