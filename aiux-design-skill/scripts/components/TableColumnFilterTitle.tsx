import type { CSSProperties, ReactNode } from 'react'
import { useState } from 'react'
import { Dropdown, Menu, Tooltip } from '@arco-design/web-react'
import { IconCaretDown, IconCaretUp, IconFilter } from '@arco-design/web-react/icon'

export type TableColumnFilterOption = { label: string; value: string }

const ALL_KEY = '__all__'

/** 与 Arco Table 列排序态一致；用于表头内联排序（标题 → 排序 → 筛选） */
export type TableColumnFilterSortOrder = 'ascend' | 'descend' | null

export type TableColumnFilterSortControl = {
  order: TableColumnFilterSortOrder
  onClick: () => void
  /** 默认双向升降序 */
  sortDirections?: ('ascend' | 'descend')[]
}

/** 仅排序列表头：与 `TableColumnFilterTitle` 中「标题 + arco-table-sorter」布局一致（无筛选） */
export type TableColumnSortTitleProps = {
  title: ReactNode
  sort: TableColumnFilterSortControl
  /** 是否对标题做单行省略，默认 true（保持列表列头不挤压排序/筛选控件） */
  ellipsis?: boolean
}

const LIST_TABLE_COL_FILTER_TITLE_ROOT = 'list-table-col-filter-title-root'

export function TableColumnSortTitle({ title, sort, ellipsis = true }: TableColumnSortTitleProps) {
  return (
    <span
      className={`${LIST_TABLE_COL_FILTER_TITLE_ROOT} flex min-w-0 w-full max-w-full flex-1 items-center justify-start gap-2`}
    >
      <span
        className={[
          'shrink',
          ellipsis ? 'min-w-0 truncate' : 'whitespace-nowrap',
          'text-[14px] font-semibold leading-[22px] text-[color:var(--color-text-1)]',
        ].join(' ')}
      >
        {title}
      </span>
      <TableColumnHeaderSortTrigger {...sort} />
    </span>
  )
}

export type TableColumnFilterTitleProps = {
  /** 表头主文案（纯文案或节点；排序、筛选图标由组件按稿面顺序追加） */
  title: ReactNode
  /** 是否对标题做单行省略，默认 true */
  ellipsis?: boolean
  options: TableColumnFilterOption[]
  /** null 表示「全部」，不筛选（与数据服务列表页 Dropdown+Menu 一致） */
  value: string | null
  onChange: (next: string | null) => void
  dropdownPosition?: 'bl' | 'br' | 'tl' | 'tr'
  /** 是否展示「全部」菜单项，默认 true */
  showAllOption?: boolean
  /** 「全部」文案 */
  allOptionLabel?: string
  /** 下拉菜单最小宽度 */
  menuMinWidth?: number
  /**
   * 表头内联排序（稿：标题左侧成组，顺序为 标题 → 排序 → 筛选）。
   * 与列 `sorter` 二选一，避免 Arco 把排序块接到整段 title 之后。
   */
  sort?: TableColumnFilterSortControl
}

/**
 * 与 Arco Table `thead/column.js` 一致：`div.arco-table-sorter` 内并列 `div.arco-table-sorter-icon` + 激活态 class。
 * 主题 19155 下颜色、尺寸由 `@arco-design/web-react/es/Table/style` 与主题变量接管（勿再写纵向 flex 覆盖）。
 */
function TableColumnHeaderSortTrigger({
  order,
  onClick,
  sortDirections = ['ascend', 'descend'],
}: TableColumnFilterSortControl) {
  const dirs = sortDirections.length ? sortDirections : (['ascend', 'descend'] as const)
  const oneWay = dirs.length === 1

  return (
    <Tooltip content="排序" position="top">
      <div
        role="button"
        tabIndex={0}
        aria-label="排序"
        className={['arco-table-sorter shrink-0 cursor-pointer', oneWay ? 'arco-table-sorter-direction-one' : '']
          .filter(Boolean)
          .join(' ')}
        style={{ marginLeft: 0 }}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            e.stopPropagation()
            onClick()
          }
        }}
      >
        {dirs.includes('ascend') ? (
          <div
            className={['arco-table-sorter-icon', order === 'ascend' ? 'arco-table-sorter-icon-active' : '']
              .filter(Boolean)
              .join(' ')}
          >
            <IconCaretUp />
          </div>
        ) : null}
        {dirs.includes('descend') ? (
          <div
            className={['arco-table-sorter-icon', order === 'descend' ? 'arco-table-sorter-icon-active' : '']
              .filter(Boolean)
              .join(' ')}
          >
            <IconCaretDown />
          </div>
        ) : null}
      </div>
    </Tooltip>
  )
}

/**
 * 表头筛选：单选下拉菜单（Arco Dropdown + Menu），仅漏斗为触发区。
 * 视觉：标题 14/22/600（text-1）、与操作区间距、筛选 16px；可选内联排序 DOM 与 Arco `arco-table-sorter` 一致，配色随主题 Table。
 */
export function TableColumnFilterTitle({
  title,
  ellipsis = true,
  options,
  value,
  onChange,
  dropdownPosition = 'bl',
  showAllOption = true,
  allOptionLabel = '全部',
  menuMinWidth,
  sort,
}: TableColumnFilterTitleProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const active = value != null && value !== ''

  const selectedKeys = active && value ? [value] : [ALL_KEY]

  const iconStyle: CSSProperties = { fontSize: 16 }
  if (active) {
    iconStyle.color = 'rgb(var(--primary-6))'
  }

  const droplist = (
    <Menu
      style={menuMinWidth != null ? { minWidth: menuMinWidth } : undefined}
      selectedKeys={selectedKeys}
      onClickMenuItem={(key) => {
        const next = key === ALL_KEY ? null : String(key)
        onChange(next)
      }}
    >
      {showAllOption ? <Menu.Item key={ALL_KEY}>{allOptionLabel}</Menu.Item> : null}
      {options.map((o) => (
        <Menu.Item key={o.value}>{o.label}</Menu.Item>
      ))}
    </Menu>
  )

  return (
    <span
      className={`${LIST_TABLE_COL_FILTER_TITLE_ROOT} flex min-w-0 w-full max-w-full flex-1 items-center justify-start gap-2`}
    >
      <span
        className={[
          'shrink',
          ellipsis ? 'min-w-0 truncate' : 'whitespace-nowrap',
          'text-[14px] font-semibold leading-[22px] text-[color:var(--color-text-1)]',
        ].join(' ')}
      >
        {title}
      </span>
      {sort ? <TableColumnHeaderSortTrigger {...sort} /> : null}
      <Dropdown
        droplist={droplist}
        trigger="click"
        position={dropdownPosition}
        popupVisible={dropdownOpen}
        onVisibleChange={setDropdownOpen}
      >
        <span
          className={[
            'group/table-col-filter inline-flex shrink-0 cursor-pointer select-none items-center rounded-[var(--border-radius-small)] p-0.5 transition-colors',
            'hover:bg-[color:var(--color-fill-2)]',
            dropdownOpen ? 'bg-[color:var(--color-fill-2)]' : '',
          ].join(' ')}
          role="button"
          tabIndex={0}
          onClick={(e) => e.stopPropagation()}
        >
          <IconFilter
            className={
              active
                ? 'transition-colors'
                : 'text-[color:var(--color-text-3)] transition-colors group-hover/table-col-filter:text-[color:var(--color-text-2)]'
            }
            style={iconStyle}
          />
        </span>
      </Dropdown>
    </span>
  )
}
