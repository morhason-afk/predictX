import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const SLIDES = [
  {
    id: '1',
    title: 'Starter pack',
    sub: '2,000 bonus X-Coins',
    cta: 'Shop',
    to: '/store',
    gradient: 'linear-gradient(95deg, #4f46e5, #a855f7)',
  },
  {
    id: '2',
    title: 'Savant Cup',
    sub: 'Climb the board this week',
    cta: 'Leaderboards',
    to: '/leaderboards',
    gradient: 'linear-gradient(95deg, #0ea5e9, #6366f1)',
  },
  {
    id: '3',
    title: 'Daily streak',
    sub: 'Claim rewards',
    cta: 'Store',
    to: '/store',
    gradient: 'linear-gradient(95deg, #f97316, #ec4899)',
  },
] as const

type Props = {
  /** Floated over the feed so vertical scroll is only forecasts (Reels-style). */
  overlay?: boolean
}

export function PromoBanner({ overlay = false }: Props) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 5200)
    return () => clearInterval(t)
  }, [])

  const slide = SLIDES[i]

  return (
    <div className={`promo-banner${overlay ? ' promo-banner--overlay' : ''}`}>
      <div
        key={slide.id}
        className="promo-banner__slide"
        style={{ background: slide.gradient }}
      >
        <div className="promo-banner__text">
          <strong>{slide.title}</strong>
          <span>{slide.sub}</span>
        </div>
        <div className="promo-banner__tail">
          <div className="promo-banner__dots" aria-hidden>
            {SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                className={`promo-banner__dot${idx === i ? ' is-active' : ''}`}
                onClick={() => setI(idx)}
                aria-label={`Promotion ${idx + 1}`}
              />
            ))}
          </div>
          <Link to={slide.to} className="promo-banner__cta">
            {slide.cta}
          </Link>
        </div>
      </div>
    </div>
  )
}
