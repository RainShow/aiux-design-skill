# AIUX Design Skill 新手使用指南

把本目录放到项目 `.cursor/skills/aiux-design-skill/`，用 Cursor 打开该项目后即可调用。按本指南可以从零搭出本规范下的列表 / 表单 / 详情 / IDE / 登录 / 导航页。

Agent 生成页面时读 [SKILL.md](SKILL.md)；落地文件对照 [references/bootstrap.md](references/bootstrap.md)。

顶层为 `SKILL.md` / `references/` / `scripts/` / `styles/` / `assets/`。`scripts/` 内部对齐业务仓 `src/` 的代码树：去掉 `scripts/` 前缀复制后不必改 import。`styles/` → 项目 `src/styles/`，`assets/` → 项目 `src/assets/`。不要把 `scripts/tsconfig.json`、`scripts/env.d.ts` 拷进业务仓库。

## 目录做什么用

| 路径 | 职责 |
|------|------|
| [SKILL.md](SKILL.md) | 描述、主规则、路线 |
| [references/](references/) | 组件 / 页面规则 |
| [scripts/](scripts/) | 代码模板（内部对齐业务仓 `src/`） |
| [styles/](styles/) | 主题 19155、`--yb-*` token、表格/表单皮肤 |
| [assets/](assets/) | 品牌、登录底图、空态插画、导航图标 |
| `scripts/tsconfig.json` / `scripts/env.d.ts` | 仅给在 Skill 里打开模板消红线，**不要拷** |

粘贴产品列表 / 表单 / 详情 Figma 稿时：结构跟 Figma，组件用 **Arco 19155**，不要自绘 Tailwind 组件。

## 文件索引

### 规范文档（references/）

| 类别 | 文件 | 说明 |
|------|------|------|
| 新项目落地 | [bootstrap.md](references/bootstrap.md) | 依赖、CSS `@import`、`styles/` `assets/` `scripts/` 三分复制 |
| 导航壳 | [layout.md](references/layout.md) | 顶栏 / 双列 / 单列尺寸与禁止项 |
| 导航图标 | [nav-icons.md](references/nav-icons.md) | 预置 SVG 语义表；写 `navConfig` 先查 |
| 列表页 | [list-page.md](references/list-page.md) | §1 无树 / §2 Tab+64px / §3 Tab+48px / §4 左树 / §5 卡片列表 |
| 表单页 | [form-page.md](references/form-page.md) | §1 全页水平 / §2 抽屉垂直 |
| 详情页 | [detail-page.md](references/detail-page.md) | §1 有主 Tab / §2 无主 Tab |
| IDE 页 | [ide-page.md](references/ide-page.md) | 三栏编辑器 + 右栏配置 + 底结果 |
| 登录页 | [login-page.md](references/login-page.md) | 全屏登录卡 |
| 空态 | [empty-state.md](references/empty-state.md) | 页级 / 容器内；跨页区块 |
| 看板页 | [dashboard-page.md](references/dashboard-page.md) | KPI 概览 / 指标磁贴 + 图表 |
| Figma→Arco | [theme-mapping.md](references/theme-mapping.md) | 稿到 Token / 组件 |

### 代码模板（scripts/，内部对齐业务仓 src/）

有模板则 **复制起步**，只换业务字段、数据、文案与提交逻辑。去掉 `scripts/` 前缀落到项目 `src/` 后不必改 import。**不要**把 `scripts/` 下 list / form / detail / dashboard / ide 整目录拷进项目；按需单文件拷到 `src/{feature}/`。登录可整拷 `auth/`。

**导航**（规范见 `layout.md`、`nav-icons.md`）

| 场景 | 文件 | 说明 |
|------|------|------|
| 产品导航壳 | `scripts/components/` | `ProductAppShell` + 顶栏 + 双列 / 单列 |
| 示例菜单结构 | `scripts/nav/exampleNavConfig.ts` | 全模态双列 + 应用开发 / 基础管控单列；非全模态不要默认改成双列 |
| 未搭建菜单页 | `scripts/pages/PlaceholderPage.tsx` | 侧导路径 +「该页面还未搭建」；配合 `scripts/nav/resolveNavTrail.ts` |
| 最小壳 | `scripts/components/MinimalAppShell.tsx` | 只要插槽、不要完整产品导航 |
| 顶栏 / 登录品牌 | `scripts/components/TopNavBrandLogo.tsx` | 与壳一起拷；登录左上复用 |

**列表**（规范见 `list-page.md`）

