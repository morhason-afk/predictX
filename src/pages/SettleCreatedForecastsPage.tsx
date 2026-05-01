import { useMemo, useState } from 'react'
import { useAppState } from '../context/useAppState'

export function SettleCreatedForecastsPage() {
  const { user, forecasts, settleForecast, expiredCreatedSettleCount } = useAppState()
  const [msg, setMsg] = useState<string | null>(null)
  const [notifMsg, setNotifMsg] = useState<string | null>(null)

  const mine = useMemo(() => {
    const now = Date.now()
    return forecasts
      .filter((f) => f.creatorId === user.uid && f.status === 'open')
      .sort((a, b) => {
        const aEx = a.endsAt < now ? 1 : 0
        const bEx = b.endsAt < now ? 1 : 0
        if (aEx !== bEx) return bEx - aEx
        return a.endsAt - b.endsAt
      })
  }, [forecasts, user.uid, expiredCreatedSettleCount])

  const needsSettle = expiredCreatedSettleCount > 0
  const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://predict-x.netlify.app'
  const settleUrl = `${appOrigin}/settle-created-forecasts`
  const waReminder = `Reminder: settle my PredictX forecast(s). ${settleUrl}`

  const requestSettlementNotifs = async () => {
    if (typeof Notification === 'undefined') {
      setNotifMsg('Notifications are not available in this browser.')
      return
    }
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      setNotifMsg('You will get a system notification when a created forecast expires.')
    } else {
      setNotifMsg('Permission was not granted — use WhatsApp reminder below if you prefer.')
    }
  }

  return (
    <div className="mobile-screen">
      <header className="mobile-screen__header">
        <h1 className="screen-title screen-title--with-alert">
          Settle created forecasts
          {needsSettle && (
            <span className="screen-title__alert" aria-hidden>
              !
            </span>
          )}
        </h1>
        <p className="screen-lead tight">Only your open forecasts appear here.</p>
        {needsSettle && (
          <div className="settle-nudge-actions">
            {typeof Notification !== 'undefined' && Notification.permission !== 'granted' && (
              <button type="button" className="btn-ghost settle-nudge-actions__btn" onClick={requestSettlementNotifs}>
                Enable phone / desktop notifications
              </button>
            )}
            <a
              className="btn-ghost settle-nudge-actions__btn"
              href={`https://wa.me/?text=${encodeURIComponent(waReminder)}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp reminder to yourself
            </a>
          </div>
        )}
        {notifMsg && <p className="settle-nudge-actions__msg muted small">{notifMsg}</p>}
      </header>
      <div className="mobile-screen__scroll">
        {mine.length === 0 && (
          <p className="muted">No open created forecasts to settle right now.</p>
        )}
        <div className="bo-board-list">
          {mine.map((f) => {
            const overdue = f.endsAt < Date.now()
            return (
              <article key={f.id} className={`bo-card${overdue ? ' bo-card--settle-due' : ''}`}>
                <strong>{f.title}</strong>
                <span className="muted small">
                  Resolves: {new Date(f.endsAt).toLocaleString()}
                  {overdue && <span className="bo-card__due-tag"> — needs settlement</span>}
                </span>
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
            )
          })}
        </div>
        {msg && <p className="avatar-shop__msg">{msg}</p>}
      </div>
    </div>
  )
}
