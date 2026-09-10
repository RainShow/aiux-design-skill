# 登录页

全屏账号密码页：无顶栏、无侧栏，壳层只挂 Message 宿主 + 全屏内容。不属于业务列表或配置表单。

## 目录

| 场景 | 说明 |
|------|------|
| [共性规则](#共性规则) | 全屏壳、禁止业务主区滚动 |
| [1. 壳层与路由](#1-壳层与路由) | `/login`、鉴权跳转、`MinimalAppShell fullscreen` |
| [2. 页面结构](#2-页面结构三层) | 背景 / 品牌 / 主区 / 页脚 |
| [3. 桌面布局](#3-桌面布局最小宽-1280) | 三栏 + 左文案 + 右卡片；与壳层同最小宽 |
| [4. 窄于 1280](#4-窄于-1280) | html 横滚，不切移动布局 |
| [5. 登录卡片](#5-登录卡片表单) | vertical Form、large 控件 |
| [6. 背景层](#6-背景层loginpagebackground) | 主底图 `bg-2160-1.png`，禁止纯色替代 |

相关：[layout.md](layout.md)（`fullscreen`）、[form-page.md](form-page.md)（业务表单不要套登录卡）。

---

## 意图 / 何时用 / 资产

**意图**：进系统前的身份页，构图和品牌固定；换产品只换平台名、说明文案和鉴权接口，不重排三栏和背景。

**何时用**

| 判断 | 用 |
|------|----|
| `/login` 账号密码全屏页 | 本文；复制 `scripts/auth/` |
| 业务创建 / 编辑表单 | 不要用本文，走 [form-page.md](form-page.md) |
| 带顶栏侧导的业务页 | 不要用本文，走 [layout.md](layout.md) |
| 产品明确换登录皮肤 | 可换文案 / 品牌；**禁止**用纯色或 CSS 渐变替代主底图 `bg-2160-1.png`，除非产品写明换皮肤 |

**资产（Skill 内，换电脑可复现）** — 登录页已有完整可复制实现，**复制起步**。

| 用途 | 路径 |
|------|------|
| 整页 | `scripts/auth/LoginPage.tsx` |
| 背景层 | `scripts/auth/LoginPageBackground.tsx` |
| 布局常量 | `scripts/patterns/loginPageLayout.ts`（最小宽对齐 `NAV_LAYOUT_MIN_W_PX`） |
| 鉴权 demo | `scripts/patterns/authDemo.ts`（`DEMO_USERNAME` / `DEMO_PASSWORD`、`writeDemoAuthed` / `subscribeDemoAuth`）+ `scripts/auth/useDemoAuth.ts` |
| 背景图 | `assets/login/bg-2160-1.png`（不要再拷 `image-*` / `gradient-top-*`） |
| 左上品牌 | `scripts/components/TopNavBrandLogo.tsx` + `assets/brand/topnav-logo.svg` |
| 全屏壳 | `scripts/components/MinimalAppShell.tsx`（`fullscreen`）或 `ProductAppShell` 对登录路由自动去顶侧栏 |

去掉 `scripts/` 前缀复制到业务仓，不必改 import。见 [bootstrap.md](bootstrap.md)。

---

## 共性规则

- 无 TopNav / SideNav。根容器 `h-[100dvh]` + `overflow-hidden`；底色 `LOGIN_SHELL_BG`（`#dceaff`）。
- 登录根与全屏壳加 `min-w-[var(--yb-layout-min-w)]`（**1280**），与产品壳同一最小宽。
- **禁止**走业务主区的 `yb-layout-main-scroll`：纵向滚动会破坏背景 `absolute inset-0` 参照系。
- Message 仍挂 `#yb-message-root` + `globalMessage`。登录成功 `ok('登录')`，凭据错误 / 请求失败 `fail('登录')`，不要「账号或密码错误」。忘记密码 / 立即注册等演示占位用 `info('…暂未开放')`，不要 `fail`。
- 常量从 `loginPageLayout.ts` 导入，不要在业务页手写 12.5% / 480 / `#dceaff`。
- 登录卡片是 Arco `Form` `layout="vertical"`，与业务水平表单 `.app-form-page` **不是同一套**。
- Demo 凭据只写在 `authDemo.ts`（默认 `admin` / `admin`），登录页预填并在卡片下提示；不要在 `LoginPage.tsx` 再写一套。鉴权用 `writeDemoAuthed(true)`（含 sessionStorage 失败时的内存兜底），不要只 `sessionStorage.setItem`；壳层用 `useDemoAuth()` 才能听到登录/退出。
- 占位符「请输入账号 / 请输入密码」不是账号。空着点登录会校验失败；模板已预填，预览区直接点「登录」即可。

---

## 1. 壳层与路由

| 项 | 约定 |
|----|------|
| 路由 | `LOGIN_ROUTE_PATH`（`/login`） |
| 鉴权 demo | `writeDemoAuthed` / `useDemoAuth`；未登录进业务路由 → 重定向登录；已登录访问登录 → 回首页 |
| 壳层表现 | 无顶栏侧栏；`h-[100dvh]` + `overflow-hidden` + `min-w-[var(--yb-layout-min-w)]`；底色 `LOGIN_SHELL_BG` |

```tsx
<MinimalAppShell fullscreen style={{ backgroundColor: LOGIN_SHELL_BG }}>
  <AppRoutes />
</MinimalAppShell>
```

`fullscreen` 时壳层等价于：`h-[100dvh] overflow-hidden` + Message 宿主 + `relative min-h-0 flex-1 overflow-hidden` 包住页面。`ProductAppShell` 遇到 `loginPath` 同样去顶侧栏、铺 `LOGIN_SHELL_BG`。

---

## 2. 页面结构（三层）

```
根（relative, h-full, flex-col, overflow-x-hidden, min-w 1280）
├─ LoginPageBackground（absolute inset-0, pointer-events-none）
├─ header：左上品牌 TopNavBrandLogo（absolute left-6 top-6 z-10）
├─ main（relative z-10 flex-1，min-w 1280）
│   └─ 三栏 grid + 左右 12.5% padding（始终，不要 lg:hidden）
└─ footer：中国电子云版权居中一行（shrink-0；不要 CES / 京ICP，不要 Logo / 友情链接）
```

---

## 3. 桌面布局（最小宽 1280）

从壳层最小宽起**始终**走三栏，不要用 Tailwind `lg`（1024）切移动布局。

- 主区 class：`LOGIN_DESKTOP_MAIN_CLASS`
- **左栏**：品牌渐变字「中国电子云」→ 平台名 `h1` → 功能说明；额外 `pt-[2.99vh]`
- **中栏**：占位（`aria-hidden`），拉开左右
- **右栏**：登录卡片，`max-w-[480px]`、`min-h-[54.75vh]`、`rounded-xl`、`px-10 pb-10 pt-16`、`background: var(--color-bg-2)`

### 左侧文案规格

| 元素 | 规格 |
|------|------|
| 「中国电子云」 | 32px / semibold / lh 1.3；`background-clip: text` + `LOGIN_BRAND_GRADIENT` |
| 平台名 | 46px / semibold / lh 1.3；`var(--color-text-1)` |
| 说明 | 14px / lh 22px；`mt-8`；`var(--color-text-1)` |

---

## 4. 窄于 1280

- 视口窄于 `--yb-layout-min-w` 时由 **html 横向滚动**，与产品壳一致
- **禁止** `lg:hidden` 再做一套居中卡片；不要两套表单
- 全屏壳（`ProductAppShell` 登录分支 / `MinimalAppShell fullscreen`）同样加 `min-w-[var(--yb-layout-min-w)]`
- Cursor 预览区 / iframe 常 < 1280，登录卡在**右侧**会被裁掉，看起来像登不进去。验收把视口拉到 ≥1280，或告诉用户往右滚再点「登录」

---

## 5. 登录卡片（表单）

- 标题「欢迎登录」：32px / semibold / lh 48px / 居中 / `mb-8`
- Arco `Form`：`layout="vertical"`、`requiredSymbol={false}`、`initialValues` 预填 `DEMO_USERNAME` / `DEMO_PASSWORD`
- 字段间距：账号/密码容器 `flex flex-col gap-6`；`Form.Item` 用 `!mb-0` 避免与 gap 叠距
- 控件：`Input` / `Input.Password`，`size="large"`，prefix 图标色 `var(--color-text-4)`
- 主按钮：`Button type="primary" long size="large"`，上方 `mt-6`，与辅助链同列 `gap-6`
- 按钮下 12px 提示：「演示账号 admin / admin」（从 `authDemo.ts` 读，不要手写第二套）
- 辅助链：「忘记密码」|「立即注册」——文字按钮（无边框）、`gap-[27px]`、中间 1×12px 竖线 `var(--color-border-3)`
- 提交：成功 `ok('登录')`，凭据错误 / 请求失败 `fail('登录')`。忘记密码 / 立即注册用 `info('…暂未开放')`

---

## 6. 背景层（`LoginPageBackground`）

- 容器：`absolute inset-0 overflow-hidden`，底色 `LOGIN_BG_FALLBACK`
- 资源：只铺主底图 `assets/login/bg-2160-1.png`
- **不要**再拷或引用 `image-19-2.png` / `image-63-1.png` / `image-94-1.png` / `gradient-top-1.svg` / `gradient-top-2.svg`（已从 Skill 去掉）
- **禁止**用纯色或 CSS 渐变替代主底图（除非产品明确换皮肤）

### 主底图适配（`bg-2160-1.png`，原稿约 4096×2276）

- 贴底居中：`absolute bottom-0 left-1/2 -translate-x-1/2` + `object-cover object-bottom`
- 宽度 class 常量：`LOGIN_BG_MAIN_WIDTH_CLASS`（`loginPageLayout.ts`），等价于：

```txt
w-[max(100%,min(2048px,170%),calc(100dvh*4096/2276))]
h-auto min-h-full min-w-full max-w-none
```

- `min(2048px, 170%)`：普通屏保持构图（AI 雕塑尺度）
- `calc(100dvh*4096/2276)`：视口更高时加宽，使 `h-auto` 高度仍 ≥ 视口，避免顶部露出 `LOGIN_BG_FALLBACK`
- **不要**改成单纯 `h-full w-auto`（会压扁构图）或只用 `w-[min(2048px,170%)]`（高屏顶部露缝）

---

## 7. 品牌与页脚

- 左上：复用 `TopNavBrandLogo`（与顶栏同源 logo + `PLATFORM_PRODUCT_NAME`）
- 页脚：`text-xs` / `var(--color-text-3)`，`max-w-[1280px]` **居中** `flex-wrap`，`gap-x-6`
- 默认文案（一行，不要 CES / 京ICP，不要 Logo / 友情链接）：
  - `中电云计算技术有限公司 2022 保留一切权利 鄂B2-20220088-1`
  - `鄂公网安备 42011402000611号`（前加盾牌小标）
  - `法律声明及隐私权政策`
- 用户另给版权句时只换这三句，不要改回 CES 占位，也不要默认加友情链接行

---

## 8. Checklist

- [ ] `/login` 无顶栏/侧栏；使用 `MinimalAppShell fullscreen`（或等价全屏壳）；壳底色 `#dceaff`
- [ ] 登录壳**无**业务主区纵向滚动（非 `yb-layout-main-scroll`）
- [ ] 根与全屏壳 `min-w-[var(--yb-layout-min-w)]`；始终三栏，没有 `lg:hidden` 移动卡
- [ ] 桌面：左右 12.5% 边距，三栏比例与卡片 `max-w 480`、顶距约 `22.625vh`
- [ ] 视口 < 1280 时 html 横滚，不降级成仅卡片；预览区验收 ≥1280 或已提示往右滚
- [ ] 主底图 `bg-2160-1.png` 可见，非纯色占位；盖满视口（高屏顶部无 `#dceaff` 缝），构图接近稿面（勿被 `h-full` 压扁）；没有 `image-*` / `gradient-top-*`
- [ ] 表单 vertical + large 控件；凭据来自 `authDemo.ts` 且已预填；卡片下有演示账号提示；登录走 `ok('登录')` / `fail('登录')` + `writeDemoAuthed`
- [ ] 页脚为中国电子云居中版权，不是 CES / 京ICP
- [ ] 左上品牌与顶栏 `TopNavBrandLogo` 视觉一致；页签 title 与产品名一致；`public/favicon.ico` 已挂
