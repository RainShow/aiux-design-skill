# 新项目落地指南（Skills 自包含）

只带 **`aiux-design-skill/`** 即可落地，不依赖本目录以外的示例工程。

推荐先读 [SKILL.md](../SKILL.md) 与新手指南 [README.md](../README.md)。

## 0. 放入仓库

将 `aiux-design-skill/` 放到新仓库 `.cursor/skills/`。

## 1. 依赖安装

工作区已有 `.cursor/skills/` 时，**不要** `npm create vite@latest .`（非空目录会失败）。先建到临时目录再搬到根：

```bash
npm create vite@latest _vite_tmp -- --template react-ts
rsync -a _vite_tmp/ ./ --exclude node_modules
rm -rf _vite_tmp
```

然后钉依赖：

```bash
npm install react@18 react-dom@18 @arco-design/web-react react-router-dom
npm install -D tailwindcss@3 postcss autoprefixer
```

**钉 React 18。** Vite `react-ts` 模板默认会装 React 19；Arco 2 的 `Modal.confirm` 仍调用 `ReactDOM.render`，19 下会报 `ReactDOM.render is not a function`，确认框弹不出来。若模板已装 19，执行上面的 install **覆盖** `react` / `react-dom`，并把 `@types/react`、`@types/react-dom` 也钉在 **18**。Tailwind 用 **v3**（不要 v4）。

配置 Tailwind（`content` 覆盖 `./src/**/*.{ts,tsx}`）。图表按需：`npm install echarts`（仅落地看板页时）。

`vite.config.ts` 加上 `resolve.dedupe` 与 `optimizeDeps.include`，避免 HMR 把 React / `react-router-dom` 打成两份（Arco Icon 会报 `Cannot read properties of null`）：

```ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@arco-design/web-react',
      '@arco-design/web-react/icon',
    ],
  },
})
```

本 Skill 默认按 Tailwind **开启** preflight（含全局 `box-sizing: border-box`）来验收。若为避免覆盖 Arco reset 而设置 `preflight: false`，**必须**使用本 Skill 的 `shell-baseline.css`（已补 `*, *::before, *::after { box-sizing: border-box }`）。缺少此项时，顶栏 `w-full + px-16` 会在 content-box 下比视口更宽，`overflow-clip` 裁掉头像，图标也会被压扁。

## 2. 从 Skills 复制资产

| 类别 | 复制 |
|------|------|
| 代码模板 | `scripts/{components,patterns,nav,providers}/` → 项目 `src/{components,patterns,nav,providers}/`（去掉 `scripts/` 前缀，**不必改 import**） |
| 样式 | `styles/` → 项目 `src/styles/` |
| 静态资源 | 根目录 `assets/` → 项目 `src/assets/`（`assets/brand/favicon.ico` 例外，拷到项目 `public/favicon.ico`，见 §2.7.1） |

**不要**把 `scripts/tsconfig.json`、`scripts/env.d.ts` 拷进业务仓库。那只给在 Skill 里打开模板时消红线；落地后以宿主 tsconfig 与真实依赖为准。

**不要**把 `scripts/` 下 list / form / detail / dashboard / ide 整目录拷进项目。业务页按需从对应模板单文件拷到 `src/{feature}/`。登录可整拷 `auth/`。

### 2.1 主题

| Skill 源 | 目标 |
|----------|------|
| `styles/arco-theme-19155.css` | `src/styles/arco-theme-19155.css` |
| `styles/figma-tokens.css` | `src/styles/figma-tokens.css` |
| `scripts/providers/ArcoTheme19155Provider.tsx` | `src/providers/ArcoTheme19155Provider.tsx` |

入口 `main.tsx`：

```ts
import '@arco-design/web-react/dist/css/arco.css'
import './index.css'
import './styles/arco-theme-19155.css'
```

`App.tsx` 根节点包 `<ArcoTheme19155Provider>`。

### 2.2 布局样式

| Skill 源 | 目标 |
|----------|------|
| `styles/page-layout.css` | `src/styles/page-layout.css` |
| `styles/message.css` | `src/styles/message.css` |
| `styles/shell-baseline.css` | `src/styles/shell-baseline.css` |

`src/index.css` 建议：

