import { forwardRef, useEffect, useMemo, useState, type ButtonHTMLAttributes } from 'react'
import { Button, Card, Menu, Radio, Select, Tree } from '@arco-design/web-react'
import type { TreeProps } from '@arco-design/web-react'
import { IconCaretDown, IconCaretRight } from '@arco-design/web-react/icon'
import { SearchBox } from './SearchBox'
import { globalMessage } from '../patterns/globalMessage'
import {
  NAV_ORG_SELECT_CREATE_ICON_PX,
  NAV_ORG_SELECT_PANEL_H_PX,
  NAV_ORG_SELECT_PANEL_W_PX,
} from '../patterns/navShellLayout'
import caretDown12 from '../assets/nav/shell/caret-down-12.svg'
import tabOrg16 from '../assets/nav/org-select/tab-org-16.svg'
import tabSpace16 from '../assets/nav/org-select/tab-space-16.svg'
import folder16 from '../assets/nav/org-select/folder-16.svg'
import launch16 from '../assets/nav/org-select/launch-16.svg'
import { MaskIcon } from './MaskIcon'

/** 占位 value：真实展示文案由 `renderFormat` 控制，保留 Select 触发器主题态 */
const WORKSPACE_SELECT_SENTINEL = '__workspace_current__'

export type NavWorkspaceSelectMode = 'org' | 'space'

export type NavWorkspaceOrgTreeNode = {
  key: string
  title: string
  isLeaf?: boolean
  children?: NavWorkspaceOrgTreeNode[]
}

export type NavWorkspaceSpaceItem = {
  key: string
  label: string
}

export type NavWorkspaceSelectChange = {
  key: string
  label: string
  mode: NavWorkspaceSelectMode
}

export type NavWorkspaceSelectProps = {
  /** 仅轨 / 折叠：48px 方触发器；展开双列：全宽 Select */
  compact?: boolean
  /** 按组织选择的树；不传用 `DEMO_ORG_TREE` */
  orgTree?: NavWorkspaceOrgTreeNode[]
  /** 按空间选择的列表；不传用 `DEMO_SPACE_ITEMS` */
  spaceItems?: NavWorkspaceSpaceItem[]
  /** 触发器上的展示文案 */
  label?: string
  selectedKey?: string
  onChange?: (next: NavWorkspaceSelectChange) => void
  /** 底栏「创建工作空间」；不传则演示 Message */
  onCreateWorkspace?: () => void
  createLabel?: string
  searchPlaceholder?: string
}

/** 兼容旧示例：简单空间列表（新面板默认走组织树） */
export const DEMO_WORKSPACE_OPTIONS = [
  { label: '生产空间', value: 'ws-prod' },
  { label: '预发空间', value: 'ws-staging' },
  { label: '研发测试', value: 'ws-dev' },
] as const

/**
 * 演示组织树：集团 → 部门 → 中心 → 工作空间。
 * 含一条超长空间名，用来验收触发器 / 叶子 truncate。
 */
export const DEMO_ORG_TREE: NavWorkspaceOrgTreeNode[] = [
  {
    key: 'org-star',
    title: '中电云',
    children: [
      {
        key: 'org-digital',
        title: '数字化部',
        children: [
          {
            key: 'org-dmp',
            title: '数据中台',
            children: [
              { key: 'ws-prod', title: '生产空间', isLeaf: true },
              { key: 'ws-staging', title: '预发空间', isLeaf: true },
              { key: 'ws-dev', title: '研发测试', isLeaf: true },
              { key: 'ws-govern', title: '数据治理专项', isLeaf: true },
            ],
          },
          {
            key: 'org-bmp',
            title: '业务中台',
            children: [
              { key: 'ws-metric', title: '指标服务', isLeaf: true },
              { key: 'ws-api', title: '数据服务', isLeaf: true },
            ],
          },
        ],
      },
      {
        key: 'org-east',
        title: '华东分公司',
        children: [
          {
            key: 'org-ops',
            title: '数据运营中心',
            children: [
              { key: 'ws-market', title: '营销分析', isLeaf: true },
              { key: 'ws-profile', title: '客户画像', isLeaf: true },
              {
                key: 'ws-report',
                title: '监管报送-华东营销域客户标签与指标仓历史回刷',
                isLeaf: true,
              },
            ],
          },
        ],
      },
    ],
  },
]

/**
 * 从组织树抽出全部工作空间叶子，供「按空间选择」列表使用。
 */
function flattenOrgLeaves(nodes: NavWorkspaceOrgTreeNode[]): NavWorkspaceSpaceItem[] {
  const out: NavWorkspaceSpaceItem[] = []
  const walk = (list: NavWorkspaceOrgTreeNode[]) => {
    for (const node of list) {
      if (node.isLeaf) out.push({ key: node.key, label: node.title })
      else if (node.children) walk(node.children)
    }
  }
  walk(nodes)
  return out
}

