import { useMemo, useRef, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ForecastCard } from '../components/ForecastCard'
import { PromoBanner } from '../components/PromoBanner'
import { useAppState } from '../context/useAppState'
import { FtueOverlay } from '../components/FtueOverlay'

export function FeedPage() {
  const { forecasts, rankedForecastIds, ftueDone } = useAppState()
  const [searchParams] = useSearchParams()
  const ordered = useMemo(() => {
    const map = new Map(forecasts.map((f) => [f.id, f]))
    return rankedForecastIds.map((id) => map.get(id)).filter(Boolean) as typeof forecasts
  }, [forecasts, rankedForecastIds])

  const containerRef = useRef<HTMLDivElement>(null)
  const [focusId, setFocusId] = useState<string | null>(null)
  const fallbackId = ordered[0]?.id ?? ''
  const activeId =
    focusId && ordered.some((f) => f.id === focusId) ? focusId : fallbackId

  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target) {
          const id = (visible.target as HTMLElement).dataset.id
          if (id) setFocusId(id)
        }
      },
      { root, threshold: [0.55, 0.65, 0.75] },
    )
    root.querySelectorAll('[data-id]').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [ordered])

  useEffect(() => {
    const forecastId = searchParams.get('forecast')
    if (!forecastId) return
    const root = containerRef.current
    if (!root) return
    const el = root.querySelector<HTMLElement>(`[data-id="${forecastId}"]`)
    if (!el) return
    el.scrollIntoView({ block: 'start', behavior: 'smooth' })
    setFocusId(forecastId)
  }, [searchParams, ordered])

  return (
    <div className="feed-page feed-page--promo">
      {!ftueDone && <FtueOverlay />}
      <div className="feed-scroll" ref={containerRef}>
        {ordered.map((f) => (
          <div key={f.id} data-id={f.id} className="feed-snap-item">
            <ForecastCard forecast={f} active={f.id === activeId} />
          </div>
        ))}
      </div>
      <div className="feed-promo-layer">
        <PromoBanner overlay />
      </div>
    </div>
  )
}
