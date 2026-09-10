import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button, Divider, Form, Input, Select, Typography } from '@arco-design/web-react'
import { IconLeft } from '@arco-design/web-react/icon'
import {
  FORM_PAGE_ARCO_CLASS,
  FORM_PAGE_CHROME_HEADER_HEIGHT_PX,
  FORM_PAGE_FOOTER_ACTION_BAR_HEIGHT_PX,
  FORM_PAGE_FOOTER_ACTIONS_CLASS,
  FORM_PAGE_FOOTER_BAR_CLASS,
  FORM_PAGE_FOOTER_BUTTON_STYLE,
  FORM_PAGE_FORM_STYLE,
  FORM_PAGE_HEADER_BACK_BUTTON_STYLE,
  FORM_PAGE_HEADER_BACK_TITLE_GAP_PX,
  FORM_PAGE_HEADER_TITLE_STYLE,
  FORM_PAGE_LABEL_COL,
  FORM_PAGE_WRAPPER_COL,
} from '../patterns/formPageLayout'
import { globalMessage } from '../patterns/globalMessage'

/**
 * 全页水平表单（主规范）。规范：`references/form-page.md` §1。
 *
 * 相对导入已对齐落地路径：复制到 `src/{feature}/` 后不必改 import。
 *
 * 只换：LIST_PATH、字段、initialValues、提交逻辑。保留顶栏 80 / 底栏左对齐「确定 / 取消」/ `state.from`。
 * 同前缀路由须先注册 `/create`、`/:id/edit`，再 `/:id` 详情，最后列表。
 */

const LIST_PATH = '/resources'

const TYPE_OPTIONS = [
  { label: 'API 服务', value: 'api' },
  { label: '文件任务', value: 'file' },
  { label: '数据库', value: 'db' },
] as const

const INITIAL_VALUES = {
  name: '',
  type: TYPE_OPTIONS[0].value,
  remark: '',
}

type FormValues = typeof INITIAL_VALUES

export function BasicFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams() as { id?: string }
  const isEdit = Boolean(id)
  const [form] = Form.useForm()

  const goBack = () => {
    const from = (location.state as { from?: string } | null)?.from
    navigate(from || LIST_PATH, { replace: true })
  }

  const onSubmit = async () => {
    try {
      await form.validate()
      globalMessage.ok(isEdit ? '保存' : '创建')
      goBack()
    } catch {
      /* 校验失败只红框，不弹 Message；请求失败才 fail('创建'|'保存') */
    }
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[color:var(--color-bg-2)]">
      <div
        className="flex min-w-0 shrink-0 items-center px-6"
        style={{
          height: FORM_PAGE_CHROME_HEADER_HEIGHT_PX,
          gap: FORM_PAGE_HEADER_BACK_TITLE_GAP_PX,
          boxSizing: 'border-box',
        }}
      >
        <Button
          type="secondary"
          shape="square"
          icon={<IconLeft />}
          style={FORM_PAGE_HEADER_BACK_BUTTON_STYLE}
          aria-label="返回"
          onClick={goBack}
        />
        <Typography.Title
          heading={5}
          className="min-w-0 truncate"
          style={FORM_PAGE_HEADER_TITLE_STYLE}
        >
          {isEdit ? '编辑资源' : '创建资源'}
        </Typography.Title>
      </div>
      <Divider style={{ margin: 0 }} />
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="w-full min-w-0 px-6" style={{ paddingTop: 24, paddingBottom: 24, boxSizing: 'border-box' }}>
          <Form
            form={form}
            className={FORM_PAGE_ARCO_CLASS}
            layout="horizontal"
            labelAlign="left"
            labelCol={FORM_PAGE_LABEL_COL}
            wrapperCol={FORM_PAGE_WRAPPER_COL}
            style={FORM_PAGE_FORM_STYLE}
            requiredSymbol
            initialValues={INITIAL_VALUES}
          >
            <Form.Item
              label="名称"
              field="name"
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input placeholder="请输入名称" allowClear />
            </Form.Item>
            <Form.Item label="类型" field="type" rules={[{ required: true, message: '请选择类型' }]}>
              <Select placeholder="请选择类型">
                {TYPE_OPTIONS.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="说明" field="remark">
              <Input.TextArea placeholder="选填" autoSize={{ minRows: 3, maxRows: 6 }} />
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className={FORM_PAGE_FOOTER_BAR_CLASS}>
        <div
          className={FORM_PAGE_FOOTER_ACTIONS_CLASS}
          style={{ height: FORM_PAGE_FOOTER_ACTION_BAR_HEIGHT_PX, boxSizing: 'border-box' }}
        >
          <Button type="primary" style={FORM_PAGE_FOOTER_BUTTON_STYLE} onClick={() => void onSubmit()}>
            确定
          </Button>
          <Button type="secondary" style={FORM_PAGE_FOOTER_BUTTON_STYLE} onClick={goBack}>
            取消
          </Button>
        </div>
      </div>
    </div>
  )
}
