import { useMemo } from 'react'
import { useAppState } from '../context/useAppState'

function statusLabel(status: 'open' | 'locked' | 'resolved' | 'cancelled') {
  if (status === 'open') return 'Open'
  if (status === 'locked') return 'Locked'
  if (status === 'resolved') return 'Resolved'
  return 'Cancelled'
}

export function ForecastHistoryPage() {
  const { user, forecasts, predictions } = useAppState()

  const createdByMe = useMemo(
    () =>
      forecasts
        .filter((f) => f.creatorId === user.uid)
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt),
    [forecasts, user.uid],
  )

  const forecastById = useMemo(() => new Map(forecasts.map((f) => [f.id, f])), [forecasts])

  const participated = useMemo(() => {
    const latestPredictionAt = new Map<string, number>()
    predictions
      .filter((p) => p.userId === user.uid)
      .forEach((p) => {
        const prev = latestPredictionAt.get(p.forecastId) ?? 0
        if (p.timestamp > prev) latestPredictionAt.set(p.forecastId, p.timestamp)
      })

    return [...latestPredictionAt.entries()]
      .map(([forecastId, ts]) => ({ forecast: forecastById.get(forecastId), ts }))
      .filter((x): x is { forecast: (typeof forecasts)[number]; ts: number } => Boolean(x.forecast))
      .sort((a, b) => {
        if (a.forecast.status === 'open' && b.forecast.status !== 'open') return -1
        if (a.forecast.status !== 'open' && b.forecast.status === 'open') return 1
        return b.ts - a.ts
      })
      .map((x) => x.forecast)
  }, [predictions, user.uid, forecastById, forecasts])

  return (
    <div className="mobile-screen">
      <header className="mobile-screen__header">
        <h1 className="screen-title">Forecasts history</h1>
        <p className="screen-lead tight">Created and placed forecasts history.</p>
      </header>
      <div className="mobile-screen__scroll">
        <h2 className="section-title">Placed forecasts</h2>
        {participated.length === 0 && (
          <p className="muted">No placed forecasts yet. Use the feed to place your first one.</p>
        )}
        <div className="bo-board-list">
          {participated.map((f) => (
            <article key={`participated-${f.id}`} className="bo-card">
              <strong>{f.title}</strong>
              <span className="muted small">Status: {statusLabel(f.status)}</span>
              <span className="muted small">Resolves {new Date(f.endsAt).toLocaleString()}</span>
              {f.status === 'resolved' && (
                <span className="muted small">
                  Winner: {f.options.find((o) => o.id === f.resolvedOptionId)?.text ?? 'set'}
                </span>
              )}
            </article>
          ))}
        </div>

        <h2 className="section-title">Created forecasts</h2>
        {createdByMe.length === 0 && (
          <p className="muted">No created forecasts yet. Start from Create tab.</p>
        )}
        <div className="bo-board-list">
          {createdByMe.map((f) => (
            <article key={f.id} className="bo-card">
              <strong>{f.title}</strong>
              <span className="muted small">
                {statusLabel(f.status)} · Created {new Date(f.createdAt).toLocaleString()}
              </span>
              <span className="muted small">Resolves {new Date(f.endsAt).toLocaleString()}</span>
              {f.status === 'resolved' && (
                <span className="muted small">
                  Winner: {f.options.find((o) => o.id === f.resolvedOptionId)?.text ?? 'set'}
                </span>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
