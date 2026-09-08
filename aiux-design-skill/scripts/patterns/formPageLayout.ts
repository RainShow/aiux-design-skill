import type { CSSProperties } from 'react'

/**
 * 通用「表单配置页」布局常量（与 `index.css` 中 `.app-form-page` 配套）。
 * 参考实现：
 * - 全页水平表单 + 顶栏 / 底栏：`CreateCatalogPage`、`ObjectStorageManagePage`、`CreateDataTableServiceAttrPage`、`CreateDataTransferTaskPage` 等
 * - 抽屉垂直表单：`integrate/connection/AddDataSourcePage.tsx`（添加-MySQL）；`DataSourceManagePage.tsx`（数据源管理列表 + 详情抽屉）
 * 说明文档：aiux-design-skill 内 `references/form-page.md`
 */

/** 挂在 Arco `Form` 上，启用统一 label / 控件宽度 / 子控件拉满等样式 */
export const FORM_PAGE_ARCO_CLASS = 'app-form-page'

/** 与 `index.css` 中 `.app-form-page` 水平表单的 `--yb-form-required-space`(12) + `--yb-form-required-gap`(4) 一致 */
export const FORM_PAGE_LABEL_STAR_GAP_PX = 16 as const

/** 全页水平表单 label 列默认最小宽度（px）；Arco `Col` 的 `flex: 'Npx'` 会规范为 `0 0 Npx` */
export const FORM_PAGE_LABEL_COL_MIN_PX = 112 as const

export const FORM_PAGE_LABEL_COL = { flex: `${FORM_PAGE_LABEL_COL_MIN_PX}px` } as const
export const FORM_PAGE_WRAPPER_COL = { flex: '1' } as const

/**
 * 按「当前页」全部 label 文案中最长的一条估算水平 `Form` 的 `labelCol` 宽度，使控件列左缘对齐。
 * 粗估：14px 级中文约 16px/字 + 必填星与间距占位，再向上取整到 8px。
 */
export function formPageHorizontalLabelColFromLabels(labels: readonly string[]): { flex: string } {
  const maxChars = labels.reduce((m, s) => Math.max(m, Array.from(s).length), 0) || 1
  const raw = FORM_PAGE_LABEL_STAR_GAP_PX + maxChars * 16 + 8
  const px = Math.min(320, Math.max(FORM_PAGE_LABEL_COL_MIN_PX, Math.ceil(raw / 8) * 8))
  return { flex: `${px}px` }
}
export const FORM_PAGE_FORM_STYLE: CSSProperties = { width: '100%' }

/** 表单项 `Form.Item` 的 `extra` 说明文案样式（见 `docs/form-page-layout-reference.md` §13） */
export const FORM_FIELD_EXTRA_CLASS = 'text-[12px] leading-[18px] text-[color:var(--color-text-3)]'

/** 表单项内局部控件宽度按 80px 档位递增（如 160 = 2×80，640 = 8×80） */
export const FORM_CTRL_STEP_PX = 80
export function formCtrlWidth(steps: number) {
  return FORM_CTRL_STEP_PX * steps
}
export const FORM_CTRL_W_160 = formCtrlWidth(2)

/** 分组之间 `Divider`：仅保留下方 24px；上方由表单项默认下边距承接，避免与分割线叠出过大空白 */
export const FORM_SECTION_DIVIDER_STYLE: CSSProperties = { marginTop: 0, marginBottom: 24 }

/** 同一行多列 `Grid.Row` 表单项水平间距（`gutter`） */
export const FORM_GRID_ROW_GUTTER = 32

// ---- 全页表单顶栏（返回 + 主标题，与 `docs/form-page-layout-reference.md` §2.1 一致）----

/** 顶栏固定高度（px）；下接 `Divider style={{ margin: 0 }}`（1px / --yb-border-2，见 page-layout.css） */
export const FORM_PAGE_CHROME_HEADER_HEIGHT_PX = 80

/** 返回按钮与主标题水平间距（px），与详情页 PageHeader 主行一致 */
export const FORM_PAGE_HEADER_BACK_TITLE_GAP_PX = 16

/** 方形返回按钮：与 `detail-page-layout-reference.md` §2 左侧一致 */
export const FORM_PAGE_HEADER_BACK_BUTTON_STYLE: CSSProperties = {
  flexShrink: 0,
  width: 32,
  height: 32,
  padding: 0,
}

/** `Typography.Title` `heading={5}` 主标题，与详情页 PageHeader 一致 */
export const FORM_PAGE_HEADER_TITLE_STYLE: CSSProperties = {
  margin: 0,
  flex: '0 1 auto',
  fontSize: 20,
  lineHeight: '30px',
  fontWeight: 600,
  color: 'var(--color-text-1)',
}

// ---- 全页表单底栏（默认确定 / 取消；创建流才用下一步 / 保存草稿）----

/** 底栏行高（px）：顶边框 + 水平内边距，与 36px 主按钮垂直留白一致 */
export const FORM_PAGE_FOOTER_ACTION_BAR_HEIGHT_PX = 68

/** 底栏主/次按钮高度（px），与全页表单底栏 36 高按钮一致 */
export const FORM_PAGE_FOOTER_PRIMARY_BUTTON_HEIGHT_PX = 36

/** 底栏外层：顶部分隔 1px / --yb-border-2，与页头 Divider / 壳层 hairline 同档 */
export const FORM_PAGE_FOOTER_BAR_CLASS =
  'w-full shrink-0 border-t border-solid border-[color:var(--yb-border-2)] bg-[color:var(--color-bg-2)]' as const

/**
 * 底栏按钮行：左对齐 + 主→次间距。
 * **禁止**叠加 `justify-end` / `ml-auto`。
 */
export const FORM_PAGE_FOOTER_ACTIONS_CLASS = 'flex items-center gap-3 px-6' as const

/** 底栏按钮统一尺寸（主/次共用高度与最小宽） */
export const FORM_PAGE_FOOTER_BUTTON_STYLE: CSSProperties = {
  height: FORM_PAGE_FOOTER_PRIMARY_BUTTON_HEIGHT_PX,
  paddingLeft: 16,
  paddingRight: 16,
  minWidth: 80,
}

// ---- 抽屉内垂直表单（与 `docs/form-page-layout-reference.md` 第 11 节一致）----

/** 抽屉宽度档位（px）：窄表单 / 中等内容 / 宽表（如字段映射配置） */
export const FORM_DRAWER_WIDTH_SM = 600
export const FORM_DRAWER_WIDTH_MD = 900
export const FORM_DRAWER_WIDTH_LG = 1200

/** 配置类抽屉默认宽度（添加/编辑等短表单），等价 {@link FORM_DRAWER_WIDTH_SM} */
export const FORM_DRAWER_WIDTH = FORM_DRAWER_WIDTH_SM

/**
 * 挂在 Arco `Drawer` 的 `className` 上，启用 `index.css` 中标题栏高度（与 `--yb-topnav-h` 一致）及关闭按钮垂直居中。
 */
export const FORM_DRAWER_ARCO_CLASS = 'yb-form-drawer'

/** 抽屉标题栏高度（px），与 `--yb-topnav-h`、`.yb-form-drawer` 样式保持一致 */
export const FORM_DRAWER_HEADER_HEIGHT = 56

/**
 * 抽屉内 `Grid.Row` 横向间距：容器较窄，通常小于全页表单的 `FORM_GRID_ROW_GUTTER`（32）。
 * 与「添加-MySQL」等服务地址+端口并排场景对齐。
 */
export const FORM_DRAWER_GRID_ROW_GUTTER = 8
