import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Divider, Modal, Pagination, Typography } from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'
import { ListTableStatusDot, STATUS_DOT_COLOR } from '../components/ListTableStatusDot'
import { PageLevelEmpty } from '../components/PageLevelEmpty'
import { SearchWithRefresh } from '../components/SearchBox'
import { globalMessage } from '../patterns/globalMessage'
import { LIST_CARD_PAGE_SIZE_3COL } from '../patterns/listPageLayout'

/**
 * 卡片列表。规范：`references/list-page.md` §5。
 * 视觉对齐 data-demo「应用管理」：无 Tab 页头 + 三列资源卡 + 外置分页。
 *
 * 相对导入已对齐落地路径：复制到 `src/{feature}/` 后不必改 import。
 *
 * 只换：LIST_PATH、DEMO_ROWS、文案、键值行。保留页头 / 工具行 / yb-list-card / 整卡进详情 / `state.from`。
 * 不要改成 Table，不要挂 yb-content-card。
 */

const LIST_PATH = '/apps'
const CREATE_PATH = `${LIST_PATH}/create`

type StatusValue = 'running' | 'stopped'

type Row = {
  id: string
  name: string
  status: StatusValue
  description: string
  accessKey: string
  secretKey: string
}

const STATUS_LABEL: Record<StatusValue, string> = {
  running: '已启用',
  stopped: '未启用',
}

const DEMO_ROWS: Row[] = [
  {
    id: '1',
    name: '新星小助手1',
    status: 'running',
    description: '根据写作需求生成大纲',
    accessKey: 'c05ffdee8a21d807d155957eeaa',
    secretKey: '**********',
  },
  {
    id: '2',
    name: '新星小助手2',
    status: 'running',
    description: '根据写作需求生成大纲',
    accessKey: 'c05ffdee8a21d807d155957eeaa',
    secretKey: '**********',
  },
  {
    id: '3',
    name: '新星小助手3',
    status: 'stopped',
    description: '根据写作需求生成大纲',
    accessKey: 'c05ffdee8a21d807d155957eeaa',
    secretKey: '**********',
  },
  {
    id: '4',
    name: '新星小助手4',
    status: 'running',
    description: '根据写作需求生成大纲',
    accessKey: 'c05ffdee8a21d807d155957eeaa',
    secretKey: '**********',
  },
  {
    id: '5',
    name: '新星小助手5',
    status: 'running',
    description: '根据写作需求生成大纲',
    accessKey: 'c05ffdee8a21d807d155957eeaa',
    secretKey: '**********',
  },
  {
    id: '6',
    name: '新星小助手6',
    status: 'running',
    description: '根据写作需求生成大纲',
    accessKey: 'c05ffdee8a21d807d155957eeaa',
    secretKey: '**********',
  },
]

const DEFAULT_PAGE_SIZE = LIST_CARD_PAGE_SIZE_3COL

function ListCardAppIcon() {
  return (
    <div
      className="grid size-12 shrink-0 place-items-center rounded-lg"
      style={{ background: 'rgb(var(--primary-1))' }}
      aria-hidden
    >
      <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
        <rect x="1" y="1" width="8" height="8" rx="1.5" fill="rgb(var(--primary-6))" />
        <rect x="11" y="1" width="8" height="8" rx="1.5" fill="rgb(var(--primary-6))" />
        <rect x="1" y="11" width="8" height="8" rx="1.5" fill="rgb(var(--primary-6))" />
        <rect x="11" y="11" width="8" height="8" rx="1.5" fill="rgb(var(--primary-6))" />
      </svg>
    </div>
  )
}