| 场景 | 文件 | 说明 |
|------|------|------|
| 无树列表 | `scripts/list/01-BasicListPage.tsx` | 默认。搜索 + 48px 表 + 外置分页（默认每页 20） |
| Tab + 64px 双行表 | `scripts/list/02-TabDoubleRowListPage.tsx` | 页头 line Tabs，表体双行 |
| Tab + 48px 表 | `scripts/list/03-TabRow48ListPage.tsx` | 页头同 §2，表体仍 48px |
| 左树右表 | `scripts/list/04-TreeListPage.tsx` | **仅**稿面明确要左树 |
| 卡片列表 | `scripts/list/05-CardListPage.tsx` | 搜索 + 固定三列资源卡。页名含「广场」或稿面是卡片网格时用；对齐 data-demo 应用管理 |

**表单**（规范见 `form-page.md`）

| 场景 | 文件 | 说明 |
|------|------|------|
| 全页水平 | `scripts/form/01-BasicFormPage.tsx` | 创建 / 编辑整页；80px 顶栏 + 底栏左对齐 |
| 抽屉垂直 | `scripts/form/02-DrawerForm.tsx` | 列表 / 详情上的添加浮层 |

**详情**（规范见 `detail-page.md`）

| 场景 | 文件 | 说明 |
|------|------|------|
| 有主 Tab | `scripts/detail/01-BasicDetailPage.tsx` | 默认。`page-header-with-tabs`，标题行不要写死 80px |
| 无主 Tab | `scripts/detail/02-NoTabDetailPage.tsx` | 仅返回 + 标题 + 操作；80px 顶栏 |

**看板 / IDE / 登录**

| 场景 | 文件 | 说明 |
|------|------|------|
| 状态概览看板 | `scripts/dashboard/01-BasicDashboardPage.tsx` | 一张卡六项 KPI + 大图 + TOP 表 |
| 指标磁贴看板 | `scripts/dashboard/02-MetricTileDashboardPage.tsx` | 独立读数卡并排，每项带走势；空值「—」 |
| IDE | `scripts/ide/01-BasicIdePage.tsx` | `dev-task-detail` + `dev-task-ide-root` |
| 登录 | `scripts/auth/` | 品牌用 `TopNavBrandLogo`；与登录底图一起拷 |

**落地共享件**

| 用途 | 路径 |
|------|------|
| Provider | `scripts/providers/ArcoTheme19155Provider.tsx` |
| 原子 | `scripts/components/`（SearchBox、表头筛选、空态、省略单元格、`ListTableStatusDot`、DetailFieldValue） |
| 常量 | `scripts/patterns/`（表单/详情/IDE 尺寸、`LIST_DEFAULT_PAGE_SIZE`、`globalMessage`、表格空态） |

### 样式（styles/）

六份 CSS **不要合并**。落地后 `@import` 顺序见 [bootstrap.md](references/bootstrap.md)。

| 文件 | 说明 |
|------|------|
| `styles/arco-theme-19155.css` | 主题 19155；校验红框白底 |
| `styles/figma-tokens.css` | `--yb-*` Token |
| `styles/shell-baseline.css` | 全局 `box-sizing` 等基线（preflight 关闭时必拷） |
| `styles/page-layout.css` | 表格 / 表单 / 详情 / IDE / 卡片皮肤 |
| `styles/message.css` | `globalMessage` |
| `styles/nav-shell.css` | 导航壳；**导航阶段再 `@import`** |

`page-layout.css` 按需检索：`service-manage-table`（列表）、`yb-list-card`（卡片列表）、`app-form-page`（表单）、`yb-content-card`（看板）、`dev-task-detail`（IDE）、`service-catalog-tree`（左树）。

### 图标库（assets/）

预置导航 SVG，换电脑复刻侧导必须带着。生成列表 / 表单 / 详情时不必打开；写 `navConfig` 时读 [nav-icons.md](references/nav-icons.md)，用 `resolveNavIcon(菜单名)`。

| 路径 | 说明 |
|------|------|
| `assets/brand/` | 顶栏 Logo |
| `assets/login/` | 登录底图 |
| `assets/empty/` | 页级空态插画 |
| `assets/nav/` | 轨 / 分组 / 各产品线预置图标；壳层在 `nav/shell/` |

## 给 Agent 的命令（兼容）

| 你输入 | 作用 |
|--------|------|
| `/page-layout` 或 `/aiux` | 判断页面类型并指出该读哪份规范 |
| `/page-layout bootstrap` | 新项目落地主题、样式、原子组件、最小壳 |
| `/page-layout nav` | 顶栏 + 全模态双列 / 其他产品线单列侧导 |
| `/page-layout list` / `form` / `detail` / `ide` / `login` / `empty` / `dashboard` | 对应业务页 |

