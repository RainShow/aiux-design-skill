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
| 列表页 | [list-page.md](references/list-page.md) | §1 无树 / §2 Tab+64px / §3 Tab+48px / §4 左树 / §5 三列资源卡 / §6 单列横向卡 |
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
| 示例菜单结构 | `scripts/nav/exampleNavConfig.ts` | 全模态双列 + 应用开发 / 模型开发 / 基础管控单列；非全模态不要默认改成双列 |
| 未搭建菜单页 | `scripts/pages/PlaceholderPage.tsx` | 侧导路径 +「该页面还未搭建」；配合 `scripts/nav/resolveNavTrail.ts` |
| 最小壳 | `scripts/components/MinimalAppShell.tsx` | 只要插槽、不要完整产品导航 |
| 顶栏 / 登录品牌 | `scripts/components/TopNavBrandLogo.tsx` | 与壳一起拷；登录左上复用 |

**列表**（规范见 `list-page.md`）

| 场景 | 文件 | 说明 |
|------|------|------|
| 无树列表 | `scripts/list/01-BasicListPage.tsx` | 默认。搜索 + 48px 表 + 外置分页（默认每页 10） |
| Tab + 64px 双行表 | `scripts/list/02-TabDoubleRowListPage.tsx` | 页头 line Tabs，表体双行 |
| Tab + 48px 表 | `scripts/list/03-TabRow48ListPage.tsx` | 页头同 §2，表体仍 48px |
| 左树右表 | `scripts/list/04-TreeListPage.tsx` | **仅**稿面明确要左树 |
| 三列卡片列表 | `scripts/list/05-CardListPage.tsx` | 搜索 + 固定三列资源卡（默认每页 15）。页名含「广场」或稿面是卡片网格时用 |
| 单列横向卡片 | `scripts/list/06-HorizontalCardListPage.tsx` | 标题操作区 + 左文右图内容卡（默认每页 10）。资产中心 / 分页浏览 |

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
| 登录 | `scripts/auth/` | 品牌用 `TopNavBrandLogo`；含 `useDemoAuth.ts`；最小宽与壳同为 1280 |

**落地共享件**

| 用途 | 路径 |
|------|------|
| Provider | `scripts/providers/ArcoTheme19155Provider.tsx` |
| 原子 | `scripts/components/`（SearchBox、表头筛选、空态、省略单元格、`ListTableStatusDot`、DetailFieldValue） |
| 常量 | `scripts/patterns/`（表单/详情/IDE 尺寸、`LIST_DEFAULT_PAGE_SIZE` / `listCardPageSize`、`globalMessage`、表格空态） |

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
| `assets/brand/` | 顶栏 Logo、`favicon.ico` / `favicon.png` |
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
请使用 aiux-design-skill，严格分三步执行，每步完成后停下来等我确认：

Step 1：搭建 Vite + React + TS + Arco19155 + Tailwind 环境，确保能运行。
Step 2：先问我顶导入口名称（没定就默认给 全模态数据智能 / 模型开发 / 应用开发 / 基础管控），再搭建顶栏、侧导、路由与鉴权跳转。
Step 3：实现第一个真实业务的列表、表单与详情页，并挂到侧栏。

