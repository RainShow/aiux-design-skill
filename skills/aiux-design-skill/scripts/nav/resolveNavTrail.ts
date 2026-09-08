import type { ProductNavShellConfig } from '../components/types'

export type NavTrail = {
  title: string
  trail: string
}

/** 按当前 path 从 navConfig 抽出侧导路径，供未搭建占位页展示。 */
export function resolveNavTrail(config: ProductNavShellConfig, pathname: string): NavTrail {
  const topKey = config.resolveTopNavKey(pathname)
  const mode = config.sideNavModeByTopKey[topKey] ?? 'none'

  if (mode === 'dual' && config.dual) {
    const segments: string[] = []
    const railKey =
      config.resolveDualRailKey?.(pathname) ?? config.dual.homeKey ?? config.dual.rail[0]?.key
    const rail = config.dual.rail.find((item) => item.key === railKey)
    if (rail) segments.push(rail.label)

    const secondKey = config.resolveDualSecondKey?.(pathname)
    if (secondKey && railKey) {
      for (const section of config.dual.panels[railKey] ?? []) {
        if (section.type === 'item' && section.key === secondKey) {
          segments.push(section.label)
          break
        }
        if (section.type === 'group') {
          const child = section.children.find((item) => item.key === secondKey)
          if (child) {
            segments.push(section.label, child.label)
            break
          }
        }
      }
    }

    const title = segments[segments.length - 1] ?? '未命名'
    return { title, trail: segments.join(' / ') }
  }

  if (mode === 'single') {
    const segments: string[] = []
    const rows = config.singles?.[topKey]?.rows ?? []
    const activeKey = config.resolveSingleKey?.(topKey, pathname)
    let currentGroup: string | undefined
    for (const row of rows) {
      if (row.type === 'group') {
        currentGroup = row.label
        continue
      }
      if (row.type === 'item' && row.key === activeKey) {
        if (currentGroup) segments.push(currentGroup)
        segments.push(row.label)
        break
      }
    }

    const title = segments[segments.length - 1] ?? '未命名'
    return { title, trail: segments.join(' / ') }
  }

  return { title: '未命名', trail: pathname }
}
