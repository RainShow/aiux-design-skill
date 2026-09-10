import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Link as ArcoLink, Modal, Pagination, Table, Tree, Typography } from '@arco-design/web-react'
import { IconCaretDown, IconCaretRight } from '@arco-design/web-react/icon'
import { ListTableStatusDot, STATUS_DOT_COLOR } from '../components/ListTableStatusDot'
import { SearchWithRefresh } from '../components/SearchBox'
import { TableColumnFilterTitle } from '../components/TableColumnFilterTitle'
import { TableEllipsisCell } from '../components/TableEllipsisCell'
import { LIST_DEFAULT_PAGE_SIZE } from '../patterns/listPageLayout'
import { LIST_TABLE_NAME_LINK_CLASSNAME } from '../patterns/listTableNameLink'
import { LIST_TABLE_NO_DATA_ELEMENT } from '../patterns/listTableNoDataElement'
import { globalMessage } from '../patterns/globalMessage'

/**
 * 左树右表。规范：`references/list-page.md` §4。
 *
 * 仅稿面明确要左树时复制本文件。不要因为页名叫「服务管理」或表里有「类型」列就加树。
 *
 * 相对导入已对齐落地路径：复制到 `src/{feature}/` 后不必改 import。
 */

const LIST_PATH = '/services'
const CREATE_PATH = `${LIST_PATH}/create`
const ALL_KEY = 'all'

type StatusValue = 'running' | 'stopped'

type Row = {
  id: string
  name: string
  catalogKey: string
  status: StatusValue
  owner: string
}

const TREE_DATA = [
  {
    key: ALL_KEY,
    title: '全部',
    children: [
      {
        key: 'order',
        title: '订单域',
        children: [
          { key: 'order-query', title: '查询服务', isLeaf: true },
          { key: 'order-sync', title: '同步任务', isLeaf: true },
        ],
      },
      {
        key: 'bill',
        title: '账单域',
        children: [{ key: 'bill-export', title: '导出接口', isLeaf: true }],
      },
    ],
  },
]

const STATUS_OPTIONS: { label: string; value: StatusValue }[] = [
  { label: '运行中', value: 'running' },
  { label: '已停用', value: 'stopped' },
]

const STATUS_LABEL: Record<StatusValue, string> = {
  running: '运行中',
  stopped: '已停用',
}

const DEMO_ROWS: Row[] = [
  { id: '1', name: '订单查询服务', catalogKey: 'order-query', status: 'running', owner: '张三' },
  { id: '2', name: '用户同步任务', catalogKey: 'order-sync', status: 'stopped', owner: '李四' },
  { id: '3', name: '账单导出接口', catalogKey: 'bill-export', status: 'running', owner: '王五' },
]

const DEFAULT_PAGE_SIZE = LIST_DEFAULT_PAGE_SIZE

function rowInCatalog(row: Row, selected: string) {
  if (selected === ALL_KEY) return true
  if (row.catalogKey === selected) return true
  return row.catalogKey.startsWith(`${selected}-`)
}

