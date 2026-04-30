import { useMemo, useState } from 'react'
import { useAppState } from '../context/useAppState'

export function SettleCreatedForecastsPage() {
  const { user, forecasts, settleForecast } = useAppState()
  const [msg, setMsg] = useState<string | null>(null)

  const mine = useMemo(
    () => forecasts.filter((f) => f.creatorId === user.uid && f.status === 'open'),
    [forecasts, user.uid],
  )

  return (
    <div className="mobile-screen">
      <header className="mobile-screen__header">
        <h1 className="screen-title">Settle created forecasts</h1>
        <p className="screen-lead tight">Only your open forecasts appear here.</p>
      </header>
      <div className="mobile-screen__scroll">
        {mine.length === 0 && (
          <p className="muted">No open created forecasts to settle right now.</p>
        )}
        <div className="bo-board-list">
          {mine.map((f) => (
            <article key={f.id} className="bo-card">
              <strong>{f.title}</strong>
              <span className="muted small">Resolves: {new Date(f.endsAt).toLocaleString()}</span>
              <div className="bo-actions">
                {f.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className="btn-ghost"
                    onClick={() => {
                      const ok = settleForecast(f.id, o.id)
                      setMsg(ok ? `Settled "${f.title}" as ${o.text}.` : 'Could not settle this forecast.')
                    }}
                  >
                    Winner: {o.text}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
        {msg && <p className="avatar-shop__msg">{msg}</p>}
      </div>
    </div>
  )
}
