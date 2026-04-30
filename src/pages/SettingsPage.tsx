import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AVATAR_CATALOG } from '../data/avatarCatalog'
import { useAppState } from '../context/useAppState'
import { UserAvatar } from '../components/UserAvatar'
import { CoinIcon } from '../components/icons/CoinIcon'

const SOCIAL_LINKS = [
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/predictx' },
  { id: 'tiktok', label: 'TikTok', href: 'https://tiktok.com/@predictx' },
  { id: 'youtube', label: 'YouTube', href: 'https://youtube.com/@predictx' },
  { id: 'x', label: 'X (Twitter)', href: 'https://x.com/predictx' },
  { id: 'reddit', label: 'Reddit', href: 'https://reddit.com/r/predictx' },
] as const

export function SettingsPage() {
  const { user, purchaseAvatar, equipAvatar, updateUsername } = useAppState()
  const [msg, setMsg] = useState<string | null>(null)
  const [usernameDraft, setUsernameDraft] = useState(user.username)

  useEffect(() => {
    setUsernameDraft(user.username)
  }, [user.username])

  return (
    <div className="mobile-screen">
      <header className="mobile-screen__header">
        <h1 className="screen-title">Settings</h1>
        <p className="screen-lead tight">Avatars: first five free, rest are one-time X-Coin unlocks.</p>
      </header>
      <div className="mobile-screen__scroll">
        <section className="settings-username">
          <h2 className="section-title">Presented name</h2>
          <p className="muted small">Shown as your @username across feed, leaderboards, and profile.</p>
          <div className="settings-username__row">
            <span>@</span>
            <input
              value={usernameDraft}
              onChange={(e) => setUsernameDraft(e.target.value)}
              placeholder="username"
              maxLength={24}
            />
          </div>
          <button
            type="button"
            className="btn-primary settings-username__save"
            disabled={usernameDraft.trim() === user.username}
            onClick={() => {
              const ok = updateUsername(usernameDraft)
              setMsg(
                ok
                  ? 'Username updated.'
                  : 'Use 3-24 chars: letters, numbers, dot, dash, underscore.',
              )
              if (ok) setUsernameDraft(usernameDraft.trim().replace(/\s+/g, '_'))
            }}
          >
            Save username
          </button>
        </section>

        <section className="avatar-shop">
          <h2 className="section-title">Your avatar</h2>
          <p className="muted small">Shown on your profile, leaderboards, and forecasts you create.</p>
          <div className="avatar-shop__grid">
            {AVATAR_CATALOG.map((a) => {
              const owned = user.ownedAvatarIds.includes(a.id)
              const equipped = user.avatarId === a.id
              return (
                <div key={a.id} className={`avatar-tile${equipped ? ' is-equipped' : ''}${owned ? ' is-owned' : ''}`}>
                  <UserAvatar avatarId={a.id} className="avatar-tile__glyph" />
                  <span className="avatar-tile__name">{a.name}</span>
                  <span className="avatar-tile__price">{a.cost === 0 ? 'Free' : `${a.cost} coins`}</span>
                  {equipped && <span className="avatar-tile__badge">Equipped</span>}
                  {!equipped && owned && (
                    <button
                      type="button"
                      className="btn-ghost avatar-tile__btn"
                      onClick={() => {
                        equipAvatar(a.id)
                        setMsg(`Equipped ${a.name}.`)
                      }}
                    >
                      Equip
                    </button>
                  )}
                  {!owned && (
                    <button
                      type="button"
                      className="btn-primary avatar-tile__btn"
                      disabled={user.balance < a.cost}
                      onClick={() => {
                        const ok = purchaseAvatar(a.id)
                        setMsg(ok ? `Unlocked ${a.name}!` : 'Not enough coins or already owned.')
                      }}
                    >
                      {a.cost === 0 ? 'Claim' : 'Buy'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          {msg && (
            <p className="avatar-shop__msg" role="status">
              {msg}
            </p>
          )}
        </section>

        <ul className="settings-list">
          <li>
            <span>Connect</span>
            <span className="muted">Google · Apple · FB</span>
          </li>
          <li>
            <span>Username</span>
            <span className="muted">@{user.username}</span>
          </li>
          <li>
            <span>User ID</span>
            <code className="code">{user.uid}</code>
          </li>
          <li>
            <span>Balance</span>
            <span className="coin-inline">
              <CoinIcon className="coin-inline__icon" /> {user.balance.toLocaleString()} X-Coins
            </span>
          </li>
          <li>
            <span>Notifications</span>
            <label className="toggle">
              <input type="checkbox" defaultChecked /> On
            </label>
          </li>
        </ul>

        <section className="settings-social">
          <h2 className="section-title">Follow PredictX</h2>
          <p className="muted small">Get updates, drops, and community highlights.</p>
          <div className="settings-social__links">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost settings-social__link"
              >
                {item.label}
              </a>
            ))}
          </div>
        </section>

        <section className="settings-social">
          <h2 className="section-title">Team</h2>
          <p className="muted small">Open the daily KPI analytics dashboard.</p>
          <Link to="/analytics" className="btn-ghost settings-social__link">
            Open analytics dashboard
          </Link>
        </section>
      </div>
    </div>
  )
}
