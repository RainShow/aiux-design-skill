import { Divider, Typography } from '@arco-design/web-react'
import { useLocation } from 'react-router-dom'
import { navConfig } from '../nav/navConfig'
import { resolveNavTrail } from '../nav/resolveNavTrail'

/**
 * 未搭建菜单页。规范：`references/layout.md` §5.1。
 *
 * 相对导入已对齐落地路径：复制到 `src/pages/` 后不必改 import。
 * 只给侧栏已有、业务页尚未落地的路由用。不要加搜索、不要加「创建 XX」。
 * 页面已落地、数据还是 mock 时，改走对应 `*-page.md` 模板。
 */
export function PlaceholderPage() {
  const { pathname } = useLocation()
  const { title, trail } = resolveNavTrail(navConfig, pathname)

  return (
    <div className="flex h-full min-h-0 flex-col bg-[color:var(--color-bg-2)]">
      <div className="shrink-0 bg-[color:var(--color-bg-2)]" style={{ padding: 24, boxSizing: 'border-box' }}>
        <Typography.Title
          heading={5}
          className="min-w-0 truncate"
          style={{ margin: 0, fontSize: 20, lineHeight: '30px', fontWeight: 600, color: 'var(--color-text-1)' }}
        >
          {title}
        </Typography.Title>
      </div>
      <Divider style={{ margin: 0 }} />
      <div className="flex flex-col gap-2" style={{ padding: 24, boxSizing: 'border-box' }}>
        <Typography.Text type="secondary">{trail}</Typography.Text>
        <Typography.Text type="secondary">该页面还未搭建</Typography.Text>
      </div>
    </div>
  )
}