export const DEMO_SPACE_ITEMS: NavWorkspaceSpaceItem[] = flattenOrgLeaves(DEMO_ORG_TREE)

/**
 * 取第一片叶子及其面包屑，用作触发器默认选中。
 */
function findFirstLeaf(
  nodes: NavWorkspaceOrgTreeNode[],
  acc: string[] = [],
): { key: string; label: string } | undefined {
  for (const node of nodes) {
    const path = [...acc, node.title]
    if (node.isLeaf) return { key: node.key, label: path.join('/') }
    if (node.children?.length) {
      const hit = findFirstLeaf(node.children, path)
      if (hit) return hit
    }
  }
  return undefined
}

const DEMO_DEFAULT_LEAF = findFirstLeaf(DEMO_ORG_TREE)
const DEMO_DEFAULT_EXPANDED = ['org-star', 'org-digital', 'org-dmp']

/**
 * 默认展开到第一棵树的第一条叶子路径，便于打开面板即看到空间。
 */
function defaultExpandedKeys(nodes: NavWorkspaceOrgTreeNode[]): string[] {
  const keys: string[] = []
  let current: NavWorkspaceOrgTreeNode | undefined = nodes[0]
  while (current && !current.isLeaf) {
    keys.push(current.key)
    current = current.children?.[0]
  }
  return keys.length ? keys : DEMO_DEFAULT_EXPANDED
}

/**
 * 按关键字过滤组织树：只保留标题命中的叶子及其祖先。
 */
function filterOrgTree(nodes: NavWorkspaceOrgTreeNode[], keyword: string): NavWorkspaceOrgTreeNode[] {
  const kw = keyword.trim()
  if (!kw) return nodes
  const out: NavWorkspaceOrgTreeNode[] = []
  for (const node of nodes) {
    if (node.isLeaf) {
      if (node.title.includes(kw)) out.push(node)
      continue
    }
    const children = filterOrgTree(node.children ?? [], kw)
    if (children.length) out.push({ ...node, children })
  }
  return out
}

/**
 * 收集过滤后树中全部非叶子 key，搜索命中时自动展开祖先。
 */
function collectExpandedKeys(nodes: NavWorkspaceOrgTreeNode[]): string[] {
  const keys: string[] = []
  const walk = (list: NavWorkspaceOrgTreeNode[]) => {
    for (const node of list) {
      if (!node.isLeaf) {
        keys.push(node.key)
        if (node.children) walk(node.children)
      }
    }
  }
  walk(nodes)
  return keys
}

/**
 * 从根到目标节点的标题路径，用作触发器面包屑。
 */
function findBreadcrumb(nodes: NavWorkspaceOrgTreeNode[], key: string, acc: string[] = []): string[] | null {
  for (const node of nodes) {
    const next = [...acc, node.title]
    if (node.key === key) return next
    if (node.children) {
      const hit = findBreadcrumb(node.children, key, next)
      if (hit) return hit
    }
  }
  return null
}

/**
 * 判断 key 是否为叶子（仅叶子可被选为工作空间）。
 */
function isLeafKey(nodes: NavWorkspaceOrgTreeNode[], key: string): boolean {
  for (const node of nodes) {
    if (node.key === key) return Boolean(node.isLeaf)
    if (node.children && isLeafKey(node.children, key)) return true
  }
  return false
}

/**
 * 侧导顶部位置选择器：触发器 + 280×400 下拉（搜索 / 按组织|按空间 / 树或列表 / 创建工作空间）。
 *
 * 相对导入已对齐落地路径（`./SearchBox`、`../patterns/*`、`../assets/*`），复制后不必改 import。
 */
