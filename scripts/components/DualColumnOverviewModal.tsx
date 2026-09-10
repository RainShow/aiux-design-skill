import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { IconClose } from '@arco-design/web-react/icon'
import {
  NAV_OVERVIEW_DESC,
  NAV_OVERVIEW_DESC_MAX_W_PX,
  NAV_OVERVIEW_ICON_PX,
  NAV_OVERVIEW_MASK_BG,
  NAV_OVERVIEW_PANEL_STYLE,
  NAV_OVERVIEW_SECTION_GAP_PX,
  NAV_OVERVIEW_TEXT,
  NAV_OVERVIEW_TITLE_COL_W_PX,
  NAV_OVERVIEW_Z_MASK,
  NAV_OVERVIEW_Z_PANEL,
} from '../patterns/navShellLayout'
import { MaskIcon } from './MaskIcon'
import type {
  DualColumnNavConfig,
  DualOverviewBlockConfig,
  DualOverviewLink,
  DualRailItem,
  DualSecondSection,
} from './types'

const overviewLinkButtonClass = [
  'side-nav-overview-link',
  'min-w-0 flex-1 cursor-pointer border-0 bg-transparent p-0 text-left font-normal outline-none',
  'text-[14px] leading-[22px]',
  'transition-colors duration-150',
  'focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-6))] focus-visible:ring-offset-1',
].join(' ')

export type DualColumnOverviewModalProps = {
  visible: boolean
  onClose: () => void
  /** 面板标题；优先于 `config.overview.title` */
  title: string
  config: DualColumnNavConfig
}

type OverviewBlock = {
  key: string
  label: string
  iconSrc: string
  description: string
  links: DualOverviewLink[]
}

function collectPanelLinks(sections: DualSecondSection[] | undefined): DualOverviewLink[] {
  if (!sections?.length) return []
  const links: DualOverviewLink[] = []
  for (const section of sections) {
    if (section.type === 'item') links.push({ label: section.label, path: section.path })
    else {
      for (const child of section.children) {
        links.push({ label: child.label, path: child.path })
      }
    }
  }
  return links
}

function resolveBlock(
  spec: DualOverviewBlockConfig,
  railByKey: Map<string, DualRailItem>,
  panels: DualColumnNavConfig['panels'],
): OverviewBlock | null {
  const rail = railByKey.get(spec.railKey)
  if (!rail) return null
  const links = spec.links?.length ? spec.links : collectPanelLinks(panels[spec.railKey])
  if (!links.length) return null
  return {
    key: spec.railKey,
    label: spec.label ?? rail.label,
    iconSrc: rail.iconSrc,
    description: spec.description,
    links,
  }
}

/**
 * 组装功能全景分区：优先 `overview.blocks`（含简介）；否则按轨 + panels 自动抽出。
 */
export function buildDualOverviewBlocks(config: DualColumnNavConfig): OverviewBlock[] {
  const homeKey = config.homeKey ?? 'home'
  const railByKey = new Map(config.rail.map((item) => [item.key, item]))
  const specs = config.overview?.blocks
  if (specs?.length) {
    return specs
      .map((spec) => resolveBlock(spec, railByKey, config.panels))
      .filter((block): block is OverviewBlock => block != null)
  }
  return config.rail
    .filter((item) => item.key !== homeKey)
    .map((item) => ({
      key: item.key,
      label: item.label,
      iconSrc: item.iconSrc,
      description: '',
      links: collectPanelLinks(config.panels[item.key]),
    }))
    .filter((block) => block.links.length > 0)
}

function chunkPairs<T>(items: T[]): [T, T | undefined][] {
  const rows: [T, T | undefined][] = []
  for (let i = 0; i < items.length; i += 2) {
    rows.push([items[i], items[i + 1]])
  }
  return rows
}

/**
 * 双列侧导「功能全景」浮层。
 * 交互与视觉对齐 Figma modal_menu（575:36599）：
 * 遮罩 + Esc 关闭、400 宽贴左上、高度铺满窗口（顶底各 10）、分区图标/简介/两列叶子、悬停才出滚动条。
 * 文案与 path 由 `config.dual.overview` 注入，不写死产品线。
 */