export function TreeListPage() {
  const navigate = useNavigate()
  const [selectedKey, setSelectedKey] = useState(ALL_KEY)
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState(null as string | null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [refreshTick, setRefreshTick] = useState(0)

  const filtered = useMemo(() => {
    void refreshTick
    const q = keyword.trim().toLowerCase()
    return DEMO_ROWS.filter((row) => {
      if (!rowInCatalog(row, selectedKey)) return false
      if (statusFilter && row.status !== statusFilter) return false
      if (q && !row.name.toLowerCase().includes(q) && !row.owner.toLowerCase().includes(q)) return false
      return true
    })
  }, [selectedKey, keyword, statusFilter, refreshTick])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  const goCreate = () => {
    navigate(CREATE_PATH, { state: { from: LIST_PATH } })
  }

  const confirmDelete = (row: Row) => {
    Modal.confirm({
      title: `确定要删除「${row.name}」吗？`,
      content: '服务删除后不可恢复，所有使用该服务的功能将停止运行。',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        globalMessage.ok('删除')
      },
    })
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 240,
      render: (name: string, row: Row) => (
        <Link to={`${LIST_PATH}/${row.id}`} className={LIST_TABLE_NAME_LINK_CLASSNAME}>
          {name}
        </Link>
      ),
    },
    {
      title: (
        <TableColumnFilterTitle
          title="状态"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(next) => {
            setStatusFilter(next)
            setPage(1)
          }}
        />
      ),
      dataIndex: 'status',
      width: 120,
      render: (status: StatusValue) => (
        <ListTableStatusDot color={STATUS_DOT_COLOR[status]} label={STATUS_LABEL[status]} />
      ),
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      width: 140,
      render: (owner: string) => <TableEllipsisCell tooltip={owner}>{owner}</TableEllipsisCell>,
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 80,
      fixed: 'right',
      render: (_id: string, row: Row) => (
        <span className="service-manage-actions inline-flex items-center gap-3">
          <ArcoLink status="error" onClick={() => confirmDelete(row)}>
            删除
          </ArcoLink>
        </span>
      ),
    },
  ]

  return (
    <div className="h-full w-full min-h-0" style={{ padding: 24, boxSizing: 'border-box' }}>
      <div className="flex h-full min-h-0 w-full gap-4">
        <div className="w-[220px] shrink-0 min-h-0 overflow-auto">
          <Tree
            className="service-catalog-tree"
            blockNode
            size="small"
            showLine
            actionOnClick="select"
            selectedKeys={[selectedKey]}
            treeData={TREE_DATA}
            onSelect={(keys: string[]) => {
              const next = keys[0] || ALL_KEY
              setSelectedKey(next)
              setPage(1)
            }}
            icons={{
              switcherIcon: (node: { isLeaf?: boolean; expanded?: boolean }) => {
                if (node.isLeaf) return null
                const style = { fontSize: 12 }
                return node.expanded ? <IconCaretDown style={style} /> : <IconCaretRight style={style} />
              },
            }}
            renderTitle={(node: { title?: string }) => (
              <span className="service-catalog-tree-title" style={{ minWidth: 0 }}>
                {node.title}
              </span>
            )}
          />
        </div>
        <div className="w-px shrink-0 self-stretch bg-[color:var(--yb-border-2)]" />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Typography.Title
            heading={5}
            className="min-w-0 shrink-0 truncate"
            style={{ margin: 0, fontSize: 20, lineHeight: '30px', fontWeight: 600, color: 'var(--yb-text-1)' }}
          >
            服务管理
          </Typography.Title>
          <div className="mt-4 flex shrink-0 min-w-0 flex-wrap items-center justify-between gap-2">
            <SearchWithRefresh
              placeholder="搜索名称或负责人"
              value={keyword}
              onChange={(value: string) => {
                setKeyword(value)
                setPage(1)
              }}
              onRefresh={() => setRefreshTick((n: number) => n + 1)}
              iconPlacement="right"
              size="md"
              allowClear={false}
              searchWrapStyle={{ width: 240 }}
            />
            <Button type="primary" style={{ height: 32 }} onClick={goCreate}>
              创建服务
            </Button>
          </div>
          <div className="mt-4 min-w-0 shrink-0 overflow-x-auto">
            <Table
              className="service-manage-table service-manage-list-table--row48-flex"
              border={false}
              pagination={false}
              columns={columns}
              data={paged}
              rowKey="id"
              noDataElement={LIST_TABLE_NO_DATA_ELEMENT}
              scroll={{ x: 640 }}
            />
          </div>
          <div className="mt-4 flex shrink-0 items-center justify-between">
            <span className="text-[12px] leading-[18px] text-[color:var(--yb-text-2)]">共 {filtered.length} 条</span>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={filtered.length}
              showTotal={false}
              showJumper
              sizeCanChange
              pageSizeChangeResetCurrent
              onChange={(next: number, size: number) => {
                setPage(next)
                setPageSize(size)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
