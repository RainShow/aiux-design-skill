import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import caretDown12 from '../assets/nav/shell/caret-down-12.svg'
import { NAV_RAIL_FOLD_H_PX, NAV_RAIL_FOLD_ICON_PX, NAV_RAIL_HAMBURGER_H_PX, NAV_RAIL_W_PX, NAV_SECOND_W_PX } from '../patterns/navShellLayout'
import { MaskIcon } from './MaskIcon'
import { NavWorkspaceSelect, type NavWorkspaceSelectProps } from './NavWorkspaceSelect'
import type { DualColumnNavConfig, DualSecondSection } from './types'

/** 位置选择器业务数据；`compact` 由侧导仅轨态接管，不要从外部传入 */
export type DualWorkspaceSelectProps = Omit<NavWorkspaceSelectProps, 'compact'>

/** 无二级面板时的稳定空数组，避免 `?? []` 导致 useEffect 死循环 */
const EMPTY_SECOND_SECTIONS: DualSecondSection[] = []

export type DualColumnSideNavProps = {
  config: DualColumnNavConfig
  activeRailKey: string
  activeSecondKey?: string | null
  collapsed?: boolean
  onRailChange?: (key: string) => void
  onFoldClick?: () => void
  /**
   * 顶部工作空间条内容。
   * `undefined`：默认 `NavWorkspaceSelect`（含位置选择器下拉）；`null`：不渲染顶条；传入节点则整段替换。
   * 接组织树请用 `workspaceSelectProps`，整段替换会丢掉仅轨 `compact`。
   */
  headerSlot?: ReactNode | null
  /** 注入组织树 / 创建回调等；仅 `headerSlot` 为 `undefined` 时生效 */
  workspaceSelectProps?: DualWorkspaceSelectProps
  /** 轨顶「功能全景」点击；有 `putawayIconSrc` 时必现汉堡入口 */
  onOverviewClick?: () => void
  foldIconSrc: string
  unfoldIconSrc: string
  /** 双列轨顶功能全景图标（汉堡）；传入即渲染，图标下不跟文字 */
  putawayIconSrc?: string
}

/**
 * 双列侧导（全模态数据智能）：60px 图标轨 + 180px 二级面板。
 * 整栏一块 `--yb-fill-2`；分隔线只画在轨的 `border-r`（收起时改透明占位）。
 * 一级选中只变图标/10px 文案主色，不要白底描边（白底是二级叶子）。
 * 轨结构对齐 Figma `344063:34873`：汉堡 52（px-12 py-16 + 底边）→ 菜单 py-12/gap-4/项 48 → 底 fold 60。
 */
