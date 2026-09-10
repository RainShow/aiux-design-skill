# 导航壳

企业中后台的顶栏 + 侧导骨架：定内容区高度，菜单文案、路由、产品线由业务 config 注入，不在组件里写死。

## 目录

| 场景 | 说明 |
|------|------|
| [共性规则](#共性规则) | 尺寸 Token、1280 最小宽、`box-sizing` |
| [1. 最小壳](#1-最小壳minimalappshell) | 只要 Message + 插槽、自己写导航 |
| [2. 顶栏](#2-顶栏producttopnav) | `ProductTopNav` |
| [3. 双列侧导](#3-双列侧导dualcolumnsidenav) | 轨 60 + 二级 180；含功能全景、位置选择器 |
| [4. 单列侧导](#4-单列侧导singlecolumnsidenav) | 展开 200 / 折叠 60 |
| [5. 产品壳接线](#5-productappshell-接线) | dual / single / 全屏 / 鉴权；[未搭建菜单页](#51-未搭建菜单页) |

相关：[nav-icons.md](nav-icons.md)（写菜单先按语义查表）、[bootstrap.md](bootstrap.md)（落地路径）、[login-page.md](login-page.md)（全屏无顶侧栏）。

命令：`/page-layout nav`，或提到「顶栏 / 侧导 / 双列导航 / 应用开发侧栏」时读本文。

---

## 意图 / 何时用 / 资产

**意图**：把壳层尺寸和交互钉死，换产品只换 config，避免每份业务各写一套顶栏侧导。

**何时用**

写代码前先问用户：顶导几个入口、各叫什么（未指定时建议 全模态数据智能 / 模型开发 / 应用开发 / 基础管控）。用户说「继续」且未点选时，按四个建议入口全部落地。**不要问**侧导用双列还是单列。

| 判断 | 用 |
|------|----|
| 顶导是「全模态数据智能」 | `ProductAppShell` **双列**（轨 60 + 二级 180） |
| 应用开发 / 模型开发 / 基础管控 / 其他产品线（默认） | `ProductAppShell` **单列**（200 / 60） |
| 用户**强烈明确**要求某条非全模态产品线也用双列 | 才把该顶导改为 dual |
| 只要 Message + 插槽、自己写导航 | `MinimalAppShell` |
| 登录 / 全屏编辑器 | `ProductAppShell` 自动去顶侧栏，或 `MinimalAppShell fullscreen` |
| 已有项目无壳，且是系统级后台 | 补 `ProductAppShell`（仍先问入口名，侧导走默认） |
| 用户只要裸页 / 嵌入模块 | 不强制导航，内容区仍走 Token 与 class |

**资产（Skill 内，换电脑可复现）** — 导航壳已有完整可复制实现，**复制起步**，不要另写一套壳。

| 用途 | 路径 |
|------|------|
| 产品壳 + 顶栏 + 双列 / 单列 | `scripts/components/`（`ProductAppShell`、`ProductTopNav`、`DualColumnSideNav`、`SingleColumnSideNav`） |
| 功能全景浮层 | `scripts/components/DualColumnOverviewModal.tsx`（壳默认挂上，菜单来自 `config.dual`） |
| 位置选择器 | `scripts/components/NavWorkspaceSelect.tsx`（侧导顶条默认；下拉 280×400；业务数据走 `workspaceSelectProps`） |
| 尺寸常量 | `scripts/patterns/navShellLayout.ts` |
| 示例菜单 | `scripts/nav/exampleNavConfig.ts` |
| 预置图标 | `scripts/components/navIcons.ts` + `assets/nav/`，见 [nav-icons.md](nav-icons.md) |
| 最小壳 | `scripts/components/MinimalAppShell.tsx` |
| 滚动条 / 全览 / 组织选择器皮肤 | `styles/nav-shell.css` |
| 全局 `box-sizing` + 最小宽 | `styles/shell-baseline.css` |

落地目标见下文 §6 与 [bootstrap.md](bootstrap.md) §2.8。

---

## 共性规则

- 侧导高度一律：`h-[calc(100dvh-var(--yb-topnav-h))]`。
- 壳与顶栏、**登录全屏壳** `min-width: var(--yb-layout-min-w)`（**1280**）。视口更窄时 **html 横向滚动**，勿裁切顶栏右侧，登录页也不要降级成移动卡片。
- `shell-baseline.css`：全局 `box-sizing: border-box`；`html { overflow-x: auto }`，`body` / `#root` 设 `min-width`。禁止 html/body/#root 全部 `overflow: hidden`，否则小于 1280 时顶栏头像会被裁一半。关掉 Tailwind preflight 时尤其依赖这份 baseline，否则 `w-full + px-16` 会把头像裁出视口。
- 菜单文案、路由、产品线顺序全部 **config 注入**。禁止在组件内写死「全模态 / 应用开发」等产品名。
- 菜单 `iconSrc` 来自 `NAV_PRESET_ICONS` / `resolveNavIcon`，未另起一套图标。
- 侧导只用本目录的 `DualColumnSideNav` / `SingleColumnSideNav`，不要另写一套。

### 尺寸速查（强制）

| Token / 常量 | 值 | 用途 |
|--------------|-----|------|
| `--yb-topnav-h` / `NAV_TOP_H_PX` | **56** | 顶栏高 |
| `--yb-side-w` / `NAV_RAIL_W_PX` | **60** | 双列轨宽 / 单列折叠宽 |
| `NAV_SECOND_W_PX` | **180** | 双列二级宽 |
| 双列展开 | **240** | 60 + 180 |
| `NAV_SINGLE_EXPANDED_W_PX` | **200** | 单列展开 |
| `--yb-menu-item` / `NAV_RAIL_ITEM_PX` | **48** | 双列一级点击区（项间距 4，菜单区 py-12） |
| `NAV_RAIL_HAMBURGER_H_PX` | **52** | 轨顶汉堡条（px-12 py-16） |
| `NAV_RAIL_FOLD_H_PX` | **60** | 轨底 fold 条 |
| `NAV_RAIL_FOLD_ICON_PX` | **20** | 轨底 fold 图标（20×20 viewBox） |
| `--yb-layout-min-w` / `NAV_LAYOUT_MIN_W_PX` | **1280** | 壳与顶栏最小宽 |
| `NAV_OVERVIEW_PANEL_W_PX` | **400** | 功能全景浮层宽；距视口左/顶/底 **10**；高度铺满 `100dvh - 顶栏 - 20` |
| `NAV_ORG_SELECT_PANEL_W/H_PX` | **280 × 400** | 位置选择器下拉面板 |

---

## 1. 最小壳（`MinimalAppShell`）

只要 Message 容器 + `topNav` / `sideNav` / 主区插槽。登录页用 `fullscreen`（见 [login-page.md](login-page.md)），勿复用带滚动主区的业务壳。

要对齐产品顶栏侧导时不要停留在本组件，改用 `ProductAppShell`。

---

## 2. 顶栏（`ProductTopNav`）

```
header h-56 | min-width 1280 | bg --yb-bg-2 | border-b 1px --yb-border-2 | shadow
├── 左：Logo + | + 平台名 + 产品线按钮（config.topNav）
└── 右：rightExtra（文档/消息）+ 头像 Dropdown（退出）；整簇 shrink-0
```

- 激活项：`font-semibold` + `--yb-text-1`；未激活：`font-normal` + `--yb-text-2`
- **禁止**在组件内写死产品线文案；全部走 `items: ProductTopNavItem[]`
- 右侧图标用 **`TopNavGlyphIcon`**（20px 热区 + 与 viewBox 同比例的 inset）。文档 inset `TOPNAV_GLYPH_INSET_FILE`，铃铛 `TOPNAV_GLYPH_INSET_BELL`。禁止 `<img className="size-full">` 铺满正方形（Figma SVG 为 `preserveAspectRatio="none"`，会拉扁）。
- 头像按钮：`size-[var(--yb-avatar)]` + `shrink-0` + `overflow-hidden`；外包一层固定 32px 盒，避免 Dropdown 把圆形撑成椭圆。
- `ProductAppShell` 未传 `topNavRightExtra` 时默认渲染 `ProductTopNavRightExtra`；传 `null` 关闭。

---

## 3. 双列侧导（`DualColumnSideNav`）

```
总宽：60（仅轨 / 主页）或 240（轨+二级）
背景：整栏一块 --yb-fill-2（二级禁止改白底 --yb-bg-2）
├── 顶条（默认 NavWorkspaceSelect，跨两列；仅轨时 compact）
└── flex
    ├── 轨 60：h-full + justify-between
    │     ├── 功能全景汉堡：全宽、px-12 py-16（高 52）、底边 1px --yb-border-2、图标 20 居中（无文字；不要做成 48 方块 + 另画一根 divider）
    │     ├── 菜单列表：全宽、py-12、gap-4、items-center
    │     │     └── 一级项：48×48、p-8、gap-4、圆角 4、图标 20 + 10px/normal 文案；**不要** 1px 透明边框（border-box 会吃掉内容区），**不要** overflow-clip（四字文案会裁切）
    │     └── 底 fold：全宽高 60、p-12，内层 **36**（p-8）+ 图标 **20**
    │           展开态用「侧栏折叠」（左箭头）；收起态用「侧栏展开」（右箭头）
    │           **禁止** `collapsed ? fold : unfold`（展开时会画出展开箭头）
    │           图标必须是 **20×20 viewBox**（约 2.5 内边距），不要把 15×12.5 拉伸进 20 方槽
    └── 二级 180（!collapsed && 非 home）：同色 fill-2，无 border-l，h-full
```

| 约定 | 说明 |
|------|------|
| 一级 | `config.dual.rail`；点击无 `path` 时跳转该面板第一个叶子。选中：**图标 + 10px 文案变 `--yb-primary-6`**，字重 400；点击区 **48×48**、`p-8`、项间距 **4**、菜单区 **py-12**。水平居中于 60 轨（左右各 6）。**不要**白底描边卡片（那是二级叶子） |
| 二级分组 | **20px 图标** + **14px/22 标题** + **下拉箭头**，可折叠；不要用单列那种 12px `text-3` 分组名 |
| 二级叶子 | 左侧空出 **20px** 与分组图标对齐，`p-8`；选中 **白底 `--yb-bg-2` + `--yb-border-3`** |
| 折叠 | 只藏二级；轨始终 60；**home 时 fold disabled**；fold 钉在轨**底**，高 **60**、图标 **20×20**；展开用折叠箭头、收起用展开箭头；禁止贴在一级图标下面 |
| 功能全景入口 | 传入 `putawayIconSrc` 即在轨顶渲染**汉堡图标**（无「全览」二字）；条高 **52**（`px-12 py-16` + 底边）；点击打开浮层。不必再传 `onOverviewClick`。业务要自绘时才覆盖 |
| 高亮 | 激活主色 `--yb-primary-6`；图标用 `MaskIcon`；`iconSrc` 来自 `NAV_PRESET_ICONS` / `resolveNavIcon` |

**禁止**把分隔线画在二级的 `border-l`、禁止二级白底：那会变成「灰轨 \| 白卡片 \| 白内容」多层框。正确是灰轨和灰二级连成一块，中间一根细线（轨 `border-r` 1px `--yb-border-2`），外面再一根贴内容区（整栏 `border-r` 1px `--yb-border-2`）。

### 3.1 功能全景浮层（`DualColumnOverviewModal`）

菜单文案走 **`config.dual.overview`**，组件不写死产品线。Figma 节点 `modal_menu`（575:36599）仅作视觉对照。

```
遮罩 rgba(15,19,31,0.25) z-1099
面板 400 宽 | 距视口左/顶 10 | 高度 = 100dvh - 顶栏 - 20（顶底各留 10，铺满窗口）
圆角 12 | 阴影 0 8 20 12% | z-1100 | bg --yb-bg-1
├── 顶栏 padding 20×24：标题 20/30 semibold + 16px 关闭
└── 滚动区 flex-1 | padding 16×24，分区 gap 16（滚动条仅悬停整块面板时出现）
    └── 分区
        ├── 22px 图标 + 14/22 #23293b 标题 + 12/18 #646c85 简介（max 312）
        └── 叶子两列、左空 22px 对齐标题；14/22 #23293b，悬停 `--link-6`（class **`side-nav-overview-link`**；**禁止**行内 `color`，会压过 hover）
```

**禁止**只写 `maxHeight` 让面板随内容收缩（内容少时下方会露出大块遮罩，不像浮窗）。用 **`height`**（`NAV_OVERVIEW_PANEL_STYLE`），内容区 `flex-1 overflow-y-auto`。

| 交互 | 说明 |
|------|------|
| 打开 | 轨顶汉堡 |
| 关闭 | 遮罩点击 / Esc / 关闭钮；打开时 `body` 禁滚 |
| 跳转 | 点叶子 `navigate` 后关闭 |
| 配置 | `overview.title`、`overview.blocks[].description` 必写产品简介；`links` 可与侧栏树叶子不同。不传 `blocks` 时按 rail+panels 自动抽叶子（无简介，仅结构） |

**禁止**在汉堡下再写「全览」二字。**禁止**把功能全景做成二级 180 面板或居中 Modal。

### 3.2 位置选择器（`NavWorkspaceSelect`）

侧导顶部**默认**就是这套下拉，不要再做成普通 `Select` 选项列表。演示树 `DEMO_ORG_TREE` 开箱即用。接业务组织树请传 **`workspaceSelectProps`**（壳层会保留仅轨 `compact`）；整段换成别的控件才用 `headerSlot`。

```
触发器：展开双列 = 全宽 Select；仅轨 / 折叠 = 32×32 方钮 + 箭头
下拉挂 body | position bl | 280×400 | 白底圆角 Card（popup 自身无边框阴影）
├── 顶：SearchBox「输入空间名称搜索」+ Radio.button「按组织选择 | 按空间选择」（16px 图标）
├── 中：列表区 px-12 py-4
│     ├── 组织 = Tree（分组标题；叶子 **16px 文件夹放在 switcher 位** 与父级箭头对齐，title 只放文字 truncate）
│     │     每层缩进 **16px**（indent = 箭头宽）；悬停/选中 **整行** fill-2，禁止只包文字的小胶囊
│     │     Tree 需 **`showLine`**（Arco 无连线时叶子不渲染 switcherIcon），连线用 CSS 藏掉；父级自定义 caret，不要加减号
│     └── 空间 = Menu 列表：选项高 **36**、`px-12 py-7`、项间距 **0**、图标 16 + gap 8、14/22 text-2
│           悬停/选中 `--color-fill-2`，文案保持 text-2 / 字重 400
│           **禁止**沿用 Arco Menu 默认 40 高、margin-bottom 4、inner 4×8、选中主色字
└── 底：分割线 + 「创建工作空间」正文色（`--color-text-1`）+ 12px 外链图标（水平翻转）；悬停主色
```

| 交互 | 说明 |
|------|------|
| 打开 | 点击触发器；`getPopupContainer={() => document.body}`，避免侧导 `overflow-clip` 裁切 |
| 搜索 | 过滤叶子标题；命中后自动展开祖先 |
| 选中 | 只认叶子；触发器文案为面包屑 `组织/…/空间名`（按空间模式为 `空间：xxx`），选中后关闭 |
| 创建 | `onCreateWorkspace`；不传则 `globalMessage.info` 演示占位（不要 `fail('创建')`） |
| 紧凑 | `compact` 时用方触发器，面板内容与展开态相同 |

**禁止**用 Arco 默认 option 列表充当位置选择器。`headerSlot={null}` / `workspaceSlot={null}` 才关闭顶条。业务真实组织树用壳层 `workspaceSelectProps={{ orgTree, spaceItems, onChange, onCreateWorkspace }}` 注入；**不要**为了接数据而 `dualHeaderSlot={<NavWorkspaceSelect … />}`（会丢掉仅轨 compact）。

---

## 4. 单列侧导（`SingleColumnSideNav`）

```
宽：展开 200 / 折叠 60
背景：--yb-bg-4 | border-r 1px --yb-border-2
├── 滚动区 px-12 py-24 gap-4
│   ├── NavWorkspaceSelect（默认；`workspaceSlot={null}` 关闭，如平台管理）
│   └── rows：group(12px text-3) | item(icon20+label) | divider
└── 底 fold 条：展开内宽 176 / 折叠按钮 36
```

| 约定 | 说明 |
|------|------|
| 行数据 | `config.rows`：`item` / `group` / `divider` |
| 激活 | `bg --yb-bg-2` + `border --yb-border-3`；字/图标主色 |
| 折叠 | 仅显示 36×36 图标按钮，`title=label`；折叠后不显示工作空间条 |

同一 `SingleColumnSideNav`，换 `singles[topKey]` 配置即可覆盖模型开发 / 本体 / 平台管理等产品线。

---

## 5. `ProductAppShell` 接线

1. `resolveTopNavKey(pathname)` → 当前顶导
2. `sideNavModeByTopKey[topKey]` → `'none' | 'dual' | 'single'`
3. dual / single 用对应 resolve* 算激活项
4. `isFullscreenPath` / `loginPath` → 无顶侧栏全屏

鉴权：`App.tsx` 用 `useDemoAuth()` 把 `isAuthed` / `onLogout` 传给壳；登录页用 `writeDemoAuthed(true)`。只写 `sessionStorage` 壳听不到变化。也可在外层自行 `Navigate`。

### 5.1 未搭建菜单页

侧栏先铺菜单、业务页还没做时，内容区复制 `scripts/pages/PlaceholderPage.tsx` + `scripts/nav/resolveNavTrail.ts`。

| 场景 | 用 |
|------|----|
| 菜单有了、页面还没做 | 无 Tab 页头标题 + 侧导路径（如 `AI资产库 / 应用广场`）+「该页面还未搭建」。**不要**搜索、**不要**「创建 XX」、**不要**假表 |
| 页面已落地、数据还是 mock | 按对应 `*-page.md` 搭完整骨架（页头 / 工具行 / 表或卡） |

不要把「占位也要页头 / 工具行」理解成给未搭建路由加创建按钮。那条只约束**已选型的业务页**。

---

## 6. 落地清单

`scripts/` 代码、根目录 `assets/` 与 `styles/` 分别落到项目 `src/` 对应位置，不必改 import。见 [bootstrap.md](bootstrap.md) §2.8。

| Skill 源 | 目标 |
|----------|------|
| `scripts/components/` | `src/components/` |
| `scripts/patterns/navShellLayout.ts` | `src/patterns/navShellLayout.ts` |
| `assets/nav/` | `src/assets/nav/` |
| `styles/nav-shell.css` | `src/styles/nav-shell.css`（`@import` 进 `index.css`，含 `.side-nav-scroll`、`.side-nav-overview-scroll`、`.org-select-droplist`） |

业务提供一份 `navConfig.ts`（参考 `scripts/nav/exampleNavConfig.ts` 的字段结构：全模态 dual，其他顶导 singles）。在 `App.tsx` 包 `<ProductAppShell config={...}>`。不必再手写顶栏文档/消息和侧导位置选择器；接组织树用 `workspaceSelectProps`，不要整段替换顶条。完整业务 `routeMap` / 二级巨石面板 **不进 Skill**。

---

## 7. Checklist

- [ ] 顶栏高 56；`min-width` 1280 且与壳同宽；视口 < 1280 时页面横滚、头像完整不被裁
- [ ] 浏览器页签 title = `navConfig.platformName`；`public/favicon.ico` 已挂，不是 Vite 默认图
- [ ] 右侧文档/铃铛用 `TopNavGlyphIcon` + 光学 inset，不拉伸；头像 32×32 正圆
- [ ] 产品线来自 config，激活字重正确
- [ ] 双列：轨 60 + 二级 180；主页仅 60；折叠藏二级；home 不可 fold；**一级轨拉满视口高度，fold 在底部**
- [ ] 双列整栏 `--yb-fill-2`，分隔线只在轨 `border-r`；二级不是白卡片
- [ ] 双列一级选中：图标+10px 文案主色、字重 400、48 点击区 `p-8`/`gap-4`，**不要**白底描边
- [ ] 双列二级：分组 = 20px 图标 + 14px 标题 + 箭头；叶子对齐图标列；选中白底+边
- [ ] 传入 `putawayIconSrc` 后轨顶是**汉堡图标、无文字**；点击打开功能全景：400 宽、**高度铺满窗口**（顶底各 10）、简介 12/18、叶子两列、遮罩/Esc 可关
- [ ] 双列/单列顶部默认有 `NavWorkspaceSelect`；仅轨时为 compact 方按钮
- [ ] 位置选择器下拉 280×400：搜索 + 按组织/按空间 + 组织树叶子图标 + 底栏「创建工作空间」（默认黑字 + 12px 外链图标）；挂 `document.body`，不是普通 Select 列表
- [ ] 单列：展开 200 / 折叠 60；group/item/divider；激活主色边框
- [ ] 切换顶导可切换 dual/single/none；内容区 `yb-layout-main-scroll`
- [ ] 菜单 `iconSrc` 来自 `resolveNavIcon` / `NAV_PRESET_ICONS`，未另起一套图标
- [ ] 未搭建的侧栏路由用 `PlaceholderPage`：路径 +「该页面还未搭建」，没有创建按钮
