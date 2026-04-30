import { useState } from 'react'
import { useAppState } from '../context/useAppState'
import { CategoryIcon } from './icons/CategoryIcons'
import { CoinIcon } from './icons/CoinIcon'

const CATEGORIES = ['Sports', 'Politics', 'Crypto', 'Pop Culture', 'Personal'] as const

export function FtueOverlay() {
  const { setInterests, addCoins, completeFtue } = useAppState()
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<string[]>(['Sports'])

  const next = () => setStep((s) => s + 1)

  return (
    <div className="ftue" role="dialog" aria-modal aria-labelledby="ftue-title">
      <div className="ftue__panel">
        {step === 0 && (
          <>
            <h2 id="ftue-title">Pick your vibe</h2>
            <p className="ftue__sub">We weight your Savant feed by what you care about.</p>
            <div className="ftue__chips">
              {CATEGORIES.map((c) => {
                const on = picked.includes(c)
                return (
                  <button
                    key={c}
                    type="button"
                    className={`ftue-chip${on ? ' is-on' : ''}`}
                    onClick={() =>
                      setPicked((p) => (on ? p.filter((x) => x !== c) : [...p, c]))
                    }
                  >
                    <CategoryIcon category={c} size={20} />
                    {c}
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              className="ftue__primary"
              disabled={picked.length === 0}
              onClick={() => {
                setInterests(picked)
                next()
              }}
            >
              Continue
            </button>
          </>
        )}
        {step === 1 && (
          <>
            <h2 id="ftue-title">Swipe the feed</h2>
            <p className="ftue__sub">Vertical snaps switch forecasts like stories — stay on what feels live.</p>
            <div className="ftue__illus ftue__illus--swipe" aria-hidden />
            <button type="button" className="ftue__primary" onClick={next}>
              Got it
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <h2 id="ftue-title">Pick a side</h2>
            <p className="ftue__sub">
              Swipe left/right on the card or tap a sentiment bar.{' '}
              <span className="coin-inline">
                <CoinIcon className="coin-inline__icon" /> X-Coins
              </span>{' '}
              fuel the pool — no real money.
            </p>
            <div className="ftue__illus ftue__illus--stake" aria-hidden />
            <button type="button" className="ftue__primary" onClick={next}>
              Next
            </button>
          </>
        )}
        {step === 3 && (
          <>
            <h2 id="ftue-title">Claim welcome coins</h2>
            <p className="ftue__sub">Daily streaks and packs live in the store — here’s a head start.</p>
            <button
              type="button"
              className="ftue__primary"
              onClick={() => {
                addCoins(500)
                completeFtue()
              }}
            >
              <span className="coin-inline">
                Collect <CoinIcon className="coin-inline__icon" /> 500 X-Coins
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
