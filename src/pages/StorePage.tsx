import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppState } from '../context/useAppState'
import { BundleTierArt } from '../components/store/BundleTierArt'
import { CoinIcon } from '../components/icons/CoinIcon'

type Tab = 'prices' | 'rewards' | 'orders'

export function StorePage() {
  const {
    addCoins,
    user,
    dailyStreakDay,
    dailyStreakReward,
    canClaimDailyStreak,
    claimDailyStreak,
    storeOffers,
    streakRewards,
    pendingForecastRewards,
    collectForecastReward,
  } = useAppState()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab')
  const [tab, setTab] = useState<Tab>(
    initialTab === 'rewards' || initialTab === 'orders' ? initialTab : 'prices',
  )
  const collectedCount = canClaimDailyStreak ? Math.max(0, dailyStreakDay - 1) : dailyStreakDay
  const unclaimedForecastRewards = pendingForecastRewards.filter((r) => !r.collected)
  const setTabAndQuery = (next: Tab) => {
    setTab(next)
    if (next === 'prices') setSearchParams({})
    else setSearchParams({ tab: next })
  }

  useEffect(() => {
    const q = searchParams.get('tab')
    const next: Tab = q === 'rewards' || q === 'orders' ? q : 'prices'
    setTab(next)
  }, [searchParams])

  return (
    <div className="mobile-screen">
      <header className="mobile-screen__header">
        <h1 className="screen-title">Store</h1>
        <p className="screen-lead tight">Virtual X-Coins — not real money.</p>
        <div className="segmented">
          <button type="button" className={tab === 'prices' ? 'is-on' : ''} onClick={() => setTabAndQuery('prices')}>
            Prices
          </button>
          <button type="button" className={tab === 'rewards' ? 'is-on' : ''} onClick={() => setTabAndQuery('rewards')}>
            Rewards
          </button>
          <button type="button" className={tab === 'orders' ? 'is-on' : ''} onClick={() => setTabAndQuery('orders')}>
            Orders
          </button>
        </div>
      </header>
      <div className="mobile-screen__scroll">
        {tab === 'prices' && (
          <div className="store-grid">
            {storeOffers.map((p) => (
              <div key={p.id} className="store-card">
                <div className="store-card__visual" aria-hidden>
                  <BundleTierArt tier={p.tier} />
                </div>
                <strong>{p.label}</strong>
                <span className="coin-inline"><CoinIcon className="coin-inline__icon" /> {p.coins.toLocaleString()} X-Coins</span>
                <button type="button" className="btn-buy" onClick={() => addCoins(p.coins)}>
                  Buy {p.price} (demo)
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'rewards' && (
          <div className="rewards-block">
            <div className="daily-card">
              <h3>Forecast winnings</h3>
              {unclaimedForecastRewards.length === 0 ? (
                <p>No winnings to collect yet.</p>
              ) : (
                <div className="lb-rewards">
                  {unclaimedForecastRewards.map((reward) => (
                    <div key={reward.id} className="lb-reward">
                      <div className="lb-reward__main">
                        <strong>{reward.forecastTitle}</strong>
                        <span>Winner payout from settled forecast</span>
                      </div>
                      <button
                        type="button"
                        className="btn-buy lb-reward__btn"
                        onClick={() => collectForecastReward(reward.id)}
                      >
                        <span className="coin-inline">
                          Collect <CoinIcon className="coin-inline__icon" /> {reward.rewardCoins}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="daily-card">
              <h3>Streak bonus</h3>
              <p>
                Checked in for {collectedCount} day{collectedCount === 1 ? '' : 's'}.
                Miss one day and your streak resets to Day 1.
              </p>
              <div className="streak-grid" role="list" aria-label="7 day streak rewards">
                {streakRewards.map((reward, idx) => {
                  const day = idx + 1
                  const collected = day <= collectedCount
                  const today = canClaimDailyStreak && day === dailyStreakDay
                  const stateClass = collected
                    ? 'is-collected'
                    : today
                      ? 'is-today'
                      : 'is-upcoming'
                  return (
                    <div key={day} className={`streak-day ${stateClass}`} role="listitem">
                      <strong>+{reward}</strong>
                      <CoinIcon className="streak-day__coin" />
                      <span>{day === 1 ? 'Day 1' : `Day ${day}`}</span>
                      <em>{collected ? 'Collected' : today ? 'Today' : 'Upcoming'}</em>
                    </div>
                  )
                })}
              </div>
              <button
                type="button"
                className="btn-primary streak-claim"
                disabled={!canClaimDailyStreak}
                onClick={() => {
                  claimDailyStreak()
                }}
              >
                {canClaimDailyStreak ? (
                  <>
                    Claim Day {dailyStreakDay} + <CoinIcon className="coin-inline__icon" /> {dailyStreakReward}
                  </>
                ) : (
                  'Claimed today'
                )}
              </button>
              <p className="muted small">
                Keep your streak after Day 7 to continue earning the Day 7 reward amount.
              </p>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <p className="muted">No orders yet — IAP hooks to your back office.</p>
        )}

        <p className="muted small coin-inline"><CoinIcon className="coin-inline__icon" /> {user.balance.toLocaleString()} X-Coins</p>
      </div>
    </div>
  )
}