export function NavWorkspaceSelect({
  compact = false,
  orgTree = DEMO_ORG_TREE,
  spaceItems = DEMO_SPACE_ITEMS,
  label: labelProp,
  selectedKey: selectedKeyProp,
  onChange,
  onCreateWorkspace,
  createLabel = '创建工作空间',
  searchPlaceholder = '输入空间名称搜索',
}: NavWorkspaceSelectProps) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<NavWorkspaceSelectMode>('org')
  const [keyword, setKeyword] = useState('')
  const [innerKey, setInnerKey] = useState<string | undefined>(DEMO_DEFAULT_LEAF?.key)
  const [innerLabel, setInnerLabel] = useState(DEMO_DEFAULT_LEAF?.label ?? '中电云/数字化部/数据中台/生产空间')
  const [expandedKeys, setExpandedKeys] = useState<string[]>(() => defaultExpandedKeys(orgTree))

  const selectedKey = selectedKeyProp ?? innerKey
  const selectedLabel = labelProp ?? innerLabel

  useEffect(() => {
    if (compact) setOpen(false)
  }, [compact])

  useEffect(() => {
    if (!open) setKeyword('')
  }, [open])

  const filteredTree = useMemo(() => filterOrgTree(orgTree, keyword), [orgTree, keyword])
  const filteredSpaces = useMemo(() => {
    const kw = keyword.trim()
    if (!kw) return spaceItems
    return spaceItems.filter((item) => item.label.includes(kw))
  }, [keyword, spaceItems])

  useEffect(() => {
    if (keyword.trim()) setExpandedKeys(collectExpandedKeys(filteredTree))
    else setExpandedKeys(defaultExpandedKeys(orgTree))
  }, [filteredTree, keyword, orgTree])

  const commit = (next: NavWorkspaceSelectChange) => {
    setInnerKey(next.key)
    setInnerLabel(next.label)
    onChange?.(next)
    setOpen(false)
  }

  const droplist = (
    <Card
      className="org-select-droplist"
      onMouseDown={(e) => {
        e.preventDefault()
      }}
      style={{ width: NAV_ORG_SELECT_PANEL_W_PX, height: NAV_ORG_SELECT_PANEL_H_PX }}
      bodyStyle={{
        padding: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="shrink-0 border-b border-solid"
        style={{ borderColor: 'var(--color-border-2)', padding: '8px 12px' }}
      >
        <SearchBox
          placeholder={searchPlaceholder}
          size="md"
          autoComplete="off"
          value={keyword}
          onChange={setKeyword}
          allowClear
        />
        <Radio.Group
          type="button"
          name="org-workspace-mode"
          value={mode}
          onChange={(v) => setMode(v as NavWorkspaceSelectMode)}
          style={{ width: '100%', marginTop: 8, display: 'flex', gap: 0 }}
        >
          <Radio value="org" style={{ flex: 1, textAlign: 'center', padding: 0 }}>
            <span className="inline-flex items-center justify-center gap-1">
              <MaskIcon
                src={tabOrg16}
                color={mode === 'org' ? 'rgb(var(--primary-6))' : 'var(--color-text-2)'}
                size={16}
                fit="contain"
              />
              按组织选择
            </span>
          </Radio>
          <Radio value="space" style={{ flex: 1, textAlign: 'center', padding: 0 }}>
            <span className="inline-flex items-center justify-center gap-1">
              <MaskIcon
                src={tabSpace16}
                color={mode === 'space' ? 'rgb(var(--primary-6))' : 'var(--color-text-2)'}
                size={16}
                fit="contain"
              />
              按空间选择
            </span>
          </Radio>
        </Radio.Group>
      </div>

      <div
        className="org-select-option-list yb-layout-main-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
        style={{ padding: '4px 12px' }}
      >
        {mode === 'org' ? (
          <Tree
            className="org-select-tree"
            blockNode
            size="small"
            showLine
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys.map(String))}
            selectedKeys={selectedKey ? [selectedKey] : undefined}
            treeData={filteredTree as TreeProps['treeData']}
            style={{ width: '100%', minWidth: 0 }}
            /**
             * Arco 无 showLine 时叶子不渲染 switcherIcon。
             * 开 showLine 才能把文件夹放进展开位；连线用 CSS 藏掉。
             * 父级必须自定义箭头，否则 showLine 会变成加减号。
             */
            icons={(node) => ({
              switcherIcon: node.isLeaf ? (
                <span className="org-select-leaf-switcher inline-flex size-4 items-center justify-center">
                  <MaskIcon src={folder16} color="var(--color-text-2)" size={16} fit="contain" />
                </span>
              ) : node.expanded ? (
                <IconCaretDown style={{ fontSize: 12 }} />
              ) : (
                <IconCaretRight style={{ fontSize: 12 }} />
              ),
            })}
            renderTitle={(node) => (
              <span className="min-w-0 flex-1 truncate">
                {typeof node.title === 'string' ? node.title : ''}
              </span>
            )}
            onSelect={(keys) => {
              const key = String(keys[0] ?? '')
              if (!key || !isLeafKey(orgTree, key)) return
              const crumbs = findBreadcrumb(orgTree, key)
              const label = crumbs?.join('/') ?? key
              commit({ key, label, mode: 'org' })
            }}
          />
        ) : (
          <Menu
            className="org-select-space-menu"
            mode="vertical"
            style={{ border: 'none', background: 'transparent' }}
            selectedKeys={selectedKey ? [selectedKey] : undefined}
            onClickMenuItem={(key) => {
              const item = spaceItems.find((s) => s.key === key)
              if (!item) return
              commit({ key: item.key, label: `空间：${item.label}`, mode: 'space' })
            }}
          >
            {filteredSpaces.map((item) => (
              <Menu.Item key={item.key}>
                <span className="inline-flex min-w-0 w-full items-center gap-2">
                  <MaskIcon src={folder16} color="var(--color-text-2)" size={16} fit="contain" />
                  <span
                    className="min-w-0 flex-1 truncate"
                    style={{ fontSize: 14, fontWeight: 400, lineHeight: '22px', color: 'var(--color-text-2)' }}
                  >
                    {item.label}
                  </span>
                </span>
              </Menu.Item>
            ))}
          </Menu>
        )}
      </div>

      <div
        className="shrink-0 border-t border-solid"
        style={{ borderColor: 'var(--color-border-2)', padding: '8px 12px' }}
      >
        {/**
         * 底栏创建入口：默认 `--color-text-1`，外链图标 12px（见 `NAV_ORG_SELECT_CREATE_ICON_PX`）。
         */}
        <Button
          type="text"
          className="org-select-create-btn"
          onClick={() => {
            if (onCreateWorkspace) onCreateWorkspace()
            else globalMessage.info('当前为演示环境，创建工作空间能力待接入')
            setOpen(false)
          }}
        >
          <span className="inline-flex items-center gap-1" style={{ fontSize: 14, lineHeight: '22px' }}>
            {createLabel}
            <span
              className="inline-grid shrink-0 place-items-center scale-x-[-1]"
              style={{ width: NAV_ORG_SELECT_CREATE_ICON_PX, height: NAV_ORG_SELECT_CREATE_ICON_PX }}
            >
              <MaskIcon
                src={launch16}
                color="currentColor"
                size={NAV_ORG_SELECT_CREATE_ICON_PX}
                fit="contain"
              />
            </span>
          </span>
        </Button>
      </div>
    </Card>
  )

  return (
    <Select
      value={WORKSPACE_SELECT_SENTINEL}
      options={[{ value: WORKSPACE_SELECT_SENTINEL, label: selectedLabel }]}
      renderFormat={() => selectedLabel}
      dropdownRender={() => droplist}
      popupVisible={open}
      onVisibleChange={setOpen}
      getPopupContainer={() => document.body}
      size="default"
      bordered={!compact}
      allowClear={false}
      showSearch={false}
      defaultActiveFirstOption={false}
      onChange={() => undefined}
      triggerElement={compact ? <WorkspaceSelectCollapsedTrigger popupVisible={open} /> : undefined}
      triggerProps={{
        position: 'bl',
        autoAlignPopupWidth: false,
        popupStyle: {
          width: NAV_ORG_SELECT_PANEL_W_PX,
          padding: 0,
          border: 'none',
          boxShadow: 'none',
          background: 'transparent',
        },
      }}
      aria-label={compact ? undefined : 'select-workspace'}
      className={
        compact ? 'flex w-[var(--yb-menu-item)] items-center justify-center' : 'w-full pr-px'
      }
    />
  )
}

