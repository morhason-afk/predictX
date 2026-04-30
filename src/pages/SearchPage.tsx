import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppState } from '../context/useAppState'
import { CategoryIcon } from '../components/icons/CategoryIcons'
import { UserAvatar } from '../components/UserAvatar'

const CATS = ['Sports', 'Politics', 'Crypto', 'Pop Culture', 'Personal'] as const

export function SearchPage() {
  const { forecasts } = useAppState()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string | null>(null)

  const list = useMemo(() => {
    return forecasts.filter((f) => {
      const matchesQ =
        !q ||
        f.title.toLowerCase().includes(q.toLowerCase()) ||
        f.description.toLowerCase().includes(q.toLowerCase())
      const matchesC = !cat || f.category === cat
      return matchesQ && matchesC
    })
  }, [forecasts, q, cat])

  return (
    <div className="mobile-screen">
      <header className="mobile-screen__header">
        <h1 className="screen-title">Search</h1>
        <input
          className="search-input"
          placeholder="Find a forecast…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="chip-row chip-row--tight">
          <button
            type="button"
            className={`mini-chip${cat === null ? ' is-on' : ''}`}
            onClick={() => setCat(null)}
          >
            All
          </button>
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              className={`mini-chip${cat === c ? ' is-on' : ''}`}
              onClick={() => setCat(c)}
            >
              <CategoryIcon category={c} size={16} />
              {c}
            </button>
          ))}
        </div>
      </header>
      <div className="mobile-screen__scroll">
        <ul className="result-list">
          {list.map((f) => (
            <li key={f.id}>
              <Link to="/" className="result-card">
                <div className="result-card__thumb" style={{ background: f.mediaBackdrop }} />
                <div className="result-card__body">
                  <span className="result-card__cat">{f.category}</span>
                  <strong>{f.title}</strong>
                  <span className="result-card__creator">
                    <UserAvatar avatarId={f.creatorAvatarId} emojiFallback={f.creatorAvatarEmoji} />
                    @{f.creatorUsername}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
