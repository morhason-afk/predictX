type CoinIconProps = {
  className?: string
}

export function CoinIcon({ className }: CoinIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id="coin-face" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#coin-face)" stroke="#92400e" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6.2" fill="none" stroke="rgba(146, 64, 14, 0.45)" strokeWidth="1.2" />
      <text x="12" y="15" textAnchor="middle" fontSize="8" fontWeight="700" fill="rgba(69, 26, 3, 0.75)">
        X
      </text>
    </svg>
  )
}
