import { useCallback, useLayoutEffect, useState, type RefObject } from 'react'

/**
 * 判断元素是否因 overflow / line-clamp 等发生可见区域截断。
 * 用于仅在截断时启用 Tooltip（完整展示时不应出现气泡）。
 *
 * @param enabled 为 false 时不订阅尺寸（用于无需 Tooltip 的展示路径）。
 */
export function useTruncationObserved(
  ref: RefObject<HTMLElement | null>,
  measureKey: string,
  enabled = true,
): boolean {
  const [truncated, setTruncated] = useState(false)

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) {
      setTruncated(false)
      return
    }
    const wTrunc = el.scrollWidth > el.clientWidth + 0.5
    const hTrunc = el.scrollHeight > el.clientHeight + 0.5
    setTruncated(wTrunc || hTrunc)
  }, [ref])

  useLayoutEffect(() => {
    if (!enabled) return
    measure()
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(measure)
    })
    ro.observe(el)
    const tableCell = el.closest('.arco-table-td') as HTMLElement | null
    if (tableCell) ro.observe(tableCell)
    let p: Element | null = el.parentElement
    for (let i = 0; i < 6 && p; i++) {
      ro.observe(p)
      p = p.parentElement
    }
    window.addEventListener('resize', measure)
    let alive = true
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (alive) measure()
      })
    })
    queueMicrotask(() => {
      if (alive) measure()
    })
    return () => {
      alive = false
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure, measureKey, enabled, ref])

  return enabled && truncated
}
