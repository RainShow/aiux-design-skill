# 空态

没数据时那一块怎么摆：统一插画与间距。这是嵌在列表 / 详情 / IDE 里的**跨页区块**，不是一种业务页，也没有自己的页头骨架。

## 目录

| 场景 | 说明 |
|------|------|
| [共性规则](#共性规则) | 只用本组件与本插画；禁止裸 Empty、禁止垂直居中 |
| [1. 内容区空态](#1-内容区空态layoutpage) | 默认。距 Divider 下沿 1/4 高度 |
| [2. 容器内空态](#2-容器内空态layoutinline) | 表格 / 卡片 / 抽屉，不做 1/4 偏移 |

相关：[list-page.md](list-page.md)（表空态）、[detail-page.md](detail-page.md)（空 Tab）、[ide-page.md](ide-page.md)（右栏参数表）。

---

## 意图 / 何时用 / 资产

**意图**：空着也要像本产品，不要露出 Arco 默认抽屉线框图，也不要把插画甩到屏幕正中。

**何时用**

| 判断 | 用 |
|------|----|
| 详情主 Tab「暂未接入」、详情「未找到」整页 | §1，`layout="page"`（默认） |
| 列表 / 区块 / 抽屉内无业务数据 | §2，`layout="inline"` |
| 卡片列表网格无数据 | §2，`layout="inline"`（见 [list-page.md](list-page.md) §5） |
| 单列横向内容卡无数据 | §2，`layout="inline"`（见 [list-page.md](list-page.md) §6） |
| Arco `Table` 无行 | `noDataElement={LIST_TABLE_NO_DATA_ELEMENT}`（已是 `inline`） |
| 挂了 `service-manage-table` / `service-detail-table` 仍用默认 `Empty` | CSS 会换图标；**仍推荐**显式传 `PageLevelEmpty` |

做列表 / 详情时顺带遵守本文，不必单独开一页「空态页」。

**资产（Skill 内，换电脑可复现）** — 组件即模板，**复制起步**。

| 用途 | 路径 |
|------|------|
| 空态组件 | `scripts/components/PageLevelEmpty.tsx` |
| 表格快捷 | `scripts/patterns/listTableNoDataElement.tsx` → `LIST_TABLE_NO_DATA_ELEMENT` |
| 插画 | `assets/empty/page-level-empty-state.svg` |
| 表皮肤兜底 | `styles/page-layout.css`（默认 `Empty` 换本插画；CSS 须落在 `src/styles/`，见 [bootstrap.md](bootstrap.md) §2.4） |

去掉 `scripts/` 前缀复制到业务仓，不必改 import。不要另写一套 img + Typography。

---

## 共性规则

- **禁止**详情 Tab / 内容区占位使用裸 `<Empty description="…" />`。
- **禁止**另引一套空态 SVG；统一 `page-level-empty-state.svg`。
- **禁止**业务页手写「img + Typography」空态（字体 / 间距易漂）。
- **禁止**内容区空态用 `justify-center` / `items-center` 把整块垂直居中（那是 1/2，不是稿面的 **1/4 X**）。
- `PageLevelEmpty`：`title` 为标题；不传 `title` 时 `description` 当作主文案（16/24/600）。同时传 `title` + `description` 时走「标题 + 说明」两行。

---

## 1. 内容区空态（`layout="page"`）

占满页头 **Divider 以下**到窗口底的内容区。设该区高度为 **X**。

```
内容区顶（Divider 下沿）
│
│  1/4 X          ← 插画顶距内容区顶
│
├─ 插画 100×100（水平居中）
│     16px
├─ 标题 16 / 24 / 600 / text-1
│     8px          ← 仅有说明文案时
├─ 说明 14 / 22 / 400 / text-2（可选）
│     16px         ← 仅有按钮时
└─ 主按钮（可选，如「创建实例」）
```

| 项 | 值 |
|----|-----|
| 插画 | **100×100**，`object-fit: contain`（class `create-catalog-business-item-empty__img`） |
| 垂直位置 | 插画组距内容区顶 **1/4 X**。实现：宿主 **`height: 100%`** + 顶部占位 **`flex-basis / height: 25%`**（**不要**用 `padding-top: 25%`，那是相对宽度）。父级必须有明确高度（内容区 `flex-1 min-h-0`），**不要**在该宿主上再加 padding，否则 1/4 会按内盒计算。有工具行时，1/4 相对工具行**以下**的剩余高度 |
| 图 → 标题 | **16px** |
| 标题 → 说明 | **8px**（无说明则跳过） |
| 说明 → 按钮 | **16px**（无标题、只有主文案时：图 → 主文案 **16px**，主文案 → 按钮 **16px**） |
| 标题 | 16px / 24 行高 / 600 / `var(--color-text-1)` |
| 说明 | 14px / 22 行高 / 400 / `var(--color-text-2)` |
| 水平 | 整组 **水平居中** |

```tsx
<PageLevelEmpty description="演示环境：调用监控暂未接入" />

<PageLevelEmpty
  description="未找到该记录"
  actions={<Button>返回列表</Button>}
/>
```

---

## 2. 容器内空态（`layout="inline"`）

表格、卡片、抽屉内：**不要** 1/4 偏移。插画与文案规格同 §1，只是贴在容器里排，不占满内容区高度。

```tsx
<PageLevelEmpty layout="inline" description="暂无数据" />

<Table noDataElement={LIST_TABLE_NO_DATA_ELEMENT} pagination={false} />
```

`LIST_TABLE_NO_DATA_ELEMENT` 已是 `layout="inline"` 的 `PageLevelEmpty`。

---

## 3. Checklist

1. 详情未接入 Tab / 内容区占位使用 `PageLevelEmpty`，非裸 `Empty`。
2. 内容区：插画距顶约 **1/4** 高度，**不是**垂直居中。
3. 插画 **100×100**；图→标题 **16**；标题→说明 **8**；说明/主文案→按钮 **16**。
4. 表格无数据为 `LIST_TABLE_NO_DATA_ELEMENT`（`inline`，不套 1/4 X）。
5. 资源已拷贝到 `src/assets/empty/page-level-empty-state.svg`。
