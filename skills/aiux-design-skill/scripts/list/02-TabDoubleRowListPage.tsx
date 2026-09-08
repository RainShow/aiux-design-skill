import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Divider, Link as ArcoLink, Modal, Pagination, Table, Tabs, Typography } from '@arco-design/web-react'
import { ListTableStatusDot, STATUS_DOT_COLOR } from '../components/ListTableStatusDot'
import { SearchWithRefresh } from '../components/SearchBox'
import { TableColumnFilterTitle } from '../components/TableColumnFilterTitle'
import { LIST_DEFAULT_PAGE_SIZE } from '../patterns/listPageLayout'
import { LIST_TABLE_NAME_LINK_CLASSNAME } from '../patterns/listTableNameLink'
import { LIST_TABLE_NO_DATA_ELEMENT } from '../patterns/listTableNoDataElement'
import { globalMessage } from '../patterns/globalMessage'

/**
 * 带 Tab + 64px 双行表。规范：`references/list-page.md` §2。
 *
 * 相对导入已对齐落地路径：复制到 `src/{feature}/` 后不必改 import。
 *
 * 只换：LIST_PATH、Tab、列、DEMO_ROWS、文案。保留 `page-header-with-tabs`、双 Tabs class、`data-source-manage-table`。
 * 不要再挂 `service-manage-list-table--row48-flex`（与 64px 双行互斥）。
 */

const LIST_PATH = '/datasources'
const CREATE_PATH = `${LIST_PATH}/create`

type TypeValue = 'mysql' | 'hive'

type Row = {
  id: string
  name: string
  type: TypeValue
  host: string
  user: string
  status: 'running' | 'stopped'
}

const TYPE_TABS = [
  { key: 'all', title: '全部' },
  { key: 'mysql', title: 'MySQL' },
  { key: 'hive', title: 'Hive' },
] as const

const STATUS_OPTIONS = [
  { label: '运行中', value: 'running' },
  { label: '已停用', value: 'stopped' },
]

const STATUS_LABEL: Record<Row['status'], string> = {
  running: '运行中',
  stopped: '已停用',
}

const DEMO_ROWS: Row[] = [
  { id: '1', name: '订单库', type: 'mysql', host: 'mysql.example.com:3306', user: 'order_rw', status: 'running' },
  { id: '2', name: '数仓 Hive', type: 'hive', host: 'hive.example.com:10000', user: 'analyst', status: 'running' },
  { id: '3', name: '归档库', type: 'mysql', host: 'archive.example.com:3306', user: 'archive_ro', status: 'stopped' },
]

const DEFAULT_PAGE_SIZE = LIST_DEFAULT_PAGE_SIZE

export function TabDoubleRowListPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState(null as string | null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [refreshTick, setRefreshTick] = useState(0)

  const filtered = useMemo(() => {
    void refreshTick
    const q = keyword.trim().toLowerCase()
    return DEMO_ROWS.filter((row) => {
      if (tab !== 'all' && row.type !== tab) return false
      if (statusFilter && row.status !== statusFilter) return false
      if (q && !row.name.toLowerCase().includes(q) && !row.host.toLowerCase().includes(q)) return false
      return true
    })
  }, [tab, keyword, statusFilter, refreshTick])

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
      content: '数据源删除后不可恢复，使用该连接的任务将无法继续拉取或写入。',
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
      width: 200,
      render: (name: string, row: Row) => (
        <Link to={`${LIST_PATH}/${row.id}`} className={LIST_TABLE_NAME_LINK_CLASSNAME}>
          {name}
        </Link>
      ),
    },
    {
      title: '连接信息',
      dataIndex: 'host',
      render: (_host: string, row: Row) => (
        <Typography.Paragraph
          style={{
            margin: 0,
            whiteSpace: 'pre-line',
            fontSize: 14,
            lineHeight: '22px',
            color: 'var(--color-text-2)',
          }}
        >
          {`${row.host}\n${row.user}`}
        </Typography.Paragraph>
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
      render: (status: Row['status']) => (
        <ListTableStatusDot color={STATUS_DOT_COLOR[status]} label={STATUS_LABEL[status]} />
      ),
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
              数据源管理
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
            {TYPE_TABS.map((item) => (
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
              placeholder="搜索名称或地址"
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
              创建数据源
            </Button>
          </div>
          <div className="mt-4 min-w-0 overflow-x-auto">
            <Table
              className="service-manage-table data-source-manage-table"
              border={false}
              pagination={false}
              columns={columns}
              data={paged}
              rowKey="id"
              noDataElement={LIST_TABLE_NO_DATA_ELEMENT}
              scroll={{ x: 800 }}
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
