import { forwardRef, useMemo } from 'react'
import { Input } from '@arco-design/web-react'
import type { RefInputType } from '@arco-design/web-react/es/Input/interface'
import { IconSearch } from '@arco-design/web-react/icon'
import type { SearchBoxProps, SearchBoxSize } from './types'

function mapSize(size: SearchBoxSize | undefined): 'small' | 'default' | 'large' {
  if (size === 'sm') return 'small'
  if (size === 'lg') return 'large'
  return 'default'
}

export const SearchBox = forwardRef<RefInputType, SearchBoxProps>(function SearchBox(
  {
    size = 'md',
    clearable = true,
    invalid = false,
    prefix,
    iconPlacement = 'left',
    allowClear: allowClearProp,
    status,
    className,
    placeholder = '输入关键词搜索',
    ...rest
  },
  ref,
) {
  const allowClear = allowClearProp !== undefined ? allowClearProp : clearable

  const mergedPrefix = useMemo(
    () => (
      <span className="flex items-center gap-1">
        <IconSearch
          style={{
            fontSize: 16,
            width: 16,
            height: 16,
            color: 'var(--color-text-2)',
          }}
        />
        {prefix}
      </span>
    ),
    [prefix],
  )

  const rightSuffix = useMemo(() => {
    if (iconPlacement !== 'right') return undefined
    return (
      <IconSearch
        style={{
          fontSize: 16,
          width: 16,
          height: 16,
          color: 'var(--color-text-2)',
        }}
      />
    )
  }, [iconPlacement])

  return (
    <Input
      ref={ref}
      size={mapSize(size)}
      allowClear={allowClear}
      status={invalid ? 'error' : status}
      prefix={iconPlacement === 'left' ? mergedPrefix : prefix}
      suffix={rightSuffix ?? rest.suffix}
      placeholder={placeholder}
      className={['w-full', className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
})

SearchBox.displayName = 'SearchBox'