export function DualColumnOverviewModal({
  visible,
  onClose,
  title,
  config,
}: DualColumnOverviewModalProps) {
  const navigate = useNavigate()
  const blocks = useMemo(() => buildDualOverviewBlocks(config), [config])
  const heading = config.overview?.title ?? title

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, onClose])

  useEffect(() => {
    if (!visible) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [visible])

  if (!visible) return null

  const panel = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dual-nav-overview-title"
      className="side-nav-overview-panel fixed flex flex-col overflow-hidden bg-[color:var(--yb-bg-1)]"
      style={{
        ...NAV_OVERVIEW_PANEL_STYLE,
        zIndex: NAV_OVERVIEW_Z_PANEL,
      }}
    >
      <div
        className="flex shrink-0 items-center justify-between gap-2"
        style={{ padding: '20px 24px' }}
      >
        <h2
          id="dual-nav-overview-title"
          className="m-0 whitespace-nowrap font-semibold not-italic"
          style={{
            fontSize: 20,
            lineHeight: '30px',
            color: 'var(--yb-text-1)',
            fontFamily: 'var(--yb-font-family)',
          }}
        >
          {heading}
        </h2>
        <button
          type="button"
          className="inline-flex shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-6))] focus-visible:ring-offset-2"
          style={{ width: 16, height: 16, color: NAV_OVERVIEW_TEXT }}
          aria-label="关闭功能全景"
          onClick={onClose}
        >
          <IconClose style={{ fontSize: 16 }} />
        </button>
      </div>

      <div
        className="side-nav-overview-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
        style={{ padding: '16px 24px' }}
      >
        <div className="flex flex-col" style={{ gap: NAV_OVERVIEW_SECTION_GAP_PX }}>
          {blocks.map((block) => (
            <div key={block.key} className="flex flex-col" style={{ gap: NAV_OVERVIEW_SECTION_GAP_PX }}>
              <div className="flex items-start gap-2">
                <div className="flex w-[22px] shrink-0 justify-center pt-px">
                  <MaskIcon src={block.iconSrc} color={NAV_OVERVIEW_TEXT} size={NAV_OVERVIEW_ICON_PX} />
                </div>
                <div
                  className="min-w-0 flex-1"
                  style={{ width: NAV_OVERVIEW_TITLE_COL_W_PX, maxWidth: '100%' }}
                >
                  <h3
                    className="m-0 font-semibold not-italic"
                    style={{
                      fontSize: 14,
                      lineHeight: '22px',
                      color: NAV_OVERVIEW_TEXT,
                      fontFamily: 'var(--yb-font-family)',
                    }}
                  >
                    {block.label}
                  </h3>
                  {block.description ? (
                    <p
                      className="mb-0 font-normal not-italic"
                      style={{
                        marginTop: 4,
                        fontSize: 12,
                        lineHeight: '18px',
                        color: NAV_OVERVIEW_DESC,
                        fontFamily: 'var(--yb-font-family)',
                        maxWidth: NAV_OVERVIEW_DESC_MAX_W_PX,
                      }}
                    >
                      {block.description}
                    </p>
                  ) : null}
                </div>
              </div>

              {chunkPairs(block.links).map((pair, rowIdx) => {
                const [first, second] = pair
                return (
                <div key={`${block.key}-row-${rowIdx}`} className="flex w-full items-start gap-2">
                  <div className="w-[22px] shrink-0" aria-hidden />
                  <button
                    type="button"
                    className={overviewLinkButtonClass}
                    onClick={() => {
                      navigate(first.path)
                      onClose()
                    }}
                  >
                    {first.label}
                  </button>
                  {second ? (
                    <button
                      type="button"
                      className={overviewLinkButtonClass}
                      onClick={() => {
                        navigate(second.path)
                        onClose()
                      }}
                    >
                      {second.label}
                    </button>
                  ) : (
                    <div className="min-w-0 flex-1" aria-hidden />
                  )}
                </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return createPortal(
    <>
      <button
        type="button"
        className="fixed inset-0 cursor-default border-0 p-0"
        style={{ zIndex: NAV_OVERVIEW_Z_MASK, backgroundColor: NAV_OVERVIEW_MASK_BG }}
        aria-label="关闭功能全景"
        onClick={onClose}
      />
      {panel}
    </>,
    document.body,
  )
}
