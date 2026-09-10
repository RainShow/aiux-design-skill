/** 用于「日期时间」类列：按 12:00 分界演示筛选 */
export const TIME_OF_DAY_FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: '上午（12:00 前）', value: 'am' },
  { label: '中午及以后（12:00 起）', value: 'pm' },
]

export function hourFromDateTime(s: string): number | null {
  const tail = s.trim().split(/\s+/)[1]
  if (!tail || tail.length < 2) return null
  const h = Number(tail.slice(0, 2))
  return Number.isFinite(h) ? h : null
}

/** 行是否命中「时段」单选：未选则放行 */
export function rowMatchesTimeOfDayPart(rowTime: string, selected: string | null): boolean {
  if (selected == null || selected === '') return true
  const h = hourFromDateTime(rowTime)
  if (h == null) return false
  if (selected === 'am') return h < 12
  if (selected === 'pm') return h >= 12
  return true
}
