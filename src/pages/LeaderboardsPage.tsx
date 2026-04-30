import { useEffect, useState } from 'react'
import { LEADERBOARD_SECTIONS } from '../data/leaderboardMock'
import { UserAvatar } from '../components/UserAvatar'
import { useAppState } from '../context/useAppState'
import { CoinIcon } from '../components/icons/CoinIcon'

function formatTimeLeft(endsAt: number, now: number) {
  const ms = Math.max(0, endsAt - now)
  if (ms === 0) return 'Finished'
  const totalHours = Math.floor(ms / 3_600_000)
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  const mins = Math.floor((ms % 3_600_000) / 60_000)
  if (days > 0) return `${days}d ${hours}h left`
  return `${hours}h ${mins}m left`
}

export function LeaderboardsPage() {
  const { pendingLeaderboardRewards, collectLeaderboardReward } = useAppState()
  const [now, setNow] = useState(() => Date.now())
  const unclaimedRewards = pendingLeaderboardRewards.filter((r) => !r.collected)

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(t)
  }, [])

  return (
    <div className="mobile-screen">
      <header className="mobile-screen__header">
        <h1 className="screen-title">Leaderboards</h1>
        <p className="screen-lead tight">Each metric is its own board — top 3 only.</p>
      </header>
      <div className="mobile-screen__scroll">
        <section className="lb-section">
          <h2 className="lb-section__title">Rewards to collect</h2>
          {unclaimedRewards.length === 0 ? (
            <p className="lb-section__rule">No leaderboard rewards waiting right now.</p>
          ) : (
            <ul className="lb-rewards">
              {unclaimedRewards.map((reward) => (
                <li key={reward.id} className="lb-reward">
                  <div className="lb-reward__main">
                    <strong>{reward.boardTitle}</strong>
                    <span>
                      Place #{reward.place} · {reward.cadence} board
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-buy lb-reward__btn"
                    onClick={() => collectLeaderboardReward(reward.id)}
                  >
                    <span className="coin-inline">
                      Collect <CoinIcon className="coin-inline__icon" /> {reward.rewardCoins}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {LEADERBOARD_SECTIONS.map((section) => (
          <section key={section.id} className="lb-section">
            <div className="lb-section__head">
              <h2 className="lb-section__title">{section.title}</h2>
              <span className={`lb-timer${section.endsAt <= now ? ' is-finished' : ''}`}>
                {section.cadence} · {formatTimeLeft(section.endsAt, now)}
              </span>
            </div>
            <p className="lb-section__rule">{section.rule}</p>
            <p className="lb-prizes">
              <span className="coin-inline">
                #1 <CoinIcon className="coin-inline__icon" /> {section.rewards.first}
              </span>
              <span className="coin-inline">
                #2 <CoinIcon className="coin-inline__icon" /> {section.rewards.second}
              </span>
              <span className="coin-inline">
                #3 <CoinIcon className="coin-inline__icon" /> {section.rewards.third}
              </span>
            </p>
            <ol className="lb-top3">
              {section.rows.map((r) => (
                <li key={`${section.id}-${r.username}`} className={`lb-row${r.rank === 1 ? ' lb-row--first' : ''}`}>
                  <span className="lb-row__rank">{r.rank}</span>
                  <UserAvatar avatarId={r.avatarId} savant={r.rank === 1} className="lb-row__avatar" />
                  <div className="lb-row__main">
                    <span className="lb-row__name">@{r.username}</span>
                    <span className="lb-row__val">{r.value}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  )
}
