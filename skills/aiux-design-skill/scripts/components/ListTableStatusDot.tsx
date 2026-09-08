import type { ReactNode } from 'react'

export type ListTableStatusDotProps = {
  /** 状态点填充色（hex / rgb / var，与业务语义色一致） */
  color: string
  /** 状态文案 */
  label: ReactNode
  className?: string
}

/** 跨页状态点语义色。业务枚举映射到这些 token，禁止自绘圆点或改用 Badge。 */
export const STATUS_DOT_COLOR = {
  running: 'rgb(var(--success-6))',
  stopped: 'var(--color-text-4)',
  success: 'rgb(var(--success-6))',
  failed: 'rgb(var(--danger-6))',
  warning: 'rgb(var(--warning-6))',
  processing: 'rgb(var(--primary-6))',
} as const

/**
 * 跨页「状态点 + 文案」：列表状态列、详情标题旁共用。
 * 8px 圆点、点字间距 8px、文案 14/22/`--color-text-2`。
 * 禁止 Arco `Badge`、禁止自绘圆点。
 */
export function ListTableStatusDot({ color, label, className }: ListTableStatusDotProps) {
  return (
    <span className={['inline-flex min-w-0 max-w-full items-center gap-2', className].filter(Boolean).join(' ')}>
      <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden />
      <span className="min-w-0 truncate text-[14px] font-normal leading-[22px] text-[color:var(--color-text-2)]">
        {label}
      </span>
    </span>
  )
}
