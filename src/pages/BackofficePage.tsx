import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../context/useAppState'

const BACKOFFICE_UNLOCK_KEY = 'predictx_backoffice_unlocked'
const BACKOFFICE_SECRET = '5678'

export function BackofficePage() {
  const nav = useNavigate()
  const {
    welcomeBonusCoins,
    streakRewards,
    leaderboardRewards,
    storeOffers,
    updateWelcomeBonusCoins,
    updateStreakRewardForDay,
    updateLeaderboardReward,
    reorderStoreOffers,
    updateStoreOffer,
    leaderboardSections,
  } = useAppState()
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(BACKOFFICE_UNLOCK_KEY) === '1')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const unlock = () => {
    if (password.trim() !== BACKOFFICE_SECRET) {
      setError('Incorrect password.')
      return
    }
    sessionStorage.setItem(BACKOFFICE_UNLOCK_KEY, '1')
    setUnlocked(true)
    setPassword('')
    setError(null)
  }

  if (!unlocked) {
    return (
      <div className="mobile-screen">
        <header className="mobile-screen__header">
          <h1 className="screen-title">Backoffice</h1>
          <p className="screen-lead tight">Restricted control panel.</p>
        </header>
        <div className="mobile-screen__scroll">
          <p className="muted">Enter password to manage live product economy settings.</p>
          <div className="analytics-lock__row">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError(null)
              }}
              placeholder="Enter password"
              autoComplete="off"
            />
          </div>
          {error && <p className="analytics-lock__error">{error}</p>}
          <button type="button" className="btn-primary" onClick={unlock}>
            Unlock backoffice
          </button>
          <button type="button" className="btn-ghost" onClick={() => nav('/')}>
            Back to feed
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-screen">
      <header className="mobile-screen__header">
        <h1 className="screen-title">Backoffice</h1>
        <p className="screen-lead tight">Live economy controls (applies immediately).</p>
      </header>
      <div className="mobile-screen__scroll">
        <section className="bo-section">
          <h2 className="section-title">1) Welcome bonus</h2>
          <label className="bo-field">
            <span>Coins given as welcome bonus</span>
            <input
              type="number"
              min={0}
              value={welcomeBonusCoins}
              onChange={(e) => updateWelcomeBonusCoins(Number(e.target.value) || 0)}
            />
          </label>
        </section>

        <section className="bo-section">
          <h2 className="section-title">2) Streak rewards</h2>
          <div className="bo-grid">
            {streakRewards.map((coins, idx) => (
              <label key={`streak-${idx + 1}`} className="bo-field">
                <span>Day {idx + 1}</span>
                <input
                  type="number"
                  min={0}
                  value={coins}
                  onChange={(e) => updateStreakRewardForDay(idx + 1, Number(e.target.value) || 0)}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="bo-section">
          <h2 className="section-title">3) Leaderboard winner rewards</h2>
          <div className="bo-board-list">
            {leaderboardSections.map((board) => {
              const rewards = leaderboardRewards[board.id] ?? board.rewards
              return (
                <article key={board.id} className="bo-card">
                  <strong>{board.title}</strong>
                  <div className="bo-grid bo-grid--3">
                    <label className="bo-field">
                      <span>#1</span>
                      <input
                        type="number"
                        min={0}
                        value={rewards.first}
                        onChange={(e) => updateLeaderboardReward(board.id, 1, Number(e.target.value) || 0)}
                      />
                    </label>
                    <label className="bo-field">
                      <span>#2</span>
                      <input
                        type="number"
                        min={0}
                        value={rewards.second}
                        onChange={(e) => updateLeaderboardReward(board.id, 2, Number(e.target.value) || 0)}
                      />
                    </label>
                    <label className="bo-field">
                      <span>#3</span>
                      <input
                        type="number"
                        min={0}
                        value={rewards.third}
                        onChange={(e) => updateLeaderboardReward(board.id, 3, Number(e.target.value) || 0)}
                      />
                    </label>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="bo-section">
          <h2 className="section-title">4) Store offers</h2>
          <div className="bo-board-list">
            {storeOffers.map((offer, idx) => (
              <article key={offer.id} className="bo-card">
                <strong>Offer #{idx + 1}</strong>
                <div className="bo-grid bo-grid--2">
                  <label className="bo-field">
                    <span>Label</span>
                    <input
                      value={offer.label}
                      onChange={(e) => updateStoreOffer(offer.id, { label: e.target.value })}
                    />
                  </label>
                  <label className="bo-field">
                    <span>Price</span>
                    <input
                      value={offer.price}
                      onChange={(e) => updateStoreOffer(offer.id, { price: e.target.value })}
                    />
                  </label>
                  <label className="bo-field">
                    <span>Coins</span>
                    <input
                      type="number"
                      min={1}
                      value={offer.coins}
                      onChange={(e) => updateStoreOffer(offer.id, { coins: Number(e.target.value) || 1 })}
                    />
                  </label>
                  <label className="bo-field">
                    <span>Tier (0-2)</span>
                    <input
                      type="number"
                      min={0}
                      max={2}
                      value={offer.tier}
                      onChange={(e) =>
                        updateStoreOffer(offer.id, { tier: Math.max(0, Math.min(2, Number(e.target.value) || 0)) as 0 | 1 | 2 })
                      }
                    />
                  </label>
                </div>
                <div className="bo-actions">
                  <button
                    type="button"
                    className="btn-ghost"
                    disabled={idx === 0}
                    onClick={() => reorderStoreOffers(idx, idx - 1)}
                  >
                    Move up
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    disabled={idx === storeOffers.length - 1}
                    onClick={() => reorderStoreOffers(idx, idx + 1)}
                  >
                    Move down
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
