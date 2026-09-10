import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Divider, Link as ArcoLink, Modal, Pagination, Table, Typography } from '@arco-design/web-react'
import { ListTableStatusDot, STATUS_DOT_COLOR } from '../components/ListTableStatusDot'
import { SearchWithRefresh } from '../components/SearchBox'
import { TableColumnFilterTitle, TableColumnSortTitle } from '../components/TableColumnFilterTitle'
import { TableEllipsisCell } from '../components/TableEllipsisCell'
import { LIST_DEFAULT_PAGE_SIZE } from '../patterns/listPageLayout'
import { LIST_TABLE_NAME_LINK_CLASSNAME } from '../patterns/listTableNameLink'
import { LIST_TABLE_NO_DATA_ELEMENT } from '../patterns/listTableNoDataElement'
import { globalMessage } from '../patterns/globalMessage'

/**
 * 无左侧树列表（主规范）。规范：`references/list-page.md` §1。
 *
 * 相对导入已对齐落地路径：复制到 `src/{feature}/` 后不必改 import。
 *
 * 只换：LIST_PATH、列、DEMO_ROWS、文案。保留页头 / 工具行 / Table class / 外置分页 / `state.from`。
 */

const LIST_PATH = '/resources'
const CREATE_PATH = `${LIST_PATH}/create`

type StatusValue = 'running' | 'stopped'

type Row = {
  id: string
  name: string
  status: StatusValue
  owner: string
  updatedAt: string
}

const STATUS_OPTIONS: { label: string; value: StatusValue }[] = [
  { label: '运行中', value: 'running' },
  { label: '已停用', value: 'stopped' },
]

const STATUS_LABEL: Record<StatusValue, string> = {
  running: '运行中',
  stopped: '已停用',
}

const DEMO_ROWS: Row[] = [
  { id: '1', name: '订单查询服务', status: 'running', owner: '张三', updatedAt: '2026-08-01 10:00:00' },
  { id: '2', name: '用户同步任务', status: 'stopped', owner: '李四', updatedAt: '2026-08-12 14:20:00' },
  { id: '3', name: '账单导出接口', status: 'running', owner: '王五', updatedAt: '2026-09-02 09:15:00' },
]

const DEFAULT_PAGE_SIZE = LIST_DEFAULT_PAGE_SIZE

type SortState = { field: 'updatedAt' | null; order: 'ascend' | 'descend' | null }

export function BasicListPage() {
  const navigate = useNavigate()
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
      if (statusFilter && row.status !== statusFilter) return false
      if (q && !row.name.toLowerCase().includes(q) && !row.owner.toLowerCase().includes(q)) return false
      return true
    })
    if (sort.field === 'updatedAt' && sort.order) {
      const dir = sort.order === 'ascend' ? 1 : -1
      rows = [...rows].sort((a, b) => a.updatedAt.localeCompare(b.updatedAt) * dir)
    }
    return rows
  }, [keyword, statusFilter, sort, refreshTick])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  const cycleUpdatedAtSort = () => {
    setSort((prev: SortState) => {
      if (prev.field !== 'updatedAt') return { field: 'updatedAt', order: 'ascend' }
      if (prev.order === 'ascend') return { field: 'updatedAt', order: 'descend' }
      return { field: null, order: null }
    })
  }

  const goCreate = () => {
    navigate(CREATE_PATH, { state: { from: LIST_PATH } })
  }

  const goEdit = (id: string) => {
    navigate(`${LIST_PATH}/${id}/edit`, { state: { from: LIST_PATH } })
  }

  const confirmDelete = (row: Row) => {
    Modal.confirm({
      title: `确定要删除「${row.name}」吗？`,
      content: '资源删除后不可恢复，依赖该资源的任务与调用将无法继续。',
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
      title: (
        <TableColumnSortTitle
          title="更新时间"
          sort={{
            order: sort.field === 'updatedAt' ? sort.order : null,
            onClick: cycleUpdatedAtSort,
          }}
        />
      ),
      dataIndex: 'updatedAt',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 120,
      fixed: 'right',
      render: (_id: string, row: Row) => (
        <span className="service-manage-actions inline-flex items-center gap-3">
          <ArcoLink onClick={() => goEdit(row.id)}>编辑</ArcoLink>
          <ArcoLink status="error" onClick={() => confirmDelete(row)}>
            删除
          </ArcoLink>
        </span>
      ),
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 bg-[color:var(--color-bg-2)]" style={{ padding: 24, boxSizing: 'border-box' }}>
        <div className="flex h-8 min-w-0 flex-1 items-center">
          <Typography.Title
            heading={5}
            className="min-w-0 truncate"
            style={{ margin: 0, fontSize: 20, lineHeight: '30px', fontWeight: 600, color: 'var(--color-text-1)' }}
          >
            资源管理
          </Typography.Title>
          <div className="ml-auto h-8 w-[280px] shrink-0" aria-hidden />
        </div>
      </div>
      <Divider style={{ margin: 0 }} />
      <div
        className="flex min-h-0 flex-1 flex-col bg-[color:var(--color-bg-2)]"
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
            searchWrapStyle={{ width: 280 }}
          />
          <Button type="primary" style={{ height: 32 }} onClick={goCreate}>
            创建资源
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
  )
}
