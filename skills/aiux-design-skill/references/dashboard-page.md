# 看板页

企业中后台的总览画布：KPI、分布图、趋势、可选内嵌 TOP 表。不是整页列表。

## 目录

| 场景 | 说明 |
|------|------|
| [共性规则](#共性规则) | 白底页头 + Divider；滚动交给壳层；禁止灰底套白卡 |
| [1. 内容卡片](#1-内容卡片) | `yb-content-card` 8px，工具行放 Card body |
| [2. 状态概览 KPI](#2-状态概览-kpi) | 一张卡里多项指标 + 卡片内筛选 |
| [3. 指标磁贴](#3-指标磁贴监控读数) | 多项独立读数并排，每项带走势 |
| [4. 图表](#4-图表echarts) | tooltip 无灰框；颜色先解析再交给画布 |
| [5. 内嵌表](#5-内嵌表与分段控件) | 仍走列表表皮肤，不要整页搜索主表 |

相关：[list-page.md](list-page.md)（无 Tab 页头、48px 表、卡片列表 §5）、[form-page.md](form-page.md)（`formCtrlWidth`）。

---

## 意图 / 何时用 / 资产

**意图**：一屏看健康度与趋势，卡片描边分区，不要做成「搜索 + 一张主表」的列表。

**何时用**

| 判断 | 用 |
|------|----|
| 页名叫「总览 / 看板 / Dashboard」，主体是 KPI、分布图、趋势、TOP 表 | 本文 |
| 任务实例状态、筛选后六项计数并排 | §2，复制 `01-BasicDashboardPage.tsx` |
| 值班 / 监控读数：CPU、内存等**独立采集**，每项当前值 + 近期走势 | §3，复制 `02-MetricTileDashboardPage.tsx` |
| 搜索 + 一张主表 + 外置分页 | 不要用本文，走 [list-page.md](list-page.md) |
| 卡片列表 / 广场 / 资源卡网格 | 不要用本文，走 [list-page.md](list-page.md) §5（`yb-list-card` 12px，不是本页 8px 卡） |
| 列表页上的局部 KPI 卡 | 卡片仍挂 `yb-content-card`，页骨架走列表 |
| 登录卡、侧导位置选择器浮层 | 不要用 `yb-content-card` |

不确定 §2 还是 §3 时：多项读数要各自失败/为空、且每项带折线 → §3；同一筛选维度下的计数横条 → §2。

**资产（Skill 内，换电脑可复现）**

| 用途 | 路径 |
|------|------|
| 内容卡皮肤 | `styles/page-layout.css`（`.yb-content-card`、`.yb-radio-button-group`） |
| 刷新钮 | `scripts/components/SearchBox/` 的 `ListToolbarRefreshButton` |
| 筛选宽度 | `scripts/patterns/formPageLayout.ts`（`formCtrlWidth` / `FORM_CTRL_W_160`） |
| 消息 | `scripts/patterns/globalMessage.ts` |
| 内嵌表 | 同 [list-page.md](list-page.md) §1.3 / §1.6；默认每页 `LIST_DEFAULT_PAGE_SIZE`（20） |
| 状态概览模板 | `scripts/dashboard/01-BasicDashboardPage.tsx`。只换 KPI、图表、TOP 表 |
| 指标磁贴模板 | `scripts/dashboard/02-MetricTileDashboardPage.tsx`。只换磁贴字段、单位、色、明细表。宿主需 `npm install echarts`。禁止自写 12px 圆角卡、禁止灰底画布、禁止给卡片加阴影 |

---

## 共性规则

页头与内容区走 [list-page.md](list-page.md) §1.1 **无 Tab** 那套：白底标题栏 + 1px Divider + 白底内容。

- **标题栏**：`shrink-0 bg-[color:var(--color-bg-2)]`，四边 `padding: 24`，标题 20 / 30 / 600，下接 `Divider style={{ margin: 0 }}`（1px `--yb-border-2`）
- **内容区**：`flex-1`，`bg-[color:var(--color-bg-2)]`，四边 `padding: 24`，卡片列 `gap-4`
- **根用 `min-h-full`，不要 `h-full` + 内容区 `overflow-auto`。** 滚动交给壳层 `yb-layout-main-scroll`（与列表页相同、隐藏滚动条）
- **内容列直接子级必须 `shrink-0`。** `yb-content-card` 有 `overflow: hidden`（切圆角），flex 项在 overflow 非 visible 时 `min-height: auto` 会变成 0，卡片会被压成 2px 描边，右上角筛选看起来像被切掉
- **禁止**给内容区铺 `--yb-fill-2`。看板画布就是普通页白底，卡片靠 `yb-content-card` 描边区分，不要灰底套白卡
- **不要**套整页 `SearchWithRefresh` + 一张主表的列表骨架

---

## 1. 内容卡片

Arco `Card` 默认 `--border-radius-none`（直角）。内容卡片必须：

- `bordered={false}`（主题 Provider 默认 `bordered: true` 是 1px，不要叠）
- class **`yb-content-card`**：圆角 **`--yb-radius-8`（8px）** + `overflow: hidden` + 描边 **1px `--yb-border-2`**；白底走 Arco Card 默认 `--color-bg-2`
- **禁止** `yb-card-radius-12`（12px）
- **禁止**给 `yb-content-card` 再加 `box-shadow`
- 卡片**内嵌**小格（如调度周期 2×3、磁贴图标底）可用 `--yb-radius-4`，那不是外层卡片

工具行放 **Card body**，**不要**用 `title` / `extra`。Arco header extra 默认 `nowrap + overflow:hidden`，再叠 `yb-content-card` 的 `overflow: hidden`，右上角 Radio / RangePicker / Select 会被裁切。

---

## 2. 状态概览 KPI

用于「任务实例状态」一类概览卡：

- 标题旁 `IconInfoCircle` + Tooltip；时间文案放标题里
- 今日/昨日、RangePicker、`placeholder="选择任务类型"` 的 Select（默认空、可清空）、刷新
- KPI 六项：总数 / 运行中 / 成功 / 失败 / 待运行 / **已终止**；列间 `border-r` 1px `--yb-border-2`，不要伸进标题行
- 复制 `01-BasicDashboardPage.tsx`

---

## 3. 指标磁贴（监控读数）

用于值班 / 基础设施监控：四项（或相近数量）**并排独立卡**，每项同时给出当前读数与近期走势。复制 `02-MetricTileDashboardPage.tsx`。

**不要**用 §2 那张「一条筛选 + 六项计数」冒充本形态。

### 3.1 卡片结构

每张卡仍是 `yb-content-card shrink-0`，`grid-cols-4 gap-4` 并排。卡内左右分栏：

| 区域 | 内容 |
|------|------|
| 左 | 色块图标（28×28，底 `rgb(var(--*-1))`，图标 `rgb(var(--*-6))`，圆角 `--yb-radius-4`）+ 名称 14/22；其下读数 24/32/600 `tabular-nums`，单位 14 紧跟且 `shrink-0`；底栏「更新 HH:mm:ss」12 / `--color-text-3` |
| 右 | 约 40% 宽、高度写死（模板 88px）的迷你面积折线 |

四张卡 **min-height 一致**。初次打开先画出卡壳与预留高度，再填数，避免请求返回后版面跳变。

色板用 Arco 语义色（示例：主色 / warning / success / purple），**不是**唯一业务色。换指标时换 token，不要另起一套 CSS。

### 3.2 空值与失败

- **暂无数据**：读数显示 **—**（一字线），**不要写成 0**。单位仍占位，保持对齐。走势区留空，不要画一条贴零的线。
- **单项读数失败**：只在该卡右侧预留区内提示 +「重试」。不要 `globalMessage`，不要让其他卡 loading / 卸载。
- 明细表缺测同样用 **—**，走 [list-page.md](list-page.md) 内嵌表皮肤。

---

## 4. 图表（ECharts）

- tooltip **`borderWidth: 0`**。ECharts 默认 `borderWidth: 1` + 灰边，悬停会多一圈框；白底 + 组件自带阴影即可
- 不要用 `extraCssText` 再加 `border: 1px solid …`
- 柱 / 折线 `trigger: 'axis'`；同一页多图共用一份 tooltip 配置
- **不要把 CSS 变量写进 option。** 画布解析不了 `var(--yb-border-2)`、`rgb(var(--primary-6))`。先 `resolveThemeColor`（探测计算色）再交给 ECharts，fallback `#184ff2` / `#dfe2eb` / `#646c85`
- 直角坐标系：轴文字 `#646c85` 12px，刻度隐藏；分割线 `#dfe2eb` + `dashed`；折线 `smooth`、线宽 2、无 symbol
- 迷你走势（磁贴右侧）：无轴、`smooth`、线宽 2、面积自上而下透明渐变；`animation: false` 以免值班首屏闪一下

---

## 5. 内嵌表与分段控件

- 内嵌 TOP 表 / 主机明细走 [list-page.md](list-page.md) §1.3 / §1.6：`service-manage-table service-manage-list-table--row48-flex`、`pagination={false}`、外置「共 N 条」，表外层禁止 `flex-1`；默认每页 **20**（`LIST_DEFAULT_PAGE_SIZE`）
- 卡片工具行里的 Radio（今日/昨日、全部/已生效、任务/工作流）**不是表格列**，用 `Radio.Group type="button"` + `yb-radio-button-group`
- RangePicker / DatePicker / Select 宽度走 `formCtrlWidth` / `FORM_CTRL_W_160`；控件皮肤走 `styles/arco-theme-19155.css`（不要在业务页给 Picker 另写）
- 刷新：`ListToolbarRefreshButton` + `globalMessage`（整页刷新）。磁贴单卡失败只用卡内重试，不走全局消息

---

## 6. Checklist

1. 白底标题栏 padding 24 + `Divider`；根 `min-h-full`；内容区 `--color-bg-2` 四边 padding 24、**不要** `overflow-auto`。标题 20/30/600。**不要**内容区 `--yb-fill-2`。
2. 内容卡片：`bordered={false}` + `yb-content-card shrink-0`，计算圆角 **8px**（不是 0，也不是 12），**不要**阴影。卡片列 `gap-4`。状态概览工具行放 Card body（不要 `title`/`extra`）+ 说明图标 + 六项 KPI（含已终止）。
3. 指标磁贴（若本页是监控读数）：左右分栏、数字与单位对齐、空值 **—**、卡高预留；单卡失败只在该块重试。
4. 内嵌表：`service-manage-table service-manage-list-table--row48-flex`，`pagination={false}`，分页 `mt-4 shrink-0` 紧跟表；默认每页 20。
5. ECharts tooltip：`borderWidth: 0`，悬停气泡无灰框；option 里是解析后的颜色，不是 CSS 变量。
6. 非表格列的分段用 `yb-radio-button-group`；整页消息走 `globalMessage`。
