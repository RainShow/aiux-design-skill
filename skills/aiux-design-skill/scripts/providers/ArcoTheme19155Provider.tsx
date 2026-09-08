import type { ReactNode } from 'react'
import { ConfigProvider } from '@arco-design/web-react'
import zhCN from '@arco-design/web-react/es/locale/zh-CN'

/**
 * 主题 19155：以 Arco 主题包语义为先——全局变量与组件级补偿见 `src/styles/arco-theme-19155.css`。
 * 业务里 `@arco-design/web-react` 组件请使用 Arco 语义色（`var(--color-*)` / `rgb(var(--primary-6))`），
 * 勿再混用 `--yb-*` 控制 Arco 组件外观（壳层布局可继续用 figma-tokens）。
 *
 * 说明见 `references/theme-mapping.md`。
 * 落地目标路径：`src/providers/ArcoTheme19155Provider.tsx`。
 */
export function ArcoTheme19155Provider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      locale={zhCN}
      componentConfig={{
        Card: { bordered: true },
      }}
    >
      {children}
    </ConfigProvider>
  )
}
