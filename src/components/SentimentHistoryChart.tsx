import { useMemo } from 'react'
import type { Forecast } from '../types'
import { optionShare } from '../lib/parimutuel'

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function noise(i: number, seed: number): number {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/** Mock time series ending at current pool share for the chosen option (24h window). */
function buildSeries(forecastId: string, optionId: string, endShare: number, points = 18): number[] {
  const seed = hashStr(`${forecastId}:${optionId}`)
  const start = 0.15 + noise(0, seed) * 0.55
  const out: number[] = []
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1)
    const eased = t * t * (3 - 2 * t)
    let v = start + (endShare - start) * eased + (noise(i + 1, seed) - 0.5) * 0.08 * (1 - t)
    v = Math.max(0.03, Math.min(0.97, v))
    out.push(v)
  }
  out[out.length - 1] = endShare
  return out
}

type Props = {
  forecast: Forecast
  optionId: string
}

export function SentimentHistoryChart({ forecast, optionId }: Props) {
  const option = forecast.options.find((o) => o.id === optionId)
  const endShare = option ? optionShare(option, forecast.options) : 0.5

  const series = useMemo(
    () => buildSeries(forecast.id, optionId, endShare),
    [forecast.id, optionId, endShare],
  )

  const w = 100
  const h = 36
  const pad = 4
  const innerW = w - pad * 2
  const innerH = h - pad * 2
  const n = series.length
  const pts = series.map((y, i) => {
    const x = pad + (i / Math.max(1, n - 1)) * innerW
    const yy = pad + (1 - y) * innerH
    return `${x.toFixed(1)},${yy.toFixed(1)}`
  })
  const d = `M ${pts.join(' L ')}`
  const gradId = `sg${hashStr(`${forecast.id}:${optionId}`)}`

  return (
    <div className="sentiment-chart">
      <div className="sentiment-chart__head">
        <span>Sentiment over time</span>
        <span className="sentiment-chart__now">Now {(endShare * 100).toFixed(0)}%</span>
      </div>
      <svg
        className="sentiment-chart__svg"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(56,189,248,0.45)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.02)" />
          </linearGradient>
        </defs>
        <path
          d={`${d} L ${pad + innerW} ${h - pad} L ${pad} ${h - pad} Z`}
          fill={`url(#${gradId})`}
          opacity={0.9}
        />
        <path d={d} fill="none" stroke="var(--accent-2)" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div className="sentiment-chart__axis">
        <span>24h ago</span>
        <span>12h</span>
        <span>Now</span>
      </div>
    </div>
  )
}
