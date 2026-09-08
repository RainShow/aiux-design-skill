/**
 * 列表表格「可点击名称」列的样式类（与 `AssetCatalogManagePage` 目录名称列一致）。
 * 默认正文色 14px semibold，悬停主色，无下划线；visited 保持正文色。
 * 有路由用 `react-router-dom` 的 `Link`/`RouterLink`；演示跳转用 {@link ListTableNameLink}（`listTableNameLinkAnchor.tsx`）；勿用 Arco `Link`。
 * 操作列反过来：必须用 Arco `Link` + `service-manage-actions`，禁止套本 class。
 */
export const LIST_TABLE_NAME_LINK_BASE_CLASSNAME =
  'list-table-name-link min-w-0 max-w-full text-[14px] font-semibold no-underline text-[color:var(--color-text-1)] visited:text-[color:var(--color-text-1)] hover:text-[color:rgb(var(--primary-6))]'

/** 单行省略：用于大多数列表「名称」列 */
export const LIST_TABLE_NAME_LINK_CLASSNAME = `block truncate ${LIST_TABLE_NAME_LINK_BASE_CLASSNAME}`

/** 多行（不强制单行省略）：用于双行表格等场景 */
export const LIST_TABLE_NAME_LINK_MULTILINE_CLASSNAME = `block ${LIST_TABLE_NAME_LINK_BASE_CLASSNAME}`
