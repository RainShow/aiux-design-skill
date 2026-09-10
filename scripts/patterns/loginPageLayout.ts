/**
 * 登录页布局常量（对齐 Figma 755:5716 / 背景 576:16786）。
 * 说明见同 Skill `login-page.md`。
 */
import { NAV_LAYOUT_MIN_W_PX } from './navShellLayout'

/** 路由 path */
export const LOGIN_ROUTE_PATH = '/login' as const

/** 壳层在登录路由下的底色（与背景主色一致，避免未铺图闪白） */
export const LOGIN_SHELL_BG = '#dceaff' as const

/** 背景层未铺图时的底色 */
export const LOGIN_BG_FALLBACK = '#dceaff' as const

/**
 * 主底图 `bg-2160-1.png`（约 4096×2276）宽度 class：
 * 保留 `min(2048px,170%)` 构图，并以 `100dvh*(4096/2276)` 盖满高视口，避免顶部露底色。
 * 见 `login-page.md` §6。
 */
export const LOGIN_BG_MAIN_WIDTH_CLASS =
  'w-[max(100%,min(2048px,170%),calc(100dvh*4096/2276))]' as const

/**
 * 登录页最小宽：与产品壳 `--yb-layout-min-w` 一致。
 * 视口更窄时由 html 横向滚动，不按 1024px 切到仅卡片的移动布局。
 */
export const LOGIN_LAYOUT_MIN_W_PX = NAV_LAYOUT_MIN_W_PX
export const LOGIN_DESKTOP_MIN_PX = LOGIN_LAYOUT_MIN_W_PX
export const LOGIN_ROOT_MIN_W_CLASS = 'min-w-[var(--yb-layout-min-w)]' as const

/** 桌面主区：三栏从最小宽起始终展示 */
export const LOGIN_DESKTOP_MAIN_CLASS =
  'grid min-h-0 w-full min-w-0 flex-1 grid-cols-[29.22fr_8.28fr_37.5fr] items-start px-[12.5%] pt-[22.625vh]' as const

/**
 * 桌面主区栅格：左右边距各 12.5%，中间三列比例 29.22 : 8.28 : 37.5
 *（对应 Tailwind `grid-cols-[29.22fr_8.28fr_37.5fr]` + `px-[12.5%]`）
 */
export const LOGIN_DESKTOP_SIDE_PAD = '12.5%' as const
export const LOGIN_DESKTOP_COL_TEMPLATE = '29.22fr 8.28fr 37.5fr' as const

/** 桌面主区顶距（相对视口高度） */
export const LOGIN_DESKTOP_MAIN_PT_VH = 22.625 as const

/** 左侧文案区额外顶距 */
export const LOGIN_HERO_PT_VH = 2.99 as const

/** 登录卡片 */
export const LOGIN_CARD_MAX_W_PX = 480 as const
export const LOGIN_CARD_MIN_H_VH = 54.75 as const
export const LOGIN_CARD_RADIUS_CLASS = 'rounded-xl' as const
export const LOGIN_CARD_PAD_CLASS = 'px-10 pb-10 pt-16' as const
/** 卡片背景：Arco `var(--color-bg-2)` */
export const LOGIN_CARD_BG = 'var(--color-bg-2)' as const

/** 左侧品牌渐变字（「中国电子云」） */
export const LOGIN_BRAND_GRADIENT =
  'linear-gradient(90deg, #3370ff 35%, #9a52ff 100%)' as const

/** 表单区：账号/密码与按钮块间距 */
export const LOGIN_FORM_STACK_GAP_CLASS = 'gap-6' as const

/** 「忘记密码 | 立即注册」分隔与间距 */
export const LOGIN_AUX_LINK_GAP_PX = 27 as const

/** 页脚 */
export const LOGIN_FOOTER_MAX_W_PX = 1280 as const
export const LOGIN_FOOTER_PAD_CLASS = 'px-6 pb-5' as const

/** 左上角品牌：距边 24px（`left-6 top-6`） */
export const LOGIN_BRAND_INSET_CLASS = 'left-6 top-6' as const
