/** 演示登录态：与 LoginPage 写入的 sessionStorage 键一致 */
export const AUTH_DEMO_SESSION_KEY = 'figma-demo:auth:demo' as const

const AUTH_DEMO_CHANGED_EVENT = 'figma-demo:auth:changed'

/** 演示登录凭据（只在这里维护，登录页从此处读取） */
export const DEMO_USERNAME = 'admin'
export const DEMO_PASSWORD = 'admin'

/** 预览区 / iframe 可能写不了 sessionStorage，用内存兜底同一会话 */
let memoryAuthed = false

function readSessionAuthed(): boolean | null {
  try {
    return sessionStorage.getItem(AUTH_DEMO_SESSION_KEY) === '1'
  } catch {
    return null
  }
}

/** 读取演示登录态 */
export function readDemoAuthed(): boolean {
  const stored = readSessionAuthed()
  if (stored) {
    memoryAuthed = true
    return true
  }
  return memoryAuthed
}

/** 写入演示登录态，并通知壳层刷新鉴权跳转 */
export function writeDemoAuthed(next: boolean): void {
  memoryAuthed = next
  try {
    if (next) sessionStorage.setItem(AUTH_DEMO_SESSION_KEY, '1')
    else sessionStorage.removeItem(AUTH_DEMO_SESSION_KEY)
  } catch {
    /* 预览沙箱可能禁用 sessionStorage */
  }
  window.dispatchEvent(new Event(AUTH_DEMO_CHANGED_EVENT))
}

/** 订阅演示登录态变化 */
export function subscribeDemoAuth(onChange: () => void): () => void {
  window.addEventListener(AUTH_DEMO_CHANGED_EVENT, onChange)
  return () => window.removeEventListener(AUTH_DEMO_CHANGED_EVENT, onChange)
}
