/**
 * 导航配置结构示例：全模态双列 + 应用开发 / 模型开发 / 基础管控单列。
 * 落地按产品线默认形态保留 dual / singles，入口名 / path / 图标换成用户确认过的。
 * 未指定入口名时，建议「全模态数据智能 / 模型开发 / 应用开发 / 基础管控」。
 * 不要问侧导形态；非全模态只有用户强烈要求时才改成双列。
 *
 * 图标必须先 `resolveNavIcon` / `NAV_PRESET_ICONS`（见 `references/nav-icons.md`）。
 * 复制到 `src/nav/navConfig.ts` 后，相对导入已对齐，不必改深度。
 */
import type { ProductNavShellConfig } from '../components/types'
import { PLATFORM_PRODUCT_NAME } from '../components/TopNavBrandLogo'
import { NAV_PRESET_ICONS } from '../components/navIcons'

export const EXAMPLE_NAV_SHELL_CONFIG: ProductNavShellConfig = {
  platformName: PLATFORM_PRODUCT_NAME,
  loginPath: '/login',
  topNav: [
    { key: 'data', label: '全模态数据智能', path: '/' },
    { key: 'app-dev', label: '应用开发', path: '/app-dev/square' },
    { key: 'platform', label: '基础管控', path: '/platform/workspace' },
  ],
  resolveTopNavKey: (pathname) => {
    if (pathname.startsWith('/app-dev')) return 'app-dev'
    if (pathname.startsWith('/platform')) return 'platform'
    return 'data'
  },
  sideNavModeByTopKey: {
    data: 'dual',
    'app-dev': 'single',
    platform: 'single',
  },
  dual: {
    homeKey: 'home',
    rail: [
      { key: 'home', label: '主页', iconSrc: NAV_PRESET_ICONS['主页'], path: '/' },
      { key: 'integrate', label: '数据集成', iconSrc: NAV_PRESET_ICONS['数据集成'] },
      { key: 'service', label: '数据服务', iconSrc: NAV_PRESET_ICONS['数据服务'] },
    ],
    panels: {
      integrate: [
        {
          type: 'group',
          key: 'conn',
          label: '数据连接',
          iconSrc: NAV_PRESET_ICONS['数据连接'],
          children: [
            { key: 'ds', label: '数据源管理', path: '/data-source/manage' },
            { key: 'transfer', label: '数据传输', path: '/integrate/transfer' },
          ],
        },
      ],
      service: [
        {
          type: 'group',
          key: 'svc-api',
          label: '数据服务API',
          iconSrc: NAV_PRESET_ICONS['数据服务API'],
          children: [{ key: 'svc', label: '服务管理', path: '/service/manage' }],
        },
      ],
    },
    /**
     * 功能全景：简介 + 两列叶子（叶子文案可与侧栏树不同）。
     * 新项目按产品 IA 补 blocks，不要省略 description。
     */
    overview: {
      title: '全模态数据智能',
      blocks: [
        {
          railKey: 'integrate',
          description:
            '作为多模态数据治理平台的「数据管道」，提供连接、传输及运维功能，实现全流程数据流动与汇聚的核心基础设施。',
          links: [
            { label: '数据连接', path: '/data-source/manage' },
            { label: '数据传输', path: '/integrate/transfer' },
          ],
        },
        {
          railKey: 'service',
          description:
            '统一管理 API 服务、应用与安全组，衔接数据编织与指标能力，支撑数据服务化对外交付。',
          links: [{ label: '服务管理', path: '/service/manage' }],
        },
      ],
    },
  },
  resolveDualRailKey: (pathname) => {
    if (pathname.startsWith('/data-source') || pathname.startsWith('/integrate')) return 'integrate'
    if (pathname.startsWith('/service')) return 'service'
    return 'home'
  },
  resolveDualSecondKey: (pathname) => {
    if (pathname.startsWith('/data-source')) return 'ds'
    if (pathname.startsWith('/integrate/transfer')) return 'transfer'
    if (pathname.startsWith('/service')) return 'svc'
    return null
  },
  singles: {
    'app-dev': {
      dataName: 'menu_side_nav_oneplatform_app_dev',
      rows: [
        { type: 'group', label: 'AI资产库' },
        { type: 'item', key: 'square', label: '应用广场', iconSrc: NAV_PRESET_ICONS['应用广场'], path: '/app-dev/square' },
        { type: 'group', label: '应用管理' },
        { type: 'item', key: 'agent', label: '智能体', iconSrc: NAV_PRESET_ICONS['智能体'], path: '/app-dev/agent' },
      ],
    },
    platform: {
      dataName: 'menu_side_nav_oneplatform_platform',
      workspaceSlot: null,
      rows: [
        { type: 'item', key: 'workspace', label: '工作空间', iconSrc: NAV_PRESET_ICONS['工作空间'], path: '/platform/workspace' },
        { type: 'group', label: '组织权限' },
        { type: 'item', key: 'org', label: '组织管理', iconSrc: NAV_PRESET_ICONS['组织管理'], path: '/platform/org' },
        { type: 'item', key: 'user', label: '用户管理', iconSrc: NAV_PRESET_ICONS['用户管理'], path: '/platform/user' },
      ],
    },
  },
  resolveSingleKey: (topKey, pathname) => {
    if (topKey === 'app-dev') {
      if (pathname.includes('/agent')) return 'agent'
      if (pathname.includes('/square')) return 'square'
      return null
    }
    if (topKey === 'platform') {
      if (pathname.startsWith('/platform/org')) return 'org'
      if (pathname.startsWith('/platform/user')) return 'user'
      if (pathname.startsWith('/platform/workspace')) return 'workspace'
      return null
    }
    return null
  },
}
