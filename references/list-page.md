# 列表页

企业中后台列表：默认用 Arco `Table` 一屏扫完记录；卡片墙（广场 / 资源卡网格）走 §5；单列横向内容卡走 §6。不要先出表再改。

## 目录

| 场景 | 说明 |
|------|------|
| [共性规则](#共性规则) | 页头、分页、名称列、操作列、空态、确认框 |
| [1. 无左侧树列表](#1-无左侧树列表主规范) | 默认。搜索 + 表头筛选 + 48px 单行表 + 外置分页 |
| [2. 带 Tab + 双行表](#2-带顶部-tabs--双行文本行高的表格) | 页头 line Tabs，表体 64px 双行 |
| [3. 带 Tab + 48px 表](#3-带-tab-页头--48px-主表变体) | 页头同 §2，表体仍用 §1 的 48px |
| [4. 左树右表](#4-带左侧目录树的列表变体) | **仅**稿面明确要左树时 |
| [5. 卡片列表](#5-卡片列表) | 搜索 + 三列资源卡 + 外置分页。参考 data-demo「应用管理」 |
| [6. 单列横向卡片](#6-单列横向卡片列表) | 标题操作区 + 标签筛选 + 左文右图内容卡。参考资产中心 / 分页浏览 |

相关：[form-page.md](form-page.md)（创建/编辑与 `state.from`）、[detail-page.md](detail-page.md)、[empty-state.md](empty-state.md)。

---

## 意图 / 何时用 / 资产

**意图**：高频扫描与批量处置用表；资源广场 / 应用卡片墙用 §5；资产中心 / 分页浏览用 §6。不要用看板 KPI 卡冒充。

**何时用**

| 判断 | 用 |
|------|----|
| 默认；搜索 + 表 + 外置分页 | §1 无树 |
| 页头一级分类是 Arco line Tabs，主列是固定双行 | §2（64px 表） |
| 页头有 Tabs，表体仍要 48px 单行 | §3 |
| 用户或稿面**写了**左侧目录 | §4 |
| 用户说「卡片列表 / 卡片墙 / 网格」；或页面名含「广场」且没说要表；或稿面是资源卡片网格 | §5 |
| 用户说「单列横向卡片 / 分页浏览 / 内容卡」；或稿面是左文右图、一排一条（如资产中心） | §6 |
| 不确定表还是卡 | **先问一句**，不要先出表 |
| 不确定三列资源卡还是横向内容卡 | **先问一句**，不要先出 §5 再改 |
| 看板 / KPI / 指标磁贴 | 不要用本文，走 [dashboard-page.md](dashboard-page.md) |

页面名叫「服务管理」、或表里有「类型」列，**不是**加左树的信号。名字含「管理」也**不是**走表或走卡的信号：提示词是搜索表 + 增删改查（如「应用管理」列表）走 §1；用户说卡片墙 / 广场 / 稿面是资源卡网格才走 §5。

**资产（Skill 内，换电脑可复现）**

| 用途 | 路径 |
|------|------|
| 表格 / 页头 / 树皮肤 | `styles/page-layout.css`（落地后由 `index.css` `@import`；文中旧称 `index.css` 即此文件） |
| 搜索 + 刷新 | `scripts/components/SearchBox/` |
| 表头筛选 / 排序 | `scripts/components/TableColumnFilterTitle.tsx` |
| 状态点 + 文案 | `scripts/components/ListTableStatusDot.tsx`（列表状态列与详情标题旁共用；禁止 `Badge`） |
| 单元格省略 | `scripts/components/TableEllipsisCell.tsx` |
| 名称列 class | `scripts/patterns/listTableNameLink.ts` |
| 表格空态 | `scripts/patterns/listTableNoDataElement.tsx` |
| 卡片列表皮肤 | `styles/page-layout.css`（`.yb-list-card` 12px；**不要**用 `yb-content-card`） |
| 整页起步模板 | `scripts/list/01-BasicListPage.tsx`（§1 无树）；`02-TabDoubleRowListPage.tsx`（§2）；`03-TabRow48ListPage.tsx`（§3）；`04-TreeListPage.tsx`（§4）；`05-CardListPage.tsx`（§5 三列资源卡）；`06-HorizontalCardListPage.tsx`（§6 单列横向卡）。表模板只换列、数据、path；卡片模板只换字段、数据、path。表格默认每页 `LIST_DEFAULT_PAGE_SIZE`（10）；卡片 1/2 列 10、3 列 15（`listCardPageSize`） |

去掉 `scripts/` 前缀复制到业务仓，不必改 import。见 [bootstrap.md](bootstrap.md)。

---

## 共性规则

以下对 §1–§6 都成立，各节不重复。§1–§4 的 Table 细则只约束表列表。

- 根节点：`h-full min-h-0 flex flex-col`，占满导航壳内容区。
- 结构线：页头 `Divider`、表头与表体分隔均为 **1px / `--yb-border-2`**（`page-layout.css` 覆盖）。
- 标题：`Typography.Title` `heading={5}`，20 / 30 / 600，`var(--color-text-1)` 或 `var(--yb-text-1)`。
- **无 Tab 页头**：四边 `padding: 24`，禁止 `'24px 24px 0'`（标题会贴 Divider）。**有 Tab 页头**：必须 `page-header-with-tabs`（`padding: 24px 24px 0`），禁止四边 24。两套勿混用。
- 内容区（Divider 以下）：四边 24。§1–§4 不要对整块加 `overflow-auto`；§5 / §6 卡片更高，内容区允许 `overflow-auto`，分页仍 `shrink-0` 跟在列表后。
- Table（仅 §1–§4）：`border={false}`，**`pagination={false}`**。分页 `mt-4 shrink-0` 紧跟表格外层。表格外层 **禁止 `flex-1`**，否则分页被撑到视区底。
- 名称列（仅 §1–§4）：`Link` + `LIST_TABLE_NAME_LINK_CLASSNAME`。操作列：`service-manage-actions` + **Arco `Link`**。两套 class **禁止混用**。§5 / §6 整卡进详情，标题不是表名称列；§5 操作是 Card 内文字按钮。
- 表头筛选 / 排序（仅 §1–§4）：`TableColumnFilterTitle` / `TableColumnSortTitle`，**禁止**与列 `sorter` 同时用。状态列默认走表头漏斗，不要在工具行再放一套状态 Radio。
- **状态点**：表状态列、卡片标题行、详情标题旁一律 `ListTableStatusDot`（8px 圆点、间距 8px、文案 14/22/`--color-text-2`）。颜色用 `STATUS_DOT_COLOR`（运行中绿、已停用灰、失败红；同一表还有「成功」时运行中用 `processing`）。禁止纯文字、禁止 Arco `Badge`、禁止自绘圆点。表单页状态下拉没有点，不必套本组件。
- 主按钮文案 **「创建 XX」**。§1–§5 放工具行右侧，不要放无 Tab 页头标题行。**§6** 放页头标题行右侧（标题操作区），工具行只放搜索 / 标签。
- 空态：表用 `noDataElement={LIST_TABLE_NO_DATA_ELEMENT}`；§5 / §6 用 `PageLevelEmpty layout="inline"`。禁止裸 Arco `Empty`。
- 删除等确认：`Modal.confirm`，不用 `Popconfirm`。**标题**默认「确定要操作XX吗？」（删除即「确定要删除「名称」吗？」）；**正文**只写该操作带来的影响，不要把问句再写一遍。操作结果 `globalMessage.ok('删除')` / `fail('删除')` →「删除成功」/「删除失败，请稍后重试」。禁止「已删除」。表格状态文案「已停用」不是 Message。
- 创建 / 编辑必须带 `state.from`，见 [form-page.md](form-page.md) §1.4。

---

## 1. 无左侧树列表（主规范）

48px 单行扫描表。工具行搜索 + 表头筛选；分页不用 Table 内置。

### 1.1 根容器与页头

| 约定 | 说明 |
|------|------|
| 根节点 | `h-full min-h-0 flex flex-col` |
| **页头（无 Tab）** | `shrink-0 bg-[color:var(--color-bg-2)]`，只放主标题（及可选右侧搜索占位）。**`style={{ padding: 24, boxSizing: 'border-box' }}`**，四边 24。随后 `Divider style={{ margin: 0 }}` |
| **页头（有 Tab）** | `className="page-header-with-tabs shrink-0"`。Tabs：`className="service-detail-page-header-tabs data-source-manage-header-tabs"`，`type="line"`，`style={{ marginTop: 16 }}`。无 Pane 时后者隐藏 `.arco-tabs-content` |
| 标题行 | 外层 `flex-1 min-w-0 h-8 flex items-center` 防挤压 |
| 标题行右侧占位（可选） | 搜索在内容区首行时，标题行右侧留 `w-[280px] h-8`，与 `SearchWithRefresh` 对齐 |
| 内容区 | `flex-1 min-h-0 flex flex-col bg-[color:var(--color-bg-2)]`，`padding: 24`。内容区里的 KPI 卡仍挂 `yb-content-card` |

### 1.2 工具行（搜索 + 主按钮）

- **搜索**：`SearchWithRefresh`，`iconPlacement="right"`，`size="md"`，`allowClear={false}`；常用 `searchWrapStyle={{ width: 280 }}`。
- **刷新**：`onRefresh` 内 bump tick 或重新拉数；关键字变化时 `setPage(1)`。
- **状态列**用 `TableColumnFilterTitle`。工具行 `Radio.Group type="button"` + `yb-radio-button-group` 只留给**不是表格列**的流程分段（如待审批 / 已审批）。
- **主按钮**：高 32，本行右侧。容器 `shrink-0 flex items-center justify-between gap-2 min-w-0 flex-wrap`；左侧放搜索 / 刷新。无主按钮时不必 `justify-between`。

### 1.3 表格

| 约定 | 说明 |
|------|------|
| **className** | `service-manage-table service-manage-list-table--row48-flex`：48px 行高 + 单元格 `display:flex; align-items:center`。**不要**与 `data-source-manage-table` 混用 |
| **scroll** | 按需 `scroll={{ x: … }}` |
| **名称列** | `Link` + `LIST_TABLE_NAME_LINK_CLASSNAME`：14px semibold、悬停主色、单行 `truncate` |
| **状态列** | `ListTableStatusDot` + 表头 `TableColumnFilterTitle`。不要只渲染文案 |
| **省略** | 优先 `TableEllipsisCell`：仅 `scrollWidth > clientWidth` 时出 Tooltip |
| **操作列** | `fixed: 'right'`，`service-manage-actions inline-flex items-center gap-3`。内部 Arco `Link`（`--link-6`）。删除可用 `status="error"`（皮肤收成同样蓝链）。需要路由时 `onClick` + `navigate`，**禁止** react-router `Link`、**禁止** `LIST_TABLE_NAME_LINK_CLASSNAME`、**禁止**裸 `button` 当操作链 |

### 1.4 表头筛选与排序

| 场景 | 约定 |
|------|------|
| **仅排序** | `TableColumnSortTitle` 作为列 `title`（ReactNode）。**不要**再写列 `sorter`。排序在父级对已筛选数据 `useMemo` |
| **筛选，可与排序同列** | `TableColumnFilterTitle`：标题 → 可选 `sort` → 漏斗。**仅漏斗**是 `Dropdown` 热区。有选中项时漏斗 `rgb(var(--primary-6))` |
| **与列 `sorter` 二选一** | 已用内联排序的列禁止再配 `sorter`，否则图标易被挤到列尾 |
| **多列互斥排序** | 单一状态 `{ field, order }`：换列从升序起；同列轮转 null → ascend → descend → 清除 |

`TableColumnFilterTitle`：`value: string | null`（`null` = 全部），`onChange` 内 `setPage(1)`。选项 `{ label, value }[]`。时间分段可用 `TIME_OF_DAY_FILTER_OPTIONS` / `rowMatchesTimeOfDayPart`（`scripts/components/tableColumnFilterTime.ts`），`render` 仍展示原始时间字符串。

仍使用 **Arco 原生 `sorter` + `ellipsis`** 时：`page-layout.css` 已让 `service-manage-table` / `service-detail-table` 的「标题 + 排序」左对齐成组。内联排序列无 `cell-with-sorter`，不受该条影响。

### 1.5 表格与外层容器

- 表格外层：`mt-4 min-w-0 shrink-0`；横向滚动可加 `overflow-x-auto`。
- **禁止** `flex-1` / `flex-1 min-h-0` 吃剩余高度。
- **勿**在 row48-flex 下给固定列 `td/th` 设 `overflow: hidden`（会裁切固定列阴影），见 `page-layout.css` 注释。

### 1.6 分页区

- `mt-4 shrink-0 flex items-center justify-between`。
- 左：「共 N 条」，`text-[12px] leading-[18px] text-[color:var(--yb-text-2)]`，N 为过滤后总数。
- 右：`Pagination`，`showTotal={false}`、`showJumper`、`sizeCanChange`、`pageSizeChangeResetCurrent`。表格默认 **`pageSize={10}`**（`LIST_DEFAULT_PAGE_SIZE`），`onChange` 同时更新页码与每页条数。卡片列表用 `listCardPageSize(列数)`：1/2 列 10，3 列 15。用户指定条数时只改常量，不要在各页写死。

### 1.7 数据过滤顺序

Tab / 分段状态 → 关键字 → 各列 `TableColumnFilterTitle` → （可选）表头排序 `useMemo` → 分页 slice。

### 1.8 危险操作确认

```tsx
Modal.confirm({
  title: `确定要删除「${row.name}」吗？`,
  content: '服务删除后不可恢复，所有使用该服务的功能将停止运行。',
  okText: '确定',
  cancelText: '取消',
  onOk: () => {
    globalMessage.ok('删除')
  },
})
```

标题用问句「确定要{操作}「{对象名}」吗？」；正文只写影响（不可恢复、依赖方停用等），不要重复问句。视觉由 `styles/arco-theme-19155.css` 对齐：宽 400、圆角 8、正文 `pl-28`、按钮右对齐 gap 8 / min-width 72。仅当产品明确要求锚点旁气泡时才用 `Popconfirm`。

---

## 2. 带顶部 Tabs + 双行文本行高的表格

页头一级分类用 Arco `Tabs type="line"`，表体有固定双行主列。**不要**再挂 `service-manage-list-table--row48-flex`（48px flex 与 64px 双行互斥）。

页头必须 `page-header-with-tabs`（底边 0），使 line 指示线贴 `Divider`。列表主区用 `flex-1 min-h-0 flex flex-col` + `padding: 24`，**不要**整块 `overflow-auto`，表格外层不要 `flex-1`。

### 2.1 页面根与页头块

| 约定 | 说明 |
|------|------|
| 根（含抽屉时） | 外层 `h-full w-full min-h-0 flex flex-col`；主列 `className="service-detail-page flex-1 min-h-0 flex flex-col"` + `bg-[color:var(--color-bg-2)]`（与详情页同源 class，复用页头 Tab 皮肤） |
| 页头内层 | `page-header-with-tabs shrink-0`；内放标题行 + Tabs；**勿**再写四边 `padding: 24` |
| 标题行 | `flex items-center justify-between gap-4 min-w-0`；左侧 Title。列表无返回键可只留左侧；详情可在左侧加返回 Button |
| **Tabs** | `service-detail-page-header-tabs` + `data-source-manage-header-tabs`；`type="line"`；`marginTop: 16`；`activeTab` 变化时 `setPage(1)` |
| **Divider** | `margin: 0`，紧贴页头底 |

`page-layout.css` 中 `.page-header-with-tabs` 与 `.data-source-manage-header-tabs` 压平 Tab 头下边距，并去掉通栏灰线（`::before`）。仅 Tab 导航、无 Pane 时：`.data-source-manage-header-tabs .arco-tabs-content { display: none }`。

### 2.2 内容区

- 容器：`flex-1 min-h-0 flex flex-col`，`padding: 24`。
- 首行工具条：`SearchWithRefresh`（示例宽 480）+ 主按钮高 32。
- 表格外层：`mt-4 min-w-0 overflow-x-auto`，勿 `flex-1`。
- 分页：`mt-4 shrink-0`，同 §1.6。

### 2.3 表格 class 与行高

| 约定 | 说明 |
|------|------|
| **className** | `service-manage-table data-source-manage-table` |
| **表头** | 固定 40px |
| **表体行** | 固定 64px |
| **双行主列** | `Typography.Paragraph`，`margin: 0`，`whiteSpace: 'pre-line'`，14 / 22，`var(--color-text-2)`（如连接 URL + 换行 + 用户名） |

名称列、操作列、分页同 §1.3 / §1.6。

---

## 3. 带 Tab 页头 + 48px 主表（变体）

页头仍按 §2.1（`page-header-with-tabs` + 两个 Tabs class）。  
表格用 §1.3 的 `service-manage-table service-manage-list-table--row48-flex`，**勿**挂 `data-source-manage-table`。

---

## 4. 带左侧目录树的列表（变体）

**选用前提**：稿面或需求写了左侧目录。不要因为页名或「类型」列自动加「全部 / 分类」树——那会和表头类型筛重复。

### 4.1 根容器与页内布局

| 约定 | 说明 |
|------|------|
| 根节点 | `h-full w-full min-h-0` |
| 页面 padding | 内容区 24px |
| 左右分栏 | `flex-1 min-h-0 w-full flex gap-4` |
| 左侧宽度 | `w-[220px] shrink-0` |
| 分割线 | `w-px`，`var(--yb-border-2)` |

### 4.2 左侧目录树

- Arco `Tree`，`className="service-catalog-tree"`（皮肤只在 `page-layout.css`，禁止业务页再写一套）。
- `blockNode`、`size="small"`、`showLine`、`actionOnClick="select"`、`selectedKeys`。
- `icons.switcherIcon`：`IconCaretRight` / `IconCaretDown` 12px；叶子 `null`。
- `renderTitle` 用 `service-catalog-tree-title` + `min-width: 0` 单行省略。

### 4.3 右侧列表区

- 标题 20 / 30 / semibold，`--yb-text-1`。
- 搜索 + 刷新 + 主按钮同 §1.2。
- 表格外层：`mt-4 min-w-0 overflow-x-auto shrink-0`，**禁止** `flex-1 min-h-0`。
- Table：`service-manage-table`；筛选 / 排序同 §1.4。
- 操作列、分页同 §1.3 / §1.6。

---

## 5. 卡片列表

无 Tab 页头 + 搜索工具行 + **三列资源卡** + 外置分页。视觉对齐 data-demo「应用管理」（`AppManagePage`），不是看板 KPI 卡。

页头 / 工具行 / 主按钮走 §1.1–§1.2（无 Tab、搜索宽 280、右侧「创建 XX」）。**不要**套 `Table`、`yb-content-card`、名称列 `LIST_TABLE_NAME_LINK_CLASSNAME`。

### 5.1 内容区

| 约定 | 说明 |
|------|------|
| 内容区 | `flex-1 min-h-0 flex flex-col gap-4 overflow-auto`，`padding: 24`（卡片比表高，允许这块滚动） |
| 工具行 | 同 §1.2：`SearchWithRefresh` 宽 280；主按钮高 32，可带 `IconPlus` |
| 网格 | `grid grid-cols-3 gap-4`（壳层最小宽 1280，固定一排 3 个，不要随宽度收成 1 / 2 列） |
| 分页 | 网格下 `shrink-0 flex items-center justify-between`。左「共 N 条」。右 `Pagination`：默认 `pageSize={15}`（`LIST_CARD_PAGE_SIZE_3COL` / `listCardPageSize(3)`）、`showJumper`、`sizeCanChange` |
| 空态 | 无卡片时 `PageLevelEmpty layout="inline"`，不要表格 `noDataElement` |

### 5.2 卡片

Arco `Card`：`bordered={false}` + class **`yb-list-card`**（皮肤在 `page-layout.css`）。`bodyStyle={{ padding: 24 }}`。

| 约定 | 说明 |
|------|------|
| 圆角 / 描边 | **12px**（`--yb-radius-12`）+ 1px `--yb-border-2`。**禁止** `yb-content-card`（那是看板 8px） |
| 悬停 | 上移 2px、阴影 `0 4px 16px rgba(0,0,0,0.08)`、描边变 `--primary-6`（class 已写，不要业务页再抄一份 Tailwind hover） |
| 点击 | **整卡**进详情（`onClick` + `navigate`）。操作钮 `e.stopPropagation()` |
| 结构 | 上：48×48 图标 + 标题行（名 + 状态点）；中：一行说明；下：两行键值（高 44）+ 右对齐操作 |
| 图标 | 48×48、圆角 8、底 `rgb(var(--primary-1))`。模板内 `ListCardAppIcon` 可换成业务 SVG |
| 标题 | `Typography.Text` 16 / 24 / 500，`var(--color-text-1)`。不是表名称列，不要 `LIST_TABLE_NAME_LINK_CLASSNAME` |
| 说明 | 14 / 22，`var(--color-text-3)`，单行 |
| 状态 | 标题行右侧 `ListTableStatusDot`（已启用→`running`，未启用 / 已停用→`stopped`） |
| 键值区 | 高 44、两行 14 / 22 / `--color-text-3`，溢出裁切（如 AccessKey / SecretKey） |
| 操作 | 右对齐，`Button type="text"` 高 32、`!px-0`、色 `rgb(var(--primary-6))`、间距 8。常见：停用或启用 / 编辑 / 删除。**不要** `service-manage-actions` + Arco `Link`（那是表操作列） |
| 删除 | 仍走共性 `Modal.confirm`；成功 `ok('删除')`。启停 Message 用 `ok('启用'|'停用')`，不要「已启用」「已停用」（那是状态点文案） |

创建 / 编辑带 `state.from`，同 §1。

---

## 6. 单列横向卡片列表

无 Tab 页头（**标题操作区**）+ 搜索 / 标签筛选 + **一排一条**左文右图内容卡 + 外置分页。对齐「资产中心 / 分页浏览」，不是 §5 三列应用卡，也不是看板 KPI 卡。

复制 `scripts/list/06-HorizontalCardListPage.tsx`。**不要**先出 `grid-cols-3` 再改。

### 6.1 页头与工具行

| 约定 | 说明 |
|------|------|
| 页头 | 无 Tab，四边 padding 24 + `Divider`。标题行右侧放主按钮「创建 XX」（可带 `IconPlus`），**不要**再留 280 搜索占位 |
| 内容区 | `flex-1 min-h-0 flex flex-col gap-4 overflow-auto`，`padding: 24` |
| 工具行 | `SearchWithRefresh` 宽 280；标签用 `Radio.Group type="button"` + `yb-radio-button-group`；可选「高级筛选」展开更多 `Select`（宽 `FORM_CTRL_W_160`） |
| 列表 | `flex flex-col gap-4`，**一列**。不要 `grid-cols-3` |
| 分页 | 默认 `pageSize={10}`（`LIST_CARD_PAGE_SIZE_1COL` / `listCardPageSize(1)`）。2 列卡片同样 10；3 列才用 15 |
| 空态 | `PageLevelEmpty layout="inline"` |

### 6.2 内容卡

Arco `Card`：`bordered={false}` + **`yb-list-card`**，`bodyStyle={{ padding: 24 }}`。整卡进详情。

| 约定 | 说明 |
|------|------|
| 结构 | 左：标签 + 标题 + 摘要 + 发布信息 / 互动数据；右：配图 160×108，圆角 8 |
| 标题 | 16 / 24 / 500，`var(--color-text-1)`，单行 truncate |
| 摘要 | 14 / 22，`var(--color-text-3)`，最多两行 |
| 标签 | Arco `Tag` `bordered={false}`；端类型可用 `arcoblue` |
| 底栏 | 左「作者 · 时间」12 / `--color-text-3`；右阅读 / 点赞 / 评论，空值「—」 |
| 配图 | 可换成业务图；没有实图时用模板内占位渐变，不要留空框 |

创建 / 编辑带 `state.from`，同 §1。

---

## 7. Checklist

### 无树（§1）

1. 根 `h-full min-h-0 flex flex-col`；无 Tab 页头四边 24 + Divider；内容区 `flex-1 min-h-0` + 24 padding。
2. `SearchWithRefresh`；状态走表头筛选 + `ListTableStatusDot`；主按钮「创建 XX」在工具行右；筛选变化 `setPage(1)`。
3. `service-manage-table service-manage-list-table--row48-flex`；`pagination={false}`；表外层勿 `flex-1`。
4. 名称列 `LIST_TABLE_NAME_LINK_CLASSNAME`；省略用 `TableEllipsisCell`；排序/筛选勿混列 `sorter`。
5. 操作列 `service-manage-actions` + Arco `Link`；删除 `Modal.confirm`，成功 `ok('删除')`。
6. `noDataElement={LIST_TABLE_NO_DATA_ELEMENT}`。
7. 分页「共 N 条」+ `Pagination` 同 §1.6；默认每页 10。

### 带 Tab + 双行表（§2）

1. `page-header-with-tabs` → 标题 → Tabs `marginTop: 16` → Divider；根挂 `service-detail-page`；Tab 切换 `setPage(1)`。
2. Tabs 两个 class：`service-detail-page-header-tabs` + `data-source-manage-header-tabs`。
3. 内容区 flex 列 + padding 24；勿整块 `overflow-auto`；表外层勿 `flex-1`。
4. `service-manage-table data-source-manage-table`；勿再加 `row48-flex`。
5. 双行列 `pre-line` + 14/22；名称列 / 操作列 / 分页同 §1。

### 带 Tab + 48px（§3）

页头按 §2 Checklist 1–2；表格按 §1.3 的 `row48-flex`，勿挂 `data-source-manage-table`。

### 左树右表（§4）

1. `220px` + 分割线 + 表区；Tree 只用 `service-catalog-tree`。
2. 表外层 `shrink-0`，分页紧跟表格。
3. 创建/编辑带 `state.from`。

### 卡片列表（§5）

1. 无 Tab 页头四边 24 + Divider；内容区 `gap-4 overflow-auto`。
2. `SearchWithRefresh` 宽 280；主按钮「创建 XX」在工具行右。
3. 网格固定 `grid-cols-3`、`gap-4`；卡挂 `yb-list-card`，圆角 12，不要 `yb-content-card`。
4. 整卡进详情；标题 16/24/500；状态 `ListTableStatusDot`；操作是文字按钮，`stopPropagation`。
5. 空态 `PageLevelEmpty layout="inline"`；分页「共 N 条」、默认每页 15、`sizeCanChange`。
6. 删除 `Modal.confirm`，成功 `ok('删除')`；启停 `ok('启用'|'停用')`；创建 / 编辑带 `state.from`。

### 单列横向卡片（§6）

1. 无 Tab 页头四边 24 + Divider；主按钮在**标题行右侧**。
2. 工具行：搜索 280 + 标签 Radio + 可选高级筛选；内容区 `flex flex-col gap-4`。
3. 卡挂 `yb-list-card`；左文右图（160×108）；整卡进详情。
4. 空态 `PageLevelEmpty layout="inline"`；分页默认每页 10、`sizeCanChange`。
5. 不要做成 §5 三列资源卡。
