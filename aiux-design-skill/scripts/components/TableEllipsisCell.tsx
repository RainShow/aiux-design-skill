import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Tooltip } from '@arco-design/web-react'

export type TableEllipsisCellProps = {
  /** Tooltip 内容；为空时不展示 Tooltip */
  tooltip?: ReactNode
  className?: string
  style?: CSSProperties
  children: ReactNode
}

/**
 * 表格单元格文本省略（...）+ 悬停提示。
 * 由于部分列表使用自定义 row/cell 的 flex 布局，直接依赖 Table 的 ellipsis.showTooltip 可能不稳定，
 * 这里用显式的 Tooltip + text-overflow 来保证行为一致。
 */
export function TableEllipsisCell({ tooltip, className, style, children }: TableEllipsisCellProps) {
  const elRef = useRef<HTMLSpanElement | null>(null)
  const [isOverflow, setIsOverflow] = useState(false)

  const tooltipEnabled = useMemo(() => tooltip !== undefined && tooltip !== null && tooltip !== '', [tooltip])

  const computeOverflow = () => {
    const el = elRef.current
    if (!el) return
    // scrollWidth 在 overflow:hidden 下仍可反映真实内容宽度
    setIsOverflow(el.scrollWidth > el.clientWidth + 1)
  }

  useEffect(() => {
    computeOverflow()
    const el = elRef.current
    if (!el) return

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => computeOverflow())
      ro.observe(el)
      return () => ro.disconnect()
    }

    const onResize = () => computeOverflow()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅在挂载/children 变化时重新计算
  }, [children])

  const content = (
    <span
      ref={elRef}
      className={className}
      style={{
        flex: '1 1 auto',
        display: 'block',
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        ...style,
      }}
      onMouseEnter={computeOverflow}
    >
      {children}
    </span>
  )

  if (!tooltipEnabled) return content
  if (!isOverflow) return content
  return <Tooltip content={tooltip}>{content}</Tooltip>
}