/**
 * 折叠态工作区触发器：32×32 白底描边 + 12px 箭头，对齐仅轨态。
 */
const WorkspaceSelectCollapsedTrigger = forwardRef<
  HTMLButtonElement,
  { popupVisible: boolean } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>
>(function WorkspaceSelectCollapsedTrigger({ popupVisible, className, ...rest }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={[
        'flex h-[var(--yb-control-h-md)] min-h-[var(--yb-control-h-md)] w-[var(--yb-menu-item)]',
        'items-center justify-center overflow-clip rounded-[var(--yb-radius-4)]',
        'border-0 bg-transparent p-0',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="select-workspace"
      {...rest}
    >
      <div
        className={[
          'box-border flex size-[32px] shrink-0 items-center justify-center',
          'rounded-[var(--yb-radius-4)] border border-solid bg-[color:var(--yb-bg-2)]',
          popupVisible
            ? 'border-[color:var(--yb-primary-6)]'
            : 'border-[color:var(--yb-border-input-idle)]',
        ].join(' ')}
        style={
          popupVisible
            ? { boxShadow: '0 0 0 2px color-mix(in srgb, var(--yb-primary-6) 20%, transparent)' }
            : undefined
        }
      >
        <span className="inline-flex size-[14px] items-center justify-center" aria-hidden>
          <span
            className="inline-flex size-[12px] items-center justify-center"
            style={{
              transform: popupVisible ? 'rotate(180deg)' : 'rotate(0deg)',
              transformOrigin: '50% 50%',
            }}
          >
            <MaskIcon
              src={caretDown12}
              color={popupVisible ? 'var(--yb-primary-6)' : 'var(--yb-text-2)'}
              size={12}
              fit="stretch"
            />
          </span>
        </span>
      </div>
    </button>
  )
})