不打命令、直接说「做一个审批列表」也可以，Agent 应按用户语言命中本 Skill。

## 新项目怎么走

1. 复制本 Skill 到新仓库 `.cursor/skills/aiux-design-skill/`
2. 把下面这段发给 Agent（它会分三步做，每步停下来等你确认）
3. 之后用上表命令继续加页

拷哪些文件、侧导默认双列/单列、删除确认话术等，都写在 Skill 里，提示词里不必再抄一遍。

```text
请严格分三步，每步完成后停一下等我确认再继续：

Step A：按 /page-layout bootstrap 从零搭 Vite+React+TS+Arco19155+Tailwind 环境，能跑起来。
Step B：先问我顶导入口叫什么（没定就给 全模态数据智能 / 应用开发 / 基础管控 让我选），再按 /page-layout nav 搭顶栏 + 侧导 + routes（含 /login）+ 鉴权跳转。
Step C：按 /page-layout list 实现第一个真实列表页、表单页、详情页并挂到侧栏。

全程遵守 aiux-design-skill，不要偏离规范另起样式体系。
```

底座齐了之后，按下面三个常见场景继续加页。选型与复制哪份模板以 [SKILL.md](SKILL.md) 为准，提示词只说业务意图。

## 常见使用场景

### 场景 1：快速搭建 CRUD 页面

**布局：** 已有导航壳 + 无树列表 + 全页创建/编辑 + 有主 Tab 详情。筛选在列表工具行 / 表头，和侧导形态无关。

这是 `/page-layout list` + `form` + `detail` 的组合。默认复制 `01-BasicListPage` / `01-BasicFormPage` / `01-BasicDetailPage`。页面名叫「服务管理」不是加左树的信号；稿面明确要树才用 `04`。用户说卡片列表、页名含「广场」、或稿面是资源卡网格时复制 `05-CardListPage`，不要先出表。

**生成顺序：**

1. 已有 `ProductAppShell` 时只出内容区，禁止再套一套顶栏侧导；没有壳才先走 `/page-layout nav`。
2. 按数据实体复制 `scripts/list/01-BasicListPage.tsx`：搜索 + 刷新、48px 表、外置分页、主按钮「创建 XX」、名称列进详情。
3. 创建 / 编辑复制 `scripts/form/01-BasicFormPage.tsx`，必须带 `state.from`；列表上的轻量添加才用抽屉 `02`。
4. 详情复制 `scripts/detail/01-BasicDetailPage.tsx`；删除用 `Modal.confirm`（标题问句、正文写影响）。

```text
按 /page-layout list 做「XXX管理」CRUD：无树列表 + 全页创建/编辑 + 有 Tab 详情，挂到现有侧栏。
```

### 场景 2：创建配置类页面

**布局：** 任意导航 + 全页水平表单（一行一个字段）。区块再多也还是这一套，不要另起模板。

整页创建 / 编辑 / 配置用 `form-page.md` §1；只有列表或详情上的添加 / 编辑浮层才用 §2 抽屉。

**生成顺序：**

1. 复制 `scripts/form/01-BasicFormPage.tsx`，只换字段、path、文案；挂 `FORM_PAGE_ARCO_CLASS`。
2. 默认一行一个字段，禁止两个短标签对半切；长文本仍占整行。
3. 底栏「确定 / 取消」左对齐（主按钮在左）；校验红框 + 白底。
4. 返回 / 取消 / 保存回到 `state.from`，缺省回列表，不要写死进详情。

```text
按 /page-layout form 做「XXX配置」整页表单，水平布局，保存后回到来源页。
```

### 场景 3：搭建看板页

**布局：** 任意导航 + 无 Tab 页头 + KPI / 磁贴 / 图表。不要做成整页搜索列表。

**生成顺序：**

1. 任务状态概览复制 `01-BasicDashboardPage.tsx`；值班 / 监控读数复制 `02-MetricTileDashboardPage.tsx`。只换字段与数据；宿主需 `echarts`。
2. 页头与内容区走列表 §1.1 的无 Tab 白底 + `Divider`，根 `min-h-full`，不要铺灰底。
3. 卡片 `yb-content-card`；工具行放 Card body，不要用 Card `title` / `extra`。不要加阴影。
4. 图表 tooltip 用模板里的 `DASHBOARD_ECHARTS_TOOLTIP`；颜色先解析，不要把 CSS 变量写进 ECharts option。

```text
按 /page-layout dashboard 做「XXX概览」看板：KPI 或指标磁贴 + 图表，挂到现有侧栏。
```

登录 / IDE / 空态把命令换成 `/page-layout login`、`ide`、`empty` 即可。

