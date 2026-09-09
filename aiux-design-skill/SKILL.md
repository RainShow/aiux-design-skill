---
name: aiux-design-skill
description: >-
  基于 AIUX / Arco Design 主题 19155 生成企业级中后台界面：导航壳、列表/卡片列表/表单/详情/IDE/登录/空态/看板、Design Token、ConfigProvider 与原子组件。
  用于新建或改造 React+TypeScript 业务页（产品列表/表单/详情 Figma 稿用 Arco 落地，不要自绘 Tailwind 组件），或用户提及 AIUX、aiux-design-skill、Arco、主题 19155、page-layout、列表页、卡片列表、单列横向卡片、资产中心、分页浏览、应用广场、应用管理、表单页、详情页、登录页、导航壳、双列侧导、单列侧导、空态、PageLevelEmpty、NAV_PRESET_ICONS、看板、指标磁贴、监控概览、yb-content-card、yb-list-card、favicon、ECharts tooltip、Design Token、ConfigProvider、
  /aiux、/page-layout、/list-page、/form-page、/detail-page、/login-page 时。
---

# AIUX Design Skill

冷启动见 [README.md](README.md)。Agent **禁止通读** `references/` 与 `styles/`，按 [按任务选读](#按任务选读) 只加载当前任务的 1 份规范。目录对照见 README。

顶层为 `SKILL.md` / `references/` / `scripts/` / `styles/` / `assets/`。`scripts/` 内部对齐业务仓 `src/` 的代码树：去掉 `scripts/` 前缀复制后 **不必改 import**。`styles/` → 项目 `src/styles/`，`assets/` → 项目 `src/assets/`。不要把 `scripts/tsconfig.json`、`scripts/env.d.ts` 拷进业务仓库。不要把 `scripts/` 下 list / form / detail / dashboard / ide 整目录拷进项目；按需单文件拷到 `src/{feature}/`。登录可整拷 `auth/`。

---

## 优先级

1. 命中本 Skill 页面类型 → 用本 Skill 选型 / class / Token，Arco 官方文档只补 API，不覆盖结构。
2. `scripts/` 有模板（导航壳、登录、列表六套、全页/抽屉表单、详情两套、看板两套、IDE、原子、常量、Provider）→ **复制起步**，只换业务字段、数据、文案与提交逻辑。
3. 有 reference、无整页模板 → 按 `references/*-page.md` 生成，复用 `scripts/components/` 与 `scripts/patterns/`，禁止自写 Table / Form 皮肤。
4. 未覆盖能力 → Arco 原生 API，视觉仍继承本 Skill 的 token、密度、圆角与分割线。
5. 产品 Figma 稿 → 结构 / 文案跟 Figma，组件用 Arco；映射见 [theme-mapping.md](references/theme-mapping.md)。

---

## 按任务选读

| 任务 | 规范 | 复制 | 样式 |
|------|------|------|------|
| 新项目落地 | [bootstrap.md](references/bootstrap.md) | `styles/`、`assets/`、`scripts/providers/`、`scripts/patterns/`、`scripts/components/` | 六份 CSS 按 bootstrap `@import` |
| 导航壳 | [layout.md](references/layout.md)、[nav-icons.md](references/nav-icons.md) | `scripts/components/`；**全模态默认双列，其余产品线默认单列**；未搭建路由复制 `scripts/pages/PlaceholderPage.tsx` | `nav-shell.css`、`shell-baseline.css` |
| 列表 | [list-page.md](references/list-page.md) 对应 § | `scripts/list/` 中 **1 个** | `page-layout.css` Table / `yb-list-card` |
| 表单 | [form-page.md](references/form-page.md) | `scripts/form/` 中 **1 个** | `.app-form-page`；校验见 `arco-theme-19155.css` |
| 详情 | [detail-page.md](references/detail-page.md) | `scripts/detail/` 中 **1 个** | 详情 / Tab |
| IDE | [ide-page.md](references/ide-page.md) | `scripts/ide/` 中 **1 个** | IDE 中缝 |
| 登录 | [login-page.md](references/login-page.md) | `scripts/auth/`（品牌用 `TopNavBrandLogo`；整拷含 `useDemoAuth.ts`） | `figma-tokens.css` |
| 空态 | [empty-state.md](references/empty-state.md) | `PageLevelEmpty.tsx` | 空态插画路径 |
| 看板 | [dashboard-page.md](references/dashboard-page.md) 对应 § | `scripts/dashboard/` 中 **1 个** | 卡片 |
| Figma→Arco | [theme-mapping.md](references/theme-mapping.md) | — | `arco-theme-19155.css` |

命令 `/page-layout`、`/aiux`、`/page-layout list|form|detail|ide|login|nav|empty|dashboard|bootstrap` 与上表等价；无命令时按用户语言选型。

### 核心 class

| class | 用途 |
|-------|------|
| `service-manage-table` | 列表 / 表单内嵌表皮肤 |
| `service-manage-list-table--row48-flex` | 48px 行高 + 单元格垂直居中 |
| `data-source-manage-table` | 双行 64px 表体（与上行互斥） |
| `service-detail-table` / `service-detail-page` | 详情表 / 详情根 |
| `yb-content-card` | 看板内容卡 8px + 1px `--yb-border-2` |
| `yb-list-card` | 卡片列表资源卡 12px（不要用 `yb-content-card`） |
| `page-header-with-tabs` | 带 Tab 页头（底 padding 0） |
| `app-form-page` | 表单页（`FORM_PAGE_ARCO_CLASS`） |
| `yb-form-drawer` | 配置抽屉标题栏 56px |
| `service-catalog-tree` | 左树右表 |
| `dev-task-detail` + `dev-task-ide-root` | IDE 页根 |

---

## 技术栈

| 类别 | 包 | 说明 |
|------|----|------|
| 框架 | `react` / `react-dom` **18** | Arco 2 的 `Modal.confirm` 在 React 19 会挂 |
| UI | `@arco-design/web-react` 2.x | 主题 19155 |
| 路由 | `react-router-dom` | 名称列 `Link`、`state.from` |
| 布局 | `tailwindcss` **v3** | 不要 v4 |
| 语言 | TypeScript 5 | 禁止 `any` |

图表按需 ECharts。脚手架见 [bootstrap.md](references/bootstrap.md)。

---

## 选型

### 导航壳（先问顶导名；侧导按产品线默认，不要追问）

写代码前必须先问用户并等答复：

顶导有几个入口、各叫什么？未指定时给出建议名让用户选（全模态数据智能 / 模型开发 / 应用开发 / 基础管控）。侧导按默认提供：全模态数据智能默认双列，其他产品线默认单列。

同一壳内可以混用：

| 条件 | 用 |
|------|----|
| 顶导是「全模态数据智能」（或用户明确只要该产品线的轨+二级） | `ProductAppShell` **双列**（轨 60 + 二级 180） |
| 应用开发 / 模型开发 / 基础管控 / 其他产品线（默认） | `ProductAppShell` **单列**（200 / 60） |
| 用户**强烈明确**要求某条非全模态产品线也用双列 | 才把该顶导改为 dual |
| 只要插槽 | `MinimalAppShell` |
| 登录 / 全屏 | `fullscreen` |
| 存量已有导航 | **只出内容区**，禁止第二套顶栏侧导 |
| 已有项目无壳，且是系统级后台 | 补 `ProductAppShell`（仍先问入口名，侧导走默认） |
| 用户只要裸页 / 嵌入模块 | 不强制导航，内容区仍走 Token 与 class |

`scripts/nav/exampleNavConfig.ts` 同时含全模态双列与其他产品线单列，落地按上表保留对应形态，入口名换成用户确认过的。

`navConfig` 先 `resolveNavIcon(菜单名)`。尺寸与禁止项见 `layout.md`。

### 列表（与导航无关）

| 条件 | `list-page.md` |
|------|----------------|
| 默认：搜索 + 表 + 外置分页 | §1 无树（复制 `01-BasicListPage.tsx`） |
| 页头 Tabs + 双行文案 | §2（复制 `02-TabDoubleRowListPage.tsx`） |
| 页头 Tabs + 48px 单行 | §3（复制 `03-TabRow48ListPage.tsx`） |
| 稿面**明确**要左树 | §4（复制 `04-TreeListPage.tsx`） |
| 卡片列表 / 卡片墙 / 页名含「广场」且没说要表 / 稿面是资源卡网格 | §5（复制 `05-CardListPage.tsx`） |
| 单列横向内容卡 / 分页浏览 / 资产中心（左文右图、一排一条） | §6（复制 `06-HorizontalCardListPage.tsx`） |

页面名叫「服务管理」不是加树的信号。名字含「管理」也不是走表或走卡的信号：搜索表 + CRUD 走 §1，广场 / 卡片墙才走 §5。不确定表还是卡、三列资源卡还是横向内容卡时先问一句。不要把看板做成整页列表，也不要把卡片列表做成看板。不要把 §6 做成 §5 三列网格。

### 表单

| 条件 | 方案 |
|------|------|
| 整页创建 / 编辑 / 配置 | 全页水平，复制 `scripts/form/01-BasicFormPage.tsx` |
| 列表或详情上的添加 / 编辑浮层 | 抽屉垂直，复制 `scripts/form/02-DrawerForm.tsx` |

### 详情

| 条件 | 方案 |
|------|------|
| 默认；页头有一级分类 Tabs | 有主 Tab，复制 `scripts/detail/01-BasicDetailPage.tsx` |
| 只有返回 + 标题 + 操作 | 无主 Tab，复制 `scripts/detail/02-NoTabDetailPage.tsx` |

### 看板

| 条件 | `dashboard-page.md` |
|------|---------------------|
| 默认：任务状态概览 + 大图 + TOP 表 | §2，复制 `01-BasicDashboardPage.tsx` |
| 值班 / 监控读数：多项独立采集，每项当前值 + 走势 | §3，复制 `02-MetricTileDashboardPage.tsx` |

不要把 §3 磁贴做成 §2 六项计数横条，也不要把 §2 拆成四张独立监控卡。

---

## 生成流程

生成前先定交付边界与选型，再读 **1 份** reference。有模板则复制起步。

### 生成导航

1. **先问**顶导入口名称（未指定时给：全模态数据智能 / 模型开发 / 应用开发 / 基础管控）。**不要问**侧导双列还是单列。得到顶导答复后：全模态用双列，模型开发 / 应用开发 / 基础管控等用单列；仅当用户强烈要求时才把非全模态改成双列。
2. 读 `layout.md`、`nav-icons.md`。
3. 复制 `scripts/components/` 产品壳，或只要 `MinimalAppShell`。相对导入已对齐，不必改。
4. 从 `scripts/nav/exampleNavConfig.ts` 复制结构到 `src/nav/navConfig.ts`：按产品线默认形态保留 dual / singles，换成用户确认的入口名 / path / 图标。
5. 保留顶栏 56、双列 60+180 / 单列 200、位置选择器 280×400、默认 `NavWorkspaceSelect`。
6. 侧导顶部不要改成普通 `Select` 列表。
7. 菜单已挂、业务页还没做的路由复制 `scripts/pages/PlaceholderPage.tsx`：页头标题 + 侧导路径 +「该页面还未搭建」。不要加搜索，不要加「创建 XX」。
8. `index.html` 的 `<title>`、运行时 `document.title` 用 `navConfig.platformName`（壳层已同步）。`public/favicon.ico` 从 `assets/brand/favicon.ico` 拷贝；用户另给图则替换，不要留 Vite 默认图标。

### 生成登录页面

1. 读 `login-page.md`。整拷 `scripts/auth/`（含 `useDemoAuth.ts`）与 `assets/login/`、`assets/brand/topnav-logo.svg`。
2. 全屏壳 `fullscreen` + `LOGIN_SHELL_BG`；根与壳 `min-w-[var(--yb-layout-min-w)]`（1280）。始终三栏，不要 `lg` 切移动卡。
3. 登录成功 `writeDemoAuthed(true)`。`App.tsx` 用 `useDemoAuth()` 把 `isAuthed` / `onLogout` 传给 `ProductAppShell`。
4. 页签 title 与 `PLATFORM_PRODUCT_NAME` 一致；拷 favicon 到 `public/favicon.ico`。

### 生成列表页面

1. 按选型复制 `scripts/list/01`–`06` 之一到 `src/{feature}/`。表模板只换列、数据、path、文案；§5 / §6 只换字段、数据、path。细节读 `list-page.md` 对应节。
2. 复用 `SearchWithRefresh`、`ListTableStatusDot`。§1–§5 主按钮 **「创建 XX」** 放工具行右侧。§6 放页头标题行右侧。创建 / 编辑带 `state.from`。
3. **§5 / §6**：到此为止，见下面「生成卡片列表」。**§1–§4** 继续 4–7。
4. 再加 `TableColumnFilterTitle`、`LIST_TABLE_NO_DATA_ELEMENT`。Table：`border={false}`、`pagination={false}`；分页 `mt-4 shrink-0` 紧跟表外层，表外层禁止 `flex-1`。默认每页 10（`LIST_DEFAULT_PAGE_SIZE`）。用户改条数只动该常量。
5. 名称列 `LIST_TABLE_NAME_LINK_CLASSNAME` + `Link`；操作列 `service-manage-actions` + Arco `Link`，class **禁止混用**。
6. 有状态列时单元格用 `ListTableStatusDot`（`STATUS_DOT_COLOR` 映射语义色），禁止纯文字、禁止 `Badge`、禁止自绘圆点。
7. 进入创建 / 编辑必须带 `state.from`，见 `form-page.md` §1.4。

### 生成卡片列表

**三列资源卡（§5）**

1. 复制 `scripts/list/05-CardListPage.tsx`。页头走无 Tab §1.1；搜索宽 280；主按钮在工具行右。
2. 网格固定 `grid-cols-3`、`gap-4`。卡挂 `yb-list-card`（12px），禁止 `yb-content-card`，禁止 Table。
3. 整卡进详情；标题 16/24/500；状态 `ListTableStatusDot`；操作是 `Button type="text"`，`stopPropagation`。
4. 空态 `PageLevelEmpty layout="inline"`。分页默认每页 15（`LIST_CARD_PAGE_SIZE_3COL`），`sizeCanChange`。
5. 删除 `Modal.confirm`。图标 48×48 可换成业务 SVG。

**单列横向内容卡（§6）**

1. 复制 `scripts/list/06-HorizontalCardListPage.tsx`。主按钮放页头标题行右侧。
2. 工具行：搜索 280 + 标签 Radio + 可选高级筛选。列表 `flex flex-col gap-4`，不要 `grid-cols-3`。
3. 卡挂 `yb-list-card`；左文（标签 / 标题 / 摘要 / 发布与互动）右图 160×108。
4. 空态 `PageLevelEmpty layout="inline"`。分页默认每页 10（`LIST_CARD_PAGE_SIZE_1COL`）。2 列同样 10。
5. 不要先出 §5 三列应用卡再改。

### 生成表单页面

1. 全页水平：复制 `scripts/form/01-BasicFormPage.tsx`，只换字段、path、文案。抽屉：复制 `scripts/form/02-DrawerForm.tsx`。
2. `className={FORM_PAGE_ARCO_CLASS}`；常量从 `formPageLayout.ts` 导入。
3. 全页水平默认**一行一个字段**，禁止两个 112px 标签 `Col span={12}` 对半切。
4. 底栏 **「确定 / 取消」**（左对齐，主在左）；校验 **红框 + 白底**，禁止 `--color-danger-light-1`。
5. 返回 / 取消 / 保存回到 `from`，缺省回列表；禁止编辑态一律进详情；禁止只靠 `navigate(-1)`。

### 生成详情页面

1. 有主 Tab：复制 `scripts/detail/01-BasicDetailPage.tsx`。无主 Tab：复制 `scripts/detail/02-NoTabDetailPage.tsx`（80px 顶栏）。只换字段、表格、文案。不要把 80px 叠到有 Tab 页头上。
2. 只读多行值用 `DetailFieldValue`。
3. 标题旁状态与列表状态列用同一个 `ListTableStatusDot`，禁止 Arco `Badge`。
4. 空 Tab 用 `PageLevelEmpty`（`layout="page"`），禁止裸 Arco `Empty`。

### 生成看板页面

1. 按选型复制 `scripts/dashboard/01-BasicDashboardPage.tsx`（状态概览）或 `02-MetricTileDashboardPage.tsx`（指标磁贴）。只换字段、数据、文案。宿主需 `npm install echarts`。
2. 页头与内容区走列表 §1.1 无 Tab 白底 + `Divider`，根 `min-h-full`，不要铺 `--yb-fill-2`，不要整页搜索主表。
3. 卡片 `bordered={false}` + `yb-content-card shrink-0`；工具行放 Card body，不要 `title` / `extra`。不要给卡加阴影。
4. ECharts tooltip 用模板里的 `DASHBOARD_ECHARTS_TOOLTIP`（`borderWidth: 0`）。颜色先 `resolveThemeColor`，不要把 CSS 变量写进 option。
5. **§3 磁贴**：左右分栏、空值「—」、卡高预留；单卡失败只在该块重试，不用 `globalMessage`。

### 生成 IDE 页面

1. 复制 `scripts/ide/01-BasicIdePage.tsx`，只换顶栏、编辑器内容、右栏字段。
2. 根节点同一元素挂 `dev-task-detail` + `DEV_TASK_IDE_ROOT_CLASS`。尺寸从 `devTaskIdePage.ts` 导入。
3. 主分栏链 `min-h-0` + `overflow-hidden`；中缝 / 顶栏底 / 结果区顶均为 1px `--yb-border-2`。
4. 右栏表单挂 `FORM_PAGE_ARCO_CLASS`；版本表容器 `min-w-0 overflow-x-auto` + `dev-task-version-table`。

---

## 输出规则

1. 代码写入用户工作区，禁止改 Skill 目录。
2. 先声明页面类型与参照章节。未搭建菜单页只出路径 +「还未搭建」，不要工具行按钮。已落地的 mock 页才按对应 `*-page.md` 搭页头 / 工具行。
3. 常量从 `src/patterns/` 导入，不手写魔法数。
4. 结构线 `--yb-border-2` + `1px`。看板 / KPI 内容卡 `yb-content-card`（8px）。卡片列表 `yb-list-card`（12px）。禁止把 12px 套到看板卡，也禁止用 `yb-content-card` 做资源列表卡。
5. 消息用 `globalMessage`。删除用 `Modal.confirm`（宽 400、圆角 8、正文 `pl-28`；标题「确定要操作XX吗？」、正文写影响），不用 `Popconfirm`。
6. 空态距顶 1/4，禁止垂直居中；表格用 `LIST_TABLE_NO_DATA_ELEMENT`；卡片列表用 `PageLevelEmpty layout="inline"`。
7. 路由 `/create` → `/:id/edit` → `/:id` → 列表。文末附对应 `*-page.md` Checklist。

---

## Design Token 集成（复制模板时必做）

Skill 内 CSS 不会在用户项目自动生效。按 [bootstrap.md](references/bootstrap.md) 做完：

| 步骤 | 操作 |
|------|------|
| 1. 复制样式 | `styles/` → 项目 `src/styles/`（导航阶段再 `@import` `nav-shell.css`） |
| 2. 复制 Provider | `scripts/providers/ArcoTheme19155Provider.tsx` → 项目 `src/providers/` |
| 3. 入口 | `main.tsx`：`arco.css` → `index.css` → `arco-theme-19155.css` |
| 4. `@import` | `figma-tokens` → `shell-baseline` → `page-layout` → `message`（→ `nav-shell`）→ `@tailwind` |
| 5. 根节点 | `<ArcoTheme19155Provider>` 包裹 App |
| 6. 页签 | `index.html` `<title>` = `PLATFORM_PRODUCT_NAME`；拷 `assets/brand/favicon.ico` → `public/favicon.ico` |
| 7. 验收 | 校验白底红框；`Modal.confirm` 能弹出（React 18）；无 CSS 404；不要删减 `page-layout.css` 里表格 / 表单 / `yb-content-card` / `yb-list-card` 选择器 |