全程遵守 aiux-design-skill，不要偏离规范另起样式体系。
```

底座齐了之后，可按下面的常见场景继续搭建。选型与复制哪份模板以 [SKILL.md](SKILL.md) 为准。

复制给 Agent 的提示词只写 **意图** 和 **业务约束**（谁、要解决什么、关键规则、不可越过的边界）。**策略**（选哪类页、哪套模板）和 **资产**（规范、组件、代码模板）由 Skill 按条件选型，不必写进提示词。

## 常见使用场景

### 场景 1：搭建 CRUD 页面（增删改查页面流）

**布局：** 已有导航壳 + 无树列表 + 全页创建/编辑 + 有主 Tab 详情。筛选在列表工具行 / 表头，和侧导形态无关。

这是 `/page-layout list` + `form` + `detail` 的组合。默认复制 `01-BasicListPage` / `01-BasicFormPage` / `01-BasicDetailPage`。页面名叫「服务管理」或「应用管理」不是加左树、也不是出三列卡的信号；提示词是搜索表 + 增删改查就走 §1。稿面明确要树才用 `04`。用户说卡片列表、页名含「广场」、或稿面是资源卡网格时复制 `05-CardListPage`；用户说单列横向卡片、分页浏览、资产中心时复制 `06-HorizontalCardListPage`，不要先出表或三列网格。信息分组多、页头操作多的详情走场景 3，不要停在列表 CRUD 里那张轻量详情。

**生成顺序：**

1. 已有 `ProductAppShell` 时只出内容区，禁止再套一套顶栏侧导；没有壳才先走 `/page-layout nav`。
2. 按数据实体复制 `scripts/list/01-BasicListPage.tsx`：搜索 + 刷新、48px 表、外置分页、主按钮「创建 XX」、名称列进详情。
3. 创建 / 编辑复制 `scripts/form/01-BasicFormPage.tsx`，必须带 `state.from`；列表上的轻量添加才用抽屉 `02`。
4. 详情复制 `scripts/detail/01-BasicDetailPage.tsx`；删除用 `Modal.confirm`（标题问句、正文写影响）。

```text
全模态数据智能增加「应用管理」，右侧页面为应用列表，可按名称搜索、按状态筛选，可在列表页创建、编辑、删除，点击名称进详情页。创建/编辑填完回到原来的列表。详情页能按分类查看。删除前说清楚后果。这是一套轻量的 CRUD 页面流。
```

### 场景 2：创建配置类页面

**布局：** 任意导航 + 全页水平表单。区块再多、选项再复杂也还是这一套，不要另起向导、多步页或抽屉。列表或详情上的轻量添加才用 `form-page.md` §2。

整页创建 / 编辑 / 配置复制 `scripts/form/01-BasicFormPage.tsx`。普通字段一行一个；成组短选项用分段；方式 / 模型等带说明的选择仍在 Form 里，不要拆成第二页。

**生成顺序：**

1. 复制 `scripts/form/01-BasicFormPage.tsx`，只换区块、字段、path、文案；挂 `FORM_PAGE_ARCO_CLASS`。
2. 按业务块用标题分开。默认一行一个字段，禁止两个短标签对半切；长文本仍占整行。
3. 底栏「确定 / 取消」左对齐（主按钮在左）；校验红框 + 白底。由前面选择推导的只读项不要再做成可填。
4. 返回 / 取消 / 保存回到 `state.from`，缺省回列表，不要写死进详情。

```text
模型开发增加「模型精调」创建页，训练同学在一页里配完提交。先选精调方式（Pre-Training / SFT / 偏好对齐），每种有一句说明及插图，默认选中SFT。基本信息包括任务名称、任务描述；训练配置包括训练方法、参数配置，训练里可开关增量训练，选全量或 LoRA，可填迭代轮次、学习率、序列长度等参数，每项旁边要有说明，不常用的先收起来。数据配置包括数据来源、数据格式、选择数据集，并设定训练/验证拆分比例。最后发布模型包括是否自动发布、发成新模型还是已有模型的新版本。
```

### 场景 3：搭建详情页

**布局：** 已有导航壳 + 有主 Tab 详情。页头是返回 + 名称/状态，下面分类 Tab，内容区只读字段分组 + 参数表。不要做成可提交表单，也不要做成看板或列表。

这是 `/page-layout detail` 命中 `detail-page.md` §1 的情况。复制 `01-BasicDetailPage.tsx`。有一级分类 Tabs 时用这一套；只有返回 + 标题才用 `02`。标题行随内容高度，不要把无 Tab 的 80px 顶栏叠上来。

**生成顺序：**

1. 复制 `scripts/detail/01-BasicDetailPage.tsx`，只换字段、分组、Tab、表格；挂 `service-detail-page`。挂到现有侧栏（如全模态「服务管理」点进详情）。
2. 页头 `page-header-with-tabs`：返回、服务详情（名称）、`ListTableStatusDot`。有操作再放右侧 `Button type="secondary"`。
3. 默认 Tab「服务信息」：基本信息用三列只读字段行，不要用 `Form`。调用地址用 Method + 可复制长链，不要单行裁断。请求头 / 请求参数 / 返回参数用 `service-detail-table`。
4. 未接入的 Tab（调用监控、授权应用、在线测试）用 `PageLevelEmpty`。点编辑带 `state.from`，保存后回到这条详情。

```text
全模态数据智能增加「服务管理」详情页，接入同学打开后先认出服务名称和是否已上线，下面用分类切换服务信息、调用监控、授权应用和在线测试，默认落在服务信息。服务信息里先看基本信息（名称、类型、组织、协议、请求方式、调用地址、认证策略、限流、缓存等），调用地址要能整段复制、不要裁断。再往下是请求头、请求参数、返回参数，用表格看清字段名、类型、是否必填和说明。这是只读详情，不要做成可提交表单，也不要做成看板或列表。还没接的分类给空态。
```

### 场景 4：搭建单列横向卡片列表页

**布局：** 已有导航壳 + 无 Tab 页头（标题操作区）+ 搜索 / 标签筛选 + 单列横向内容卡。不要做成表，也不要做成三列资源卡。

这是 `/page-layout list` 命中 `list-page.md` §6 的情况。复制 `06-HorizontalCardListPage.tsx`。用户说单列横向卡片、分页浏览、资产中心，或稿面是左文右图、一排一条时用这一套。不要先出 `05-CardListPage` 的三列网格再改。

**生成顺序：**

1. 已有 `ProductAppShell` 时只出内容区；挂到现有侧栏（如应用开发「资产中心」）。
2. 复制 `scripts/list/06-HorizontalCardListPage.tsx`：主按钮「创建 XX」放页头标题行右侧；工具行搜索宽 280 + 标签 Radio（网页端 / 客户端 / 移动端）+ 可选高级筛选。
3. 列表 `flex flex-col gap-4`；卡挂 `yb-list-card`，左文（标签 / 标题 / 摘要 / 发布与互动）右图 160×108；整卡进详情，带 `state.from`。
4. 空态 `PageLevelEmpty layout="inline"`。分页跟提示词：本例每页 3 条；未指定时 1 列默认 10（`LIST_CARD_PAGE_SIZE_1COL`）。不要先出三列网格，也不要用三列的 15。

```text
应用开发增加「资产中心」，右侧为「分页浏览详情」页，含标题栏、搜索、标签筛选（网页端/客户端/移动端+高级筛选）、创建资产操作、3 条 带标题、描述、标签、创建信息、右侧配图的内容卡，支持分页。
```

### 场景 5：搭建数据看板页

**布局：** 任意导航 + 无 Tab 页头 + KPI + 走势 / 对比图 + 内嵌明细表。不要做成整页搜索列表。

这是 `/page-layout dashboard` 命中 `dashboard-page.md` §2 的情况。复制 `01-BasicDashboardPage.tsx`。页名叫总览 / 看板、主体是多项计数 + 大图 + TOP 表时用这一套；运维读数磁贴才用场景 6 的 `02`。

**生成顺序：**

1. 复制 `scripts/dashboard/01-BasicDashboardPage.tsx`，只换 KPI、图表、明细表；宿主需 `echarts`。挂到现有侧栏（如全模态「运营数据看板」）。
2. 页头无 Tab 白底 + `Divider`；标题下可写一句更新说明（如 T+1、每天上午 9 点刷新）。筛选（日期范围 / 业务线）放 Card body，不要用 Card `title` / `extra`。
3. 首屏 KPI 一眼扫完；图与表跟筛选共用同一时间范围，不要各说各的。卡片 `yb-content-card`，不要加阴影。
4. 内嵌表明细走列表 §1.3 / §1.6，默认每页 10；名称列可进详情核对。

```text
全模态数据智能增加「运营数据看板」，给运营和业务人员用。顶部能筛选日期范围，首屏先看到今日调用量、成功率、平均耗时、活跃用户数，一眼扫完。中间左边是近 30 天调用量走势，时间只标几个关键日；右边是各业务线调用量对比。下面用表格列出各业务线明细，方便点进去核对。筛选和图表必须同一时间范围。
```

### 场景 6：搭建带指标的列表页

**布局：** 已有导航壳 + 无 Tab 页头 + 四项读数磁贴并排 + 下方资源明细表。命中 `dashboard-page.md` §3，复制 `02-MetricTileDashboardPage.tsx`。不要走列表 §1，也不要做成场景 5 那种一张卡里的六项计数横条。

**生成顺序：**

1. 复制 `scripts/dashboard/02-MetricTileDashboardPage.tsx`，只换磁贴字段、单位、色、明细表；宿主需 `echarts`。挂到现有侧栏（基础管控「监控概览」）。
2. CPU / 内存 / 磁盘 / 网络四项并排，每项当前读数 + 近期走势；数字和单位对齐。暂无数据显示「—」（提示词里的横线），不要写成 0。
3. 某项失败只在该块提示并重试，不影响其他项，不用 `globalMessage` 打断整页。
4. 下方「各资源明细」走列表表皮肤，默认每页 10；不要做成带搜索的整页主表。

```text
基础管控增加「监控概览」，供运维同学查看 CPU、内存、磁盘、网络四项指标，每项同时给出当前读数与近期走势，四项并排方便对比，数字和单位整齐对齐。暂无数据用横线，不要写成零。某项失败只在该块重试，不影响其他内容。页面下面补充各资源明细列表。
```
