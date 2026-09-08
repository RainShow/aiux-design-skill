import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Divider, Link as ArcoLink, Modal, Pagination, Table, Tabs, Typography } from '@arco-design/web-react'
import { ListTableStatusDot, STATUS_DOT_COLOR } from '../components/ListTableStatusDot'
import { SearchWithRefresh } from '../components/SearchBox'
import { TableColumnFilterTitle, TableColumnSortTitle } from '../components/TableColumnFilterTitle'
import { TableEllipsisCell } from '../components/TableEllipsisCell'
import { LIST_DEFAULT_PAGE_SIZE } from '../patterns/listPageLayout'
import { LIST_TABLE_NAME_LINK_CLASSNAME } from '../patterns/listTableNameLink'
import { LIST_TABLE_NO_DATA_ELEMENT } from '../patterns/listTableNoDataElement'
import { globalMessage } from '../patterns/globalMessage'

/**
 * 带 Tab 页头 + 48px 主表。规范：`references/list-page.md` §3。
 *
 * 页头同 §2；表格同 §1 的 `service-manage-list-table--row48-flex`，不要挂 `data-source-manage-table`。
 *
 * 相对导入已对齐落地路径：复制到 `src/{feature}/` 后不必改 import。
 */

const LIST_PATH = '/ops/instances'
const CREATE_PATH = `${LIST_PATH}/create`

type StatusValue = 'running' | 'success' | 'failed'

type Row = {
  id: string
  name: string
  scope: 'task' | 'workflow'
  status: StatusValue
  owner: string
  startedAt: string
}

const SCOPE_TABS = [
  { key: 'all', title: '全部' },
  { key: 'task', title: '任务' },
  { key: 'workflow', title: '工作流' },
] as const

const STATUS_OPTIONS: { label: string; value: StatusValue }[] = [
  { label: '运行中', value: 'running' },
  { label: '成功', value: 'success' },
  { label: '失败', value: 'failed' },
]

const STATUS_LABEL: Record<StatusValue, string> = {
  running: '运行中',
  success: '成功',
  failed: '失败',
}

const STATUS_DOT: Record<StatusValue, string> = {
  running: STATUS_DOT_COLOR.processing,
  success: STATUS_DOT_COLOR.success,
  failed: STATUS_DOT_COLOR.failed,
}

const DEMO_ROWS: Row[] = [
  { id: '1', name: '订单日批', scope: 'task', status: 'running', owner: '张三', startedAt: '2026-09-02 09:00:00' },
  { id: '2', name: '对账工作流', scope: 'workflow', status: 'success', owner: '李四', startedAt: '2026-09-01 22:10:00' },
  { id: '3', name: '账单导出', scope: 'task', status: 'failed', owner: '王五', startedAt: '2026-09-02 08:30:00' },
]

const DEFAULT_PAGE_SIZE = LIST_DEFAULT_PAGE_SIZE

type SortState = { field: 'startedAt' | null; order: 'ascend' | 'descend' | null }

export function TabRow48ListPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState(null as string | null)
  const [sort, setSort] = useState({ field: null, order: null } as SortState)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [refreshTick, setRefreshTick] = useState(0)

  const filtered = useMemo(() => {
    void refreshTick
    const q = keyword.trim().toLowerCase()
    let rows = DEMO_ROWS.filter((row) => {
      if (tab !== 'all' && row.scope !== tab) return false
      if (statusFilter && row.status !== statusFilter) return false
      if (q && !row.name.toLowerCase().includes(q) && !row.owner.toLowerCase().includes(q)) return false
      return true
    })
    if (sort.field === 'startedAt' && sort.order) {
      const dir = sort.order === 'ascend' ? 1 : -1
      rows = [...rows].sort((a, b) => a.startedAt.localeCompare(b.startedAt) * dir)
    }
    return rows
  }, [tab, keyword, statusFilter, sort, refreshTick])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  const cycleStartedAtSort = () => {
    setSort((prev: SortState) => {
      if (prev.field !== 'startedAt') return { field: 'startedAt', order: 'ascend' }
      if (prev.order === 'ascend') return { field: 'startedAt', order: 'descend' }
      return { field: null, order: null }
    })
  }

  const goCreate = () => {
    navigate(CREATE_PATH, { state: { from: LIST_PATH } })
  }

  const confirmDelete = (row: Row) => {
    Modal.confirm({
      title: `确定要删除「${row.name}」吗？`,
      content: '实例删除后不可恢复，关联的运行记录与配置将一并失效。',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        globalMessage.success('已删除')
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
        <ListTableStatusDot color={STATUS_DOT[status]} label={STATUS_LABEL[status]} />
      ),
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      width: 140,
      render: (owner: string) => <TableEllipsisCell tooltip={owner}>{owner}</TableEllipsisCell>,
    },
    {
      title: (
        <TableColumnSortTitle
          title="开始时间"
          sort={{
            order: sort.field === 'startedAt' ? sort.order : null,
            onClick: cycleStartedAtSort,
          }}
        />
      ),
      dataIndex: 'startedAt',
      width: 200,
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
    <div className="flex h-full w-full min-h-0 flex-col">
      <div className="service-detail-page flex min-h-0 flex-1 flex-col bg-[color:var(--color-bg-2)]">
        <div className="page-header-with-tabs shrink-0">
          <div className="flex min-w-0 items-center justify-between gap-4">
            <Typography.Title
              heading={5}
              className="min-w-0 truncate"
              style={{ margin: 0, fontSize: 20, lineHeight: '30px', fontWeight: 600, color: 'var(--color-text-1)' }}
            >
              运行实例
            </Typography.Title>
          </div>
          <Tabs
            type="line"
            activeTab={tab}
            onChange={(next: string) => {
              setTab(next)
              setPage(1)
            }}
            className="service-detail-page-header-tabs data-source-manage-header-tabs"
            style={{ marginTop: 16 }}
          >
            {SCOPE_TABS.map((item) => (
              <Tabs.TabPane key={item.key} title={item.title} />
            ))}
          </Tabs>
        </div>
        <Divider style={{ margin: 0 }} />
        <div
          className="flex min-h-0 flex-1 flex-col"
          style={{ padding: 24, boxSizing: 'border-box' }}
        >
          <div className="flex shrink-0 min-w-0 flex-wrap items-center justify-between gap-2">
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
              searchWrapStyle={{ width: 480, maxWidth: '100%' }}
            />
            <Button type="primary" style={{ height: 32 }} onClick={goCreate}>
              创建实例
            </Button>
          </div>
          <div className="mt-4 min-w-0 overflow-x-auto">
            <Table
              className="service-manage-table service-manage-list-table--row48-flex"
              border={false}
              pagination={false}
              columns={columns}
              data={paged}
              rowKey="id"
              noDataElement={LIST_TABLE_NO_DATA_ELEMENT}
              scroll={{ x: 860 }}
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
