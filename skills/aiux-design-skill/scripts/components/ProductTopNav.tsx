import type { ReactNode } from 'react'
import { Dropdown, Menu } from '@arco-design/web-react'
import { TopNavBrandLogo } from './TopNavBrandLogo'
import type { ProductTopNavItem } from './types'

export type ProductTopNavProps = {
  items: ProductTopNavItem[]
  activeKey: string
  platformName: string
  logoSrc: string
  avatarSrc?: string
  onItemClick?: (item: ProductTopNavItem) => void
  /** 右侧文档/消息等；不传则不渲染占位（由 ProductAppShell 注入默认槽） */
  rightExtra?: ReactNode
  onLogout?: () => void
}

/**
 * 产品顶栏骨架（高 56、品牌 + 产品线 + 右侧操作）。
 * 菜单文案/顺序由 `items` 注入，勿写死业务产品线。
 *
 * 落地到 `src/components/` 后相对导入已对齐，不必改。
 */
export function ProductTopNav({
  items,
  activeKey,
  platformName,
  logoSrc,
  avatarSrc,
  onItemClick,
  rightExtra,
  onLogout,
}: ProductTopNavProps) {
  return (
    <header
      className={[
        'w-full min-w-[var(--yb-layout-min-w)] h-[var(--yb-topnav-h)] shrink-0',
        'bg-[color:var(--yb-bg-2)] border-b border-solid border-[color:var(--yb-border-2)]',
        'shadow-[0_2px_8px_0_rgba(0,0,0,0.08)]',
        'px-[var(--yb-space-16)] relative z-[900] overflow-clip',
        'flex items-center justify-between',
      ].join(' ')}
      data-name="menu_top_nav"
    >
      <div className="flex h-full min-w-0 items-center gap-[var(--yb-space-24)]">
        <TopNavBrandLogo platformName={platformName} logoSrc={logoSrc} />

        <nav className="flex h-full flex-nowrap items-center" aria-label="top-nav">
          {items.map((item) => {
            const isActive = item.key === activeKey
            return (
              <button
                key={item.key}
                type="button"
                className="flex h-full items-start overflow-clip border-0 bg-transparent px-[var(--yb-space-16)] pt-[var(--yb-space-16)]"
                onClick={() => onItemClick?.(item)}
              >
                <span
                  className={[
                    'whitespace-nowrap text-[length:var(--yb-fs-14)] leading-[var(--yb-lh-22)]',
                    isActive
                      ? 'font-semibold text-[color:var(--yb-text-1)]'
                      : 'font-normal text-[color:var(--yb-text-2)]',
                  ].join(' ')}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="flex h-full shrink-0 items-center gap-[var(--yb-space-16)]">
        {rightExtra}
        {onLogout ? (
          <div className="relative size-[var(--yb-avatar)] shrink-0">
            <Dropdown
              trigger="hover"
              position="br"
              droplist={
                <Menu
                  onClickMenuItem={(key) => {
                    if (key === 'logout') onLogout()
                  }}
                >
                  <Menu.Item key="logout">退出登录</Menu.Item>
                </Menu>
              }
            >
              <button
                type="button"
                className="relative size-[var(--yb-avatar)] shrink-0 overflow-hidden rounded-[var(--yb-radius-100)] border-0 bg-transparent p-0 outline-none"
                aria-label="用户菜单"
              >
                {avatarSrc ? (
                  <img
                    alt=""
                    className="pointer-events-none absolute inset-0 block size-full max-w-none object-cover"
                    src={avatarSrc}
                  />
                ) : null}
                <span className="pointer-events-none absolute inset-0 grid place-items-center text-[length:var(--yb-fs-18)] font-medium leading-none text-[color:var(--yb-text-white)]">
                  A
                </span>
              </button>
            </Dropdown>
          </div>
        ) : null}
      </div>
    </header>
  )
}
