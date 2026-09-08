import { useState } from 'react'
import { Button, Form, Input, Pagination, Radio, Table } from '@arco-design/web-react'
import { IconDown, IconRight, IconUp } from '@arco-design/web-react/icon'
import {
  FORM_CTRL_W_160,
  FORM_PAGE_ARCO_CLASS,
  FORM_PAGE_FORM_STYLE,
  FORM_PAGE_LABEL_COL,
  FORM_PAGE_WRAPPER_COL,
} from '../patterns/formPageLayout'
import {
  DEV_TASK_IDE_ROOT_CLASS,
  DEV_TASK_VERSION_TABLE_MIN_WIDTH_PX,
} from '../patterns/devTaskIdePage'
import { LIST_TABLE_NO_DATA_ELEMENT } from '../patterns/listTableNoDataElement'

/**
 * IDE 型三栏页。规范：`references/ide-page.md`。
 *
 * 相对导入已对齐落地路径：复制到 `src/{feature}/` 后不必改 import。
 *
 * 只换：顶栏文案、编辑器内容、右栏字段 / 版本表。根节点必须同时挂 `dev-task-detail` + `dev-task-ide-root`。
 * 尺寸走 `devTaskIdePage.ts` / CSS 变量，不要手写 400 / 40 / 48 / 240。中缝保持 1px `--yb-border-2`。
 */

type SideTab = 'config' | 'version'

const DEMO_JSON = `{
  "job": {
    "content": [{ "reader": { "name": "mysqlreader" } }],
    "setting": { "speed": { "channel": 4 } }
  }
}`

const VERSION_ROWS = [
  { id: 'v3', version: 'v3', note: '当前版本', publishedAt: '2026-09-01 09:00:00' },
  { id: 'v2', version: 'v2', note: '增加重试', publishedAt: '2026-08-12 14:20:00' },
]

export function BasicIdePage() {
  const [resultExpanded, setResultExpanded] = useState(true)
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const [sideTab, setSideTab] = useState('config' as SideTab)
  const [page, setPage] = useState(1)

  const openRight = (tab: SideTab) => {
    setSideTab(tab)
    setRightCollapsed(false)
  }

  return (
    <div className={`dev-task-detail ${DEV_TASK_IDE_ROOT_CLASS} flex h-full min-h-0 flex-col overflow-hidden`}>
      <div className="dev-task-detail__top shrink-0">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="dev-task-detail__title truncate">订单同步任务</span>
          <span className="dev-task-detail__status">运行中</span>
        </div>
        <div className="ml-auto flex items-center">
          <Button type="primary" className="dev-task-detail__config-btn">
            运行
          </Button>
        </div>
      </div>
      <div className="dev-task-detail__body flex min-h-0 flex-1 overflow-hidden">
        <div className="dev-task-detail__split overflow-hidden">
          <div
            className={[
              'dev-task-detail__editor',
              resultExpanded
                ? 'dev-task-detail__editor--result-expanded'
                : 'dev-task-detail__editor--result-collapsed',
            ].join(' ')}
          >
            <div className="dev-task-detail__editor-surface">
              <pre className="dev-task-ide__code h-full min-h-0 overflow-auto p-4 text-[12px] leading-[20px]">
                {DEMO_JSON}
              </pre>
            </div>
            <div
              className={[
                'dev-task-editor-result',
                resultExpanded ? '' : 'dev-task-editor-result--collapsed',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="dev-task-editor-result__header">
                <span className="dev-task-editor-result__title">运行结果</span>
                <Button
                  type="text"
                  className="dev-task-editor-result__toggle"
                  icon={resultExpanded ? <IconDown /> : <IconUp />}
                  aria-label={resultExpanded ? '收起运行结果' : '展开运行结果'}
                  onClick={() => setResultExpanded((open: boolean) => !open)}
                />
              </div>
              {resultExpanded ? (
                <div className="dev-task-editor-result__body text-[12px] leading-[18px] text-[color:var(--color-text-2)]">
                  演示环境：尚无运行日志
                </div>
              ) : null}
            </div>
          </div>
          <div className="dev-task-detail__split-divider" />
          <div
            className={['dev-task-detail__right', rightCollapsed ? 'dev-task-detail__right--collapsed' : '']
              .filter(Boolean)
              .join(' ')}
          >
            <div className="dev-task-detail__right-inner">
              <div className="dev-task-detail__panel">
                <div className="dev-task-detail__panel-head">
                  <span className="dev-task-detail__panel-head-title">
                    {sideTab === 'config' ? '调度运行' : '版本'}
                  </span>
                  <Button
                    type="text"
                    className="dev-task-detail__panel-collapse"
                    icon={<IconRight />}
                    aria-label="收起配置面板"
                    onClick={() => setRightCollapsed(true)}
                  />
                </div>
                <div className="dev-task-detail__panel-body">
                  {sideTab === 'config' ? (
                    <Form
                      className={`${FORM_PAGE_ARCO_CLASS} dev-task-schedule-run-form`}
                      layout="horizontal"
                      labelAlign="left"
                      labelCol={FORM_PAGE_LABEL_COL}
                      wrapperCol={FORM_PAGE_WRAPPER_COL}
                      style={FORM_PAGE_FORM_STYLE}
                      initialValues={{ cycle: 'day', timeout: 30 }}
                    >
                      <Form.Item label="调度周期" field="cycle">
                        <Radio.Group type="button" className="yb-radio-button-group">
                          <Radio value="day">天</Radio>
                          <Radio value="hour">小时</Radio>
                          <Radio value="week">周</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item label="超时(分)" field="timeout">
                        <Input style={{ width: FORM_CTRL_W_160 }} />
                      </Form.Item>
                    </Form>
                  ) : (
                    <div className="min-w-0 overflow-x-auto">
                      <Table
                        className="service-manage-table service-manage-list-table--row48-flex dev-task-version-table"
                        border={false}
                        pagination={false}
                        rowKey="id"
                        noDataElement={LIST_TABLE_NO_DATA_ELEMENT}
                        scroll={{ x: DEV_TASK_VERSION_TABLE_MIN_WIDTH_PX }}
                        columns={[
                          { title: '版本', dataIndex: 'version', width: 120 },
                          { title: '说明', dataIndex: 'note' },
                          { title: '发布时间', dataIndex: 'publishedAt', width: 200 },
                        ]}
                        data={VERSION_ROWS}
                      />
                      <div className="mt-4 flex shrink-0 items-center justify-between">
                        <span className="text-[12px] leading-[18px] text-[color:var(--yb-text-2)]">
                          共 {VERSION_ROWS.length} 条
                        </span>
                        <Pagination
                          current={page}
                          pageSize={10}
                          total={VERSION_ROWS.length}
                          showTotal={false}
                          showJumper
                          sizeCanChange
                          pageSizeChangeResetCurrent
                          onChange={(next: number) => setPage(next)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="dev-task-detail__side-tabs">
                <button
                  type="button"
                  className={[
                    'dev-task-detail__side-tab',
                    sideTab === 'config' && !rightCollapsed ? 'dev-task-detail__side-tab--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => openRight('config')}
                >
                  配置
                </button>
                <button
                  type="button"
                  className={[
                    'dev-task-detail__side-tab',
                    sideTab === 'version' && !rightCollapsed ? 'dev-task-detail__side-tab--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => openRight('version')}
                >
                  版本
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