```css
@import './styles/figma-tokens.css';
@import './styles/shell-baseline.css';
@import './styles/page-layout.css';
@import './styles/message.css';
/* 产品导航壳阶段再加：@import './styles/nav-shell.css'; */

@tailwind base;
@tailwind components;
@tailwind utilities;
```

**不要**删减 `page-layout.css` 中与 `service-manage-table`、`app-form-page`、`service-detail-page`、`yb-content-card`、`yb-list-card` 相关的选择器。

### 2.3 布局常量（`scripts/patterns/`）

整目录复制 `scripts/patterns/` → 项目 `src/patterns/`。含：`formPageLayout.ts`、`detailPageLayout.ts`、`listTableNameLink.ts`、`listPageLayout.ts`、`devTaskIdePage.ts`、`globalMessage.ts`、`listTableNoDataElement.tsx`、`loginPageLayout.ts`、`authDemo.ts`、`navShellLayout.ts`。

### 2.4 空态插图

| Skill 源 | 目标 |
|----------|------|
| `assets/empty/page-level-empty-state.svg` | `src/assets/empty/page-level-empty-state.svg` |
| `scripts/components/PageLevelEmpty.tsx` | `src/components/PageLevelEmpty.tsx` |

（`listTableNoDataElement.tsx` / `PageLevelEmpty` 已按落地深度引用；表格与详情 Tab 空态见 [empty-state.md](empty-state.md)。）

> **CSS 插画路径**：`styles/page-layout.css` 中表格默认空态用 `url('../assets/empty/page-level-empty-state.svg')`，要求 CSS 落在 `src/styles/`（相对 `src/assets/`）。若把规则合并进 `src/index.css`，须改为 `url('./assets/empty/...')`。

### 2.5 组件

整目录复制 `scripts/components/` → 项目 `src/components/`。

含导航壳：`ProductAppShell.tsx`、`MinimalAppShell.tsx`、`ProductTopNav.tsx`、`DualColumnSideNav.tsx`、`SingleColumnSideNav.tsx` 等。

含原子：`SearchBox/`（`SearchWithRefresh`、`ListToolbarRefreshButton`）、`TableColumnFilterTitle.tsx`、`TableEllipsisCell.tsx`、`tableColumnFilterTime.ts`、`ListTableStatusDot.tsx`、`DetailFieldValue/`、`PageLevelEmpty.tsx`（空态，亦见 §2.4）。

这些是薄封装，不替代 Arco `Table` / `Form` / `Drawer`。用法见各页资产表：搜索与表头筛选见 [list-page.md](list-page.md)；空态见 [empty-state.md](empty-state.md)；只读多行值见 [detail-page.md](detail-page.md)。

### 2.6 最小应用壳

复制 `scripts/components/MinimalAppShell.tsx` → 项目 `src/components/MinimalAppShell.tsx`（若 §2.5 已整目录拷过则跳过；`globalMessage` 导入已是 `../patterns/globalMessage`）。

`App.tsx` 示例（业务壳；登录见 2.7）：

```tsx
import { ArcoTheme19155Provider } from './providers/ArcoTheme19155Provider'
import { MinimalAppShell } from './components/MinimalAppShell'
import { AppRoutes } from './routes'

export default function App() {
  return (
    <ArcoTheme19155Provider>
      <MinimalAppShell>
        <AppRoutes />
      </MinimalAppShell>
    </ArcoTheme19155Provider>
  )
}
```

顶栏/侧栏通过 `topNav` / `sideNav` 插槽自行接入。要对齐产品顶栏侧导，用 §2.8 的 `ProductAppShell`，不要另写一套壳。登录页请用 `fullscreen`（见 [login-page.md](login-page.md) §1），勿复用带滚动主区的业务壳。

### 2.7 登录页（可选，需要 `/login` 时）

| Skill 源 | 目标 |
|----------|------|
| `scripts/auth/LoginPage.tsx` | `src/auth/LoginPage.tsx` |
| `scripts/auth/LoginPageBackground.tsx` | `src/auth/LoginPageBackground.tsx` |
| `assets/login/bg-2160-1.png` | `src/assets/login/bg-2160-1.png`（不要拷 `image-*` / `gradient-top-*`） |
| `assets/brand/topnav-logo.svg` | `src/assets/brand/topnav-logo.svg` |
| `scripts/auth/useDemoAuth.ts` | `src/auth/useDemoAuth.ts` |
| `scripts/components/TopNavBrandLogo.tsx` | `src/components/TopNavBrandLogo.tsx`（只做登录、未拷整份导航壳时单独拷；已拷 §2.8 则不必再拷） |