export function CardListPage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [refreshTick, setRefreshTick] = useState(0)
  const [rows, setRows] = useState(DEMO_ROWS)

  const filtered = useMemo(() => {
    void refreshTick
    const q = keyword.trim()
    if (!q) return rows
    return rows.filter((row) => row.name.includes(q))
  }, [keyword, refreshTick, rows])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  const goCreate = () => {
    navigate(CREATE_PATH, { state: { from: LIST_PATH } })
  }

  const goDetail = (id: string) => {
    navigate(`${LIST_PATH}/${id}`)
  }

  const goEdit = (id: string) => {
    navigate(`${LIST_PATH}/${id}/edit`, { state: { from: LIST_PATH } })
  }

  const toggleStatus = (row: Row) => {
    const next: StatusValue = row.status === 'running' ? 'stopped' : 'running'
    setRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, status: next } : item)))
    globalMessage.ok(next === 'stopped' ? '停用' : '启用')
  }

  const confirmDelete = (row: Row) => {
    Modal.confirm({
      title: `确定要删除「${row.name}」吗？`,
      content: '应用删除后不可恢复，已授权使用该应用的工作流将无法继续调用。',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setRows((prev) => prev.filter((item) => item.id !== row.id))
        globalMessage.ok('删除')
      },
    })
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 bg-[color:var(--color-bg-2)]" style={{ padding: 24, boxSizing: 'border-box' }}>
        <div className="flex h-8 min-w-0 flex-1 items-center">
          <Typography.Title
            heading={5}
            className="min-w-0 truncate"
            style={{ margin: 0, fontSize: 20, lineHeight: '30px', fontWeight: 600, color: 'var(--color-text-1)' }}
          >
            应用管理
          </Typography.Title>
          <div className="ml-auto h-8 w-[280px] shrink-0" aria-hidden />
        </div>
      </div>
      <Divider style={{ margin: 0 }} />
      <div
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto bg-[color:var(--color-bg-2)]"
        style={{ padding: 24, boxSizing: 'border-box' }}
      >
        <div className="flex shrink-0 min-w-0 flex-wrap items-center justify-between gap-2">
          <SearchWithRefresh
            placeholder="搜索应用名称"
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
          <Button type="primary" icon={<IconPlus />} style={{ height: 32, paddingLeft: 16, paddingRight: 16 }} onClick={goCreate}>
            创建应用
          </Button>
        </div>
        {paged.length === 0 ? (
          <PageLevelEmpty layout="inline" description="暂无应用" />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {paged.map((row) => (
              <Card
                key={row.id}
                bordered={false}
                className="yb-list-card"
                bodyStyle={{ padding: 24 }}
                tabIndex={0}
                onClick={() => goDetail(row.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    goDetail(row.id)
                  }
                }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <ListCardAppIcon />
                    <div className="flex min-w-0 flex-1 flex-col items-start">
                      <div className="flex w-full min-w-0 items-center gap-3">
                        <Typography.Text
                          className="min-w-0 truncate"
                          style={{ fontSize: 16, lineHeight: '24px', fontWeight: 500, color: 'var(--color-text-1)' }}
                        >
                          {row.name}
                        </Typography.Text>
                        <div className="flex-1" />
                        <ListTableStatusDot
                          className="shrink-0"
                          color={STATUS_DOT_COLOR[row.status]}
                          label={STATUS_LABEL[row.status]}
                        />
                      </div>
                      <Typography.Text
                        className="w-full truncate"
                        style={{ fontSize: 14, lineHeight: '22px', color: 'var(--color-text-3)' }}
                      >
                        {row.description}
                      </Typography.Text>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-3">
                    <div
                      className="h-[44px] overflow-hidden"
                      style={{ color: 'var(--color-text-3)', fontSize: 14, lineHeight: '22px' }}
                    >
                      <p className="m-0 leading-[22px]">AccessKey：{row.accessKey}</p>
                      <p className="m-0 leading-[22px]">SecretKey：{row.secretKey}</p>
                    </div>
                    <div className="flex items-center justify-end gap-2 self-end">
                      <Button
                        type="text"
                        className="!px-0"
                        style={{ height: 32, color: 'rgb(var(--primary-6))' }}
                        onClick={(event) => {
                          event.stopPropagation()
                          toggleStatus(row)
                        }}
                      >
                        {row.status === 'running' ? '停用' : '启用'}
                      </Button>
                      <Button
                        type="text"
                        className="!px-0"
                        style={{ height: 32, color: 'rgb(var(--primary-6))' }}
                        onClick={(event) => {
                          event.stopPropagation()
                          goEdit(row.id)
                        }}
                      >
                        编辑
                      </Button>
                      <Button
                        type="text"
                        className="!px-0"
                        style={{ height: 32, color: 'rgb(var(--primary-6))' }}
                        onClick={(event) => {
                          event.stopPropagation()
                          confirmDelete(row)
                        }}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        <div className="flex shrink-0 items-center justify-between">
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
