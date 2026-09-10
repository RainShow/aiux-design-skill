import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Divider, Pagination, Radio, Select, Tag, Typography } from '@arco-design/web-react'
import { IconDown, IconImage, IconPlus, IconUp } from '@arco-design/web-react/icon'
import { PageLevelEmpty } from '../components/PageLevelEmpty'
import { SearchWithRefresh } from '../components/SearchBox'
import { FORM_CTRL_W_160 } from '../patterns/formPageLayout'
import { LIST_CARD_PAGE_SIZE_1COL } from '../patterns/listPageLayout'

/**
 * 单列横向卡片列表。规范：`references/list-page.md` §6。
 * 页头只放标题；搜索 / 标签 / 创建主按钮同一工具行；左文右图内容卡 + 外置分页。
 *
 * 相对导入已对齐落地路径：复制到 `src/{feature}/` 后不必改 import。
 *
 * 只换：LIST_PATH、DEMO_ROWS、标签、文案、配图。保留 yb-list-card、整卡进详情、`state.from`。
 * 按提示词裁字段：默认无阅读/点赞/评论。不要改成三列资源卡（那是 §5），不要 Table，不要 yb-content-card。
 * 列表若挂 create / detail：两页必须有顶栏返回，禁止无返回的 PlaceholderPage。
 */

const LIST_PATH = '/contents'
const CREATE_PATH = `${LIST_PATH}/create`
const DEFAULT_PAGE_SIZE = LIST_CARD_PAGE_SIZE_1COL

type Channel = 'web' | 'client' | 'mobile'
type Kind = 'guide' | 'case' | 'notice'

type Row = {
  id: string
  title: string
  summary: string
  channel: Channel
  kind: Kind
  tags: string[]
  author: string
  publishedAt: string
}

const CHANNEL_OPTIONS: { label: string; value: Channel }[] = [
  { label: '网页端', value: 'web' },
  { label: '客户端', value: 'client' },
  { label: '移动端', value: 'mobile' },
]

const KIND_OPTIONS: { label: string; value: Kind }[] = [
  { label: '指南', value: 'guide' },
  { label: '案例', value: 'case' },
  { label: '公告', value: 'notice' },
]

const CHANNEL_LABEL: Record<Channel, string> = {
  web: '网页端',
  client: '客户端',
  mobile: '移动端',
}

const DEMO_ROWS: Row[] = [
  {
    id: '1',
    title: '网页端接入指南',
    summary: '从创建应用到发布上线的完整步骤，适合首次接入的业务同学。',
    channel: 'web',
    kind: 'guide',
    tags: ['网页端', '指南'],
    author: '张三',
    publishedAt: '2026-09-01 09:00',
  },
  {
    id: '2',
    title: '客户端灰度发布案例',
    summary: '按批次放量、失败回滚与值班盯盘的实践摘要。',
    channel: 'client',
    kind: 'case',
    tags: ['客户端', '案例'],
    author: '李四',
    publishedAt: '2026-08-28 14:20',
  },
  {
    id: '3',
    title: '移动端组件更新公告',
    summary: '本周起导航与空态插画跟随主题 19155，旧包将在两周后下线。',
    channel: 'mobile',
    kind: 'notice',
    tags: ['移动端', '公告'],
    author: '王五',
    publishedAt: '2026-08-20 11:10',
  },
  {
    id: '4',
    title: '网页端权限模型说明',
    summary: '角色、空间与数据权限的对照表，便于核对开通范围。',
    channel: 'web',
    kind: 'guide',
    tags: ['网页端', '指南'],
    author: '赵六',
    publishedAt: '2026-08-12 16:40',
  },
  {
    id: '5',
    title: '客户端崩溃收敛案例',
    summary: '符号表、堆栈聚合与值班告警的一次完整闭环。',
    channel: 'client',
    kind: 'case',
    tags: ['客户端', '案例'],
    author: '钱七',
    publishedAt: '2026-08-08 10:05',
  },
  {
    id: '6',
    title: '移动端审核须知',
    summary: '上架材料、隐私清单与截图规格，提交前请逐项核对。',
    channel: 'mobile',
    kind: 'notice',
    tags: ['移动端', '公告'],
    author: '孙八',
    publishedAt: '2026-08-02 09:30',
  },
]

