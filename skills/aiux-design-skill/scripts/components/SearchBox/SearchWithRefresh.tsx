import type { ChangeEvent, CSSProperties } from 'react'
import { Button } from '@arco-design/web-react'
import { IconRefresh } from '@arco-design/web-react/icon'
import { globalMessage } from '../../patterns/globalMessage'
import { SearchBox } from './SearchBox'
import type { SearchBoxProps } from './types'

/** 与安全组管理等列表页一致的方形次要刷新按钮 */
export function ListToolbarRefreshButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="secondary"
      shape="square"
      size="default"
      icon={<IconRefresh />}
      aria-label="刷新"
      onClick={onClick}
    />
  )
}

export type SearchWithRefreshProps = {
  /**
   * 包裹 `SearchBox` 的容器样式。
   * 安全组等为 `{ width: 280 }`；数据源/传输等为 `{ width: 480, maxWidth: '100%' }`；服务管理为 `{ width: 240 }` 等。
   */
  searchWrapStyle?: CSSProperties
  /** 外层 `flex` 容器 class，例如 `min-w-0` */
  className?: string
  /**
   * 点击刷新按钮后触发（在清空关键词 `onChange('')` 之后调用）。
   * 用于从接口或本地持久化重新拉取列表数据。
   */
  onRefresh?: () => void
  /**
   * 为 `false` 时不弹出内置「列表已刷新」，便于业务在 `onRefresh` 里自定义一条提示（避免双提示）。
   * @default true
   */
  showRefreshMessage?: boolean
} & Pick<SearchBoxProps, 'placeholder' | 'value' | 'onChange' | 'size' | 'allowClear' | 'iconPlacement'>

/**
 * 列表工具区：搜索框 + 刷新（清空关键词），与 `SecurityGroupManagePage` 组件规格一致。
 * 刷新时先调用 `onChange('')`，再调用可选的 `onRefresh`；请在 `onChange` 内处理分页重置，并传 `onRefresh` 以重新合并/拉取列表数据。
 */
export function SearchWithRefresh({
  searchWrapStyle = { width: 280 },
  className,
  placeholder,
  value,
  onChange,
  onRefresh,
  showRefreshMessage = true,
  size = 'md',
  allowClear = false,
  iconPlacement = 'right',
}: SearchWithRefreshProps) {
  const handleRefresh = () => {
    if (!onChange) return
    // Arco `Input` 的 `onChange` 签名为 (value, event)；刷新仅同步清空受控值
    onChange('', {} as ChangeEvent<HTMLInputElement>)
    onRefresh?.()
    if (showRefreshMessage) {
      globalMessage.success('列表已刷新')
    }
  }

  return (
    <div className={['flex items-center gap-2', className].filter(Boolean).join(' ')}>
      <div style={searchWrapStyle}>
        <SearchBox
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          size={size}
          allowClear={allowClear}
          iconPlacement={iconPlacement}
        />
      </div>
      <ListToolbarRefreshButton onClick={handleRefresh} />
    </div>
  )
}
