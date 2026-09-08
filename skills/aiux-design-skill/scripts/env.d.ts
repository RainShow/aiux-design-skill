/**
 * 仅供在 Skill 仓库内打开 `scripts/` 时消除「找不到 react」红线。
 * 必须放在 scripts/ 下。不要拷到业务项目；落地后以宿主 tsconfig 与真实依赖为准。
 */

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module 'react' {
  export type ReactNode = any
  export type CSSProperties = Record<string, string | number | undefined>
  export type ChangeEvent<T = unknown> = { target: T }
  export type ButtonHTMLAttributes<T = unknown> = any
  export type HTMLAttributes<T = unknown> = any
  export type RefObject<T> = { current: T | null }
  export type MutableRefObject<T> = { current: T }
  export type Ref<T> = ((instance: T | null) => void) | { current: T | null } | null
  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void]
  export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T
  export function useCallback<T extends (...args: never[]) => unknown>(fn: T, deps: readonly unknown[]): T
  export function useRef<T>(initialValue: T | null): { current: T | null }
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void
  export function useLayoutEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void
  export function forwardRef<T, P = unknown>(
    render: (props: P, ref: { current: T | null }) => any,
  ): { (props: P & { ref?: { current: T | null } }): any; displayName?: string }
  export function isValidElement(node: unknown): boolean
}

declare module 'react/jsx-runtime' {
  export function jsx(type: unknown, props: unknown, key?: unknown): unknown
  export function jsxs(type: unknown, props: unknown, key?: unknown): unknown
  export const Fragment: unique symbol
}

declare module 'react-dom' {
  export function createPortal(
    children: any,
    container: Element | DocumentFragment | null,
    key?: string | null,
  ): any
}

declare module 'react-router-dom' {
  export function useNavigate(): (to: string, options?: { replace?: boolean; state?: unknown }) => void
  export function useLocation(): { pathname: string; state: unknown }
  export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T
  export const Link: (props: any) => any
}

declare module '@arco-design/web-react' {
  export const Button: any
  export const Divider: any
  export const Input: any
  export const Select: any
  export const Table: any
  export const Tabs: any
  export const Tag: any
  export const Tooltip: any
  export const Typography: any
  export const Pagination: any
  export const Modal: any
  export const Link: any
  export const Badge: any
  export const Message: any
  export const Dropdown: any
  export const Menu: any
  export const Tree: any
  export const Card: any
  export const Radio: any
  export const DatePicker: any
  export const Drawer: any
  export const Grid: any
  export const InputNumber: any
  export const Empty: any
  export const ConfigProvider: any
  export const Avatar: any
  export const Layout: any
  export const Space: any
  export const Form: {
    (props: any): any
    Item: any
    useForm: <T = unknown>() => [any]
  }
  export type TreeProps = any
  export type InputProps = any
}

declare module 'echarts' {
  export function init(el: HTMLElement): {
    setOption: (opt: unknown) => void
    resize: () => void
    dispose: () => void
  }
}

declare module '@arco-design/web-react/es/Input/interface' {
  export type RefInputType = any
}

declare module '@arco-design/web-react/es/Message/interface' {
  export type MessageHookReturnType = any
}

declare module '@arco-design/web-react/es/Table' {
  export type ColumnProps<T = unknown> = any
}

declare module '@arco-design/web-react/es/locale/zh-CN' {
  const zhCN: any
  export default zhCN
}

declare module '@arco-design/web-react/*'

declare namespace JSX {
  interface IntrinsicAttributes {
    key?: string | number | null
  }
  interface IntrinsicElements {
    [elemName: string]: any
  }
}
