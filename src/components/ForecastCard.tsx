import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react'
import type { Forecast } from '../types'
import { CategoryIcon } from './icons/CategoryIcons'
import { ForecastBadges } from './StatusBadges'
import { optionShare } from '../lib/parimutuel'
import { StakeSheet } from './StakeSheet'
import { useAppState } from '../context/useAppState'
import { UserAvatar } from './UserAvatar'

const DESCRIPTION_EXPAND_THRESHOLD = 140

function formatEnds(endsAt: number) {
  const d = new Date(endsAt)
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

type Props = {
  forecast: Forecast
  active: boolean
}

export function ForecastCard({ forecast: f, active }: Props) {
  const { toggleLove, lovedIds } = useAppState()
  const loved = lovedIds.has(f.id)
  const [sheetOption, setSheetOption] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [descOpen, setDescOpen] = useState(false)
  const [videoBroken, setVideoBroken] = useState(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  /** Uploaded cover image always wins the hero slot on the reel (over default/demo video). */
  const hasHeroImage = Boolean(f.mediaUrl?.trim())
  const hasHeroVideo =
    Boolean(f.mediaVideoUrl?.trim()) && !videoBroken && !hasHeroImage
  const descExpandable = f.description.length > DESCRIPTION_EXPAND_THRESHOLD

  useEffect(() => {
    const el = videoRef.current
    if (!el || !hasHeroVideo) return
    if (descOpen) {
      el.pause()
      return
    }
    if (active) {
      void el.play().catch(() => {})
    } else {
      el.pause()
    }
  }, [active, hasHeroVideo, descOpen])

  const onTouchStart = useCallback((e: TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }, [])

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchStart.current) return
      const t = e.changedTouches[0]
      const dx = t.clientX - touchStart.current.x
      const dy = t.clientY - touchStart.current.y
      touchStart.current = null
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return
      if (dx < 0 && f.options[0]) setSheetOption(f.options[0].id)
      if (dx > 0 && f.options[1]) setSheetOption(f.options[1].id)
    },
    [f.options],
  )

  const shareA = optionShare(f.options[0], f.options)
  const shareB = f.options[1] ? optionShare(f.options[1], f.options) : 0

  return (
    <article className={`forecast-card${active ? ' is-active' : ''}`}>
      <div
        className="forecast-card__media"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="forecast-card__bg" style={{ background: f.mediaBackdrop }} aria-hidden />

        {hasHeroImage && f.mediaUrl && (
          <img
            src={f.mediaUrl}
            alt=""
            className="forecast-card__media-img"
            loading="eager"
            decoding="async"
          />
        )}

        {hasHeroVideo && f.mediaVideoUrl && (
          <video
            ref={videoRef}
            className="forecast-card__video"
            src={f.mediaVideoUrl}
            muted
            loop
            playsInline
            onError={() => setVideoBroken(true)}
          />
        )}

        <div className="forecast-card__vignette" />
        <div className="forecast-card__grain" aria-hidden />

        {descOpen && (
          <div
            className="forecast-desc-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`desc-${f.id}`}
          >
            <button
              type="button"
              className="forecast-desc-drawer__scrim"
              aria-label="Close details"
              onClick={() => setDescOpen(false)}
            />
            <div className="forecast-desc-drawer__panel">
              <div className="forecast-desc-drawer__head">
                <strong id={`desc-${f.id}`}>Full details</strong>
                <button type="button" className="forecast-desc-drawer__close" onClick={() => setDescOpen(false)}>
                  Close
                </button>
              </div>
              <div className="forecast-desc-drawer__body">{f.description}</div>
            </div>
          </div>
        )}

        <div className="forecast-card__top">
          <span className="forecast-card__cat">
            <CategoryIcon category={f.category} size={18} />
            {f.category}
          </span>
          <ForecastBadges f={f} />
        </div>

        <div className="forecast-card__side-actions">
          <button
            type="button"
            className={`side-btn${loved ? ' is-on' : ''}`}
            aria-pressed={loved}
            onClick={() => toggleLove(f.id)}
          >
            ♥
          </button>
          <button type="button" className="side-btn" aria-label="Share" onClick={() => setToast('Link copied (demo)')}>
            ↗
          </button>
          <button type="button" className="side-btn" aria-label="Repost" onClick={() => setToast('Reposted to your crew (demo)')}>
            ⟲
          </button>
          <button type="button" className="side-btn" aria-label="Comments" onClick={() => setToast('Comments open soon')}>
            ☰
          </button>
        </div>

        <div className="forecast-card__bottom">
          <div className="forecast-card__creator">
            <span className="forecast-card__avatar">
              <UserAvatar avatarId={f.creatorAvatarId} emojiFallback={f.creatorAvatarEmoji} />
            </span>
            <div className="forecast-card__creator-text">
              <span className="forecast-card__handle">@{f.creatorUsername}</span>
              <h2 className="forecast-card__title">{f.title}</h2>
              {descExpandable ? (
                <button
                  type="button"
                  className="forecast-card__desc-btn"
                  onClick={() => setDescOpen(true)}
                  aria-expanded={descOpen}
                  aria-label="Read full description"
                >
                  <span className="forecast-card__desc-clamped">{f.description}</span>
                </button>
              ) : (
                <p className="forecast-card__desc">{f.description}</p>
              )}
            </div>
          </div>
          <p className="forecast-card__resolve">
            Resolves {formatEnds(f.endsAt)} · {f.resolutionCriteria}
          </p>
          <div className="forecast-card__sentiment">
            <button type="button" className="sentiment sentiment--a" onClick={() => setSheetOption(f.options[0].id)}>
              <span>{f.options[0].text}</span>
              <strong>{(shareA * 100).toFixed(0)}%</strong>
            </button>
            {f.options[1] && (
              <button type="button" className="sentiment sentiment--b" onClick={() => setSheetOption(f.options[1].id)}>
                <span>{f.options[1].text}</span>
                <strong>{(shareB * 100).toFixed(0)}%</strong>
              </button>
            )}
          </div>
          <p className="forecast-card__swipe-hint">Swipe left / right to pick a side (mobile)</p>
        </div>
      </div>

      {toast && (
        <div className="forecast-toast" role="status">
          {toast}
          <button type="button" onClick={() => setToast(null)}>
            OK
          </button>
        </div>
      )}

      {sheetOption && (
        <StakeSheet
          forecast={f}
          optionId={sheetOption}
          onClose={() => setSheetOption(null)}
          onSuccess={() => {
            setSheetOption(null)
            setToast('Staked! Good luck, savant.')
          }}
        />
      )}
    </article>
  )
}
