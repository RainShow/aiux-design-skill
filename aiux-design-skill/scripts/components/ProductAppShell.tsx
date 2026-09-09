import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Message } from '@arco-design/web-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { setGlobalMessageApi } from '../patterns/globalMessage'
import { LOGIN_ROUTE_PATH, LOGIN_SHELL_BG } from '../patterns/loginPageLayout'
import { DualColumnOverviewModal } from './DualColumnOverviewModal'
import { DualColumnSideNav, type DualWorkspaceSelectProps } from './DualColumnSideNav'
import { ProductTopNav } from './ProductTopNav'
import { ProductTopNavRightExtra } from './ProductTopNavRightExtra'
import { SingleColumnSideNav } from './SingleColumnSideNav'
import type { ProductNavShellConfig, ProductTopNavItem } from './types'

export type ProductAppShellProps = {
  config: ProductNavShellConfig
  children: ReactNode
  /** 折叠/展开图标（双列与单列共用） */
  foldIconSrc: string
  unfoldIconSrc: string
  putawayIconSrc?: string
  logoSrc: string
  avatarSrc?: string
  /** 顶栏右侧；`undefined` 用默认文档/消息，`null` 关闭 */
  topNavRightExtra?: ReactNode | null
  /** 双列顶区；`undefined` 用默认位置选择器下拉（`NavWorkspaceSelect`），`null` 关闭 */
  dualHeaderSlot?: ReactNode | null
  /**
   * 默认位置选择器的业务数据（组织树、创建回调等）。
   * 仅 `dualHeaderSlot` 为 `undefined` 时生效；不要为了接数据而整段替换顶条。
   */
  workspaceSelectProps?: DualWorkspaceSelectProps
  /**
   * 双列「功能全景」点击。不传且提供了 `putawayIconSrc` 时，壳层打开内置 `DualColumnOverviewModal`。
   * 传入则完全接管（例如业务自绘全景）。
   */
  onOverviewClick?: () => void
  onLogout?: () => void
  /** 是否已登录；不传则不做鉴权跳转 */
  isAuthed?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * 产品导航壳：TopNav + 双列/单列侧导切换 + Message + 主内容滚动区。
 * 登录 / 全屏路径无顶侧栏。
 *
 * 相对导入已对齐落地路径（`../patterns/*`），复制到业务仓同位置后不必改 import。
 */
export function ProductAppShell({
  config,
  children,
  foldIconSrc,
  unfoldIconSrc,
  putawayIconSrc,
  logoSrc,
  avatarSrc,
  topNavRightExtra,
  dualHeaderSlot,
  workspaceSelectProps,
  onOverviewClick,
  onLogout,
  isAuthed,
  className,
  style,
}: ProductAppShellProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [overviewOpen, setOverviewOpen] = useState(false)
  const [messageApi, messageHolder] = Message.useMessage({
    maxCount: 3,
    getContainer: () => document.getElementById('yb-message-root') ?? document.body,
  })

  useEffect(() => {
    setGlobalMessageApi(messageApi)
    return () => setGlobalMessageApi(null)
  }, [messageApi])

  const loginPath = config.loginPath ?? LOGIN_ROUTE_PATH
  const activeTopKey = config.resolveTopNavKey(pathname)
  const sideMode = config.sideNavModeByTopKey[activeTopKey] ?? 'none'
  const isFullscreen = config.isFullscreenPath?.(pathname) ?? false
  const isLogin = pathname === loginPath
  const dualOverviewTitle =
    config.dual?.overview?.title ??
    config.topNav.find((item) => config.sideNavModeByTopKey[item.key] === 'dual')?.label ??
    config.platformName

  useEffect(() => {
    setCollapsed(false)
    setOverviewOpen(false)
  }, [activeTopKey])

  useEffect(() => {
    if (isAuthed === undefined) return
    if (!isAuthed && !isLogin) navigate(loginPath, { replace: true })
    if (isAuthed && isLogin) navigate('/', { replace: true })
  }, [isAuthed, isLogin, loginPath, navigate])

  useEffect(() => {
    if (config.platformName) document.title = config.platformName
  }, [config.platformName])

  const dualRailKey =
    config.resolveDualRailKey?.(pathname) ?? config.dual?.rail[0]?.key ?? 'home'
  const dualSecondKey = config.resolveDualSecondKey?.(pathname) ?? null
  const singleActiveKey =
    sideMode === 'single' ? config.resolveSingleKey?.(activeTopKey, pathname) ?? null : null
  const singleConfig = sideMode === 'single' ? config.singles?.[activeTopKey] : undefined

  const onTopClick = (item: ProductTopNavItem) => {
    navigate(item.path)
  }

  const handleOverviewClick = () => {
    if (onOverviewClick) onOverviewClick()
    else setOverviewOpen(true)
  }

  if (isLogin || isFullscreen) {
    return (
      <div
        className={[
          'flex h-[100dvh] w-full min-h-0 min-w-[var(--yb-layout-min-w)] flex-col overflow-hidden text-[color:var(--yb-text-2)]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ backgroundColor: isLogin ? LOGIN_SHELL_BG : undefined, ...style }}
      >
        <div id="yb-message-root" className="yb-message-root" />
        {messageHolder}
        <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    )
  }

  let sideNav: ReactNode = null
  if (sideMode === 'dual' && config.dual) {
    sideNav = (
      <DualColumnSideNav
        config={config.dual}
        activeRailKey={dualRailKey}
        activeSecondKey={dualSecondKey}
        collapsed={collapsed}
        onFoldClick={() => setCollapsed((v) => !v)}
        onRailChange={() => setCollapsed(false)}
        headerSlot={dualHeaderSlot}
        workspaceSelectProps={workspaceSelectProps}
        onOverviewClick={handleOverviewClick}
        foldIconSrc={foldIconSrc}
        unfoldIconSrc={unfoldIconSrc}
        putawayIconSrc={putawayIconSrc}
      />
    )
  } else if (sideMode === 'single' && singleConfig) {
    sideNav = (
      <SingleColumnSideNav
        config={singleConfig}
        activeKey={singleActiveKey}
        collapsed={collapsed}
        onFoldClick={() => setCollapsed((v) => !v)}
        foldIconSrc={foldIconSrc}
        unfoldIconSrc={unfoldIconSrc}
      />
    )
  }

  return (
    <div
      className={[
        'yb-layout-shell-root yb-scrollbar-hide',
        'flex h-[100dvh] w-full min-h-0 min-w-[var(--yb-layout-min-w)] flex-col',
        'overflow-x-auto overflow-y-hidden',
        'bg-[color:var(--yb-bg-1)] text-[color:var(--yb-text-2)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <ProductTopNav
        items={config.topNav}
        activeKey={activeTopKey}
        platformName={config.platformName}
        logoSrc={logoSrc}
        avatarSrc={avatarSrc}
        onItemClick={onTopClick}
        rightExtra={topNavRightExtra === null ? undefined : (topNavRightExtra ?? <ProductTopNavRightExtra />)}
        onLogout={onLogout}
      />
      <div className="flex min-h-0 min-w-0 flex-1">
        {sideNav}
        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">
          <div className="yb-layout-main-scroll relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-x-hidden overflow-y-auto bg-[color:var(--yb-bg-1)]">
            <div id="yb-message-root" className="yb-message-root" />
            {messageHolder}
            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">{children}</div>
          </div>
        </main>
      </div>
      {!onOverviewClick && config.dual ? (
        <DualColumnOverviewModal
          visible={overviewOpen && sideMode === 'dual'}
          onClose={() => setOverviewOpen(false)}
          title={dualOverviewTitle}
          config={config.dual}
        />
      ) : null}
    </div>
  )
}
