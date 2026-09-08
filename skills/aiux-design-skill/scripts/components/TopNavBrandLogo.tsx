import topnavLogo from '../assets/brand/topnav-logo.svg'

/** 平台产品名称（登录页与顶部导航共用） */
export const PLATFORM_PRODUCT_NAME = '新星数智化平台'

/**
 * 顶部导航左侧品牌（登录页左上角共用）。
 * 落地到 `src/components/` 后 logo 导入保持 `../assets/brand/topnav-logo.svg`。
 */
export function TopNavBrandLogo({
  platformName = PLATFORM_PRODUCT_NAME,
  logoSrc = topnavLogo,
}: {
  platformName?: string
  logoSrc?: string
}) {
  return (
    <div className="flex h-[var(--yb-logo-area-h)] items-center gap-[var(--yb-space-6)] overflow-clip">
      <img
        src={logoSrc}
        alt=""
        className="block h-[var(--yb-logo-h)] w-[var(--yb-logo-w)] max-w-none shrink-0"
      />
      <span className="text-[length:var(--yb-fs-16)] leading-[var(--yb-lh-22)] font-normal text-[color:var(--yb-text-1)]">
        |
      </span>
      <span className="whitespace-nowrap text-[length:var(--yb-fs-16)] leading-[var(--yb-lh-24)] font-medium text-[color:var(--yb-text-1)]">
        {platformName}
      </span>
    </div>
  )
}
