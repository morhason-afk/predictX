import { Link } from 'react-router-dom'
import { useAppState } from '../context/useAppState'
import { UserAvatar } from '../components/UserAvatar'

export function ProfilePage() {
  const { user, predictions } = useAppState()
  return (
    <div className="mobile-screen">
      <header className="mobile-screen__header">
        <div className="profile-head">
          <div className={`profile-avatar${user.level >= 4 ? ' profile-avatar--savant' : ''}`}>
            <UserAvatar avatarId={user.avatarId} savant={user.level >= 4} className="profile-avatar__inner" />
          </div>
          <div>
            <h1 className="screen-title tight">@{user.username}</h1>
            <p className="screen-lead tight">Lv {user.level} · {user.xp} XP</p>
          </div>
          <Link to="/settings" className="btn-ghost">
            Settings
          </Link>
        </div>
      </header>
      <div className="mobile-screen__scroll">
        <div className="stat-grid">
          <div className="stat-card">
            <span>Wins</span>
            <strong>{user.stats.totalWins}</strong>
          </div>
          <div className="stat-card">
            <span>Losses</span>
            <strong>{user.stats.totalLosses}</strong>
          </div>
          <div className="stat-card">
            <span>Underdog</span>
            <strong>{user.stats.underdogWins}</strong>
          </div>
          <div className="stat-card">
            <span>Creator</span>
            <strong>{user.stats.creatorScore}</strong>
          </div>
        </div>

        <h2 className="section-title">Recent stakes</h2>
        <ul className="mini-predictions">
          {predictions.length === 0 && <li className="muted">No stakes yet — hit the feed.</li>}
          {predictions.slice(-8).reverse().map((p) => (
            <li key={p.id}>
              <span>{p.stake} coins</span>
              <span className="muted"> · {new Date(p.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
