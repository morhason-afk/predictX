import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { TopHUD } from '../components/TopHUD'

const SOCIAL_LINKS = [
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/predictx' },
  { id: 'tiktok', label: 'TikTok', href: 'https://tiktok.com/@predictx' },
  { id: 'youtube', label: 'YouTube', href: 'https://youtube.com/@predictx' },
  { id: 'x', label: 'X (Twitter)', href: 'https://x.com/predictx' },
  { id: 'reddit', label: 'Reddit', href: 'https://reddit.com/r/predictx' },
] as const

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [inviteMsg, setInviteMsg] = useState<string | null>(null)
  const inviteText = 'Join me on PredictX and make your calls.'
  const inviteUrl = 'https://predict-x.netlify.app'

  const closeMenu = () => setMenuOpen(false)

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(`${inviteText} ${inviteUrl}`)
      setInviteMsg('Invite link copied.')
    } catch {
      setInviteMsg('Could not copy link on this device.')
    }
  }

  return (
    <div className="app-shell">
      <TopHUD menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((v) => !v)} />
      <main className="app-main">
        <div className="app-screen">
          <Outlet />
        </div>
      </main>
      <BottomNav />

      <div
        className={`side-menu-scrim${menuOpen ? ' is-open' : ''}`}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />
      <aside className={`side-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <h2 className="side-menu__title">Menu</h2>
        <nav className="side-menu__nav" aria-label="Sidebar menu">
          <Link to="/store" className="side-menu__item" onClick={closeMenu}>
            Store
          </Link>
          <Link to="/leaderboards" className="side-menu__item" onClick={closeMenu}>
            Leaderboards
          </Link>
          <Link to="/settings" className="side-menu__item" onClick={closeMenu}>
            Settings
          </Link>
          <Link to="/profile" className="side-menu__item" onClick={closeMenu}>
            Profile
          </Link>
          <Link to="/history" className="side-menu__item" onClick={closeMenu}>
            Forecasts history
          </Link>
          <Link to="/settle-created-forecasts" className="side-menu__item" onClick={closeMenu}>
            Settle created forecasts
          </Link>
          <Link to="/backoffice" className="side-menu__item" onClick={closeMenu}>
            Backoffice
          </Link>
          <Link to="/analytics" className="side-menu__item" onClick={closeMenu}>
            Data
          </Link>
          <button type="button" className="side-menu__item is-disabled" disabled>
            Clans <span className="side-menu__badge">Coming soon</span>
          </button>
          <button type="button" className="side-menu__item is-disabled" disabled>
            Creator tools <span className="side-menu__badge">Coming soon</span>
          </button>
          <Link to="/store?tab=rewards" className="side-menu__item" onClick={closeMenu}>
            Rewards
          </Link>
        </nav>

        <section className="side-menu__invite">
          <h3>Invite a friend</h3>
          <div className="side-menu__invite-actions">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${inviteText} ${inviteUrl}`)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              WhatsApp
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent('PredictX invite')}&body=${encodeURIComponent(`${inviteText}\n\n${inviteUrl}`)}`}
              className="btn-ghost"
            >
              Email
            </a>
            <button type="button" className="btn-ghost" onClick={copyInvite}>
              Copy link
            </button>
          </div>
          {inviteMsg && <p className="side-menu__invite-msg">{inviteMsg}</p>}
        </section>

        <section className="side-menu__social">
          <h3>Follow PredictX</h3>
          <div className="side-menu__social-links">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="side-menu__social-link"
              >
                {item.label}
              </a>
            ))}
          </div>
        </section>
      </aside>
    </div>
  )
}
