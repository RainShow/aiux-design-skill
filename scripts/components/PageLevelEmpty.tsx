import type { ReactNode } from 'react'
import { Typography } from '@arco-design/web-react'
import pageLevelEmptyIllustration from '../assets/empty/page-level-empty-state.svg'

/** 页面级（距顶 1/4）或表格/卡片内（贴顶、无 1/4 偏移） */
export type PageLevelEmptyLayout = 'page' | 'inline'

export type PageLevelEmptyProps = {
  /**
   * 标题（16 / 24 / 600）。不传时 {@link description} 作为主文案。
   */
  title?: ReactNode
  /** 说明；无 `title` 时作为主文案，默认「暂无数据」 */
  description?: ReactNode
  /** 可选操作区（如「创建」按钮），与上一行间距 16px */
  actions?: ReactNode
  className?: string
  /** 插画边长，默认 100 */
  imageSize?: number
  /** 覆盖默认插画 */
  illustrationSrc?: string
  /**
   * `page`：占满父级高度，插画组距顶 1/4（页面级空态）。
   * `inline`：表格 / 卡片内，不做 1/4 偏移。
   */
  layout?: PageLevelEmptyLayout
}

const TITLE_STYLE = {
  color: 'var(--color-text-1)',
  fontFamily: 'PingFang SC, system-ui, sans-serif',
  fontSize: 16,
  fontStyle: 'normal' as const,
  fontWeight: 600,
  lineHeight: '24px',
}

const DESC_STYLE = {
  color: 'var(--color-text-2)',
  fontFamily: 'PingFang SC, system-ui, sans-serif',
  fontSize: 14,
  fontStyle: 'normal' as const,
  fontWeight: 400,
  lineHeight: '22px',
}

/**
 * 页面级空态：统一插画 + 间距（图 16 标题 8 说明 16 按钮；页面级距顶 1/4）。
 * **不要**再用裸 Arco `Empty`。表格请用 `LIST_TABLE_NO_DATA_ELEMENT`（`layout="inline"`）。
 *
 * Skill 内导入：`../assets/empty/...`
 * 落地到 `src/components/PageLevelEmpty.tsx` 后路径深度不变。
 */
export function PageLevelEmpty({
  title,
  description = '暂无数据',
  actions,
  className,
  imageSize = 100,
  illustrationSrc = pageLevelEmptyIllustration,
  layout = 'page',
}: PageLevelEmptyProps) {
  const hasTitle = title != null && title !== ''
  const heading = hasTitle ? title : description
  const detail = hasTitle ? description : null

  return (
    <div
      className={[
        'create-catalog-business-item-empty',
        layout === 'page'
          ? 'create-catalog-business-item-empty--page'
          : 'create-catalog-business-item-empty--inline',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {layout === 'page' ? <div className="create-catalog-business-item-empty__offset" aria-hidden /> : null}
      <div className="create-catalog-business-item-empty__stack">
        <img
          src={illustrationSrc}
          alt=""
          width={imageSize}
          height={imageSize}
          className="create-catalog-business-item-empty__img block shrink-0"
          draggable={false}
        />
        {heading != null ? (
          <Typography.Text className="create-catalog-business-item-empty__title" style={TITLE_STYLE}>
            {heading}
          </Typography.Text>
        ) : null}
        {detail != null && detail !== '' ? (
          <Typography.Text className="create-catalog-business-item-empty__desc" style={DESC_STYLE}>
            {detail}
          </Typography.Text>
        ) : null}
        {actions ? <div className="create-catalog-business-item-empty__actions">{actions}</div> : null}
      </div>
    </div>
  )
}
