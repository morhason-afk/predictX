import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DAILY_ANALYTICS } from '../data/analyticsMock'
import { CoinIcon } from '../components/icons/CoinIcon'

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
const ANALYTICS_UNLOCK_KEY = 'predictx_analytics_unlocked'
const ANALYTICS_SECRET = '1234'

export function AnalyticsPage() {
  const nav = useNavigate()
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(ANALYTICS_UNLOCK_KEY) === '1')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const latest = DAILY_ANALYTICS[DAILY_ANALYTICS.length - 1]

  const unlock = () => {
    if (password.trim() !== ANALYTICS_SECRET) {
      setError('Incorrect password.')
      return
    }
    sessionStorage.setItem(ANALYTICS_UNLOCK_KEY, '1')
    setUnlocked(true)
    setError(null)
    setPassword('')
  }

  if (!unlocked) {
    return (
      <div className="mobile-screen">
        <header className="mobile-screen__header">
          <h1 className="screen-title">Data</h1>
          <p className="screen-lead tight">Restricted analytics area.</p>
        </header>
        <div className="mobile-screen__scroll">
          <p className="muted">This page is protected. Enter password to continue.</p>
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
            Unlock data access
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
        <h1 className="screen-title">Analytics Dashboard</h1>
        <p className="screen-lead tight">Daily high-level KPIs across all users.</p>
      </header>
      <div className="mobile-screen__scroll">
        <p className="muted small">Latest snapshot: {latest.day}</p>

        <div className="analytics-grid">
          <KpiCard label="Daily active unique users" value={latest.dau.toLocaleString()} />
          <KpiCard label="Daily active unique forecasters" value={latest.activeForecasters.toLocaleString()} />
          <KpiCard label="AVG forecasts per forecaster" value={latest.avgForecastsPerForecaster.toFixed(2)} />
          <KpiCard label="AVG total coins used (bets) per player" value={latest.avgCoinsUsedPerPlayer.toLocaleString()} coin />
          <KpiCard label="AVG total coins won per player" value={latest.avgCoinsWonPerPlayer.toLocaleString()} coin />
          <KpiCard label="Total revenue" value={usd.format(latest.totalRevenueUsd)} />
          <KpiCard label="ARPDAU (revenue/DAU)" value={usd.format(latest.arpdaUUsd)} />
          <KpiCard label="PPU (% paying players out of DAU)" value={`${latest.ppuPct.toFixed(1)}%`} />
          <KpiCard label="ARPPU (avg revenue per paying player)" value={usd.format(latest.arppuUsd)} />
          <KpiCard label="Daily new users" value={latest.newUsers.toLocaleString()} />
          <KpiCard
            label="% new users that joined today and placed at least 1 forecast"
            value={`${latest.newUsersWith1ForecastPct.toFixed(1)}%`}
          />
          <KpiCard
            label="% new users that joined today and placed at least 5 forecast"
            value={`${latest.newUsersWith5ForecastsPct.toFixed(1)}%`}
          />
          <KpiCard
            label="% new users that joined today and placed at least 10 forecast"
            value={`${latest.newUsersWith10ForecastsPct.toFixed(1)}%`}
          />
          <KpiCard label="Number of errors" value={latest.errorCount.toLocaleString()} />
        </div>

        <h2 className="section-title">Daily trend (last 7 days)</h2>
        <div className="analytics-table-wrap">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>DAU</th>
                <th>Revenue</th>
                <th>PPU</th>
                <th>New users</th>
                <th>Errors</th>
              </tr>
            </thead>
            <tbody>
              {DAILY_ANALYTICS.map((d) => (
                <tr key={d.day}>
                  <td>{d.day.slice(5)}</td>
                  <td>{d.dau.toLocaleString()}</td>
                  <td>{usd.format(d.totalRevenueUsd)}</td>
                  <td>{d.ppuPct.toFixed(1)}%</td>
                  <td>{d.newUsers.toLocaleString()}</td>
                  <td>{d.errorCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, value, coin = false }: { label: string; value: string; coin?: boolean }) {
  return (
    <article className="analytics-kpi">
      <span>{label}</span>
      <strong className={coin ? 'coin-inline' : ''}>
        {coin && <CoinIcon className="coin-inline__icon" />}
        {value}
      </strong>
    </article>
  )
}
