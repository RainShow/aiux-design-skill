# 主题 19155 — 参考链接与映射

基础 URL 前缀：`https://arco.design/themes/design/19155/setting/`

## 基础 Token

| 类别 | 路径 |
|------|------|
| 颜色 | `base/Color` |
| 字体 | `base/Font` |
| 边框 | `base/Border` |
| 阴影 | `base/Shadow` |
| 尺寸 | `base/Size` |

完整 URL（可复制）：  
`https://arco.design/themes/design/19155/setting/base/Color?from=%2Fthemes%2Fstores%2Fmanage%3FdepLibrary%3D%26keyword%3D%26type%3Dall`  
（Font / Border / Shadow / Size 将路径中 `Color` 替换为对应英文名即可。）

## 组件 Token 页面（components）

以下路径均接在 `.../setting/components/` 后（与主题站 URL 规则一致）。

| 中文 | Path |
|------|------|
| 按钮 | `Button` |
| 链接 | `Link` |
| 排版 | `Typography` |
| 分割线 | `Divider` |
| 头像 | `Avatar` |
| 徽标数 | `Badge` |
| 卡片 | `Card` |
| 日历 | `Calendar` |
| 折叠面板 | `Collapse` |
| 评论 | `Comment` |
| 描述列表 | `Descriptions` |
| 空状态 | `Empty` |
| 图片 | `Image` |
| 列表 | `List` |
| 气泡卡片 | `Popover` |
| 数值显示 | `Statistic` |
| 表格 | `Table` |
| 标签页 | `Tabs` |
| 标签 | `Tag` |
| 时间轴 | `Timeline` |
| 文字气泡 | `Tooltip` |
| 树 | `Tree` |
| 自动补全 | `AutoComplete` |
| 级联选择 | `Cascader` |
| 复选框 | `Checkbox` |
| 颜色选择器 | `ColorPicker` |
| 日期选择器 | `DatePicker` |
| 表单 | `Form` |
| 输入框 | `Input` |
| 数字输入框 | `InputNumber` |
| 验证码输入 | `VerificationCode` |
| 标签输入框 | `InputTag` |
| 评分 | `Rate` |
| 单选框 | `Radio` |
| 选择器 | `Select` |
| 滑动输入条 | `Slider` |
| 开关 | `Switch` |
| 数据穿梭框 | `Transfer` |
| 时间选择器 | `TimePicker` |
| 树选择 | `TreeSelect` |
| 上传 | `Upload` |
| 警告提示 | `Alert` |
| 抽屉 | `Drawer` |
| 全局提示 | `Message` |
| 对话框 | `Modal` |
| 通知提醒框 | `Notification` |
| 气泡确认框 | `Popconfirm` |
| 进度条 | `Progress` |
| 结果 | `Result` |
| 加载中 | `Spin` |
| 骨架屏 | `Skeleton` |
| 锚点 | `Anchor` |
| 面包屑 | `Breadcrumb` |
| 下拉菜单 | `Dropdown` |
| 菜单 | `Menu` |
| 页头 | `PageHeader` |
| 分页 | `Pagination` |
| 步骤条 | `Steps` |
| 伸缩框 | `ResizeBox` |

组件页完整 URL 示例：  
`https://arco.design/themes/design/19155/setting/components/Button?from=%2Fthemes%2Fstores%2Fmanage%3FdepLibrary%3D%26keyword%3D%26type%3Dall`  
（将 `Button` 替换为上表 Path。）

## Figma → `@arco-design/web-react` 映射（示意）

| Figma 常见命名 / 结构 | Arco 组件 |
|------------------------|-----------|
| Table / 数据表 / 列表格 | `Table` |
| Primary / 主按钮 / 操作 | `Button` |
| 输入区、表单项 | `Form` + `Form.Item` + `Input` / `Select` / `DatePicker` 等 |
| 侧栏 / 顶栏菜单 | `Menu` |
| 标签切换 | `Tabs` |
| 筛选下拉 | `Select` / `Cascader` |
| 弹窗、确认 | `Modal` / `Popconfirm` |
| 轻提示 | `Message` / `Notification` |
| 加载 | `Spin` / `Skeleton` |
| 空页面 | `Empty` / `Result` |

命名不一致时：**以结构和交互为准**选 Arco 组件，并在实现 Notes 中记录。

## savedTokens 提示

主题页内嵌 JSON 中 `savedTokens` 的 key 多为 Less 变量（如 `@primary-6`、`@color-text-1`）。落地到 React 时可通过 Arco 官方「主题 / CSS 变量」能力与 `ConfigProvider` 对齐；具体注入方式以项目构建链（Less / CSS-in-JS）为准。
