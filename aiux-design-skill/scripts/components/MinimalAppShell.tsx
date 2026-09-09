import type { CSSProperties, ReactNode } from 'react'
import { useEffect } from 'react'
import { Message } from '@arco-design/web-react'
import { setGlobalMessageApi } from '../patterns/globalMessage'

export type MinimalAppShellProps = {
  children: ReactNode
  /** 可选顶栏（业务自定义）；不传则仅内容区 */
  topNav?: ReactNode
  /** 可选侧栏（业务自定义）；不传则内容区全宽 */
  sideNav?: ReactNode
  /**
   * 登录等全屏页：去掉顶栏/侧栏结构与主区滚动，改为
   * `relative min-h-0 flex-1 overflow-hidden`。
   */
  fullscreen?: boolean
  /** 根容器额外 class（如登录页底色） */
  className?: string
  /** 内容区额外 class */
  contentClassName?: string
  /** 根容器内联样式 */
  style?: CSSProperties
}

/**
 * 最小应用壳：挂载全局 Message + 顶栏/侧栏插槽 + 可滚动内容区。
 * 不含登录鉴权、产品侧导与路由高亮（那些属于业务，不在本 Skill 内）。
 *
 * 相对导入已对齐落地路径（`../patterns/globalMessage`），复制到业务仓同位置后不必改 import。
 */
export function MinimalAppShell({
  children,
  topNav,
  sideNav,
  fullscreen = false,
  className,
  contentClassName,
  style,
}: MinimalAppShellProps) {
  const [messageApi, messageHolder] = Message.useMessage({
    maxCount: 3,
    getContainer: () => document.getElementById('yb-message-root') ?? document.body,
  })

  useEffect(() => {
    setGlobalMessageApi(messageApi)
    return () => setGlobalMessageApi(null)
  }, [messageApi])

  if (fullscreen) {
    return (
      <div
        className={[
          'flex h-[100dvh] w-full min-h-0 min-w-[var(--yb-layout-min-w)] flex-col overflow-hidden text-[color:var(--yb-text-2)]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={style}
      >
        <div id="yb-message-root" className="yb-message-root" />
        {messageHolder}
        <div
          className={['relative min-h-0 flex-1 overflow-hidden', contentClassName]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>
      </div>
    )
  }

  return (
    <div
      className={[
        'flex h-[100dvh] w-full min-h-0 flex-col overflow-hidden bg-[color:var(--yb-bg-1)] text-[color:var(--yb-text-2)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {topNav}
      <div className="flex min-h-0 min-w-0 flex-1">
        {sideNav}
        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">
          <div
            className={[
              'yb-layout-main-scroll relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-x-hidden overflow-y-auto bg-[color:var(--yb-bg-1)]',
              contentClassName,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div id="yb-message-root" className="yb-message-root" />
            {messageHolder}
            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
