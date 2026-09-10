# 表单页

企业中后台用 Arco `Form` + `.app-form-page` 做创建 / 编辑 / 配置：填完字段，确定或取消离开。

## 目录

| 场景 | 说明 |
|------|------|
| [共性规则](#共性规则) | class、常量、校验、禁止另写皮肤 |
| [1. 全页水平表单](#1-全页水平表单主规范) | 默认。顶栏返回 + 标题，底栏确定 / 取消，标签左、控件右 |
| [2. 抽屉垂直表单](#2-抽屉内垂直表单) | 列表或详情上的添加 / 快捷编辑浮层 |

相关：[list-page.md](list-page.md)（进入表单必须带 `state.from`）、[detail-page.md](detail-page.md)（只读页不要用 Form）、[login-page.md](login-page.md)。

---

## 意图 / 何时用 / 资产

**意图**：把可提交的配置收敛成同一套标签列、控件宽、底栏和校验态，而不是每页自绘一套表单。

**何时用**

| 判断 | 用 |
|------|----|
| 整页创建 / 编辑 / 配置 | §1 全页水平 |
| 列表或详情上的添加 / 编辑浮层 | §2 抽屉垂直 |
| 登录（账号密码卡） | 不要用本文，走 [login-page.md](login-page.md) |
| 只读展示、无提交 | 不要用 Form，走 [detail-page.md](detail-page.md) |

**资产（Skill 内，换电脑可复现）**

| 用途 | 路径 |
|------|------|
| 表单 / 抽屉皮肤 | `styles/page-layout.css`（`.app-form-page`、`.yb-form-drawer`；落地后由 `index.css` `@import`） |
| 布局常量 | `scripts/patterns/formPageLayout.ts`（`FORM_PAGE_*`、`FORM_DRAWER_*`、`formCtrlWidth`） |
| 校验红框白底 | `styles/arco-theme-19155.css`（禁止 `--color-danger-light-1` 粉底） |
| 内嵌表格 | 同 [list-page.md](list-page.md)；空态 `scripts/patterns/listTableNoDataElement.tsx` |
| 整页起步模板 | `scripts/form/01-BasicFormPage.tsx`（全页水平）；`scripts/form/02-DrawerForm.tsx`（抽屉垂直）。只换字段、path、文案 |

去掉 `scripts/` 前缀复制到业务仓，不必改 import。见 [bootstrap.md](bootstrap.md)。

---

## 共性规则

以下对 §1、§2 都成立。

- 所有要统一视觉的 `Form` 必须 `className={FORM_PAGE_ARCO_CLASS}`（即 `app-form-page`）。不要另起一套 class；特例叠业务 class 或 scoped，禁止分叉多套「表单页皮肤」。
- 常量一律从 `formPageLayout.ts` 导入，不要在业务页手写 112 / 80 / 68 / 600。
- 结构线：页头 `Divider`、底栏顶边均为 **1px / `--yb-border-2`**。禁止 0.5px 或 `--yb-border-1`。
- 默认值写在 **Form 层**（`initialValues` 优先，其次 `Form.Item initialValue`），不要靠控件 `defaultValue`。`resetFields()` 才能回到同一套默认。
- 校验：`Form.Item` 配 `rules` 即可，不必手写 `validateStatus="error"`。控件必须 **红框 + 白底**（`--color-bg-2`），禁止 Arco dist 的 `--color-danger-light-1` 浅红填充。错误文案绝对定位，**禁止**把 Form.Item 撑高。校验失败不弹 Message。
- 提交结果：创建 `globalMessage.ok('创建')`，编辑确定 `ok('保存')`；请求失败 `fail('创建'|'保存')`。禁止「已创建」「已保存」。
- 底栏 / 抽屉 footer：**左对齐**，主操作在左、次要在右。默认文案「确定」「取消」。禁止 `justify-end`。
- 普通 Select / Input **一行一个字段**。仅成组短控件才 `Grid.Row`。
- 历史 class `create-data-table-attr-form` 已废弃，只用 `FORM_PAGE_ARCO_CLASS`。
- 不修改 `page-layout.css` 里 `.app-form-page` 语义，除非全局设计升级（升级后同步本文与 `formPageLayout.ts`）。

---

## 1. 全页水平表单（主规范）

标签在左、控件在右。顶栏返回 + 主标题，底栏确定 / 取消，中间表单区滚动。

### 1.1 Form 布局 props

| 约定 | 说明 |
|------|------|
| `layout="horizontal"` | 标签在左、控件在右 |
| `labelAlign="left"` | 标签左对齐 |
| `labelCol={FORM_PAGE_LABEL_COL}` | `flex: 112px`，避免长标签折行 |
| `wrapperCol={FORM_PAGE_WRAPPER_COL}` | `flex: 1`，控件列占剩余空间 |
| `style={FORM_PAGE_FORM_STYLE}` | `{ width: '100%' }`，横向宽度由外层 `px-6` 控制 |
| `requiredSymbol` | 使用 Arco 内置必填星号 |

长标签可用 `formPageHorizontalLabelColFromLabels` 估算 `labelCol`，使控件列左缘对齐。

### 1.2 全页表单顶栏（返回 + 主标题）

整页创建 / 配置流最上方的灰条（`bg-[color:var(--color-bg-2)]`），内含方形返回与页面主标题，**下接** `Divider style={{ margin: 0 }}` 与表单滚动区。与 [detail-page.md](detail-page.md) 无主 Tab 详情顶栏在字号、字重、返回尺寸、标题与按钮间距、栏高 80px 上保持一致。

| 约定 | 说明 |
|------|------|
| 行容器 | `flex` + `items-center` + `min-w-0` + `px-6`；`style={{ height: FORM_PAGE_CHROME_HEADER_HEIGHT_PX, gap: FORM_PAGE_HEADER_BACK_TITLE_GAP_PX }}`（当前 **80** / **16**，等价 `h-[80px] gap-4`） |
| 返回 | `Button` `type="secondary"` `shape="square"`，`style={FORM_PAGE_HEADER_BACK_BUTTON_STYLE}`（**32×32**，`padding: 0`） |
| 主标题 | `Typography.Title` `heading={5}`，`style={FORM_PAGE_HEADER_TITLE_STYLE}`（**20 / 30 / 600** / `var(--color-text-1)`，`margin: 0`，`flex: '0 1 auto'`），`className="min-w-0 truncate"`。创建态默认 **「创建 XX」**（与列表主按钮一致），编辑态 **「编辑 XX」**，**不要**写「新建 XX」 |
| 含 Steps 的创建流 | 顶栏行与上表相同；**步骤条**单独占下一行（如 `h-[60px]`），仍在同一 `shrink-0` 顶区内、Divider 之上或之下均可 |

勿再使用顶栏 `gap-2` + `Typography.Text` 16/24 作为默认。

### 1.3 全页表单底栏（主操作 + 次要操作）

固定在页面底部（`shrink-0`），上接表单滚动区。

| 约定 | 说明 |
|------|------|
| 外层 | `FORM_PAGE_FOOTER_BAR_CLASS`：`shrink-0 w-full` + 顶边框 `border-t` `--yb-border-2` + `bg-[color:var(--color-bg-2)]` |
| 内层按钮行 | `FORM_PAGE_FOOTER_ACTIONS_CLASS`（`flex items-center gap-3 px-6`）+ `style={{ height: FORM_PAGE_FOOTER_ACTION_BAR_HEIGHT_PX, boxSizing: 'border-box' }}`（当前 **68**） |
| 对齐 | **左对齐**。禁止 `justify-end` / `ml-auto` / 右浮动 |
| 按钮顺序 | **主操作在左、次要在右**。默认文案 **「确定」「取消」**；仅创建流「下一步」、明确「保存草稿」等才改主按钮文案 |
| 按钮尺寸 | 高度 `FORM_PAGE_FOOTER_PRIMARY_BUTTON_HEIGHT_PX`（**36**）；样式可用 `FORM_PAGE_FOOTER_BUTTON_STYLE`（含 `minWidth: 80`、水平 padding 16） |
| 主按钮 | `Button type="primary"`；次要 `type="secondary"` |

错误示例：

```tsx
{/* ❌ 右对齐 + 取消在主按钮左侧 */}
<div className="flex justify-end gap-3 px-6">
  <Button type="secondary">取消</Button>
  <Button type="primary">保存</Button>
</div>
```

正确示例：

```tsx
<div className={FORM_PAGE_FOOTER_BAR_CLASS}>
  <div
    className={FORM_PAGE_FOOTER_ACTIONS_CLASS}
    style={{ height: FORM_PAGE_FOOTER_ACTION_BAR_HEIGHT_PX, boxSizing: 'border-box' }}
  >
    <Button type="primary" style={FORM_PAGE_FOOTER_BUTTON_STYLE}>确定</Button>
    <Button type="secondary" style={FORM_PAGE_FOOTER_BUTTON_STYLE}>取消</Button>
  </div>
</div>
```

### 1.4 返回 / 取消 / 保存后的落点（强制）

全页创建 / 编辑与列表、详情组成一套时，**返回去哪一页由进入表单时的来源决定**，不要按「编辑=详情、创建=列表」写死。

| 约定 | 说明 |
|------|------|
| 进入表单 | 列表点「创建 / 编辑」、详情点「编辑」时，`navigate` 必须带 `state: { from: 当前页 path }` |
| 退出表单 | 顶栏返回、底栏「取消」、保存成功 **同一落点**：有 `location.state.from` 就回该路径；直开或刷新没有 state 时回**列表** |
| 离开方式 | 使用 `replace: true`，避免创建 / 编辑页留在历史栈 |
| 禁止 | 编辑态一律 `navigate(\`/:id\`)` 进详情；**禁止**把 `navigate(-1)` 当作唯一返回（刷新或直开会跳出应用） |
| 路由顺序 | 同前缀必须先注册 `/create`、`/:id/edit`，再 `/:id` 详情，最后列表。否则 `create` 会被当成 id |

错误示例：

```tsx
// ❌ 编辑返回写死详情，列表进来的用户会多绕一圈
const goBack = () => {
  if (isEdit && id) navigate(`/xxx/${id}`)
  else navigate('/xxx')
}
```

正确示例：

```tsx
navigate(`/xxx/${id}/edit`, { state: { from: '/xxx' } }) // 列表 → 编辑
navigate(`/xxx/${id}/edit`, { state: { from: `/xxx/${id}` } }) // 详情 → 编辑

const from = (location.state as { from?: string } | null)?.from
navigate(from || '/xxx', { replace: true }) // 返回 / 取消 / 保存
```

### 1.5 控件区最大宽度 640px

由 `page-layout.css` 中 `.app-form-page .arco-form-item-wrapper { max-width: 640px; }` 实现：

- 宽屏下输入框、选择器、文本域不会无限拉满整页。
- 窄屏下随容器变窄（`min-width: 0` 避免 flex 溢出）。
- 子控件在控件区内 `width: 100%`，与「最大 640」配合使用。

### 1.6 控件宽度 80px 档位

局部需要固定宽度时（如并排数字框 + 单位选择），使用：

- `FORM_CTRL_STEP_PX`（80）
- `formCtrlWidth(n)` 或预置的 `FORM_CTRL_W_160`（2 档 = 160px）

示例：调用频次、上游超时数字框、版本号使用 `FORM_CTRL_W_160`。

`Input addBefore` / `addAfter` 会生成 `.arco-input-group`。`.app-form-page` 为对齐 `showWordLimit` 把 group 改成 flex，Arco 默认 table-cell addon（且 `width: 1px`）会错位或收成一条贴在框上沿。

- **短前缀（版本号的「v」）优先用框内 `prefix` / `suffix`**，不要用 `addBefore`。
- 短宽外包 `div` + `style={{ width: FORM_CTRL_W_160 }}`：`.app-form-page` 会把直接子级 `.arco-input-group-wrapper` 设为 `width: 100%`，写在 `Input` 上的 `style` 不一定落到 wrapper。
- `.app-form-page` 把 group 改成 flex 时必须同时恢复 `line-height`（Arco 默认 `line-height: 0` 配合 table-cell；不恢复则 prefix/addon 高度为 0，字浮在框上沿）。

### 1.7 单选输入默认值（Select / Radio）

选择器与单选如需「默认选中第一项」，必须把默认值写到 Form 层，以保证：首次进入即展示默认项；`form.resetFields()` 后仍能恢复；不依赖控件 `defaultValue`。

- **优先**：`Form` 上写 `initialValues`
- **其次**：对应 `Form.Item` 上写 `initialValue`

默认值应与该单选组件 **第一个 option 的 `value`** 保持一致。

### 1.8 校验错误态（强制）

`Form.Item` 配 `rules` 即可。控件必须同时满足：

- **红框**：`border-color: rgb(var(--danger-6))`，不能仍是 `border-3`
- **无粉底**：底色仍是 `--color-bg-2`（主题 `@input-color-bg_error` / `@form-color-bg_error`）。禁止 `--color-danger-light-1`。`allowClear` 的 `inner-wrapper` 同样不要粉底。

主题 CSS 必须对 error 选择器**同时写底色和边**；只覆盖边、把 error 从默认白底规则里排除，会漏出 dist 粉底。

错误文案由 `.app-form-page .arco-form-item-message` **绝对定位**，叠在字段间距里，禁止让 help 把 Form.Item 撑高。业务页不要再给错误项加额外 `margin-bottom`。

### 1.9 分组标题与分割线

- **分组标题**：`Typography.Text`，`fontSize: 14`、`lineHeight: 22px`、`fontWeight: 600`、`color: var(--color-text-1)`；外层 **`mb-4`**。
- **分组之间 `Divider`**（产品稿有分割线时）：`FORM_SECTION_DIVIDER_STYLE`（`marginTop: 0`, `marginBottom: 24`）。每个 `Form.Item` 已有默认下边距，分割线不再额外顶出空白。
- **产品稿无分组分割线**：省略组间 `Divider`，仍保留分组标题。页头与滚动区之间的 `Divider style={{ margin: 0 }}` 是顶栏规范，不要删。

### 1.10 同一行多列表单项

**默认禁止并排。** 全页水平表单是一行一个字段：左标签 112px，右控件最大 640px。服务类型、负责人、请求方法这类普通 Select / Input **必须各占一行**。

仅当产品明确要求 **成组的短控件** 才用 `Grid.Row`，例如「连接 / 发送 / 接收超时」三个 `InputNumber` + `FORM_CTRL_W_160`，或抽屉里的「地址 + 端口」。

- 使用 `Grid.Row` + `Grid.Col`（如 `span={8}` 三等分）。
- 水平间距：`FORM_GRID_ROW_GUTTER`（当前 **32**）。
- **禁止**把两个带 112px 标签的水平 `Form.Item` 用 `Col span={12}` 对半切：第二项标签会落在行中间，和上下行 640 控件列也对不齐。

### 1.11 内嵌表格

表单页中常见内嵌表格（「添加服务」「字段列表」「关联资源」等）**必须复用**列表页 / 详情页的 Table 规范：表头、行高、单元格垂直对齐、横向滚动、空态、外置分页。

| 约定 | 说明 |
|------|------|
| 默认 48px 单行 | `service-manage-table service-manage-list-table--row48-flex` |
| 双行 64px | `service-manage-table data-source-manage-table` |
| 详情页表格 | `service-detail-table` |
| props | `border={false}`，`pagination={false}` |
| 表格外层 | `mt-4 min-w-0 overflow-x-auto shrink-0`。**禁止** `flex-1` / `min-h-0` |
| 分页 | `mt-4 shrink-0`，「共 N 条」同 [list-page.md](list-page.md) §1.6 |

业务页不要复制一套 Table CSS。细则见 list-page §1.3 / §1.5 / §1.6 与 detail-page 表格节。

### 1.12 滚动区与内容宽度

主内容区常见结构：`flex-1 min-h-0 overflow-auto` + 内层 `w-full px-6` + `w-full min-w-0` 包裹表单，避免 flex 子项把横向撑破。

---

## 2. 抽屉内垂直表单

用于侧滑抽屉内的短配置表单（添加数据源、快捷编辑、流程中的单步信息等）。与 §1 共用 `.app-form-page` 皮肤，但布局 props 与栅格间距不同。

### 2.1 Drawer

| 约定 | 说明 |
|------|------|
| `className={FORM_DRAWER_ARCO_CLASS}` | **建议默认开启**，启用 `.yb-form-drawer`：标题栏高度 `FORM_DRAWER_HEADER_HEIGHT`（**56px**，与 `--yb-topnav-h` 一致），标题与关闭按钮垂直居中 |
| `width` | 自 `formPageLayout.ts` 选用档位：`FORM_DRAWER_WIDTH_SM`（600）、`FORM_DRAWER_WIDTH_MD`（900）、`FORM_DRAWER_WIDTH_LG`（1200）。短表单默认 `FORM_DRAWER_WIDTH`（与 SM 相同）；宽表（如字段映射）用 LG。勿用档外像素 |
| `footer` | **左对齐**；主操作在左、次要在右。按钮行 `flex items-center gap-2` 或 `gap-3`。**禁止** `justify-end` |

### 2.2 Form

| 约定 | 说明 |
|------|------|
| `layout="vertical"` | 标签在上、控件在下 |
| `className={FORM_PAGE_ARCO_CLASS}` | **必填** |
| `style={FORM_PAGE_FORM_STYLE}` | 建议保留 `{ width: '100%' }` |
| 不使用 `labelCol` / `wrapperCol` | 垂直布局由 Arco 自行排布；勿与水平表单 props 混用 |

打开抽屉若需清空上次输入，用 `form.resetFields()`；复位目标为当前 `initialValues`。

### 2.3 栅格与单选默认值

- **同一行多列**（仅成组短控件，如「服务地址 + 端口」）：`Grid.Row` 使用 `gutter={FORM_DRAWER_GRID_ROW_GUTTER}`（当前 **8**）。全页宽表单多列仍用 `FORM_GRID_ROW_GUTTER`（32）。普通 Select **不要**并排。
- **单选 `Select`**：产品约定为默认选中第一项时，写入 `initialValues`，且与首项 `value` 一致。

### 2.4 已由全局样式提供的视觉

挂 `FORM_PAGE_ARCO_CLASS` 即可，业务页无需重复写：

- 必填星号与 label 同一行、垂直居中。
- Label 字号 / 行高 14px / 22px（`--yb-fs-14`、`--yb-lh-22`）。
- 垂直布局下 label 与控件区间距 **8px**。
- 垂直布局下非必填 label **不与**「星号占位」缩进，与下方输入框左对齐；水平布局下非必填仍预留星号占位，与必填文案列对齐。

挂 `FORM_DRAWER_ARCO_CLASS` 即可：标题栏 56px，关闭按钮按同高度重算 `top`，与标题视觉对齐。

---

## 3. Checklist

### 全页水平（§1）

1. 顶栏：`FORM_PAGE_CHROME_HEADER_HEIGHT_PX`、`FORM_PAGE_HEADER_BACK_BUTTON_STYLE`、`FORM_PAGE_HEADER_TITLE_STYLE`、`FORM_PAGE_HEADER_BACK_TITLE_GAP_PX`。创建态「创建 XX」，编辑态「编辑 XX」。
2. 底栏：`FORM_PAGE_FOOTER_BAR_CLASS`，左对齐，主按钮在左、取消在右；默认「确定」「取消」；禁止 `justify-end`。
3. `Form`：`FORM_PAGE_ARCO_CLASS` + `FORM_PAGE_LABEL_COL` / `FORM_PAGE_WRAPPER_COL` / `FORM_PAGE_FORM_STYLE`。
4. 分组标题 `Typography.Text` + `mb-4`。稿面有分割线再加 `FORM_SECTION_DIVIDER_STYLE`；不要删页头 `Divider`。
5. 固定档位宽用 `formCtrlWidth` / `FORM_CTRL_W_160`。短前缀用 `prefix`。
6. 单选默认第一项：写入 `initialValues` / `initialValue`，与首个 option `value` 一致。
7. 校验失败：红框 + 白底，错误文案不撑高字段；不弹 Message。创建成功 `ok('创建')`，编辑成功 `ok('保存')`。
8. 默认单列。仅成组短字段才 `Grid.Row` gutter=`FORM_GRID_ROW_GUTTER`。
9. 内嵌表格：复用列表 / 详情 Table class + 外置分页。
10. 返回 / 取消 / 保存：读 `location.state.from`，缺省回列表；进入表单的列表 / 详情必须写入 `from`（§1.4）。

### 抽屉垂直（§2）

1. `Drawer`：`FORM_DRAWER_ARCO_CLASS` + `width` 取 `FORM_DRAWER_WIDTH` / `_MD` / `_LG` 之一。
2. `Form`：`layout="vertical"` + `FORM_PAGE_ARCO_CLASS` + `FORM_PAGE_FORM_STYLE` + 完整 `initialValues`。
3. `footer`：左对齐，主在左、次在右；禁止 `justify-end`。
4. 并排仅成组短字段，gutter=`FORM_DRAWER_GRID_ROW_GUTTER`。
5. 不在业务里复制 `.app-form-page` CSS。提交 `ok('创建')`，校验失败不弹 Message。
