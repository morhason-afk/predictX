import type { Forecast } from '../types'
import { demoVideoForIndex } from '../lib/demoVideos'

const CATEGORIES = ['Sports', 'Politics', 'Crypto', 'Pop Culture', 'Personal'] as const

const CREATORS = [
  { id: 'cr1', username: 'courtvision', emoji: '🏀', avatarId: 'av0' },
  { id: 'cr2', username: 'capitolpulse', emoji: '🏛️', avatarId: 'av1' },
  { id: 'cr3', username: 'chainradar', emoji: '₿', avatarId: 'av2' },
  { id: 'cr4', username: 'afterdark', emoji: '🔥', avatarId: 'av3' },
  { id: 'cr5', username: 'ski_crew', emoji: '🎿', avatarId: 'av4' },
  { id: 'cr6', username: 'prophet_j', emoji: '🔮', avatarId: 'av5' },
  { id: 'cr7', username: 'line_sharp', emoji: '📊', avatarId: 'av6' },
  { id: 'cr8', username: 'ballknows', emoji: '⚽', avatarId: 'av7' },
  { id: 'cr9', username: 'whiplash_news', emoji: '📰', avatarId: 'av8' },
  { id: 'cr10', username: 'minted_memes', emoji: '🐸', avatarId: 'av9' },
  { id: 'cr11', username: 'dorm_oracle', emoji: '🎓', avatarId: 'av10' },
  { id: 'cr12', username: 'weekend_warrior', emoji: '🏈', avatarId: 'av11' },
] as const