路由注册 `/login`；登录路由下：

```tsx
<MinimalAppShell fullscreen style={{ backgroundColor: LOGIN_SHELL_BG }}>
  …
</MinimalAppShell>
```

主底图宽度公式与验收项见 [login-page.md](login-page.md)。登录最小宽与产品壳同为 1280，不要用 `lg`（1024）切移动布局。Cursor 预览口常小于 1280，登录卡在右侧，验收把视口拉到 ≥1280 或告诉用户往右滚。Demo 凭据只写在 `authDemo.ts`（`DEMO_USERNAME` / `DEMO_PASSWORD`，默认 `admin` / `admin`），表单预填，卡片下写明演示账号；登录走 `writeDemoAuthed(true)`（含 sessionStorage 失败时的内存兜底），`App.tsx` 用 `useDemoAuth()` 把 `isAuthed` / `onLogout` 传给壳。页脚用中国电子云居中版权，不要 CES / 京ICP。

### 2.7.1 页签名称与 favicon

| Skill 源 | 目标 |
|----------|------|
| `assets/brand/favicon.ico` | 项目 `public/favicon.ico` |
| `assets/brand/favicon.png` | 仅作源图；用户另给图标时转成 `public/favicon.ico` 覆盖 |

`index.html`：

```html
<title>新星数智化平台</title>
<link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
```

`<title>` 必须与 `PLATFORM_PRODUCT_NAME` / `navConfig.platformName` 一致，不要写成 `AIUX Demo` 或 Vite 默认名。`ProductAppShell` 会把 `document.title` 同步成 `config.platformName`。用户提供了 favicon 图则替换 `public/favicon.ico`，不要留 Vite 默认图标。

### 2.8 产品导航壳（顶栏 + 按产品线默认的双列/单列侧导）

落地前先问用户：顶导几个入口、各叫什么（未指定时建议 全模态数据智能 / 模型开发 / 应用开发 / 基础管控）。用户说「继续」且未点选时，按四个建议入口全部落地。**不要问**侧导双列还是单列：全模态默认双列，模型开发 / 应用开发 / 基础管控等默认单列；只有用户强烈明确要求时才把非全模态改成双列。

复制：

| Skill 源 | 目标 |
|----------|------|
| `scripts/components/` | `src/components/`（若 §2.5 已整目录拷过则跳过） |
| `scripts/patterns/navShellLayout.ts` | `src/patterns/navShellLayout.ts`（若 §2.3 已整目录拷过则跳过） |
| `assets/nav/**` | `src/assets/nav/`（`shell/` `rail/` `group/` `app-dev/` 等） |
| `styles/nav-shell.css` | `src/styles/nav-shell.css`（并在 `index.css` `@import`） |

业务侧新建 `src/nav/navConfig.ts`（参考 `scripts/nav/exampleNavConfig.ts` 的字段结构：全模态 dual，其他顶导 singles，入口名换成用户确认过的）。菜单图标用 `NAV_PRESET_ICONS` / `resolveNavIcon`（[nav-icons.md](nav-icons.md)），不要手绘或改用 Arco Icon。尚未落地的菜单路由挂 `PlaceholderPage`（[layout.md](layout.md) §5.1），不要做成带「创建」按钮的假列表。`App.tsx`：

```tsx
import { useDemoAuth } from './auth/useDemoAuth'

export default function App() {
  const { isAuthed, onLogout } = useDemoAuth()
  return (
    <ArcoTheme19155Provider>
      <ProductAppShell
        config={navConfig}
        logoSrc={logo}
        foldIconSrc={fold}
        unfoldIconSrc={unfold}
        putawayIconSrc={putaway}
        isAuthed={isAuthed}
        onLogout={onLogout}
      >
        <AppRoutes />
      </ProductAppShell>
    </ArcoTheme19155Provider>
  )
}
```

`putawayIconSrc` 传入后轨顶出现**汉堡图标**（无文字），壳层打开 `DualColumnOverviewModal`。在 `navConfig.dual.overview` 写入标题、分区简介与两列 links（见 `exampleNavConfig.ts`）。**不必**再传 `onOverviewClick`，除非要完全自绘。单列形态不需要 dual overview。

