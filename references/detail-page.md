# 详情页

企业中后台用页头 + 主 Tab + 滚动内容区，展示一条记录的只读信息、分组字段和表格。

## 目录

| 场景 | 说明 |
|------|------|
| [共性规则](#共性规则) | 根 class、结构线、只读不用 Form |
| [1. 有主 Tab](#1-有主-tab默认) | 默认。`page-header-with-tabs` + line Tabs，标题行不要写死 80px |
| [2. 无主 Tab](#2-无主-tab) | 顶栏固定 80px，与全页表单顶栏同高 |
| [3. 内容区](#3-内容区只读字段与表格) | 分组、三列字段、表格、子 Tab 卡 |
| [4. Method + URL](#4-http-method-标签--可复制长-url) | 调用地址等长链，禁止单行省略 |

相关：[form-page.md](form-page.md)（编辑入口带 `state.from`）、[list-page.md](list-page.md)（带 Tab 页头同源）、[empty-state.md](empty-state.md)。

---

## 意图 / 何时用 / 资产

**意图**：只读扫完一条记录，再决定编辑或返回；不要和可提交表单、整页列表抢同一套骨架。

**何时用**

| 判断 | 用 |
|------|----|
| 默认；页头有一级分类 Tabs | §1 有主 Tab |
| 详情无主 Tab，只有返回 + 标题 + 操作 | §2 无主 Tab |
| 调用地址 / 接口地址（Method + 长链） | §4，叠在 §3 字段行上 |
| 可提交的创建 / 编辑 | 不要用本文，走 [form-page.md](form-page.md) |
| 代码编辑器 / 任务 IDE | 不要用本文，走 [ide-page.md](ide-page.md) |

**资产（Skill 内，换电脑可复现）**

| 用途 | 路径 |
|------|------|
| 详情根 / Tab / 表 / Method Tag | `styles/page-layout.css`（`.service-detail-page`、`.service-detail-page-header-tabs`、`.service-detail-table`、`.yb-method-tag`、`.yb-invoke-url-*`） |
| 无 Tab 顶栏常量 | `scripts/patterns/detailPageLayout.ts`（从 `formPageLayout.ts` 再导出，与表单顶栏同值） |
| 只读多行值 | `scripts/components/DetailFieldValue/`（最多两行省略，仅截断时 Tooltip） |
| 状态点 + 文案 | `scripts/components/ListTableStatusDot.tsx`（与列表状态列同一组件；禁止 `Badge`） |
| 空态 | `scripts/components/PageLevelEmpty.tsx`；表格内 `scripts/patterns/listTableNoDataElement.tsx` |
| 整页起步模板 | `scripts/detail/01-BasicDetailPage.tsx`（§1 有主 Tab）；`02-NoTabDetailPage.tsx`（§2 无主 Tab，80px 顶栏）。只换字段、表格、文案 |

去掉 `scripts/` 前缀复制到业务仓，不必改 import。见 [bootstrap.md](bootstrap.md)。

---

## 共性规则

- 根节点必须带 **`service-detail-page`**，才能命中 Tabs ink、表格、method Tag 等详情皮肤。
- 布局：`h-full w-full min-h-0 flex flex-col`，在导航壳内容区占满剩余高度；`boxSizing: border-box`。
- 结构线：页头 `Divider` **1px / `--yb-border-2`**。禁止 0.5px。
- 只读字段用轻量 **`div` + flex**，**不要**用 `Form` 做纯展示。
- 危险操作默认 `Modal.confirm`，不要用 `Popconfirm`，除非产品明确要求锚点旁确认。标题「确定要操作XX吗？」；正文写影响。
- 未接入 Tab / 空数据：`PageLevelEmpty`（默认 `layout="page"`，距 Divider 下沿 1/4，宿主 `flex-1 min-h-0` **不要**再套 `justify-center`）。表格 / 卡片内用 `layout="inline"` 或 `LIST_TABLE_NO_DATA_ELEMENT`。禁止裸 Arco `Empty`。
- 专用样式优先挂在 `.service-detail-page` 下（`page-layout.css`），避免污染全局。文中旧称 `index.css` 即此文件。
- 点「编辑」进入表单必须带 `state.from`，见 [form-page.md](form-page.md) §1.4。

---

## 1. 有主 Tab（默认）

与 [list-page.md](list-page.md) §2.1 完全同一套路：页头容器 `className="page-header-with-tabs shrink-0"`（`padding: 24px 24px 0`，底为 0），标题行 **随内容高度、禁止写死 80px**，再 `Tabs style={{ marginTop: 16 }}` + `Divider style={{ margin: 0 }}`。

**禁止**四边 `padding: 24` 再叠无 Tab 的 80px 行高（标题和 Tab 会空一大截，下划线贴不上分割线）。

### 1.1 页头行

| 区域 | 约定 |
|------|------|
| 左侧 | `flex items-center min-w-0 flex-1`：返回与主标题间距 16；方形返回 32×32；主标题 `Typography.Title` `heading={5}`，**20 / 30 / 600 / `text-1`**，`className` 含 `min-w-0 truncate` |
| 状态 | 标题旁 `ListTableStatusDot`（与列表状态列同一组件）：8px 圆点、间距 8px、文案 14 / 22 / `var(--color-text-2)`。颜色用 `STATUS_DOT_COLOR`（正常/运行中→`running`、异常→`failed`、已停用/已下线→`stopped`）。禁止 Arco `Badge`、禁止把点和文案拆成页头 `gap: 16` 的两个兄弟节点 |
| 右侧操作 | `shrink-0 inline-flex items-center`，`gap: 8`；主操作为 `Button type="secondary"` |
| 防溢出 | 标题区 `min-w-0`，避免长名称把右侧按钮挤出视口 |

无主 Tab 才用 `DETAIL_PAGE_NO_TAB_HEADER_*`（§2）。有主 Tab **不要**再用 `DETAIL_PAGE_NO_TAB_HEADER_HEIGHT_PX`。

### 1.2 主 Tab

| 约定 | 说明 |
|------|------|
| 组件 | `Tabs`，`type="line"` |
| `className` | `service-detail-page-header-tabs`，去掉 Tabs 通栏底边与页头下 `Divider` 叠成双灰线。无 Pane 的纯导航 Tab 再加 `data-source-manage-header-tabs`（隐藏 `.arco-tabs-content`） |
| 与标题间距 | `style={{ marginTop: 16 }}` |

### 1.3 分隔线与滚动内容区

| 约定 | 说明 |
|------|------|
| 分隔 | `Divider style={{ margin: 0 }}`，紧贴页头 Tab 与下方内容 |
| 滚动区 | `className="flex-1 min-h-0 overflow-auto"`，`style={{ padding: 24 }}`，仅内容区纵向滚动，页头 Tab 固定 |

列表页主区不要对整块加 `overflow-auto`；**详情页可以**。不要和列表页抢「表格外层禁止 `flex-1`」那条——那是列表分页规则，详情滚动的是整块内容区。

---

## 2. 无主 Tab

顶栏行固定高度 **80px**，`flex` + `items-center`，水平 `px-6`（24px），`boxSizing: border-box`。与 [form-page.md](form-page.md) §1.2 全页表单顶栏同高、内容上下居中。

常量：`detailPageLayout.ts` 的 `DETAIL_PAGE_NO_TAB_HEADER_*`、`DETAIL_PAGE_HEADER_BACK_BUTTON_STYLE`、`DETAIL_PAGE_HEADER_TITLE_STYLE`（与表单顶栏同值）。

左侧、状态、右侧操作同 §1.1。下接 `Divider style={{ margin: 0 }}` 与滚动区（§1.3）。

---

## 3. 内容区（只读字段与表格）

### 3.1 内容区宽度

| 约定 | 说明 |
|------|------|
| 主信息列 | 滚动区内主内容容器 `w-full min-w-0`（常见：`flex flex-col gap-6 w-full min-w-0`），扣除 `padding: 24` 后横向铺满。**不要**在页面级再套 `max-w-[1152px]` 等统一版心 |
| `min-w-0` | 与 `w-full` 组合用于 flex 子级，防止长单词 / URL 把布局横向撑破 |
| 超宽或过长 | 在**该区块内**处理：表格 `scroll.x`、长链 / 长文本换行省略或 `DetailFieldValue`、或仅该子块加 `max-w-*`。避免整页恢复全局窄版心 |

### 3.2 分组标题与区块间距

| 约定 | 说明 |
|------|------|
| 分组标题 | 字号 **16**，行高 **24px**，字重 **600**，颜色 `var(--color-text-1)` |
| 大分组纵向间距 | 多个 Section 之间 `flex flex-col gap-6` |
| Section 内 | 标题与内容之间 `gap-4` |

### 3.3 三列只读字段栅格

| 约定 | 说明 |
|------|------|
| 布局 | `flex gap-8 w-full min-w-0 flex-wrap lg:flex-nowrap` |
| 单列 | `flex-1 min-w-[200px] flex flex-col gap-4`，列内多个字段行 `gap-4` |
| 窄屏 | `flex-wrap` 允许列换行；`lg:flex-nowrap` 在宽屏恢复三列 |

### 3.4 字段行（只读）

| 约定 | 说明 |
|------|------|
| 行布局 | `flex gap-4 items-start w-full min-w-0`（`items-start` 便于多行值与标签顶对齐） |
| 标签列 | 固定宽 **74px**，`shrink-0`，14 / 22，`var(--color-text-3)` |
| 值列 | `min-w-0 flex-1`，14 / 22，`var(--color-text-1)` |
| 多行值 | 优先 `DetailFieldValue`（默认最多两行省略，仅截断时 Tooltip） |

### 3.5 表格块

| 约定 | 说明 |
|------|------|
| `className` | `service-detail-table` |
| Table props | `border={false}`、`pagination={false}`；列多时 `scroll={{ x: number }}` |
| 皮肤 | 表头字重、固定列白底、滚动条悬停由 `page-layout.css` 兜底，业务表勿再复制一套 |

内嵌列表型表（48px 单行）仍可叠 `service-manage-table service-manage-list-table--row48-flex`，见 [list-page.md](list-page.md) §1.3。

### 3.6 带子 Tab 的信息卡片（可选）

用于同一分组内多子视图（如 Params / Body / Headers）：

| 约定 | 说明 |
|------|------|
| 容器 | `bg-[color:var(--color-bg-2)]`，`border: 1px solid var(--yb-border-2)`，`borderRadius: 8`，`paddingTop: 8`，`overflow-hidden` |
| 内层 Tabs | `type="line"`，水平 `paddingLeft/Right: 8` |
| 表体区 | `padding: 24`，`paddingTop: 16`，与 Tab 条分隔 |

### 3.7 其他主 Tab 子面板

非默认 Tab 的内容拆到独立组件，主文件只负责路由级状态与 Tab 切换。未接入时用 `PageLevelEmpty`。

---

## 4. HTTP Method 标签 + 可复制长 URL

用于「调用地址」「接口地址」等 Method + 长链接，避免标签与文字纵向错位、避免长 URL 被单行省略裁断。

| 约定 | 说明 |
|------|------|
| 行容器 | `yb-invoke-url-row`，`flex flex-row flex-nowrap items-start`，`gap: 8`，`min-w-0 w-full max-w-full`。行用顶对齐，是为了 URL **折行** 时 Method Tag 贴第一行，不是让 32px 按钮和 22px 正文去顶对齐 |
| Method | `Tag` + `className="yb-method-tag"`，`bordered={false}`；高度 **22px**，`fontSize: 14`，`fontWeight: 500`，`lineHeight: 22px`，与正文一致；GET 用成功态浅绿底 |
| URL 文本 | **不要**给长 URL 加 `flex-1`（会把复制按钮顶到值列最右侧）。用 `.yb-invoke-url-text` 把「链接 + 复制」成组（`inline-flex` + `align-items: center`），宽度跟内容走；文本 `word-break: break-all`、`overflow-wrap: anywhere`，保证完整换行 |
| 复制 | **不要**对长 URL 使用 `Typography.Text` + `ellipsis` + `cssEllipsis`。使用独立 `Button type="text"` + `IconCopy` + `Tooltip` + `navigator.clipboard`。按钮必须 **22×22**（class `yb-invoke-url-copy`），与 Tag / 14-22 正文同高；外包 `yb-invoke-url-copy-wrap` 消掉 Tooltip 的 inline 基线。**禁止**用 Arco 默认约 32 高的文字按钮，否则 `items-start` 会让图标相对正文偏下 |

`.yb-method-tag`、`.arco-tag-content` 已在 `page-layout.css` 覆盖 Arco Tag 默认字号 / 行高 / flex，勿删。

---

## 5. Checklist

1. 根节点带 `service-detail-page` + 纵向 flex + 滚动区。
2. **有主 Tab**：`page-header-with-tabs` → 标题行（不要 80px）→ `Tabs` `marginTop: 16` → `Divider margin: 0`。**无主 Tab**：才用 80px 顶栏。字号 Title 20/30、`ListTableStatusDot` + 状态、右侧 `secondary`；危险确认 `Modal.confirm`。
3. 主 Tabs 使用 `service-detail-page-header-tabs`（纯导航再加 `data-source-manage-header-tabs`）。
4. 滚动区内只读信息主容器 `w-full min-w-0`，Section 标题 16/24/600，字段行 74px 标签列；多行值用 `DetailFieldValue`。
5. 表格 `service-detail-table`，`border={false}`。
6. Method + URL：`yb-invoke-url-row` + `yb-method-tag` + 换行 URL + `yb-invoke-url-copy`（22×22）；禁止长链单行省略，禁止默认 32 高文字按钮。
7. 专用样式挂在 `.service-detail-page` 下。
8. 未接入 Tab / 空数据用 `PageLevelEmpty`（或表格 `LIST_TABLE_NO_DATA_ELEMENT`）。
