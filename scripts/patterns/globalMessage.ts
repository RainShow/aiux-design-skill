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

/** 成功：「创建成功」 */
export function formatMessageOk(action: string) {
  return `${action}成功`
}

/** 失败：「创建失败，请稍后重试」 */
export function formatMessageFail(action: string) {
  return `${action}失败，请稍后重试`
}

/**
 * 全局提示。
 *
 * 操作结果一律 `ok('创建')` / `fail('创建')`，文案固定「X成功」/「X失败，请稍后重试」。
 * 禁止手写「已创建」「已删除」「列表已刷新」「账号或密码错误」。
 * `info` 仅用于演示占位（暂未开放），不要把占位写成 `fail('打开')`。
 * 表单校验失败只红框，不弹 Message。
 */
export const globalMessage = {
  ok(action: string) {
    show('success', formatMessageOk(action))
  },
  fail(action: string) {
    show('error', formatMessageFail(action))
  },
  info(content: string) {
    show('info', content)
  },
  warning(content: string) {
    show('warning', content)
  },
}