侧导顶部默认 `NavWorkspaceSelect`：**280×400** 下拉（搜索 / 按组织|按空间 / 组织树 / 创建工作空间），图标在 `assets/nav/org-select/`。演示树开箱即用。接业务组织树：

```tsx
<ProductAppShell
  workspaceSelectProps={{ orgTree, onCreateWorkspace }}
  …
/>
```

`App.tsx` **不必**再传 `dualHeaderSlot`（那会整段替换顶条，仅轨时丢掉 compact 方钮）。**禁止**再做成普通 Select 选项列表。

规范与验收见 [layout.md](layout.md)。菜单/路由必须走 config，侧导只用本 Skill 的 `DualColumnSideNav` / `SingleColumnSideNav`，不要另写一套。

顶栏文档/消息已内置（`ProductTopNavRightExtra`），`App.tsx` **不必**再传 `topNavRightExtra`。自定义右侧图标必须用 `TopNavGlyphIcon`，禁止 `<img className="size-full">`。

### 2.9 业务页模板（列表 / 表单 / 详情 / 看板 / IDE）

从模板单文件拷到业务目录，相对导入深度已对齐，**不必改 import**。只换业务列 / 字段 / path / 文案，不要改页头、Table class / `yb-list-card`、底栏对齐。

| Skill 源 | 目标 |
|----------|------|
| `scripts/list/01-BasicListPage.tsx` | `src/{feature}/XxxManagePage.tsx` |
| `scripts/list/02-TabDoubleRowListPage.tsx` | 同目录，页头 Tabs + 64px 双行表 |
| `scripts/list/03-TabRow48ListPage.tsx` | 同目录，页头 Tabs + 48px 表 |
| `scripts/list/04-TreeListPage.tsx` | 同目录，仅稿面明确要左树时 |
| `scripts/list/05-CardListPage.tsx` | 同目录，三列资源卡 / 广场（每页 15） |
| `scripts/list/06-HorizontalCardListPage.tsx` | 同目录，单列横向内容卡 / 分页浏览（每页 10） |
| `scripts/form/01-BasicFormPage.tsx` | `src/{feature}/CreateXxxPage.tsx`（编辑复用同一文件，靠 `useParams`） |
| `scripts/form/02-DrawerForm.tsx` | `src/{feature}/AddXxxDrawer.tsx` |
| `scripts/detail/01-BasicDetailPage.tsx` | `src/{feature}/XxxDetailPage.tsx`（有主 Tab） |
| `scripts/detail/02-NoTabDetailPage.tsx` | 同目录，无主 Tab（80px 顶栏） |
| `scripts/dashboard/01-BasicDashboardPage.tsx` | `src/{feature}/XxxDashboardPage.tsx`（状态概览；另 `npm install echarts`） |
| `scripts/dashboard/02-MetricTileDashboardPage.tsx` | 同目录，值班 / 监控读数磁贴 |
| `scripts/pages/PlaceholderPage.tsx` | `src/pages/PlaceholderPage.tsx`（未搭建菜单页；另拷 `scripts/nav/resolveNavTrail.ts`） |
| `scripts/ide/01-BasicIdePage.tsx` | `src/{feature}/XxxIdePage.tsx` |

## 3. 推荐目录

适用于 Vite + React + TypeScript + Arco 19155。业务页根节点常用 `h-full min-h-0 flex flex-col`。**不要**在业务页目录下再建一套 `styles/` 复制 Table 皮肤。导航壳只用 `ProductAppShell`。

```
src/
├── main.tsx                 # 挂载、BrowserRouter、全局 CSS
├── App.tsx                  # Theme Provider + ProductAppShell + Routes
├── index.css                # Tailwind + page-layout.css + nav-shell.css
├── styles/
│   ├── arco-theme-19155.css
│   ├── figma-tokens.css
│   ├── page-layout.css
│   ├── message.css
│   ├── shell-baseline.css
│   └── nav-shell.css
├── routes.tsx               # 集中路由表
├── pages/
│   └── PlaceholderPage.tsx  # 未搭建菜单页
├── nav/
│   └── navConfig.ts         # 顶导 / 全模态 dual + 其他 singles / 功能全景（参考 exampleNavConfig 结构）
├── providers/
│   └── ArcoTheme19155Provider.tsx
├── auth/
│   ├── LoginPage.tsx
│   ├── LoginPageBackground.tsx
│   └── useDemoAuth.ts
├── {feature}/               # 一层业务功能，如 service/
│   └── XxxPage.tsx
├── components/              # ProductAppShell / 原子；SearchBox、DetailFieldValue 为多文件组件
├── assets/
│   ├── brand/
│   ├── login/
│   ├── empty/
│   └── nav/
└── patterns/
```

