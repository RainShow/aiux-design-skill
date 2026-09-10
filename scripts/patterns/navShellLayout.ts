/**
 * 产品导航壳布局常量（顶栏 + 双列/单列侧导）。
 * 说明见同 Skill `references/layout.md`。
 */

/** 顶栏高度（与 `--yb-topnav-h` 一致） */
export const NAV_TOP_H_PX = 56 as const

/** 双列一级图标轨 / 单列折叠宽（与 `--yb-side-w` 一致） */
export const NAV_RAIL_W_PX = 60 as const

/** 双列二级面板宽 */
export const NAV_SECOND_W_PX = 180 as const

/** 双列展开总宽 = 轨 + 二级 */
export const NAV_DUAL_EXPANDED_W_PX = NAV_RAIL_W_PX + NAV_SECOND_W_PX

/** 单列展开宽（应用开发等） */
export const NAV_SINGLE_EXPANDED_W_PX = 200 as const

/** 双列一级菜单项点击区（与 `--yb-menu-item` 一致） */
export const NAV_RAIL_ITEM_PX = 48 as const

/** 双列轨顶汉堡条高度：px-12 + py-16 + 图标 20（Figma 353653:9783） */
export const NAV_RAIL_HAMBURGER_H_PX = 52 as const

/** 双列轨底 fold 条高度（Figma 344857:6926） */
export const NAV_RAIL_FOLD_H_PX = 60 as const

/** 双列轨底 fold 图标边长（Figma icon 20×20，带 2.5 内边距） */
export const NAV_RAIL_FOLD_ICON_PX = 20 as const

/** 壳层最小宽度（与 `--yb-layout-min-w` 一致） */
export const NAV_LAYOUT_MIN_W_PX = 1280 as const

/** 单列折叠态图标按钮边长 */
export const NAV_SINGLE_COLLAPSED_BTN_PX = 36 as const

/** 单列折叠条内展开态按钮宽 */
export const NAV_SINGLE_FOLD_BAR_INNER_W_PX = 176 as const

/**
 * 顶栏文档图标在 20px 热区内的光学 inset（对齐 viewBox 14.17×16.67）。
 * 与 ProductTopNav `inset-[8.33%_14.58%]` 一致。
 */
export const TOPNAV_GLYPH_INSET_FILE = '8.33% 14.58%' as const

/**
 * 顶栏铃铛图标在 20px 热区内的光学 inset（对齐 viewBox 15×16.67）。
 * 与 ProductTopNav `inset-[8.33%_12.5%]` 一致。
 */
export const TOPNAV_GLYPH_INSET_BELL = '8.33% 12.5%' as const

/** 功能全景浮层：对齐 Figma modal_menu（575:36599） */
export const NAV_OVERVIEW_PANEL_W_PX = 400 as const
export const NAV_OVERVIEW_INSET_PX = 10 as const
export const NAV_OVERVIEW_RADIUS_PX = 12 as const
export const NAV_OVERVIEW_ICON_PX = 22 as const
export const NAV_OVERVIEW_SECTION_GAP_PX = 16 as const
export const NAV_OVERVIEW_DESC_MAX_W_PX = 312 as const
export const NAV_OVERVIEW_TITLE_COL_W_PX = 268 as const
export const NAV_OVERVIEW_Z_MASK = 1099 as const
export const NAV_OVERVIEW_Z_PANEL = 1100 as const
export const NAV_OVERVIEW_SHADOW = '0px 8px 20px 0px rgba(0, 0, 0, 0.12)' as const
export const NAV_OVERVIEW_MASK_BG = 'rgba(15, 19, 31, 0.25)' as const
/** 分区标题 / 叶子链路 */
export const NAV_OVERVIEW_TEXT = '#23293b' as const
/** 分区简介 */
export const NAV_OVERVIEW_DESC = '#646c85' as const

/**
 * 功能全景面板定位与外形：宽 400、顶底各留 10，高度铺满窗口（不要用 maxHeight 随内容收缩）。
 */
export const NAV_OVERVIEW_PANEL_STYLE = {
  left: `${NAV_OVERVIEW_INSET_PX}px`,
  top: `calc(var(--yb-topnav-h) + ${NAV_OVERVIEW_INSET_PX}px)`,
  width: NAV_OVERVIEW_PANEL_W_PX,
  height: `calc(100dvh - var(--yb-topnav-h) - ${NAV_OVERVIEW_INSET_PX * 2}px)`,
  borderRadius: NAV_OVERVIEW_RADIUS_PX,
  boxShadow: NAV_OVERVIEW_SHADOW,
} as const

/** 侧导位置选择器下拉：宽 280 × 高 400 */
export const NAV_ORG_SELECT_PANEL_W_PX = 280 as const
export const NAV_ORG_SELECT_PANEL_H_PX = 400 as const

/**
 * 底栏「创建工作空间」外链图标边长（px）。
 * 资源 viewBox 约 12.67，按 16 槽渲染会偏大。
 */
export const NAV_ORG_SELECT_CREATE_ICON_PX = 12 as const
