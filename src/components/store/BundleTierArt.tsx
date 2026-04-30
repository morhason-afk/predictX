type Tier = 0 | 1 | 2

/** 0 = starter (few coins), 1 = pile, 2 = vault / chest — reads richer as price goes up */
export function BundleTierArt({ tier }: { tier: Tier }) {
  if (tier === 0) return <FewCoinsSvg />
  if (tier === 1) return <CoinPileSvg />
  return <CoinVaultSvg />
}

function FewCoinsSvg() {
  return (
    <svg viewBox="0 0 120 100" className="bundle-art" aria-hidden>
      <defs>
        <linearGradient id="c1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="78" rx="44" ry="10" fill="rgba(0,0,0,0.25)" />
      <circle cx="48" cy="52" r="14" fill="url(#c1)" stroke="#b45309" strokeWidth="1.2" />
      <circle cx="68" cy="48" r="12" fill="url(#c1)" stroke="#b45309" strokeWidth="1.2" />
      <circle cx="58" cy="38" r="10" fill="url(#c1)" stroke="#92400e" strokeWidth="1" />
      <text x="60" y="54" textAnchor="middle" fontSize="10" fill="rgba(0,0,0,0.35)" fontWeight="700">
        X
      </text>
    </svg>
  )
}

function CoinPileSvg() {
  return (
    <svg viewBox="0 0 120 100" className="bundle-art" aria-hidden>
      <defs>
        <linearGradient id="c2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="82" rx="50" ry="12" fill="rgba(0,0,0,0.28)" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const row = Math.floor(i / 3)
        const col = i % 3
        const cx = 38 + col * 22 + (row % 2) * 8
        const cy = 68 - row * 14
        const r = 11 - row * 0.8
        return <circle key={i} cx={cx} cy={cy} r={r} fill="url(#c2)" stroke="#a16207" strokeWidth="1" />
      })}
      <circle cx="72" cy="32" r="9" fill="#fcd34d" stroke="#b45309" strokeWidth="1" />
    </svg>
  )
}

function CoinVaultSvg() {
  return (
    <svg viewBox="0 0 120 100" className="bundle-art" aria-hidden>
      <defs>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="wood" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="86" rx="46" ry="11" fill="rgba(0,0,0,0.3)" />
      <rect x="28" y="38" width="64" height="44" rx="6" fill="url(#wood)" stroke="#292524" strokeWidth="1.5" />
      <rect x="32" y="42" width="56" height="16" rx="3" fill="rgba(0,0,0,0.2)" />
      <path d="M48 38V28h24v10" fill="none" stroke="#57534e" strokeWidth="2" />
      <rect x="52" y="22" width="16" height="14" rx="2" fill="url(#gold)" stroke="#a16207" strokeWidth="1" />
      <circle cx="60" cy="29" r="3" fill="#713f12" />
      {/* coins spilling */}
      <circle cx="42" cy="58" r="8" fill="url(#gold)" stroke="#a16207" />
      <circle cx="58" cy="54" r="9" fill="url(#gold)" stroke="#a16207" />
      <circle cx="76" cy="58" r="8" fill="url(#gold)" stroke="#a16207" />
      <circle cx="50" cy="68" r="7" fill="url(#gold)" stroke="#92400e" />
      <circle cx="70" cy="68" r="7" fill="url(#gold)" stroke="#92400e" />
    </svg>
  )
}
