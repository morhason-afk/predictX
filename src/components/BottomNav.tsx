import { NavLink } from 'react-router-dom'
import { IconCreate, IconHistory, IconHome, IconSearch, IconTrophy } from './icons/NavIcons'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `bottom-nav__link${isActive ? ' is-active' : ''}`

export function BottomNav() {
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
      <NavLink to="/history" className={linkClass}>
        <IconHistory />
        <span>History</span>
      </NavLink>
    </nav>
  )
}
