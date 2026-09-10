/**
 * 「开发任务 IDE 页」布局常量（与 `index.css` 中 `.dev-task-detail.dev-task-ide-root` 的 CSS 变量配套）。
 *
 * 说明：
 * - 页面根节点请在 `dev-task-detail` 同一元素上附加 `DEV_TASK_IDE_ROOT_CLASS`（`dev-task-ide-root`），用于承载可覆写的尺寸 token。
 * - 视觉样式仍以 `index.css` 的 `dev-task-*` / `dev-task-ide-*` 为准；此处仅沉淀“可复用尺寸/类名入口”，避免业务页散落魔法数。
 */

/**
 * 根容器附加类：与 `dev-task-detail` **同一 DOM 节点**并用，用于承载 IDE 页 CSS 变量
 *（见 `index.css` `.dev-task-detail.dev-task-ide-root`）。
 */
export const DEV_TASK_IDE_ROOT_CLASS = 'dev-task-ide-root' as const

/** 右侧配置面板展开宽度（px）——与 `--dev-task-right-panel-w` 默认保持一致 */
export const DEV_TASK_RIGHT_PANEL_WIDTH_PX = 400 as const

/** 右侧竖向 Tab 条宽度（px）——与 `--dev-task-side-tabs-w` 默认保持一致 */
export const DEV_TASK_SIDE_TABS_WIDTH_PX = 40 as const

/** 编辑器底部「运行结果」收起高度（px） */
export const DEV_TASK_RESULT_COLLAPSED_HEIGHT_PX = 48 as const

/** 编辑器底部「运行结果」展开高度（px） */
export const DEV_TASK_RESULT_EXPANDED_HEIGHT_PX = 240 as const

/** 「版本」面板表格最小宽度（用于横向滚动，避免右侧面板内折行叠字） */
export const DEV_TASK_VERSION_TABLE_MIN_WIDTH_PX = 840 as const
