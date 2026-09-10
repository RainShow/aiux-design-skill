/** 演示登录态：与 LoginPage 写入的 sessionStorage 键一致 */
export const AUTH_DEMO_SESSION_KEY = 'figma-demo:auth:demo' as const

const AUTH_DEMO_CHANGED_EVENT = 'figma-demo:auth:changed'

/** 读取演示登录态 */
export function readDemoAuthed(): boolean {
  return sessionStorage.getItem(AUTH_DEMO_SESSION_KEY) === '1'
}

/** 写入演示登录态，并通知壳层刷新鉴权跳转 */
export function writeDemoAuthed(next: boolean): void {
  if (next) sessionStorage.setItem(AUTH_DEMO_SESSION_KEY, '1')
  else sessionStorage.removeItem(AUTH_DEMO_SESSION_KEY)
  window.dispatchEvent(new Event(AUTH_DEMO_CHANGED_EVENT))
}

/** 订阅演示登录态变化 */
export function subscribeDemoAuth(onChange: () => void): () => void {
  window.addEventListener(AUTH_DEMO_CHANGED_EVENT, onChange)
  return () => window.removeEventListener(AUTH_DEMO_CHANGED_EVENT, onChange)
}
