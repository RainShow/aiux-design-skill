import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Divider, Table, Tabs, Tag, Tooltip, Typography } from '@arco-design/web-react'
import { IconCopy, IconLeft } from '@arco-design/web-react/icon'
import { DetailFieldValue } from '../components/DetailFieldValue/DetailFieldValue'
import { ListTableStatusDot, STATUS_DOT_COLOR } from '../components/ListTableStatusDot'
import { PageLevelEmpty } from '../components/PageLevelEmpty'
import {
  DETAIL_PAGE_HEADER_BACK_BUTTON_STYLE,
  DETAIL_PAGE_HEADER_TITLE_STYLE,
  DETAIL_PAGE_NO_TAB_HEADER_BACK_TITLE_GAP_PX,
} from '../patterns/detailPageLayout'
import { LIST_TABLE_NO_DATA_ELEMENT } from '../patterns/listTableNoDataElement'
import { globalMessage } from '../patterns/globalMessage'

/**
 * 有主 Tab 详情（默认）。规范：`references/detail-page.md` §1。
 *
 * 相对导入已对齐落地路径：复制到 `src/{feature}/` 后不必改 import。
 *
 * 只换：LIST_PATH、字段、表格列、Tab 文案。保留 `page-header-with-tabs`、只读 FieldRow、空 Tab 的 `PageLevelEmpty`。
 * 无主 Tab 用 `02-NoTabDetailPage.tsx`（`DETAIL_PAGE_NO_TAB_HEADER_HEIGHT_PX`），不要写死 80px 叠在本页头上。
 */

const LIST_PATH = '/resources'

const DEMO = {
  name: '订单查询服务',
  status: 'running' as const,
  owner: '张三',
  createdAt: '2026-08-01 10:00:00',
  type: 'API 服务',
  remark: '面向订单域的只读查询接口，支持按单号与时间范围检索。',
  method: 'GET',
  url: 'https://example.com/api/v1/orders/query?keyword=&page=1',
}

const VERSION_ROWS = [
  { id: 'v3', version: 'v3', note: '当前版本', publishedAt: '2026-09-01 09:00:00' },
  { id: 'v2', version: 'v2', note: '增加时间筛选', publishedAt: '2026-08-12 14:20:00' },
]

function SectionTitle({ children }: { children: string }) {
  return (
    <Typography.Text
      style={{ fontSize: 16, lineHeight: '24px', fontWeight: 600, color: 'var(--color-text-1)' }}
    >
      {children}
    </Typography.Text>
  )
}

function FieldRow({ label, children }: { label: string; children: string | number | object }) {
  return (
    <div className="flex w-full min-w-0 items-start gap-4">
      <span
        className="w-[74px] shrink-0 text-[14px] leading-[22px] text-[color:var(--color-text-3)]"
      >
        {label}
      </span>
      <div className="min-w-0 flex-1 text-[14px] leading-[22px] text-[color:var(--color-text-1)]">
        {children}
      </div>
    </div>
  )
}

function CopyableUrl({ url }: { url: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      globalMessage.ok('复制')
    } catch {
      globalMessage.fail('复制')
    }
  }
  return (
    <span className="yb-invoke-url-text">
      <span style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>{url}</span>
      <span className="yb-invoke-url-copy-wrap">
        <Tooltip content="复制">
          <Button
            type="text"
            className="yb-invoke-url-copy"
            icon={<IconCopy />}
            aria-label="复制"
            onClick={() => void copy()}
          />
        </Tooltip>
      </span>
    </span>
  )
}

