import { NavLink } from 'react-router-dom'
import { useAppState } from '../context/useAppState'
import { IconCreate, IconHistory, IconHome, IconSearch, IconTrophy } from './icons/NavIcons'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `bottom-nav__link${isActive ? ' is-active' : ''}`

export function BottomNav() {
  const { resolvedParticipatedCount } = useAppState()
  const needsHistoryAlert = resolvedParticipatedCount > 0

  return (
    <nav className="bottom-nav" aria-label="Main">
      <NavLink to="/" end className={linkClass}>
        <IconHome />
        <span>Feed</span>
      </NavLink>
      <NavLink to="/search" className={linkClass}>
        <IconSearch />
        <span>Search</span>
      </NavLink>
      <NavLink to="/create" className={linkClass}>
        <IconCreate />
        <span>Create</span>
      </NavLink>
      <NavLink to="/leaderboards" className={linkClass}>
        <IconTrophy />
        <span>Leaderboards</span>
      </NavLink>
      <NavLink
        to="/history"
        className={({ isActive }) =>
          `bottom-nav__link${isActive ? ' is-active' : ''}${needsHistoryAlert ? ' has-alert' : ''}`
        }
        aria-label={needsHistoryAlert ? 'History — action needed' : undefined}
      >
        <IconHistory />
        <span className="bottom-nav__label-wrap">
          <span>History</span>
          {needsHistoryAlert && (
            <span className="bottom-nav__alert-mark" aria-hidden>
              !
            </span>
          )}
        </span>
      </NavLink>
    </nav>
  )
}
