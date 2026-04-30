import type { FC } from 'react'

type IconProps = { size?: number; className?: string }

export function IconSports({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c3 4 3 14 0 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconPolitics({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M4 20h16M6 20V10l6-4 6 4v10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 20v-6h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function IconCrypto({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9.5 10.5h3.2c1.2 0 2 .8 2 1.8s-.8 1.7-2 1.7H9.5M12 8v10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconPopCulture({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 3c2 3 7 4 7 9a7 7 0 1 1-14 0c0-5 5-6 7-9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconPersonal({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6 19c0-3.5 2.7-6 6-6s6 2.5 6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

const MAP: Record<string, FC<IconProps>> = {
  Sports: IconSports,
  Politics: IconPolitics,
  Crypto: IconCrypto,
  'Pop Culture': IconPopCulture,
  Personal: IconPersonal,
}

export function CategoryIcon({ category, size, className }: IconProps & { category: string }) {
  const Cmp = MAP[category] ?? IconPopCulture
  return <Cmp size={size} className={className} />
}
