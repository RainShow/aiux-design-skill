import type { CSSProperties, ReactNode } from 'react'

/** 顶导项（产品线） */
export type ProductTopNavItem = {
  key: string
  label: string
  /** 点击顶导后的默认落地 path */
  path: string
}

/** 侧导形态 */
export type SideNavMode = 'none' | 'dual' | 'single'

/** 双列：一级轨项 */
export type DualRailItem = {
  key: string
  label: string
  iconSrc: string
  /** 无二级时直接跳转（如「主页」） */
  path?: string
}

/** 功能全景叶子（可与侧栏树叶子文案不同，如「数据连接」对应数据源管理） */
export type DualOverviewLink = {
  label: string
  path: string
}

/**
 * 功能全景分区。视觉：22px 图标 + 14/22 标题 + 12/18 简介 + 两列叶子。
 */
export type DualOverviewBlockConfig = {
  /** 对应 `rail.key`，取图标；标题默认用 `rail.label` */
  railKey: string
  /** 覆盖分区标题 */
  label?: string
  /** 分区简介（12px / 18px / `#646c85`） */
  description: string
  /**
   * 叶子入口。不传则从 `panels[railKey]` 抽出叶子。
   * 用于全景有、侧栏树未单独列出的入口。
   */
  links?: DualOverviewLink[]
}

/** 功能全景（轨顶汉堡打开的浮层） */
export type DualOverviewConfig = {
  /** 面板标题；不传则用双列产品线名称 */
  title?: string
  /**
   * 分区列表。不传则按 rail+panels 自动生成（无简介，仅演示结构）。
   * 有产品文案时应显式传入，以带上简介与两列链路。
   */
  blocks?: DualOverviewBlockConfig[]
}

/** 双列：二级分区 */
export type DualSecondSection =
  | {
      type: 'item'
      key: string
      label: string
      path: string
      iconSrc?: string
    }
  | {
      type: 'group'
      key: string
      label: string
      /** 分组左侧 20px 图标；不传则留空占位，与叶子图标列对齐 */
      iconSrc?: string
      children: { key: string; label: string; path: string }[]
    }

/** 双列侧导配置 */
export type DualColumnNavConfig = {
  rail: DualRailItem[]
  /** 一级 key → 二级面板；无面板或空则仅显示轨 */
  panels: Record<string, DualSecondSection[]>
  /** 视为「主页」、不展开二级的轨 key */
  homeKey?: string
  secondWidthPx?: number
  /** 功能全景：简介、可选独立 links、面板标题 */
  overview?: DualOverviewConfig
}

/** 单列行 */
export type SingleColumnNavRow =
  | { type: 'item'; key: string; label: string; iconSrc: string; path: string }
  | { type: 'group'; label: string }
  | { type: 'divider' }

export type SingleColumnNavConfig = {
  rows: SingleColumnNavRow[]
  /** 顶部工作空间；`undefined` 用默认位置选择器下拉（`NavWorkspaceSelect`），`null` 关闭（如平台管理） */
  workspaceSlot?: ReactNode | null
  /** data-name 后缀，便于调试 */
  dataName?: string
}

/** 产品壳配置（菜单与路由由业务注入） */
export type ProductNavShellConfig = {
  platformName: string
  logoSrc?: string
  topNav: ProductTopNavItem[]
  /** pathname → 当前顶导 key */
  resolveTopNavKey: (pathname: string) => string
  /** 顶导 key → 侧导形态 */
  sideNavModeByTopKey: Record<string, SideNavMode>
  dual?: DualColumnNavConfig
  /** 顶导 key → 单列配置 */
  singles?: Record<string, SingleColumnNavConfig>
  /** pathname → 双列一级 key */
  resolveDualRailKey?: (pathname: string) => string | null
  /** pathname → 双列二级 key */
  resolveDualSecondKey?: (pathname: string) => string | null
  /** pathname → 单列激活 key */
  resolveSingleKey?: (topKey: string, pathname: string) => string | null
  /** 全屏（无顶/侧）路径判断 */
  isFullscreenPath?: (pathname: string) => boolean
  loginPath?: string
}

export type MaskIconProps = {
  src: string
  color: string
  size?: number
  fit?: 'contain' | 'stretch'
  style?: CSSProperties
  className?: string
}
