# AIUX Design Skill

## 安装

直接复制下面的提示词发给 Agent，即可安装本 Skill：

```text
帮我安装skill：https://github.com/RainShow/aiux-design-skill
```

安装完成后，Agent 生成页面时会读取 [`SKILL.md`](aiux-design-skill/SKILL.md)；新项目的依赖、样式和模板落地方式见 [`bootstrap.md`](aiux-design-skill/references/bootstrap.md)。

## 新项目怎么走

1. 使用上方提示词安装本 Skill，或将 `aiux-design-skill/` 复制到新仓库的 `.cursor/skills/aiux-design-skill/`
2. 把下面这段发给 Agent（它会分三步做，每步停下来等你确认）
3. 之后用页面命令继续加页

拷哪些文件、侧导默认双列/单列、删除确认话术等，都写在 Skill 里，提示词里不必再抄一遍。

```text
请严格分三步，每步完成后停一下等我确认再继续：

Step A：按 /page-layout bootstrap 从零搭 Vite+React+TS+Arco19155+Tailwind 环境，能跑起来。
Step B：先问我顶导入口叫什么（没定就给 全模态数据智能 / 应用开发 / 基础管控 让我选），再按 /page-layout nav 搭顶栏 + 侧导 + routes（含 /login）+ 鉴权跳转。
Step C：按 /page-layout list 实现第一个真实列表页、表单页、详情页并挂到侧栏。

全程遵守 aiux-design-skill，不要偏离规范另起样式体系。
```

底座齐了之后，按下面三个常见场景继续加页。选型与复制哪份模板以 [`SKILL.md`](aiux-design-skill/SKILL.md) 为准，提示词只说业务意图。

## 常见使用场景

### 场景 1：快速搭建 CRUD 页面

**布局：** 已有导航壳 + 无树列表 + 全页创建/编辑 + 有主 Tab 详情。筛选在列表工具行/表头，和侧导形态无关。

这是 `/page-layout list` + `form` + `detail` 的组合。默认复制 `01-BasicListPage` / `01-BasicFormPage` / `01-BasicDetailPage`。页面名叫「服务管理」不是加左树的信号；稿面明确要树才用 `04`。用户说卡片列表、页名含「广场」、或稿面是资源卡网格时复制 `05-CardListPage`，不要先出表。

**生成顺序：**

1. 已有 `ProductAppShell` 时只出内容区，禁止再套一套顶栏侧导；没有壳才先走 `/page-layout nav`。
2. 按数据实体复制 `scripts/list/01-BasicListPage.tsx`：搜索 + 刷新、48px 表、外置分页、主按钮「创建 XX」、名称列进详情。
3. 创建/编辑复制 `scripts/form/01-BasicFormPage.tsx`，必须带 `state.from`；列表上的轻量添加才用抽屉 `02`。
4. 详情复制 `scripts/detail/01-BasicDetailPage.tsx`；删除用 `Modal.confirm`（标题问句、正文写影响）。

```text
按 /page-layout list 做「XXX管理」CRUD：无树列表 + 全页创建/编辑 + 有 Tab 详情，挂到现有侧栏。
```

### 场景 2：创建配置类页面

**布局：** 任意导航 + 全页水平表单（一行一个字段）。区块再多也还是这一套，不要另起模板。

整页创建/编辑/配置用 `form-page.md` §1；只有列表或详情上的添加/编辑浮层才用 §2 抽屉。

**生成顺序：**

1. 复制 `scripts/form/01-BasicFormPage.tsx`，只换字段、path、文案；挂 `FORM_PAGE_ARCO_CLASS`。
2. 默认一行一个字段，禁止两个短标签对半切；长文本仍占整行。
3. 底栏「确定/取消」左对齐（主按钮在左）；校验红框 + 白底。
4. 返回/取消/保存回到 `state.from`，缺省回列表，不要写死进详情。

```text
按 /page-layout form 做「XXX配置」整页表单，水平布局，保存后回到来源页。
```

### 场景 3：搭建看板页

**布局：** 任意导航 + 无 Tab 页头 + KPI/磁贴/图表。不要做成整页搜索列表。

**生成顺序：**

1. 任务状态概览复制 `01-BasicDashboardPage.tsx`；值班/监控读数复制 `02-MetricTileDashboardPage.tsx`。只换字段与数据；宿主需 `echarts`。
2. 页头与内容区走列表 §1.1 的无 Tab 白底 + `Divider`，根 `min-h-full`，不要铺灰底。
3. 卡片 `yb-content-card`；工具行放 Card body，不要用 Card `title`/`extra`。不要加阴影。
4. 图表 tooltip 用模板里的 `DASHBOARD_ECHARTS_TOOLTIP`；颜色先解析，不要把 CSS 变量写进 ECharts option。

```text
按 /page-layout dashboard 做「XXX概览」看板：KPI 或指标磁贴 + 图表，挂到现有侧栏。
```

登录/IDE/空态把命令换成 `/page-layout login`、`ide`、`empty` 即可。

更完整的文件索引、页面模板和样式说明，请查看 [Skill 详细使用指南](aiux-design-skill/README.md)。
