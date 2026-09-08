import type { ReactNode } from 'react'
import { isValidElement, useRef } from 'react'
import { Tooltip } from '@arco-design/web-react'
import { useTruncationObserved } from './useTruncationObserved'

/** 从 ReactNode 递归抽取纯文本，用于无显式 tooltip 时的悬停全文 */
function extractPlainText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractPlainText).join('')
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode }
    return extractPlainText(props?.children)
  }
  return ''
}

export type DetailFieldValueProps = {
  children: ReactNode
  /**
   * false：不做两行省略（如内含复制按钮、多列链接条、专用行内布局等）。
   * 为 false 且未传 `tooltip` 时，不包 Tooltip，避免复合控件误用整段纯文本提示。
   */
  clamp?: boolean
  /** 悬停展示的全文；`clamp` 为 true 且未传时从子节点递归抽取纯文本 */
  tooltip?: string
}

/**
 * 详情页只读字段值：最多两行，超出省略号；仅在被截断时悬停 Tooltip 展示全文。
 */
export function DetailFieldValue({ children, clamp = true, tooltip }: DetailFieldValueProps) {
  const measureRef = useRef<HTMLSpanElement>(null)
  const tipText = (tooltip ?? extractPlainText(children)).trim()
  const measureKey = `${Number(clamp)}:${tipText}`
  const observeTruncation = Boolean(tipText) && (clamp || tooltip !== undefined)
  const truncated = useTruncationObserved(measureRef, measureKey, observeTruncation)

  const inner = clamp ? (
    <span ref={measureRef} className="detail-field-value__clamp min-w-0 block">
      {children}
    </span>
  ) : (
    <span ref={measureRef} className="min-w-0 block">
      {children}
    </span>
  )

  if (!clamp && tooltip === undefined) return inner
  if (!tipText) return inner

  return (
    <Tooltip content={tipText} position="top" disabled={!truncated}>
      {inner}
    </Tooltip>
  )
}
