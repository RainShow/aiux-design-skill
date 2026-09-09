import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input } from '@arco-design/web-react'
import { IconLock, IconUser } from '@arco-design/web-react/icon'
import { TopNavBrandLogo, PLATFORM_PRODUCT_NAME } from '../components/TopNavBrandLogo'
import { writeDemoAuthed } from '../patterns/authDemo'
import {
  LOGIN_AUX_LINK_GAP_PX,
  LOGIN_BRAND_GRADIENT,
  LOGIN_BRAND_INSET_CLASS,
  LOGIN_CARD_BG,
  LOGIN_CARD_PAD_CLASS,
  LOGIN_CARD_RADIUS_CLASS,
  LOGIN_DESKTOP_MAIN_CLASS,
  LOGIN_FOOTER_PAD_CLASS,
  LOGIN_FORM_STACK_GAP_CLASS,
  LOGIN_ROOT_MIN_W_CLASS,
} from '../patterns/loginPageLayout'
import { LoginPageBackground } from './LoginPageBackground'
import { globalMessage } from '../patterns/globalMessage'

const FormItem = Form.Item

type LoginValues = {
  username: string
  password: string
}

/** 演示环境固定凭据 */
const DEMO_USERNAME = 'admin'
const DEMO_PASSWORD = 'admin'

/** 登录页平台名称 */
const LOGIN_PLATFORM_NAME = PLATFORM_PRODUCT_NAME

/** 左侧副标题文案 */
const LOGIN_FEATURE_SUMMARY =
  '面向国家关键行业，以应用场景为牵引，提供数智化产品与服务，已经覆盖了从数据治理，数据流通，本体构建，模型开发，智能体开发的全生命周期。'

/** 页脚链接文案 */
const LOGIN_FOOTER_LINKS = [
  '@2026 CES 使用前必读',
  '增值电信业务经营许可证：B1.B2-20100266',
  '京ICP证030173号',
  '隐私政策',
] as const

/**
 * 登录页（对齐 Figma 节点 755:5716；背景层见 {@link LoginPageBackground}）
 * 布局规范：`.cursor/skills/aiux-design-skill/references/login-page.md`
 *
 * 相对导入已对齐落地路径：复制到 `src/auth/` 后不必改 import。
 */
export function LoginPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm<LoginValues>()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: LoginValues) => {
    if (values.username.trim() !== DEMO_USERNAME || values.password !== DEMO_PASSWORD) {
      globalMessage.error('账号或密码错误')
      return
    }
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 450))
      writeDemoAuthed(true)
      globalMessage.success('登录成功')
      navigate('/', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceholderAction = (label: string) => {
    globalMessage.info(`${label}功能演示暂未开放`)
  }

  return (
    <div
      className={`relative box-border flex h-full min-h-0 w-full flex-col overflow-x-hidden ${LOGIN_ROOT_MIN_W_CLASS}`}
    >
      <LoginPageBackground />

      <header className={`absolute z-10 ${LOGIN_BRAND_INSET_CLASS}`}>
        <TopNavBrandLogo platformName={LOGIN_PLATFORM_NAME} />
      </header>

      <main
        className={`relative z-10 flex min-h-0 w-full flex-1 flex-col overflow-x-hidden ${LOGIN_ROOT_MIN_W_CLASS}`}
      >
        <div className={LOGIN_DESKTOP_MAIN_CLASS}>
          <section className="min-w-0 pt-[2.99vh]">
            <p
              className="bg-clip-text text-[32px] font-semibold leading-[1.3] text-transparent"
              style={{ backgroundImage: LOGIN_BRAND_GRADIENT }}
            >
              中国电子云
            </p>
            <h1 className="mt-[18px] text-[46px] font-semibold leading-[1.3] text-[color:var(--color-text-1,#0f131f)]">
              {LOGIN_PLATFORM_NAME}
            </h1>
            <p className="mt-8 text-sm leading-[22px] text-[color:var(--color-text-1,#0f131f)]">
              {LOGIN_FEATURE_SUMMARY}
            </p>
          </section>

          <div aria-hidden className="min-w-0" />

          <section
            className={`box-border min-h-[54.75vh] min-w-0 w-full max-w-[480px] overflow-hidden ${LOGIN_CARD_RADIUS_CLASS} ${LOGIN_CARD_PAD_CLASS}`}
            style={{ backgroundColor: LOGIN_CARD_BG }}
          >
            <LoginFormCardContent
              form={form}
              loading={loading}
              onSubmit={handleSubmit}
              onPlaceholderAction={handlePlaceholderAction}
            />
          </section>
        </div>
      </main>

      <footer className={`relative z-10 shrink-0 ${LOGIN_FOOTER_PAD_CLASS}`}>
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs leading-normal text-[color:var(--color-text-3,#646c85)]">
          {LOGIN_FOOTER_LINKS.map((text) => (
            <span key={text}>{text}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}

type LoginFormCardContentProps = {
  form: ReturnType<typeof Form.useForm<LoginValues>>[0]
  loading: boolean
  onSubmit: (values: LoginValues) => Promise<void>
  onPlaceholderAction: (label: string) => void
}

/** 登录卡片表单区 */
function LoginFormCardContent({
  form,
  loading,
  onSubmit,
  onPlaceholderAction,
}: LoginFormCardContentProps) {
  return (
    <>
      <h2 className="mb-8 shrink-0 text-center text-[32px] font-semibold leading-[48px] text-[color:var(--color-text-1,#0f131f)]">
        欢迎登录
      </h2>

      <Form form={form} layout="vertical" requiredSymbol={false} onSubmit={onSubmit}>
        <div className={`flex flex-col ${LOGIN_FORM_STACK_GAP_CLASS}`}>
          <FormItem
            field="username"
            rules={[{ required: true, message: '请输入账号' }]}
            className="!mb-0"
          >
            <Input
              size="large"
              placeholder="请输入账号"
              prefix={<IconUser style={{ color: 'var(--color-text-4)' }} />}
              autoComplete="username"
            />
          </FormItem>
          <FormItem
            field="password"
            rules={[{ required: true, message: '请输入密码' }]}
            className="!mb-0"
          >
            <Input.Password
              size="large"
              placeholder="请输入密码"
              prefix={<IconLock style={{ color: 'var(--color-text-4)' }} />}
              autoComplete="current-password"
            />
          </FormItem>
        </div>

        <div className={`mt-6 flex flex-col ${LOGIN_FORM_STACK_GAP_CLASS}`}>
          <Button type="primary" htmlType="submit" long size="large" loading={loading}>
            登录
          </Button>

          <div className="flex items-center justify-center" style={{ gap: LOGIN_AUX_LINK_GAP_PX }}>
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 text-sm leading-[22px] text-[color:var(--color-text-1,#0f131f)] hover:opacity-80"
              onClick={() => onPlaceholderAction('忘记密码')}
            >
              忘记密码
            </button>
            <span
              aria-hidden
              className="h-3 w-px shrink-0"
              style={{ backgroundColor: 'var(--color-border-3)' }}
            />
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 text-sm leading-[22px] text-[color:var(--color-text-1,#0f131f)] hover:opacity-80"
              onClick={() => onPlaceholderAction('立即注册')}
            >
              立即注册
            </button>
          </div>
        </div>
      </Form>
    </>
  )
}