export function BasicDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams() as { id?: string }
  const [tab, setTab] = useState('info')

  const goList = () => {
    navigate(LIST_PATH)
  }

  const goEdit = () => {
    const detailPath = `${LIST_PATH}/${id ?? DEMO.name}`
    navigate(`${detailPath}/edit`, { state: { from: detailPath } })
  }

  return (
    <div className="service-detail-page flex h-full w-full min-h-0 flex-col" style={{ boxSizing: 'border-box' }}>
      <div className="page-header-with-tabs shrink-0 bg-[color:var(--color-bg-2)]">
        <div className="flex min-w-0 items-center justify-between gap-4">
          <div
            className="flex min-w-0 flex-1 items-center"
            style={{ gap: DETAIL_PAGE_NO_TAB_HEADER_BACK_TITLE_GAP_PX }}
          >
            <Button
              type="secondary"
              shape="square"
              icon={<IconLeft />}
              style={DETAIL_PAGE_HEADER_BACK_BUTTON_STYLE}
              aria-label="返回"
              onClick={goList}
            />
            <Typography.Title heading={5} className="min-w-0 truncate" style={DETAIL_PAGE_HEADER_TITLE_STYLE}>
              {DEMO.name}
            </Typography.Title>
            <ListTableStatusDot
              className="shrink-0"
              color={STATUS_DOT_COLOR[DEMO.status]}
              label="运行中"
            />
          </div>
          <div className="inline-flex shrink-0 items-center" style={{ gap: 8 }}>
            <Button type="secondary" onClick={goEdit}>
              编辑
            </Button>
          </div>
        </div>
        <Tabs
          type="line"
          activeTab={tab}
          onChange={setTab}
          className="service-detail-page-header-tabs data-source-manage-header-tabs"
          style={{ marginTop: 16 }}
        >
          <Tabs.TabPane key="info" title="基本信息" />
          <Tabs.TabPane key="monitor" title="调用监控" />
        </Tabs>
      </div>
      <Divider style={{ margin: 0 }} />
      {tab === 'info' ? (
        <div className="min-h-0 flex-1 overflow-auto" style={{ padding: 24, boxSizing: 'border-box' }}>
          <div className="flex w-full min-w-0 flex-col gap-6">
            <div className="flex flex-col gap-4">
              <SectionTitle>基本信息</SectionTitle>
              <div className="flex w-full min-w-0 flex-wrap gap-8 lg:flex-nowrap">
                <div className="flex min-w-[200px] flex-1 flex-col gap-4">
                  <FieldRow label="名称">
                    <DetailFieldValue>{DEMO.name}</DetailFieldValue>
                  </FieldRow>
                  <FieldRow label="类型">{DEMO.type}</FieldRow>
                </div>
                <div className="flex min-w-[200px] flex-1 flex-col gap-4">
                  <FieldRow label="负责人">{DEMO.owner}</FieldRow>
                  <FieldRow label="创建时间">{DEMO.createdAt}</FieldRow>
                </div>
                <div className="flex min-w-[200px] flex-1 flex-col gap-4">
                  <FieldRow label="说明">
                    <DetailFieldValue>{DEMO.remark}</DetailFieldValue>
                  </FieldRow>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <SectionTitle>调用地址</SectionTitle>
              <FieldRow label="地址">
                <div className="yb-invoke-url-row">
                  <Tag className="yb-method-tag" bordered={false} color="green">
                    {DEMO.method}
                  </Tag>
                  <CopyableUrl url={DEMO.url} />
                </div>
              </FieldRow>
            </div>
            <div className="flex flex-col gap-4">
              <SectionTitle>版本</SectionTitle>
              <div className="min-w-0 overflow-x-auto">
                <Table
                  className="service-detail-table"
                  border={false}
                  pagination={false}
                  rowKey="id"
                  noDataElement={LIST_TABLE_NO_DATA_ELEMENT}
                  columns={[
                    { title: '版本', dataIndex: 'version', width: 120 },
                    { title: '说明', dataIndex: 'note' },
                    { title: '发布时间', dataIndex: 'publishedAt', width: 200 },
                  ]}
                  data={VERSION_ROWS}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <PageLevelEmpty description="演示环境：调用监控暂未接入" />
        </div>
      )}
    </div>
  )
}
