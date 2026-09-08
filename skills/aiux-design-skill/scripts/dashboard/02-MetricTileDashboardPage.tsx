import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Divider, Pagination, Table, Tooltip, Typography } from '@arco-design/web-react'
import {
  IconDashboard,
  IconInfoCircle,
  IconStorage,
  IconSwap,
  IconThunderbolt,
} from '@arco-design/web-react/icon'
import type { ReactNode } from 'react'
import { LIST_DEFAULT_PAGE_SIZE } from '../patterns/listPageLayout'
import { LIST_TABLE_NO_DATA_ELEMENT } from '../patterns/listTableNoDataElement'

/**
 * 指标磁贴看板。规范：`references/dashboard-page.md` §3。
 *
 * 相对导入已对齐落地路径：复制到 `src/{feature}/` 后不必改 import。
 *
 * 只换：磁贴名称 / 单位 / 色 / 图标、读数接口、明细表列。保留白底页头 + Divider、`yb-content-card shrink-0`、根 `min-h-full`、左右分栏、空值「—」、tooltip `borderWidth: 0`。
 * 需要 `echarts`（`npm install echarts`）。不要铺 `--yb-fill-2`，不要整页 Search + 主表。
 * 磁盘空值、网络失败是演示独立读数，落地时换成真实接口。
 */

const SPARK_H = 88
const EMPTY = '—'

/** 同一页多图共用。禁止再写 borderWidth: 1 或 extraCssText 灰框。 */
export const DASHBOARD_ECHARTS_TOOLTIP = {
  trigger: 'axis' as const,
  borderWidth: 0,
}

type TileId = 'cpu' | 'memory' | 'disk' | 'network'

type TileDef = {
  id: TileId
  label: string
  unit: string
  colorCss: string
  colorFallback: string
  tintCss: string
  icon: ReactNode
}

const TILES: TileDef[] = [
  {
    id: 'cpu',
    label: 'CPU 使用率',
    unit: '%',
    colorCss: 'rgb(var(--primary-6))',
    colorFallback: '#184ff2',
    tintCss: 'rgb(var(--primary-1))',
    icon: <IconThunderbolt />,
  },
  {
    id: 'memory',
    label: '内存使用率',
    unit: '%',
    colorCss: 'rgb(var(--warning-6))',
    colorFallback: '#ff7d00',
    tintCss: 'rgb(var(--warning-1))',
    icon: <IconDashboard />,
  },
  {
    id: 'disk',
    label: '磁盘使用率',
    unit: '%',
    colorCss: 'rgb(var(--success-6))',
    colorFallback: '#00b42a',
    tintCss: 'rgb(var(--success-1))',
    icon: <IconStorage />,
  },
  {
    id: 'network',
    label: '网络吞吐',
    unit: 'MB/s',
    colorCss: 'rgb(var(--purple-6))',
    colorFallback: '#722ed1',
    tintCss: 'rgb(var(--purple-1))',
    icon: <IconSwap />,
  },
]

