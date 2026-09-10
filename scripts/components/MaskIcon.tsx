import type { MaskIconProps } from './types'

/**
 * 侧导图标：用 mask 着色，激活态可切主色。
 * 落地：`src/components/MaskIcon.tsx`
 */
export function MaskIcon({
  src,
  color,
  size = 20,
  fit = 'contain',
  style,
  className,
}: MaskIconProps) {
  return (
    <span
      className={['block shrink-0', className].filter(Boolean).join(' ')}
      style={{
        width: size,
        height: size,
        flex: '0 0 auto',
        backgroundColor: color,
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: fit === 'stretch' ? '100% 100%' : 'contain',
        maskSize: fit === 'stretch' ? '100% 100%' : 'contain',
        ...style,
      }}
      aria-hidden
    />
  )
}
