import { useEffect, useRef, useState } from 'react'
import { Card, DatePicker, Divider, Pagination, Radio, Select, Table, Tooltip, Typography } from '@arco-design/web-react'
import { IconInfoCircle } from '@arco-design/web-react/icon'
import { ListToolbarRefreshButton } from '../components/SearchBox'
import { FORM_CTRL_W_160, formCtrlWidth } from '../patterns/formPageLayout'
import { LIST_DEFAULT_PAGE_SIZE } from '../patterns/listPageLayout'
import { LIST_TABLE_NO_DATA_ELEMENT } from '../patterns/listTableNoDataElement'
import { globalMessage } from '../patterns/globalMessage'

/**
 * 看板总览。规范：`references/dashboard-page.md` §2。
 *
 * 相对导入已对齐落地路径：复制到 `src/{feature}/` 后不必改 import。
 *
 * 只换：KPI、图表 option、TOP 表列。保留白底页头 + Divider、`yb-content-card shrink-0`、根 `min-h-full`、tooltip `borderWidth: 0`。
 * 需要 `echarts`（`npm install echarts`）。不要铺 `--yb-fill-2`，不要整页 Search + 主表。
 * 不要把 CSS 变量写进 ECharts option。
 */

const RangePicker = DatePicker.RangePicker

/** 同一页多图共用。禁止再写 borderWidth: 1 或 extraCssText 灰框。 */
export const DASHBOARD_ECHARTS_TOOLTIP = {
  trigger: 'axis' as const,
  borderWidth: 0,
}

const KPIS = [
  { label: '总数', value: 128 },
  { label: '运行中', value: 12 },
  { label: '成功', value: 96 },
  { label: '失败', value: 8 },
  { label: '待运行', value: 7 },
  { label: '已终止', value: 5 },
]

const TASK_TYPE_OPTIONS = [
  { label: '离线任务', value: 'offline' },
  { label: '实时任务', value: 'realtime' },
]

const TOP_ROWS = [
  { id: '1', name: '订单日批', duration: '12 min', status: '成功' },
  { id: '2', name: '用户同步', duration: '8 min', status: '运行中' },
  { id: '3', name: '账单导出', duration: '21 min', status: '失败' },
]

const CHART_OPTION = {
  tooltip: DASHBOARD_ECHARTS_TOOLTIP,
  grid: { left: 40, right: 16, top: 24, bottom: 32 },
  xAxis: {
    type: 'category',
    data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    boundaryGap: false,
    axisTick: { show: false },
    axisLine: { lineStyle: { color: '#dfe2eb' } },
    axisLabel: { color: '#646c85', fontSize: 12 },
  },
  yAxis: {
    type: 'value',
    axisTick: { show: false },
    axisLine: { show: false },
    axisLabel: { color: '#646c85', fontSize: 12 },
    splitLine: { lineStyle: { color: '#dfe2eb', type: 'dashed' } },
  },
  series: [
    {
      name: '成功',
      type: 'line',
      data: [12, 18, 24, 32, 28, 20],
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2, color: '#184ff2' },
    },
  ],
}

type EChartsInstance = {
  setOption: (opt: unknown) => void
  resize: () => void
  dispose: () => void
}

type EChartsLite = {
  init?: (el: HTMLElement) => EChartsInstance
}

function TrendChart() {
  const elRef = useRef(null as HTMLDivElement | null)

  useEffect(() => {
    let chart: EChartsInstance | undefined
    let cancelled = false

    void import('echarts').then((mod: EChartsLite & { default?: EChartsLite }) => {
      const api = mod.init ? mod : mod.default
      if (cancelled || !api?.init || !elRef.current) return
      chart = api.init(elRef.current)
      chart.setOption(CHART_OPTION)
    })

    const onResize = () => chart?.resize()
    window.addEventListener('resize', onResize)
    return () => {
      cancelled = true
      window.removeEventListener('resize', onResize)
      chart?.dispose()
    }
  }, [])

  return <div ref={elRef} className="h-[240px] w-full" />
}

