import type { MessageHookReturnType } from '@arco-design/web-react/es/Message/interface'

let api: MessageHookReturnType | null = null

/** 自动关闭时间（ms）。Arco 默认 3000；显式传入避免被 update/hover 逻辑打乱 */
const MESSAGE_DURATION_MS = 3000

/**
 * 注册壳层 `Message.useMessage` 得到的 API。
 * @param next 当前壳层实例；卸载时传 `null`
 */
export function setGlobalMessageApi(next: MessageHookReturnType | null) {
  api = next
}

/**
 * 同一条文案共用 id，避免 StrictMode / 连点堆叠成多条。
 * @param type 提示类型
 * @param content 文案
 */
function stableId(type: string, content: string) {
  return `yb-msg:${type}:${content}`
}

/**
 * 弹出一条全局提示。
 * @param type 提示类型
 * @param content 文案
 */
function show(type: 'success' | 'info' | 'warning' | 'error', content: string) {
  api?.[type]?.({
    id: stableId(type, content),
    content,
    duration: MESSAGE_DURATION_MS,
    closable: false,
  })
}

export const globalMessage = {
  success(content: string) {
    show('success', content)
  },
  info(content: string) {
    show('info', content)
  },
  warning(content: string) {
    show('warning', content)
  },
  error(content: string) {
    show('error', content)
  },
}
