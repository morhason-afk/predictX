import type { ForecastOption } from '../types'

/** Total coins in the pool across options (simulated market depth). */
export function totalPool(options: ForecastOption[]): number {
  return options.reduce((s, o) => s + o.totalWeight, 0)
}

/** Share of pool on an option = sentiment-style display (0–1). */
export function optionShare(option: ForecastOption, options: ForecastOption[]): number {
  const t = totalPool(options)
  if (t <= 0) return 1 / options.length
  return option.totalWeight / t
}

/**
 * If this option wins, parimutuel-style multiplier ≈ totalPool / optionPool.
 * Used for XP/coin “potential multiplier” (TDD §3.2).
 */
export function potentialMultiplier(
  option: ForecastOption,
  options: ForecastOption[],
  additionalStakeOnOption: number,
): number {
  const others = options.filter((o) => o.id !== option.id)
  const otherTotal = others.reduce((s, o) => s + o.totalWeight, 0)
  const newOptionTotal = option.totalWeight + additionalStakeOnOption
  const newGrand = otherTotal + newOptionTotal
  if (newOptionTotal <= 0) return 1
  return newGrand / newOptionTotal
}