const GRADIENTS = [
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 45%, #e94560 100%)',
  'linear-gradient(160deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  'linear-gradient(125deg, #141e30 0%, #243b55 45%, #f7971e 100%)',
  'linear-gradient(180deg, #2d1b69 0%, #11998e 55%, #38ef7d 100%)',
  'linear-gradient(220deg, #373b44 0%, #4286f4 100%)',
  'linear-gradient(145deg, #0c0c0c 0%, #434343 50%, #000 100%)',
  'linear-gradient(120deg, #8360c3 0%, #2ebf91 100%)',
  'linear-gradient(200deg, #654ea3 0%, #eaafc8 100%)',
  'linear-gradient(165deg, #355c7d 0%, #6c5b7b 50%, #c06c84 100%)',
  'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
  'linear-gradient(175deg, #403b4a 0%, #e7a0a0 100%)',
  'linear-gradient(130deg, #000428 0%, #004e92 100%)',
  'linear-gradient(190deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)',
  'linear-gradient(110deg, #134e5e 0%, #71b280 100%)',
  'linear-gradient(155deg, #5f2c82 0%, #49a09d 100%)',
]

const TITLE_HOOKS: Record<(typeof CATEGORIES)[number], string[]> = {
  Sports: [
    'Cover the closing spread?',
    'Hit the game total over?',
    'First team to 30 points?',
    'Any player posts a triple-double?',
    'Overtime played?',
    'Walk-off or buzzer-beater finish?',
    'Clean sheet for the favorite?',
    'Red card shown before halftime?',
    'Penalty shootout required?',
    'Series goes to game seven?',
  ],
  Politics: [
    'Bill clears committee this week?',
    'Poll swing ≥ 3 pts in 48h?',
    'Surprise resignation before month end?',
    'Third-party candidate qualifies?',
    'Debate draws record viewers?',
    'Executive order signed on topic?',
    'Hearing runs past midnight?',
    'Bipartisan deal announced?',
    'Shutdown averted?',
    'Cabinet nominee confirmed?',
  ],
  Crypto: [
    'Weekly close above key level?',
    'Funding flips positive 24h?',
    'Major L2 TVL up 10% week?',
    'ETF daily inflow record?',
    'Gas under threshold weekend?',
    'Stablecoin supply expands?',
    'Exploit disclosed this quarter?',
    'Reg headline moves futures?',
    'Airdrop announced?',
    'Bridge volume beats prior ATH?',
  ],
  'Pop Culture': [
    'Finale beats prior season high?',
    'Album debuts #1 Billboard?',
    'Trailer breaks view record?',
    'Award upset in major category?',
    'Celebrity collab announced?',
    'Show renewed for extra season?',
    'Box office beats tracking?',
    'Viral sound hits chart top 10?',
    'Reunion episode confirmed?',
    'Spin-off greenlit?',
  ],
  Personal: [
    'Trip stays on budget?',
    'Wedding weather holds?',
    'Group chat hits 99+ unread?',
    'Someone adopts the stray?',
    'BBQ happens despite forecast?',
    'Road trip on time ±30m?',
    'Secret Santa chaos resolved?',
    'New PB at the 5k?',
    'Lease signed before deadline?',
    'Couch finally arrives?',
  ],
}

const RESOLUTION_SNIPPETS: Record<(typeof CATEGORIES)[number], string[]> = {
  Sports: ['Official league box score.', 'Verified broadcast clock.', 'Team injury report PDF.'],
  Politics: ['Congress.gov roll call.', 'AP / Reuters wire.', 'Official docket filing.'],
  Crypto: ['Index close from agreed oracle.', 'On-chain snapshot block.', 'Exchange published tape.'],
  'Pop Culture': ['Nielsen / Billboard public data.', 'Network press release.', 'Certified stream counts.'],
  Personal: ['Timestamped photo in shared album.', 'Banking app screenshot.', 'Group vote in chat poll.'],
}

/** Extra block for ~25% of forecasts to exercise long scroll in the panel */
const SUPER_LONG_APPENDIX = ` Additional deep context for power users: we log the exact resolution timestamp in UTC, store a hash of the source document where possible, and keep an audit trail so leaderboard disputes are rare. If two reputable sources disagree, the market uses the precedence order pinned in the forecast footer — always read that block before staking. Community moderators can flag markets that become impossible to resolve; flagged markets may be voided with refunds in production. For entertainment-only personal markets, creators should attach a clear rubric (“counts if X posts proof in the group by Sunday”). Remember: X-Coins are virtual; the real prize is bragging rights and Savant rank. Staking early can move sentiment; staking late can chase value on an underdog line. Neither this demo nor the eventual app offers financial advice — you are playing a social forecasting game. Duplicate accounts, botting, and coordinated wash staking are against the spirit of the platform and will be filtered when trust systems ship. Thanks for helping stress-test copy length and UI wrapping — this paragraph exists so designers can validate scroll behavior in the expanded description drawer without shipping a novel in every single card. `

function pseudoRand(i: number, salt: number): number {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 10000
  return x - Math.floor(x)
}

function buildDescription(
  cat: (typeof CATEGORIES)[number],
  title: string,
  index: number,
): string {
  const superLong = index % 4 === 0
  const a = `This is forecast #${index + 1} in the PredictX demo deck — “${title}”. It lives in the ${cat} lane, which shapes how the Savant feed ranks it against your interests. `
  const b = `Staking uses virtual X-Coins only; you are not entering a regulated market. Resolution follows the single source of truth named in the resolve line — screenshots, podcasts, and groupchat lore do not override that unless explicitly allowed. `
  const c = `Before you size a stake, skim engagement: hot markets can swing fast as new players pile into one side. Underdog alerts fire when one option is getting crushed in the pool but still has a puncher’s chance — those wins feel best on the leaderboard. `
  const d = `Notifications (when enabled) will nudge you at lock and resolve so you do not miss the drama. In production, creators can attach media, pin comments, and run companion leaderboards; here we focus on the core loop: watch, read, pick a side, flex when you are right. `
  const e = `If the wording ever feels ambiguous, default to the conservative interpretation that favors voiding rather than forcing a bad call — good creators rewrite the rubric until it is boringly clear. `
  let out = a + b + c + d + e
  if (superLong) out += SUPER_LONG_APPENDIX
  out += ` TL;DR: read the footer, pick a side, invite friends who think they are smarter than you.`
  return out
}

function buildForecast(i: number): Forecast {
  const now = Date.now()
  const cat = CATEGORIES[i % CATEGORIES.length]
  const hooks = TITLE_HOOKS[cat]
  const hook = hooks[i % hooks.length]!
  const title = `${cat} · ${hook} (#${i + 1})`
  const creator = CREATORS[i % CREATORS.length]!
  const r = pseudoRand(i, 1)
  const r2 = pseudoRand(i, 2)
  const wA = 400 + Math.floor(r * 8000)
  const wB = 300 + Math.floor(r2 * 7000)
  const pA = 20 + Math.floor((r + r2) * 80)
  const pB = 15 + Math.floor((r * 1.3 + r2) * 70)
  const resList = RESOLUTION_SNIPPETS[cat]
  const resolutionCriteria = resList[i % resList.length]!
  const endsAt = now + (6 + (i % 120)) * 3600_000
  const id = `fx-${i + 1}`

  return {
    id,
    creatorId: creator.id,
    creatorUsername: creator.username,
    creatorAvatarEmoji: creator.emoji,
    creatorAvatarId: creator.avatarId,
    title,
    description: buildDescription(cat, title, i),
    mediaUrl: null,
    mediaVideoUrl: demoVideoForIndex(i),
    mediaBackdrop: GRADIENTS[i % GRADIENTS.length]!,
    status: 'open',
    options: [
      { id: `${id}-a`, text: 'Yes', totalWeight: wA, totalParticipants: pA },
      { id: `${id}-b`, text: 'No', totalWeight: wB, totalParticipants: pB },
    ],
    resolutionCriteria,
    endsAt,
    category: cat,
    engagementScore: 20 + (i % 75),
    createdAt: now - (i % 200) * 3600_000 - Math.floor(pseudoRand(i, 3) * 86400_000),
    verifiedCreator: i % 7 === 0,
  }
}

export function buildMockForecasts(): Forecast[] {
  return Array.from({ length: 100 }, (_, i) => buildForecast(i))
}