export function DualColumnSideNav({
  config,
  activeRailKey,
  activeSecondKey = null,
  collapsed = false,
  onRailChange,
  onFoldClick,
  headerSlot,
  workspaceSelectProps,
  onOverviewClick,
  foldIconSrc,
  unfoldIconSrc,
  putawayIconSrc,
}: DualColumnSideNavProps) {
  const navigate = useNavigate()
  const homeKey = config.homeKey ?? 'home'
  const secondW = config.secondWidthPx ?? NAV_SECOND_W_PX
  const panels = config.panels[activeRailKey] ?? EMPTY_SECOND_SECTIONS
  const showSecond = !collapsed && activeRailKey !== homeKey && panels.length > 0
  const showOverview = Boolean(putawayIconSrc)
  const totalW = showSecond ? NAV_RAIL_W_PX + secondW : NAV_RAIL_W_PX
  const compactHeader = !showSecond

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const next: Record<string, boolean> = {}
    for (const s of panels) {
      if (s.type === 'group') next[s.key] = true
    }
    setOpenGroups(next)
  }, [activeRailKey, panels])

  const foldDisabled = activeRailKey === homeKey
  const header =
    headerSlot === null
      ? null
      : (headerSlot ?? (
          <NavWorkspaceSelect compact={compactHeader} {...workspaceSelectProps} />
        ))

  return (
    <div
      className={[
        'shrink-0 flex flex-col overflow-clip',
        'h-[calc(100dvh-var(--yb-topnav-h))]',
        'bg-[color:var(--yb-fill-2)]',
        'border-r border-solid border-[color:var(--yb-border-2)]',
      ].join(' ')}
      style={{ width: totalW }}
      data-name="menu_side_nav_oneplatform"
    >
      {header ? (
        <div
          className={[
            'w-full shrink-0 border-b border-solid border-[color:var(--yb-border-2)]',
            compactHeader
              ? 'flex flex-col items-center gap-[var(--yb-space-8)] px-[var(--yb-space-6)] py-[var(--yb-space-12)]'
              : 'flex flex-col items-start gap-[var(--yb-space-8)] p-[var(--yb-space-12)]',
          ].join(' ')}
          data-name="title"
        >
          {header}
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 items-stretch" data-name="menu">
        <aside
          className={[
            'flex h-full min-h-0 shrink-0 flex-col items-center overflow-hidden',
            'border-r border-solid',
            showSecond ? 'border-[color:var(--yb-border-2)]' : 'border-transparent',
          ].join(' ')}
          style={{ width: NAV_RAIL_W_PX }}
          data-name="left"
        >
          <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-between">
            <div className="flex min-h-0 w-full flex-1 flex-col items-center">
              {showOverview ? (
                <button
                  type="button"
                className={[
                  'flex w-full shrink-0 box-border flex-col items-center justify-center',
                  'border-b border-solid border-[color:var(--yb-border-2)] bg-transparent',
                  'px-[var(--yb-space-12)]',
                  'outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-6))] focus-visible:ring-offset-2',
                ].join(' ')}
                style={{ height: NAV_RAIL_HAMBURGER_H_PX }}
                  onClick={onOverviewClick}
                  aria-label="功能全景"
                  title="功能全景"
                >
                  <MaskIcon src={putawayIconSrc!} color="var(--yb-text-2)" size={20} />
                </button>
              ) : null}

              <div
                className="side-nav-scroll flex min-h-0 w-full flex-1 flex-col items-center gap-[var(--yb-space-4)] overflow-y-auto overflow-x-hidden py-[var(--yb-space-12)]"
                data-name="菜单"
              >
                {config.rail.map((item) => {
                  const isActive = item.key === activeRailKey
                  return (
                    <button
                      key={item.key}
                      type="button"
                      title={item.label}
                      className={[
                        'flex size-[var(--yb-menu-item)] shrink-0 flex-col items-center justify-center gap-[var(--yb-space-4)] leading-[0]',
                        'rounded-[var(--yb-radius-4)] border-0 bg-transparent p-[var(--yb-space-8)]',
                      ].join(' ')}
                      onClick={() => {
                        onRailChange?.(item.key)
                        if (item.path) navigate(item.path)
                        else {
                          const first = firstPathInPanel(config.panels[item.key])
                          if (first) navigate(first)
                        }
                      }}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <MaskIcon
                        src={item.iconSrc}
                        color={isActive ? 'var(--yb-primary-6)' : 'var(--yb-text-2)'}
                        size={20}
                      />
                      <span
                        className={[
                          'whitespace-nowrap text-[10px] font-normal leading-[normal]',
                          isActive
                            ? 'text-[color:var(--yb-primary-6)]'
                            : 'text-[color:var(--yb-text-2)]',
                        ].join(' ')}
                      >
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              type="button"
              className="flex w-full shrink-0 items-center justify-center border-0 bg-transparent p-[var(--yb-space-12)] disabled:opacity-[var(--yb-opacity-disabled)]"
              style={{ height: NAV_RAIL_FOLD_H_PX }}
              onClick={onFoldClick}
              disabled={foldDisabled}
              aria-label={collapsed ? '展开二级' : '折叠二级'}
            >
              {/**
               * Figma 344857:6926：60 条 + p-12 + 内层 36（p-8）+ 图标 20。
               * 展开态用折叠箭头（左），收起态用展开箭头（右）。不要 `collapsed ? fold : unfold`。
               */}
              <span className="flex size-[36px] items-center justify-center rounded-[var(--yb-radius-4)] p-[var(--yb-space-8)]">
                <MaskIcon
                  src={collapsed ? unfoldIconSrc : foldIconSrc}
                  color="var(--yb-text-2)"
                  size={NAV_RAIL_FOLD_ICON_PX}
                />
              </span>
            </button>
          </div>
        </aside>

        {showSecond ? (
          <div
            className="side-nav-scroll flex h-full min-h-0 flex-col items-start gap-[var(--yb-space-4)] overflow-y-auto overflow-x-hidden bg-[color:var(--yb-fill-2)] p-[var(--yb-space-12)]"
            style={{ width: secondW }}
            data-name="second-nav"
          >
            {panels.map((section) => (
              <SecondSectionBlock
                key={section.key}
                section={section}
                activeSecondKey={activeSecondKey}
                open={section.type === 'group' ? openGroups[section.key] !== false : true}
                onToggleGroup={(key) =>
                  setOpenGroups((prev) => ({ ...prev, [key]: !(prev[key] !== false) }))
                }
                onNavigate={(path) => navigate(path)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function firstPathInPanel(sections: DualSecondSection[] | undefined): string | undefined {
  if (!sections?.length) return undefined
  for (const s of sections) {
    if (s.type === 'item') return s.path
    if (s.type === 'group' && s.children[0]) return s.children[0].path
  }
  return undefined
}

function GroupCaret({ open, color }: { open: boolean; color: string }) {
  return (
    <span className="inline-flex size-[14px] shrink-0 items-center justify-center" aria-hidden>
      <span
        className="inline-flex size-[12px] items-center justify-center"
        style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transformOrigin: '50% 50%' }}
      >
        <MaskIcon src={caretDown12} color={color} size={12} fit="stretch" />
      </span>
    </span>
  )
}

function SecondSectionBlock({
  section,
  activeSecondKey,
  open,
  onToggleGroup,
  onNavigate,
}: {
  section: DualSecondSection
  activeSecondKey: string | null
  open: boolean
  onToggleGroup: (key: string) => void
  onNavigate: (path: string) => void
}) {
  if (section.type === 'item') {
    const isActive = activeSecondKey === section.key
    return (
      <button
        type="button"
        className={[
          'flex w-full items-center gap-[var(--yb-space-8)] overflow-clip rounded-[var(--yb-radius-4)]',
          'border border-solid p-[var(--yb-space-8)] text-left',
          isActive
            ? 'border-[color:var(--yb-border-3)] bg-[color:var(--yb-bg-2)]'
            : 'border-transparent bg-transparent',
        ].join(' ')}
        onClick={() => onNavigate(section.path)}
      >
        {section.iconSrc ? (
          <MaskIcon
            src={section.iconSrc}
            color={isActive ? 'var(--yb-primary-6)' : 'var(--yb-text-2)'}
            size={20}
            fit="stretch"
          />
        ) : (
          <span className="size-[var(--yb-icon)] shrink-0" aria-hidden />
        )}
        <span
          className={[
            'min-w-0 flex-1 truncate text-[length:var(--yb-fs-14)] leading-[var(--yb-lh-22)]',
            isActive
              ? 'font-semibold text-[color:var(--yb-primary-6)]'
              : 'font-normal text-[color:var(--yb-text-1)]',
          ].join(' ')}
        >
          {section.label}
        </span>
      </button>
    )
  }

  const groupActive = section.children.some((c) => c.key === activeSecondKey)
  const caretColor = groupActive ? 'var(--yb-primary-6)' : 'var(--yb-text-2)'

  return (
    <div className="flex w-full flex-col items-start gap-[var(--yb-space-4)]">
      <button
        type="button"
        className="flex w-full items-center gap-[var(--yb-space-8)] overflow-clip rounded-[var(--yb-radius-4)] border border-solid border-transparent bg-transparent p-[var(--yb-space-8)] text-left"
        onClick={() => onToggleGroup(section.key)}
      >
        {section.iconSrc ? (
          <MaskIcon
            src={section.iconSrc}
            color={groupActive ? 'var(--yb-primary-6)' : 'var(--yb-text-2)'}
            size={20}
            fit="stretch"
          />
        ) : (
          <span className="size-[var(--yb-icon)] shrink-0" aria-hidden />
        )}
        <span
          className={[
            'min-w-0 flex-1 truncate text-[length:var(--yb-fs-14)] leading-[var(--yb-lh-22)]',
            groupActive
              ? 'font-semibold text-[color:var(--yb-primary-6)]'
              : 'font-normal text-[color:var(--yb-text-2)]',
          ].join(' ')}
        >
          {section.label}
        </span>
        <GroupCaret open={open} color={caretColor} />
      </button>
      {open
        ? section.children.map((child) => {
            const isActive = activeSecondKey === child.key
            return (
              <button
                key={child.key}
                type="button"
                className={[
                  'flex w-full items-center gap-[var(--yb-space-8)] overflow-clip rounded-[var(--yb-radius-4)]',
                  'border border-solid p-[var(--yb-space-8)] text-left',
                  isActive
                    ? 'border-[color:var(--yb-border-3)] bg-[color:var(--yb-bg-2)]'
                    : 'border-transparent bg-transparent',
                ].join(' ')}
                onClick={() => onNavigate(child.path)}
              >
                <span className="size-[var(--yb-icon)] shrink-0" aria-hidden />
                <span
                  className={[
                    'min-w-0 flex-1 truncate text-[length:var(--yb-fs-14)] leading-[var(--yb-lh-22)]',
                    isActive
                      ? 'font-semibold text-[color:var(--yb-primary-6)]'
                      : 'font-normal text-[color:var(--yb-text-1)]',
                  ].join(' ')}
                >
                  {child.label}
                </span>
              </button>
            )
          })
        : null}
    </div>
  )
}
