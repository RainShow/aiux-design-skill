# IDE 页

左侧树 / 列表选对象 → 中间编辑器 → 右侧多分区配置 → 底部可收起结果区。不是普通详情页，也不是全页表单。

## 目录

| 场景 | 说明 |
|------|------|
| [共性规则](#共性规则) | 双根 class、flex `min-h-0`、结构线 1px |
| [1. 页面骨架](#1-页面骨架dom-层级) | `dev-task-detail*` 层级，勿另起一套命名 |
| [2. 尺寸 token](#2-尺寸与-token) | 右栏 400、竖 Tab 40、结果区 48 / 240 |
| [3. 滚动与结果区](#3-滚动与底部面板) | 结果区绝对定位，编辑器高度扣减 |
| [4. 右侧配置](#4-右侧配置内容) | 复用表单 class；宽表横向滚 |

相关：[form-page.md](form-page.md)（右栏表单）、[detail-page.md](detail-page.md)（只读详情走开）、[empty-state.md](empty-state.md)。

---

## 意图 / 何时用 / 资产

**意图**：在一屏里改代码、改配置、看运行结果，三栏高度由 flex 算清，不要让结果区把编辑器顶出视口。

**何时用**

| 判断 | 用 |
|------|----|
| 左选对象 + 中编辑器 + 右配置 + 底结果 | 本文 |
| 只读字段 / 主 Tab 详情 | 不要用本文，走 [detail-page.md](detail-page.md) |
| 整页创建 / 编辑表单 | 不要用本文，走 [form-page.md](form-page.md)（右栏里的表单仍用 `.app-form-page`） |
| 看板 KPI + 图表 | 不要用本文，走 [dashboard-page.md](dashboard-page.md) |

**资产（Skill 内，换电脑可复现）**

| 用途 | 路径 |
|------|------|
| IDE 骨架 / 中缝 / 结果区皮肤 | `styles/page-layout.css`（`.dev-task-detail`、`.dev-task-ide-root`、`.dev-task-ide*`） |
| 尺寸常量 | `scripts/patterns/devTaskIdePage.ts`（与 CSS 变量默认值一致） |
| 右栏表单 | `scripts/patterns/formPageLayout.ts`（`FORM_PAGE_ARCO_CLASS` 等） |
| 空态 | `scripts/components/PageLevelEmpty.tsx`、`scripts/patterns/listTableNoDataElement.tsx` |
| 整页起步模板 | `scripts/ide/01-BasicIdePage.tsx`。只换顶栏、编辑器、右栏。禁止另起一套 IDE 皮肤、禁止改中缝为 0.5px |

去掉 `scripts/` 前缀复制到业务仓，不必改 import。见 [bootstrap.md](bootstrap.md)。

---

## 共性规则

- 根节点**同一元素**同时挂 `dev-task-detail` + `dev-task-ide-root`（后者即 `DEV_TASK_IDE_ROOT_CLASS`），才能命中 CSS 变量与皮肤。
- 外层结构命名保持 `dev-task-detail*` / `dev-task-ide*`，便于全站样式复用，不要另起前缀。
- 主分栏链贯穿 `min-h-0` + `overflow-hidden`，否则子区域拿不到可计算高度。
- 分栏与区域分隔：中缝 / 顶栏底 / 结果区顶 / 面板头底 / 面板与竖 Tab 之间，均为 **1px / `--yb-border-2`**。不要 0.5px。
- 尺寸从 `devTaskIdePage.ts` 导入或覆写根上 CSS 变量，不要在业务页散落魔法数。
- 文中旧称 `index.css` 即落地后的 `page-layout.css`。

---

## 1. 页面骨架（DOM 层级）

1. 同一节点同时挂 `dev-task-detail` + `dev-task-ide-root`：整页根（承载尺寸 token）。
2. `dev-task-detail__top`：标题 + 工具条（`shrink-0`，不参与纵向滚动）；底边 **1px / `--yb-border-2`**。
3. `dev-task-detail__body`：`flex min-h-0 flex-1 overflow-hidden` —— **关键**：让子区域在 flex 布局里获得可计算高度。
4. `dev-task-detail__split`：左右主分栏容器（`overflow-hidden`）。
5. 左列 `dev-task-detail__editor`：`position: relative`，用于承接底部绝对定位的「运行结果」面板。
6. 中缝 `dev-task-detail__split-divider`：**1px** 竖线，颜色 **`--yb-border-2`**。
7. 右列 `dev-task-detail__right`：固定宽度配置面板；`dev-task-detail__right--collapsed` 仅保留竖向页签条。面板与竖向 Tab 之间（`dev-task-detail__panel` 的 `border-right`）同样 **1px / `--yb-border-2`**。
8. `dev-task-detail__right-inner`：面板 + `dev-task-detail__side-tabs`（竖向 Tab）。
9. 底部「运行结果」`dev-task-editor-result` 顶边、右侧 `dev-task-detail__panel-head` 底边：同档 **1px / `--yb-border-2`**。

---

## 2. 尺寸与 token

在根节点（与 `dev-task-detail` 同一元素）附加 `dev-task-ide-root`，由 `page-layout.css` 的 `.dev-task-detail.dev-task-ide-root` 提供默认 CSS 变量（可在业务页覆写）：

| Token | 默认值 | 用途 |
|-------|--------|------|
| `--dev-task-right-panel-w` | `400px` | 右侧配置面板展开宽度 |
| `--dev-task-side-tabs-w` | `40px` | 右侧竖向 Tab 条宽度；与收起态右列宽度一致 |
| `--dev-task-result-collapsed-h` | `48px` | 「运行结果」收起高度 |
| `--dev-task-result-expanded-h` | `240px` | 「运行结果」展开高度 |
| `--dev-task-version-table-min-w` | `840px` | 「版本」等宽表格在窄面板内的最小宽度（配合 `overflow-x: auto`） |

TypeScript 对应：`devTaskIdePage.ts` 的 `DEV_TASK_RIGHT_PANEL_WIDTH_PX` 等，与上表默认值保持一致。

---

## 3. 滚动与底部面板

- **右侧面板正文**（`dev-task-detail__panel-body`）：`height: calc(100% - 40px); overflow: auto;`，表单 / 表格在面板内滚动。
- **编辑器列**（`dev-task-detail__editor`）：`position: relative`。
- **运行结果**（`dev-task-editor-result`）：`position: absolute; left/right/bottom: 0`，避免被 flex 挤压出视区；展开高度由 `--dev-task-result-expanded-h` 控制。
- **编辑器可视区高度**：通过修饰类 `dev-task-detail__editor--result-collapsed|expanded` 对 `dev-task-detail__editor-surface` 做 `height: calc(100% - var(--dev-task-result-*-h))`，保证代码区与结果区不重叠。

---

## 4. 右侧配置内容

- **表单分区**：与全站表单页一致，使用 `FORM_PAGE_ARCO_CLASS` / `FORM_PAGE_FORM_STYLE` 等，见 [form-page.md](form-page.md)。
- **调度 / 档位类**：水平表单 + `Radio` 档位宽度（`formCtrlWidth` / `FORM_CTRL_W_160`）+ `Divider` 分段。
- **参数列表**：按钮组 + 表头 + 空态插画（`PageLevelEmpty` / `LIST_TABLE_NO_DATA_ELEMENT`），见 [empty-state.md](empty-state.md)。
- **版本表**：提示条 + 标题区按钮 + 表格（`dev-task-version-table`）+ 分页；表格在 400px 面板内需横向滚动、禁止单元格折行叠字。容器 `min-w-0` + `overflow-x-auto`。

---

## 5. Checklist

- [ ] 根节点：同一元素包含 `dev-task-detail` + `dev-task-ide-root`
- [ ] 关键 flex：`min-h-0` + `overflow-hidden` 贯穿主分栏链
- [ ] 右侧面板宽度与收起宽度走 token
- [ ] 底部结果区：绝对定位 + 编辑器表面高度扣减
- [ ] 宽表格：`min-w-0` 容器 + `overflow-x-auto` + `dev-task-version-table`
- [ ] 分栏与区域分隔：中缝 / 顶栏底 / 结果区顶 / 面板头底均为 **1px / `--yb-border-2`**