export function BasicDashboardPage() {
  const [dayScope, setDayScope] = useState('today')
  const [taskType, setTaskType] = useState(undefined as string | undefined)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(LIST_DEFAULT_PAGE_SIZE)

  const onRefresh = () => {
    globalMessage.ok('刷新')
  }

  return (
    <div className="flex min-h-full flex-col bg-[color:var(--color-bg-2)]">
      <div className="shrink-0 bg-[color:var(--color-bg-2)]" style={{ padding: 24, boxSizing: 'border-box' }}>
        <Typography.Title
          heading={5}
          className="min-w-0 truncate"
          style={{ margin: 0, fontSize: 20, lineHeight: '30px', fontWeight: 600, color: 'var(--color-text-1)' }}
        >
          运维总览
        </Typography.Title>
      </div>
      <Divider style={{ margin: 0 }} />
      <div className="flex-1 bg-[color:var(--color-bg-2)]" style={{ padding: 24, boxSizing: 'border-box' }}>
        <div className="flex flex-col gap-4">
          <Card bordered={false} className="yb-content-card shrink-0">
            <div className="flex flex-col gap-4">
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-1">
                  <Typography.Text style={{ fontSize: 14, lineHeight: '22px', fontWeight: 600, color: 'var(--color-text-1)' }}>
                    任务实例状态
                  </Typography.Text>
                  <Tooltip content="按所选时间范围统计实例数">
                    <IconInfoCircle className="text-[color:var(--color-text-3)]" />
                  </Tooltip>
                  <Typography.Text style={{ fontSize: 12, lineHeight: '18px', color: 'var(--color-text-3)' }}>
                    今日 00:00 更新
                  </Typography.Text>
                </div>
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <Radio.Group
                    type="button"
                    className="yb-radio-button-group"
                    value={dayScope}
                    onChange={setDayScope}
                  >
                    <Radio value="today">今日</Radio>
                    <Radio value="yesterday">昨日</Radio>
                  </Radio.Group>
                  <RangePicker style={{ width: formCtrlWidth(4) }} />
                  <Select
                    placeholder="选择任务类型"
                    allowClear
                    value={taskType}
                    onChange={setTaskType}
                    style={{ width: FORM_CTRL_W_160 }}
                  >
                    {TASK_TYPE_OPTIONS.map((opt) => (
                      <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Select.Option>
                    ))}
                  </Select>
                  <ListToolbarRefreshButton onClick={onRefresh} />
                </div>
              </div>
              <div className="flex min-w-0">
                {KPIS.map((item, index) => (
                  <div
                    key={item.label}
                    className={[
                      'min-w-0 flex-1 px-4',
                      index < KPIS.length - 1 ? 'border-r border-solid border-[color:var(--yb-border-2)]' : '',
                    ].join(' ')}
                  >
                    <div className="text-[12px] leading-[18px] text-[color:var(--color-text-3)]">{item.label}</div>
                    <div className="mt-1 text-[24px] font-semibold leading-[32px] text-[color:var(--color-text-1)]">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card bordered={false} className="yb-content-card shrink-0">
            <div className="mb-4 text-[14px] font-semibold leading-[22px] text-[color:var(--color-text-1)]">
              成功趋势
            </div>
            <TrendChart />
          </Card>

          <Card bordered={false} className="yb-content-card shrink-0">
            <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
              <div className="text-[14px] font-semibold leading-[22px] text-[color:var(--color-text-1)]">耗时 TOP</div>
              <Radio.Group type="button" className="yb-radio-button-group" defaultValue="task">
                <Radio value="task">任务</Radio>
                <Radio value="workflow">工作流</Radio>
              </Radio.Group>
            </div>
            <div className="min-w-0 overflow-x-auto">
              <Table
                className="service-manage-table service-manage-list-table--row48-flex"
                border={false}
                pagination={false}
                rowKey="id"
                noDataElement={LIST_TABLE_NO_DATA_ELEMENT}
                columns={[
                  { title: '名称', dataIndex: 'name' },
                  { title: '耗时', dataIndex: 'duration', width: 120 },
                  { title: '状态', dataIndex: 'status', width: 120 },
                ]}
                data={TOP_ROWS}
              />
            </div>
            <div className="mt-4 flex shrink-0 items-center justify-between">
              <span className="text-[12px] leading-[18px] text-[color:var(--yb-text-2)]">共 {TOP_ROWS.length} 条</span>
              <Pagination
                current={page}
                pageSize={pageSize}
                total={TOP_ROWS.length}
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
          </Card>
        </div>
      </div>
    </div>
  )
}
