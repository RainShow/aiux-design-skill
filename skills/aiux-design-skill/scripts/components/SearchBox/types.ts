import type { InputProps } from '@arco-design/web-react'
import type { RefInputType } from '@arco-design/web-react/es/Input/interface'
import type { ReactNode } from 'react'

export type SearchBoxSize = 'sm' | 'md' | 'lg'
export type SearchBoxIconPlacement = 'left' | 'right'

/**
 * 基于 `@arco-design/web-react` 的 `Input`，语义与主题由 Arco + `ArcoTheme19155Provider` 承担。
 * - `size`：项目内 sm/md/lg 映射到 Arco `small` / `default` / `large`
 * - `clearable`：映射到 Arco `allowClear`（可被显式 `allowClear` 覆盖）
 * - `invalid`：映射到 Arco `status="error"`
 * - `prefix`：在**左侧搜索图标之后**追加内容（搜索图标始终在最左，符合 Figma 级联面板）
 */
export type SearchBoxProps = Omit<InputProps, 'size' | 'prefix'> & {
  size?: SearchBoxSize
  clearable?: boolean
  invalid?: boolean
  prefix?: ReactNode
  /**
   * 搜索图标位置：
   * - left：图标在左（默认，兼容现有侧导/级联面板）
   * - right：图标在右（主题 19155 Input 搜索样式）
   */
  iconPlacement?: SearchBoxIconPlacement
}

export type { RefInputType as SearchBoxRef }
