import bgMain from '../assets/login/bg-2160-1.png'
import bgLayer19 from '../assets/login/image-19-2.png'
import bgLayer63 from '../assets/login/image-63-1.png'
import bgLayer94 from '../assets/login/image-94-1.png'
import gradientTop1 from '../assets/login/gradient-top-1.svg'
import gradientTop2 from '../assets/login/gradient-top-2.svg'
import { LOGIN_BG_FALLBACK, LOGIN_BG_MAIN_WIDTH_CLASS } from '../patterns/loginPageLayout'

/**
 * 登录页背景（对齐 Figma「01 登录浅色-1」节点 576:16786）
 * 布局规范：`.cursor/skills/aiux-design-skill/references/login-page.md`
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
        src={bgLayer19}
        alt=""
        className="absolute left-1/2 top-[6%] h-auto w-[min(1504px,140%)] max-w-none -translate-x-1/2 object-cover"
      />
      <img
        src={bgLayer63}
        alt=""
        className="absolute left-1/2 top-1/2 h-auto w-[min(1968px,160%)] max-w-none -translate-x-1/2 -translate-y-1/2 object-bottom"
      />
      <img
        src={bgLayer94}
        alt=""
        className="absolute left-[-3%] top-[3%] h-auto w-[min(1699px,145%)] max-w-none object-cover"
      />
      <img
        src={bgMain}
        alt=""
        className={`absolute bottom-0 left-1/2 h-auto min-h-full min-w-full max-w-none -translate-x-1/2 object-cover object-bottom ${LOGIN_BG_MAIN_WIDTH_CLASS}`}
      />
      <img
        src={gradientTop1}
        alt=""
        className="absolute left-0 top-0 h-[min(324px,32vh)] w-full object-cover object-top"
      />
      <img
        src={gradientTop2}
        alt=""
        className="absolute left-0 top-[-2%] h-[min(324px,32vh)] w-full object-cover object-top"
      />
    </div>
  )
}
