import { globalMessage } from '../patterns/globalMessage'
import { TOPNAV_GLYPH_INSET_BELL, TOPNAV_GLYPH_INSET_FILE } from '../patterns/navShellLayout'
import iconFile from '../assets/nav/shell/icon-file.svg'
import iconNotification from '../assets/nav/shell/icon-notification.svg'
import { TopNavGlyphIcon } from './TopNavGlyphIcon'

/**
 * 顶栏右侧文档 / 消息（演示槽）。
 * `ProductAppShell` 未传 `topNavRightExtra` 时默认渲染本组件；传 `null` 可关闭。
 * 自定义右侧时必须继续用 `TopNavGlyphIcon`，勿把 SVG 铺满 20×20。
 */
export function ProductTopNavRightExtra() {
  return (
    <div className="flex shrink-0 items-center gap-[var(--yb-space-16)]">
      <button
        type="button"
        className="flex size-[var(--yb-icon)] shrink-0 items-center justify-center overflow-visible border-0 bg-transparent p-0"
        aria-label="文档"
        onClick={() => globalMessage.info('文档功能演示暂未开放')}
      >
        <TopNavGlyphIcon src={iconFile} inset={TOPNAV_GLYPH_INSET_FILE} />
      </button>
      <div className="relative size-[var(--yb-icon)] shrink-0">
        <button
          type="button"
          className="flex size-full items-center justify-center overflow-visible border-0 bg-transparent p-0"
          aria-label="消息"
          onClick={() => globalMessage.info('消息功能演示暂未开放')}
        >
          <TopNavGlyphIcon src={iconNotification} inset={TOPNAV_GLYPH_INSET_BELL} />
        </button>
        <div
          className="pointer-events-none absolute"
          style={{
            left: 'var(--yb-badge-left)',
            top: 'var(--yb-badge-top)',
            width: 'var(--yb-badge-dot)',
            height: 'var(--yb-badge-dot)',
          }}
          aria-hidden
        >
          <div className="size-full rounded-[var(--yb-radius-100)] bg-[color:var(--yb-danger-6)]" />
        </div>
      </div>
    </div>
  )
}