const HOST_ROWS = [
  { id: 'h1', name: 'ds-prod-01', cpu: '41.2%', memory: '66.0%', disk: '71.4%', network: '128 MB/s' },
  { id: 'h2', name: 'ds-prod-02', cpu: '38.7%', memory: '54.2%', disk: EMPTY, network: '96 MB/s' },
  { id: 'h3', name: 'etl-batch-01', cpu: '29.4%', memory: '48.6%', disk: '58.2%', network: EMPTY },
]

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function formatClock(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

function wave(base: number, length: number, seed: number) {
  return Array.from({ length }, (_, index) => {
    const next = base + Math.sin((index + seed) / 3) * (base * 0.08) + ((index + seed) % 5) - 2
    return Math.max(1, Math.round(next * 10) / 10)
  })
}

function formatValue(value: number | null, unit: string) {
  if (value == null) return EMPTY
  if (unit === 'MB/s') return String(Math.round(value))
  return value.toFixed(1)
}

/** 每项独立请求。磁盘演示空值；网络首次失败，重试后恢复。 */
function fetchTile(id: TileId, attempt: number) {
  const delay = id === 'cpu' ? 220 : id === 'memory' ? 360 : id === 'disk' ? 280 : 420
  return new Promise<{ value: number | null; points: number[] }>((resolve, reject) => {
    window.setTimeout(() => {
      if (id === 'disk') {
        resolve({ value: null, points: [] })
        return
      }
      if (id === 'network' && attempt === 0) {
        reject(new Error('metric-read-failed'))
        return
      }
      const points = id === 'cpu' ? wave(42.6, 24, 2) : id === 'memory' ? wave(68.1, 24, 5) : wave(128, 24, 8)
      const value = id === 'network' ? Math.round(points[points.length - 1]) : points[points.length - 1]
      resolve({ value, points })
    }, delay)
  })
}

function resolveThemeColor(cssColor: string, fallback: string) {
  if (typeof document === 'undefined') return fallback
  const probe = document.createElement('span')
  probe.style.color = cssColor
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  document.body.appendChild(probe)
  const resolved = getComputedStyle(probe).color
  document.body.removeChild(probe)
  return resolved && resolved !== '' ? resolved : fallback
}

function withAlpha(color: string, alpha: number) {
  const match = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (!match) return color
  return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`
}

type EChartsInstance = {
  setOption: (opt: unknown, notMerge?: boolean) => void
  resize: () => void
  dispose: () => void
}

type EChartsLite = {
  init?: (el: HTMLElement, theme?: unknown, opts?: { renderer?: string }) => EChartsInstance
}

function MiniTrendChart({ points, colorCss, colorFallback }: { points: number[]; colorCss: string; colorFallback: string }) {
  const elRef = useRef(null as HTMLDivElement | null)
  const option = useMemo(() => {
    const color = resolveThemeColor(colorCss, colorFallback)
    return {
      animation: false,
      tooltip: DASHBOARD_ECHARTS_TOOLTIP,
      grid: { left: 0, right: 4, top: 8, bottom: 0 },
      xAxis: { type: 'category', boundaryGap: false, show: false, data: points.map((_, index) => String(index)) },
      yAxis: { type: 'value', show: false, min: 'dataMin', max: 'dataMax' },
      series: [
        {
          type: 'line',
          data: points,
          smooth: true,
          symbol: 'none',
          lineStyle: { color, width: 2 },
          itemStyle: { color },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: withAlpha(color, 0.28) },
                { offset: 1, color: withAlpha(color, 0.02) },
              ],
            },
          },
        },
      ],
    }
  }, [colorCss, colorFallback, points])

  useEffect(() => {
    let chart: EChartsInstance | undefined
    let cancelled = false
    void import('echarts').then((mod: EChartsLite & { default?: EChartsLite }) => {
      const api = mod.init ? mod : mod.default
      if (cancelled || !api?.init || !elRef.current) return
      chart = api.init(elRef.current, undefined, { renderer: 'canvas' })
      chart.setOption(option, true)
    })
    const onResize = () => chart?.resize()
    window.addEventListener('resize', onResize)
    return () => {
      cancelled = true
      window.removeEventListener('resize', onResize)
      chart?.dispose()
    }
  }, [option])

  return <div ref={elRef} className="h-full w-full" />
}

type TileStatus = 'loading' | 'ok' | 'empty' | 'error'

function MetricTileCard({ def }: { def: TileDef }) {
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState('loading' as TileStatus)
  const [value, setValue] = useState(null as number | null)
  const [points, setPoints] = useState([] as number[])
  const [updatedAt, setUpdatedAt] = useState(null as string | null)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setValue(null)
    setPoints([])
    setUpdatedAt(null)
    void fetchTile(def.id, attempt)
      .then((next) => {
        if (cancelled) return
        setUpdatedAt(formatClock(new Date()))
        if (next.value == null) {
          setStatus('empty')
          return
        }
        setValue(next.value)
        setPoints(next.points)
        setStatus('ok')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [attempt, def.id])

  const stamp = updatedAt ? `更新 ${updatedAt}` : '\u00a0'

  return (
    <Card bordered={false} className="yb-content-card shrink-0">
      <div className="flex min-h-[108px] min-w-0 items-stretch gap-3">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-7 min-w-0 items-center gap-2">
            <span
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center text-[16px]"
              style={{
                borderRadius: 'var(--yb-radius-4, 4px)',
                background: def.tintCss,
                color: def.colorCss,
              }}
            >
              {def.icon}
            </span>
            <Typography.Text
              className="min-w-0 flex-1 truncate"
              style={{ fontSize: 14, lineHeight: '22px', color: 'var(--color-text-2)' }}
            >
              {def.label}
            </Typography.Text>
          </div>
          <div className="mt-2 flex h-8 min-w-0 items-baseline gap-1">
            <span className="truncate text-[24px] font-semibold leading-[32px] tabular-nums text-[color:var(--color-text-1)]">
              {formatValue(value, def.unit)}
            </span>
            <span className="shrink-0 text-[14px] leading-[22px] text-[color:var(--color-text-3)]">{def.unit}</span>
          </div>
          <div className="mt-auto pt-2 text-[12px] leading-[18px] text-[color:var(--color-text-3)]">{stamp}</div>
        </div>
        <div className="w-[40%] shrink-0" style={{ height: SPARK_H }}>
          {status === 'error' ? (
            <div className="flex h-full flex-col justify-center gap-1">
              <Typography.Text style={{ fontSize: 12, lineHeight: '18px', color: 'var(--color-text-3)' }}>
                读取失败，不影响其他指标
              </Typography.Text>
              <Button type="text" size="mini" className="self-start px-0" onClick={() => setAttempt((n) => n + 1)}>
                重试
              </Button>
            </div>
          ) : status === 'ok' && points.length > 0 ? (
            <MiniTrendChart points={points} colorCss={def.colorCss} colorFallback={def.colorFallback} />
          ) : null}
        </div>
      </div>
    </Card>
  )
}

export function MetricTileDashboardPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(LIST_DEFAULT_PAGE_SIZE)
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return HOST_ROWS.slice(start, start + pageSize)
  }, [page, pageSize])

  return (
    <div className="flex min-h-full flex-col bg-[color:var(--color-bg-2)]">
      <div className="shrink-0 bg-[color:var(--color-bg-2)]" style={{ padding: 24, boxSizing: 'border-box' }}>
        <Typography.Title
          heading={5}
          className="min-w-0 truncate"
          style={{ margin: 0, fontSize: 20, lineHeight: '30px', fontWeight: 600, color: 'var(--color-text-1)' }}
        >
          基础设施监控概览
        </Typography.Title>
        <Typography.Text style={{ fontSize: 14, lineHeight: '22px', color: 'var(--color-text-3)' }}>
          面向全天值班，指标按分钟采集
        </Typography.Text>
      </div>
      <Divider style={{ margin: 0 }} />
      <div className="flex-1 bg-[color:var(--color-bg-2)]" style={{ padding: 24, boxSizing: 'border-box' }}>
        <div className="flex flex-col gap-4">
          <div className="flex min-w-0 items-center gap-1">
            <Typography.Text style={{ fontSize: 14, lineHeight: '22px', fontWeight: 600, color: 'var(--color-text-1)' }}>
              资源指标
            </Typography.Text>
            <Tooltip content="各项独立采集。暂无数据为横线，单卡失败可在该块重试，不影响其他指标。">
              <IconInfoCircle className="text-[color:var(--color-text-3)]" />
            </Tooltip>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {TILES.map((def) => (
              <MetricTileCard key={def.id} def={def} />
            ))}
          </div>

          <Card bordered={false} className="yb-content-card shrink-0">
            <div className="mb-4 text-[14px] font-semibold leading-[22px] text-[color:var(--color-text-1)]">
              主机资源明细
            </div>
            <div className="min-w-0 overflow-x-auto">
              <Table
                className="service-manage-table service-manage-list-table--row48-flex"
                border={false}
                pagination={false}
                rowKey="id"
                noDataElement={LIST_TABLE_NO_DATA_ELEMENT}
                columns={[
                  { title: '主机', dataIndex: 'name' },
                  { title: 'CPU', dataIndex: 'cpu', width: 120 },
                  { title: '内存', dataIndex: 'memory', width: 120 },
                  { title: '磁盘', dataIndex: 'disk', width: 120 },
                  { title: '网络', dataIndex: 'network', width: 140 },
                ]}
                data={paged}
              />
            </div>
            <div className="mt-4 flex shrink-0 items-center justify-between">
              <span className="text-[12px] leading-[18px] text-[color:var(--yb-text-2)]">共 {HOST_ROWS.length} 条</span>
              <Pagination
                current={page}
                pageSize={pageSize}
                total={HOST_ROWS.length}
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