项目根另需：

```
public/favicon.ico           # 从 assets/brand/favicon.ico 拷；不要留 Vite 默认图标
index.html                   # <title> = PLATFORM_PRODUCT_NAME
```

入口：`main.tsx`（`BrowserRouter` + `arco.css` + `index.css` + 主题 CSS）→ `App.tsx`（`ArcoTheme19155Provider` → `ProductAppShell` → `AppRoutes`）→ `routes.tsx`。

| 类型 | 路径示例 | 命名 |
|------|----------|------|
| 登录 | `auth/LoginPage.tsx` | `LoginPage` |
| 列表 | `{feature}/*ManagePage.tsx` | `*ManagePage` / `*ListPage` |
| 表单 | 同目录 `Create*.tsx` / `Edit*.tsx` | `Create*` / `Edit*` |
| 详情 | 同目录 `*DetailPage.tsx` | `*DetailPage` |
| 抽屉 | 同目录 `AddXxxDrawer.tsx` | 与列表/详情同域 |
| 看板 | 同目录 `*DashboardPage.tsx` | `*DashboardPage` |
| IDE | 同目录 `*IdePage.tsx` / `*TaskPage.tsx` | 与开发任务同域 |

`navConfig.ts` 从 `scripts/nav/exampleNavConfig.ts` 复制结构后，按产品线默认形态保留 dual / singles，改入口名 / path / 图标。组织树不写进菜单 config，用 `workspaceSelectProps`。

## 4. 验证

新建最小列表页，确认：

- [ ] `service-manage-table service-manage-list-table--row48-flex` 表头加粗、行高 48px
- [ ] 分页紧贴表格下方，非视窗底部
- [ ] `SearchWithRefresh` 宽 280、刷新可用（`globalMessage` 有提示）
- [ ] 名称列 `LIST_TABLE_NAME_LINK_CLASSNAME` 悬停主色
- [ ] 列表主按钮为 **「创建 XX」**（不要「新建 XX」）；状态列用表头筛选 + `ListTableStatusDot`
- [ ] 删除确认为 `Modal.confirm`：宽 400、圆角 8、正文 pl-28 与标题齐平、按钮右对齐 gap 8（React 必须是 18）
- [ ] DatePicker / RangePicker 默认白底 + `border-3`（与 Input/Select 同档，不要发灰无框）
- [ ] 表单校验：红框 + 白底无粉底；底栏默认「确定 / 取消」
- [ ] 页面级空态距内容区顶约 1/4，不是垂直居中；表格空态 `LIST_TABLE_NO_DATA_ELEMENT`
- [ ] Arco 主色/字号与主题 19155 一致（非默认蓝）
- [ ] `index.html` `<title>` = `PLATFORM_PRODUCT_NAME`；`public/favicon.ico` 已挂，不是 Vite 默认图
- [ ] 登录与产品壳最小宽同为 1280，始终三栏；`App.tsx` 用 `useDemoAuth()` 传 `isAuthed` / `onLogout`

## 5. 范围边界

Skills **可复刻**：主题 Token、页面骨架、表格/表单/详情皮肤、原子交互、Message 宿主。

Skills **不复刻**：某个产品的全部业务路由与菜单文案、后端 API、Figma 插件运行时（需本机安装）。

**未搭建菜单页**：侧栏有了、业务页还没做 → 复制 `PlaceholderPage`，只显示路径 +「该页面还未搭建」，不要搜索、不要创建按钮。

**已落地 mock 页**：列表/表单/详情已经选型落地、只是数据还是假的 → 必须按对应 `*-page.md` 搭页头、返回钮、工具行等构成部分，禁止一段 `Typography` 充数。