/** 无实图时的图位：浅蓝灰底 + 24×24 IconImage，禁止纯灰空块或彩色渐变冒充实图 */
function CoverPlaceholder() {
  return (
    <div
      className="flex h-[108px] w-[160px] shrink-0 items-center justify-center"
      style={{
        borderRadius: 'var(--yb-radius-8, 8px)',
        background: 'rgb(232, 239, 247)',
      }}
      aria-hidden
    >
      <IconImage style={{ fontSize: 24, color: 'var(--color-text-4)' }} />
    </div>
  )
}

export function HorizontalCardListPage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [channel, setChannel] = useState('all' as 'all' | Channel)
  const [kind, setKind] = useState(undefined as Kind | undefined)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [refreshTick, setRefreshTick] = useState(0)

  const filtered = useMemo(() => {
    void refreshTick
    const q = keyword.trim()
    return DEMO_ROWS.filter((row) => {
      if (channel !== 'all' && row.channel !== channel) return false
      if (kind && row.kind !== kind) return false
      if (!q) return true
      return row.title.includes(q) || row.summary.includes(q) || row.tags.some((tag) => tag.includes(q))
    })
  }, [channel, keyword, kind, refreshTick])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  const goCreate = () => {
    navigate(CREATE_PATH, { state: { from: LIST_PATH } })
  }

  const goDetail = (id: string) => {
    navigate(`${LIST_PATH}/${id}`, { state: { from: LIST_PATH } })
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
            内容中心
          </Typography.Title>
        </div>
      </div>
      <Divider style={{ margin: 0 }} />
      <div
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto bg-[color:var(--color-bg-2)]"
        style={{ padding: 24, boxSizing: 'border-box' }}
      >
        <div className="flex shrink-0 min-w-0 flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <SearchWithRefresh
              placeholder="搜索标题、摘要或标签"
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
            <Radio.Group
              type="button"
              className="yb-radio-button-group"
              value={channel}
              onChange={(value: 'all' | Channel) => {
                setChannel(value)
                setPage(1)
              }}
            >
              <Radio value="all">全部</Radio>
              {CHANNEL_OPTIONS.map((opt) => (
                <Radio key={opt.value} value={opt.value}>
                  {opt.label}
                </Radio>
              ))}
            </Radio.Group>
            <Button
              type="secondary"
              style={{ height: 32 }}
              icon={advancedOpen ? <IconUp /> : <IconDown />}
              onClick={() => setAdvancedOpen((open) => !open)}
            >
              高级筛选
            </Button>
          </div>
          <Button
            type="primary"
            icon={<IconPlus />}
            style={{ height: 32, paddingLeft: 16, paddingRight: 16 }}
            onClick={goCreate}
          >
            创建内容
          </Button>
        </div>
        {advancedOpen ? (
          <div className="flex shrink-0 min-w-0 flex-wrap items-center gap-2">
            <Select
              placeholder="内容类型"
              allowClear
              value={kind}
              onChange={(value: Kind | undefined) => {
                setKind(value)
                setPage(1)
              }}
              style={{ width: FORM_CTRL_W_160 }}
            >
              {KIND_OPTIONS.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        ) : null}
        {paged.length === 0 ? (
          <PageLevelEmpty layout="inline" description="暂无内容" />
        ) : (
          <div className="flex flex-col gap-4">
            {paged.map((row) => (
              <ContentCard key={row.id} row={row} onOpen={() => goDetail(row.id)} />
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

function ContentCard({ row, onOpen }: { row: Row; onOpen: () => void }) {
  return (
    <Card
      bordered={false}
      className="yb-list-card shrink-0"
      bodyStyle={{ padding: 24 }}
      tabIndex={0}
      aria-label={row.title}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
    >
      <div className="flex min-w-0 items-stretch gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {row.tags.map((tag) => (
              <Tag key={tag} bordered={false} color={tag === CHANNEL_LABEL[row.channel] ? 'arcoblue' : undefined}>
                {tag}
              </Tag>
            ))}
          </div>
          <Typography.Text
            className="min-w-0 truncate"
            style={{ fontSize: 16, lineHeight: '24px', fontWeight: 500, color: 'var(--color-text-1)' }}
          >
            {row.title}
          </Typography.Text>
          <Typography.Text
            className="line-clamp-2"
            style={{ fontSize: 14, lineHeight: '22px', color: 'var(--color-text-3)' }}
          >
            {row.summary}
          </Typography.Text>
          <div className="mt-auto pt-1">
            <span className="text-[12px] leading-[18px] text-[color:var(--color-text-3)]">
              {row.author} · {row.publishedAt}
            </span>
          </div>
        </div>
        <CoverPlaceholder />
      </div>
    </Card>
  )
}
