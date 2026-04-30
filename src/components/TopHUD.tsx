import { Link } from 'react-router-dom'
import { useAppState } from '../context/useAppState'
import { UserAvatar } from './UserAvatar'
import { CoinIcon } from './icons/CoinIcon'

type Props = {
  menuOpen: boolean
  onMenuToggle: () => void
}

export function TopHUD({ menuOpen, onMenuToggle }: Props) {
  const { user } = useAppState()
  return (
    <header className="top-hud">
      <div className="top-hud__brand">
        <span className="top-hud__logo" aria-hidden>
          X
        </span>
        <span className="top-hud__name">PredictX</span>
      </div>
      <Link to="/profile" className="top-hud__avatar" aria-label="Profile" title="Profile">
        <UserAvatar avatarId={user.avatarId} savant={user.level >= 4} />
      </Link>
      <Link to="/store" className="top-hud__coins" aria-label="Open store">
        <CoinIcon className="top-hud__coin-icon" />
        <span className="top-hud__balance">{user.balance.toLocaleString()}</span>
      </Link>
      <div className="top-hud__level" title="XP / Level">
        <span className="top-hud__lvl-label">Lv</span>
        <span className="top-hud__lvl-num">{user.level}</span>
      </div>
      <button
        type="button"
        className={`top-hud__menu-btn${menuOpen ? ' is-open' : ''}`}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={onMenuToggle}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  )
}
