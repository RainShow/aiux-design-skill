import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  NAV_SINGLE_COLLAPSED_BTN_PX,
  NAV_SINGLE_EXPANDED_W_PX,
  NAV_SINGLE_FOLD_BAR_INNER_W_PX,
} from '../patterns/navShellLayout'
import { MaskIcon } from './MaskIcon'
import { NavWorkspaceSelect } from './NavWorkspaceSelect'
import type { SingleColumnNavConfig } from './types'

export type SingleColumnSideNavProps = {
  config: SingleColumnNavConfig
  activeKey: string | null
  collapsed?: boolean
  onFoldClick?: () => void
  foldIconSrc: string
  unfoldIconSrc: string
}

/**
 * 单列侧导（应用开发 / 模型开发等）：展开 200px，折叠 60px。
 * 背景 `--yb-bg-4`；菜单行由 `config.rows` 注入。
 */
export function SingleColumnSideNav({
  config,
  activeKey,
  collapsed = false,
  onFoldClick,
  foldIconSrc,
  unfoldIconSrc,
}: SingleColumnSideNavProps) {
  const navigate = useNavigate()
  const flatItems = useMemo(
    () => config.rows.filter((r): r is Extract<(typeof config.rows)[number], { type: 'item' }> => r.type === 'item'),
    [config.rows],
  )

  return (
    <div
      className={[
        'shrink-0 flex flex-col overflow-clip',
        'h-[calc(100dvh-var(--yb-topnav-h))]',
        'bg-[color:var(--yb-bg-4)]',
        'border-r border-solid border-[color:var(--yb-border-2)]',
      ].join(' ')}
      style={{ width: collapsed ? 'var(--yb-side-w)' : NAV_SINGLE_EXPANDED_W_PX }}
      data-name={config.dataName ?? 'menu_side_nav_single'}
    >
      {collapsed ? (
        <div className="flex w-full flex-1 flex-col items-start gap-[4px] overflow-x-hidden overflow-y-auto px-[12px] py-[24px]">
          {flatItems.map((item) => {
            const isActive = activeKey === item.key
            return (
              <button
                key={item.key}
                type="button"
                title={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'box-border flex flex-col items-center justify-center overflow-clip rounded-[var(--yb-radius-4)]',
                  'border border-solid border-transparent bg-transparent p-[8px]',
                  isActive ? 'bg-[color:var(--yb-bg-2)] border-[color:var(--yb-border-3)]' : '',
                ].join(' ')}
                style={{
                  width: NAV_SINGLE_COLLAPSED_BTN_PX,
                  height: NAV_SINGLE_COLLAPSED_BTN_PX,
                  ...(isActive
                    ? { backgroundColor: 'var(--yb-bg-2)', borderColor: 'var(--yb-border-3)' }
                    : null),
                }}
                onClick={() => navigate(item.path)}
              >
                <MaskIcon
                  src={item.iconSrc}
                  color={isActive ? 'var(--yb-primary-6)' : 'var(--yb-text-2)'}
                  size={20}
                />
              </button>
            )
          })}
        </div>
      ) : (
        <div className="yb-layout-main-scroll flex min-h-0 flex-1 flex-col gap-[4px] overflow-x-hidden overflow-y-auto px-[12px] py-[24px]">
          {config.workspaceSlot === null
            ? null
            : (config.workspaceSlot ?? <NavWorkspaceSelect />)}
          {config.rows.map((row, idx) => {
            if (row.type === 'divider') {
              return (
                <div
                  key={`divider-${idx}`}
                  className="h-px w-full shrink-0 bg-[color:var(--yb-border-2)]"
                />
              )
            }
            if (row.type === 'group') {
              return (
                <div
                  key={`${row.label}/${idx}`}
                  className="overflow-clip rounded-[4px] px-[8px] pt-[8px]"
                  data-name="vertical-menu-item/group"
                >
                  <span className="whitespace-nowrap text-[12px] font-normal leading-[22px] text-[color:var(--yb-text-3)]">
                    {row.label}
                  </span>
                </div>
              )
            }
            const isActive = activeKey === row.key
            return (
              <button
                key={row.key}
                type="button"
                data-name="vertical-menu-item"
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'flex w-full items-center gap-[var(--yb-space-8)] overflow-clip rounded-[var(--yb-radius-4)]',
                  'border border-solid border-transparent bg-transparent p-[var(--yb-space-8)] text-left',
                  'outline-none focus:outline-none',
                  isActive ? 'bg-[color:var(--yb-bg-2)] border-[color:var(--yb-border-3)]' : '',
                ].join(' ')}
                style={
                  isActive
                    ? { backgroundColor: 'var(--yb-bg-2)', borderColor: 'var(--yb-border-3)' }
                    : undefined
                }
                onClick={() => navigate(row.path)}
              >
                <MaskIcon
                  src={row.iconSrc}
                  color={isActive ? 'var(--yb-primary-6)' : 'var(--yb-text-2)'}
                  size={20}
                />
                <span
                  className={[
                    'flex-1 overflow-hidden text-ellipsis whitespace-nowrap',
                    'text-[length:var(--yb-fs-14)] leading-[var(--yb-lh-22)]',
                    isActive
                      ? 'font-semibold text-[color:var(--yb-primary-6)]'
                      : 'font-normal text-[color:var(--yb-text-2)]',
                  ].join(' ')}
                >
                  {row.label}
                </span>
              </button>
            )
          })}
        </div>
      )}

      <button
        type="button"
        className="flex w-full shrink-0 items-center justify-center border-0 bg-[color:var(--yb-bg-4)] p-[12px]"
        onClick={onFoldClick}
        aria-label="fold"
      >
        <div
          className="relative flex shrink-0 items-center overflow-clip rounded-[4px] p-[8px]"
          style={{ width: collapsed ? NAV_SINGLE_COLLAPSED_BTN_PX : NAV_SINGLE_FOLD_BAR_INNER_W_PX }}
          data-name="vertical-menu-item"
        >
          <div className="grid size-[20px] shrink-0 place-items-center overflow-clip">
            <MaskIcon
              src={collapsed ? unfoldIconSrc : foldIconSrc}
              color="var(--yb-text-2)"
              size={20}
            />
          </div>
        </div>
      </button>
    </div>
  )
}
