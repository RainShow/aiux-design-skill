import bgMain from '../assets/login/bg-2160-1.png'
import { LOGIN_BG_FALLBACK, LOGIN_BG_MAIN_WIDTH_CLASS } from '../patterns/loginPageLayout'

/**
 * 登录页背景（对齐 Figma「01 登录浅色-1」节点 576:16786）
 * 布局规范：`.cursor/skills/aiux-design-skill/references/login-page.md`
 *
 * 默认只铺主底图 `bg-2160-1.png`。不要再拷 `image-*-*.png` / `gradient-top-*.svg`。
 *
 * 主底图宽度：保留稿面 `min(2048px, 170%)` 的构图比例；
 * 同时用 `100dvh * (4096/2276)` 保证高视口下高度盖满，避免顶部露底色。
 *
 * 相对导入已对齐落地路径：复制到 `src/auth/` 后不必改 import。
 */
export function LoginPageBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ backgroundColor: LOGIN_BG_FALLBACK }}
    >
      <img
        src={bgMain}
        alt=""
        className={`absolute bottom-0 left-1/2 h-auto min-h-full min-w-full max-w-none -translate-x-1/2 object-cover object-bottom ${LOGIN_BG_MAIN_WIDTH_CLASS}`}
      />
    </div>
  )
}
