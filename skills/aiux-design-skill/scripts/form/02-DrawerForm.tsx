import { useEffect } from 'react'
import { Button, Drawer, Form, Grid, Input, InputNumber, Select } from '@arco-design/web-react'
import {
  FORM_CTRL_W_160,
  FORM_DRAWER_ARCO_CLASS,
  FORM_DRAWER_GRID_ROW_GUTTER,
  FORM_DRAWER_WIDTH,
  FORM_PAGE_ARCO_CLASS,
  FORM_PAGE_FORM_STYLE,
} from '../patterns/formPageLayout'
import { globalMessage } from '../patterns/globalMessage'

/**
 * 抽屉垂直表单。规范：`references/form-page.md` §2。
 *
 * 相对导入已对齐落地路径：复制到 `src/{feature}/AddXxxDrawer.tsx` 后不必改 import。
 *
 * 只换：字段、initialValues、提交逻辑。保留 `yb-form-drawer`、vertical Form、footer 左对齐「确定 / 取消」。
 * 打开时 `resetFields()`，默认值写在 `initialValues`（含 Select 首项）。
 */

const TYPE_OPTIONS = [
  { label: 'MySQL', value: 'mysql' },
  { label: 'PostgreSQL', value: 'pg' },
  { label: 'Hive', value: 'hive' },
] as const

const INITIAL_VALUES = {
  name: '',
  type: TYPE_OPTIONS[0].value,
  host: '',
  port: 3306,
}

export type BasicDrawerFormProps = {
  visible: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function BasicDrawerForm({ visible, onClose, onSuccess }: BasicDrawerFormProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible) form.resetFields()
  }, [visible, form])

  const onSubmit = async () => {
    try {
      await form.validate()
      globalMessage.success('已创建')
      onSuccess?.()
      onClose()
    } catch {
      /* Form 已展示校验态：红框白底，错误文案不撑高 */
    }
  }

  return (
    <Drawer
      className={FORM_DRAWER_ARCO_CLASS}
      width={FORM_DRAWER_WIDTH}
      title="添加数据源"
      visible={visible}
      onCancel={onClose}
      unmountOnExit
      footer={
        <div className="flex items-center gap-3">
          <Button type="primary" onClick={() => void onSubmit()}>
            确定
          </Button>
          <Button type="secondary" onClick={onClose}>
            取消
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        className={FORM_PAGE_ARCO_CLASS}
        style={FORM_PAGE_FORM_STYLE}
        requiredSymbol
        initialValues={INITIAL_VALUES}
      >
        <Form.Item label="名称" field="name" rules={[{ required: true, message: '请输入名称' }]}>
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
        <Grid.Row gutter={FORM_DRAWER_GRID_ROW_GUTTER}>
          <Grid.Col span={16}>
            <Form.Item label="地址" field="host" rules={[{ required: true, message: '请输入地址' }]}>
              <Input placeholder="主机名或 IP" allowClear />
            </Form.Item>
          </Grid.Col>
          <Grid.Col span={8}>
            <Form.Item label="端口" field="port" rules={[{ required: true, message: '请输入端口' }]}>
              <InputNumber placeholder="端口" hideControl style={{ width: FORM_CTRL_W_160 }} />
            </Form.Item>
          </Grid.Col>
        </Grid.Row>
      </Form>
    </Drawer>
  )
}
