import type { Forecast } from '../types'

const DAY = 86_400_000

/**
 * Savant feed score (TDD §3.1):
 * Score = (Recency * 0.4) + (EngagementRate * 0.3) + (CategoryMatch * 0.3)
 */
export function savantScore(
  f: Forecast,
  now: number,
  userInterests: string[],
): number {
  const ageMs = Math.max(0, now - f.createdAt)
  const recency = Math.exp(-ageMs / (3 * DAY))

  const participants = f.options.reduce((s, o) => s + o.totalParticipants, 0)
  const engagementRate = Math.min(1, participants / 50 + f.engagementScore / 100)

  const categoryMatch = userInterests.includes(f.category) ? 1 : 0.35

  return recency * 0.4 + engagementRate * 0.3 + categoryMatch * 0.3
}

export function rankForecasts(
  items: Forecast[],
  now: number,
  userInterests: string[],
): Forecast[] {
  return [...items].sort(
    (a, b) => savantScore(b, now, userInterests) - savantScore(a, now, userInterests),
  )
}
