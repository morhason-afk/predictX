import type { ReactNode } from 'react'
import type { Forecast } from '../types'

function Badge({ children, tone }: { children: ReactNode; tone: string }) {
  return <span className={`px-badge px-badge--${tone}`}>{children}</span>
}

function hoursLeft(endsAt: number) {
  return Math.max(0, (endsAt - Date.now()) / 3600_000)
}

export function ForecastBadges({ f }: { f: Forecast }) {
  const h = hoursLeft(f.endsAt)
  const totalW = f.options.reduce((s, o) => s + o.totalWeight, 0)
  const minShare = Math.min(...f.options.map((o) => o.totalWeight / (totalW || 1)))
  const underdog = minShare < 0.35 && totalW > 500

  return (
    <div className="forecast-badges">
      {f.engagementScore > 65 && <Badge tone="hot">Hot</Badge>}
      {h < 24 && h > 0 && <Badge tone="soon">Ending soon</Badge>}
      {f.verifiedCreator && <Badge tone="verified">Verified creator</Badge>}
      {underdog && <Badge tone="underdog">Underdog alert</Badge>}
    </div>
  )
}
