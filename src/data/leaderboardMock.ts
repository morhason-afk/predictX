/** Mock top-3 rows per progression metric (avatars use catalog ids). */
export type LeaderRow = {
  rank: 1 | 2 | 3
  username: string
  avatarId: string
  value: string
}

export type LeaderboardSection = {
  id: string
  title: string
  rule: string
  cadence: 'daily' | 'weekly'
  endsAt: number
  rewards: { first: number; second: number; third: number }
  rows: LeaderRow[]
}

function nextLocalMidnight() {
  const d = new Date()
  d.setHours(24, 0, 0, 0)
  return d.getTime()
}

function nextWeekBoundary() {
  const d = new Date()
  const day = d.getDay()
  const daysUntilMonday = day === 0 ? 1 : 8 - day
  d.setDate(d.getDate() + daysUntilMonday)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

const DAILY_REWARDS = { first: 1200, second: 700, third: 400 }
const WEEKLY_REWARDS = { first: 6000, second: 3500, third: 2000 }
const DAILY_END = nextLocalMidnight()
const WEEKLY_END = nextWeekBoundary()

export const LEADERBOARD_SECTIONS: LeaderboardSection[] = [
  {
    id: 'bet-volume',
    title: 'Total bet volume',
    rule: 'Sum of X-Coins you have staked (all markets).',
    cadence: 'weekly',
    endsAt: WEEKLY_END,
    rewards: WEEKLY_REWARDS,
    rows: [
      { rank: 1, username: 'savant_demo', avatarId: 'av12', value: '204k coins' },
      { rank: 2, username: 'nightshift', avatarId: 'av8', value: '188k coins' },
      { rank: 3, username: 'prophet_j', avatarId: 'av6', value: '171k coins' },
    ],
  },
  {
    id: 'bet-count',
    title: 'Forecast count',
    rule: 'Number of stakes you have placed.',
    cadence: 'daily',
    endsAt: DAILY_END,
    rewards: DAILY_REWARDS,
    rows: [
      { rank: 1, username: 'line_sharp', avatarId: 'av7', value: '2,841 stakes' },
      { rank: 2, username: 'savant_demo', avatarId: 'av12', value: '2,604 stakes' },
      { rank: 3, username: 'ballknows', avatarId: 'av5', value: '2,112 stakes' },
    ],
  },
  {
    id: 'loves',
    title: 'Loves received',
    rule: 'Hearts on forecasts you created.',
    cadence: 'weekly',
    endsAt: WEEKLY_END,
    rewards: WEEKLY_REWARDS,
    rows: [
      { rank: 1, username: 'courtvision', avatarId: 'av0', value: '418k loves' },
      { rank: 2, username: 'afterdark', avatarId: 'av4', value: '362k loves' },
      { rank: 3, username: 'chainradar', avatarId: 'av2', value: '301k loves' },
    ],
  },
  {
    id: 'reposts',
    title: 'Reposts',
    rule: 'In-app reposts of your forecasts.',
    cadence: 'daily',
    endsAt: DAILY_END,
    rewards: DAILY_REWARDS,
    rows: [
      { rank: 1, username: 'whiplash_news', avatarId: 'av9', value: '92k reposts' },
      { rank: 2, username: 'minted_memes', avatarId: 'av10', value: '81k reposts' },
      { rank: 3, username: 'capitolpulse', avatarId: 'av1', value: '74k reposts' },
    ],
  },
  {
    id: 'wins',
    title: 'Resolved wins',
    rule: 'Correct calls on settled markets.',
    cadence: 'weekly',
    endsAt: WEEKLY_END,
    rewards: WEEKLY_REWARDS,
    rows: [
      { rank: 1, username: 'savant_demo', avatarId: 'av12', value: '412 wins' },
      { rank: 2, username: 'dorm_oracle', avatarId: 'av3', value: '388 wins' },
      { rank: 3, username: 'weekend_warrior', avatarId: 'av11', value: '355 wins' },
    ],
  },
  {
    id: 'underdog-wins',
    title: 'Underdog wins',
    rule: 'Wins when your side was under 35% pool share at stake time.',
    cadence: 'daily',
    endsAt: DAILY_END,
    rewards: DAILY_REWARDS,
    rows: [
      { rank: 1, username: 'prophet_j', avatarId: 'av6', value: '118 wins' },
      { rank: 2, username: 'savant_demo', avatarId: 'av12', value: '104 wins' },
      { rank: 3, username: 'nightshift', avatarId: 'av8', value: '97 wins' },
    ],
  },
  {
    id: 'creator-pool',
    title: 'Creator pool draw',
    rule: 'Total stakes on forecasts you published.',
    cadence: 'weekly',
    endsAt: WEEKLY_END,
    rewards: WEEKLY_REWARDS,
    rows: [
      { rank: 1, username: 'courtvision', avatarId: 'av0', value: '512k pool' },
      { rank: 2, username: 'chainradar', avatarId: 'av2', value: '441k pool' },
      { rank: 3, username: 'afterdark', avatarId: 'av4', value: '398k pool' },
    ],
  },
  {
    id: 'savant-score',
    title: 'Savant score',
    rule: 'Blended feed rank score (demo composite).',
    cadence: 'daily',
    endsAt: DAILY_END,
    rewards: DAILY_REWARDS,
    rows: [
      { rank: 1, username: 'chainradar', avatarId: 'av2', value: '9.8k' },
      { rank: 2, username: 'courtvision', avatarId: 'av0', value: '9.1k' },
      { rank: 3, username: 'savant_demo', avatarId: 'av12', value: '8.6k' },
    ],
  },
]

/** Deep clone of the default sections (used for initial / per-session leaderboard state). */
export function cloneDefaultLeaderboardSections(): LeaderboardSection[] {
  return JSON.parse(JSON.stringify(LEADERBOARD_SECTIONS)) as LeaderboardSection[]
}
