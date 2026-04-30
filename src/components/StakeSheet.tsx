import { useMemo, useState } from 'react'
import type { Forecast } from '../types'
import { optionShare, potentialMultiplier, totalPool } from '../lib/parimutuel'
import { useAppState } from '../context/useAppState'
import { SentimentHistoryChart } from './SentimentHistoryChart'
import { CoinIcon } from './icons/CoinIcon'

type Props = {
  forecast: Forecast
  optionId: string | null
  onClose: () => void
  onSuccess: () => void
}

const PRESETS = [25, 50, 100, 250]

export function StakeSheet({ forecast, optionId, onClose, onSuccess }: Props) {
  const { placeStake, user } = useAppState()
  const [stake, setStake] = useState(50)
  const [flying, setFlying] = useState(false)

  const option = forecast.options.find((o) => o.id === optionId) ?? null

  const mult = useMemo(() => {
    if (!option) return 1
    return potentialMultiplier(option, forecast.options, stake)
  }, [forecast.options, option, stake])

  if (!option) return null

  const share = optionShare(option, forecast.options)
  const pool = totalPool(forecast.options)

  const submit = () => {
    setFlying(true)
    window.setTimeout(() => {
      const ok = placeStake(forecast.id, option.id, stake)
      setFlying(false)
      if (ok) onSuccess()
    }, 420)
  }

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <div
        className="stake-sheet"
        role="dialog"
        aria-modal
        aria-labelledby="stake-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="stake-sheet__close" onClick={onClose}>
          Close
        </button>
        <h2 id="stake-title" className="stake-sheet__title">
          Forecast on “{option.text}”
        </h2>
        <p className="stake-sheet__meta">
          Pool {pool.toLocaleString()} · Sentiment {(share * 100).toFixed(0)}%
        </p>

        <SentimentHistoryChart forecast={forecast} optionId={option.id} />

        <div className="stake-sheet__mult">
          <span>Potential multiplier</span>
          <strong>{mult.toFixed(2)}×</strong>
        </div>
        <div className="stake-presets">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              className={`stake-pill${stake === p ? ' is-on' : ''}`}
              onClick={() => setStake(Math.min(p, user.balance))}
            >
              {p}
            </button>
          ))}
        </div>
        <label className="stake-field">
          <span>Custom</span>
          <input
            type="number"
            min={1}
            max={user.balance}
            value={stake}
            onChange={(e) => setStake(Math.max(0, Number(e.target.value) || 0))}
          />
        </label>
        <p className="stake-balance coin-inline">
          Balance <CoinIcon className="coin-inline__icon" /> {user.balance.toLocaleString()} X-Coins
        </p>
        <button
          type="button"
          className={`stake-cta${flying ? ' is-fly' : ''}`}
          disabled={stake < 1 || stake > user.balance || flying}
          onClick={submit}
        >
          Place forecast
        </button>
      </div>
    </div>
  )
}
