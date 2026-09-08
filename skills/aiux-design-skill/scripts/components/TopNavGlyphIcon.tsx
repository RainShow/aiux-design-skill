/**
 * 顶栏 20×20 热区内的非正方形 SVG 字形。
 * Figma 导出常带 `preserveAspectRatio="none"`；必须画在与 viewBox 同比例的 inset 盒里，
 * 禁止 `<img className="size-full">` 直接铺满正方形（会把文档/铃铛拉扁）。
 */
export function TopNavGlyphIcon({
  src,
  inset,
  className,
}: {
  src: string
  /** CSS `inset`，如文档 `8.33% 14.58%`、铃铛 `8.33% 12.5%` */
  inset: string
  className?: string
}) {
  return (
    <span
      className={['relative block size-[var(--yb-icon)] shrink-0', className].filter(Boolean).join(' ')}
      aria-hidden
    >
      <span className="absolute" style={{ inset }}>
        <img alt="" src={src} className="pointer-events-none block size-full max-w-none" />
      </span>
    </span>
  )
}
