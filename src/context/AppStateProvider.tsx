import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Forecast, Prediction, UserProfile } from '../types'
import { MOCK_FORECASTS } from '../data/mockForecasts'
import { AVATAR_CATALOG, FREE_AVATAR_IDS, getAvatarGlyph } from '../data/avatarCatalog'
import { demoVideoForIndex } from '../lib/demoVideos'
import { rankForecasts } from '../lib/savantFeed'
import { LEADERBOARD_SECTIONS } from '../data/leaderboardMock'
import { AppStateContext, type CreateForecastDraft } from './AppStateContext'

const AVATAR_STORAGE_KEY = 'predictx_avatars'
const PROFILE_STORAGE_KEY = 'predictx_profile'
const STREAK_STORAGE_KEY = 'predictx_daily_streak'
const LEADERBOARD_REWARDS_STORAGE_KEY = 'predictx_leaderboard_rewards'
const STREAK_REWARDS = [100, 150, 225, 325, 450, 600, 750] as const

type DailyStreakState = {
  streak: number
  lastClaimDay: string | null
}

type PendingLeaderboardReward = {
  id: string
  boardId: string
  boardTitle: string
  place: 1 | 2 | 3
  rewardCoins: number
  cadence: 'daily' | 'weekly'
  cycleEndsAt: number
  collected: boolean
}

function localDayStamp(ts = Date.now()): string {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function dayDiff(a: string, b: string): number {
  const aMs = new Date(`${a}T00:00:00`).getTime()
  const bMs = new Date(`${b}T00:00:00`).getTime()
  const oneDay = 24 * 60 * 60 * 1000
  return Math.round((bMs - aMs) / oneDay)
}

function loadDailyStreakState(): DailyStreakState {
  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY)
    if (!raw) return { streak: 0, lastClaimDay: null }
    const parsed = JSON.parse(raw) as { streak?: number; lastClaimDay?: string | null }
    const streak = Math.max(0, Math.min(7, Number(parsed.streak) || 0))
    const lastClaimDay = typeof parsed.lastClaimDay === 'string' ? parsed.lastClaimDay : null
    return { streak, lastClaimDay }
  } catch {
    return { streak: 0, lastClaimDay: null }
  }
}

function saveDailyStreakState(state: DailyStreakState) {
  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

function loadPendingLeaderboardRewards(): PendingLeaderboardReward[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_REWARDS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as PendingLeaderboardReward[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((r) => typeof r.id === 'string' && typeof r.rewardCoins === 'number')
  } catch {
    return []
  }
}

function savePendingLeaderboardRewards(rewards: PendingLeaderboardReward[]) {
  try {
    localStorage.setItem(LEADERBOARD_REWARDS_STORAGE_KEY, JSON.stringify(rewards))
  } catch {
    /* ignore */
  }
}

function loadAvatarState(): Pick<UserProfile, 'avatarId' | 'ownedAvatarIds'> | null {
  try {
    const raw = localStorage.getItem(AVATAR_STORAGE_KEY)
    if (!raw) return null
    const o = JSON.parse(raw) as { avatarId?: string; ownedAvatarIds?: string[] }
    if (o.avatarId && Array.isArray(o.ownedAvatarIds)) {
      return { avatarId: o.avatarId, ownedAvatarIds: o.ownedAvatarIds }
    }
  } catch {
    /* ignore */
  }
  return null
}

function loadProfileState(): Pick<UserProfile, 'username'> | null {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { username?: string }
    if (typeof parsed.username !== 'string') return null
    const username = parsed.username.trim()
    if (!username) return null
    return { username }
  } catch {
    return null
  }
}

function saveProfileState(username: string) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ username }))
  } catch {
    /* ignore */
  }
}

function saveAvatarState(avatarId: string, ownedAvatarIds: string[]) {
  try {
    localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify({ avatarId, ownedAvatarIds }))
  } catch {
    /* ignore */
  }
}

const baseUser: UserProfile = {
  uid: 'demo-user-1',
  username: 'savant_demo',
  avatarUrl: '',
  avatarId: 'av0',
  ownedAvatarIds: [...FREE_AVATAR_IDS],
  cosmeticFrameId: null,
  balance: 1250,
  xp: 340,
  level: 4,
  interests: ['Sports', 'Crypto'],
  stats: {
    totalWins: 12,
    totalLosses: 9,
    underdogWins: 3,
    creatorScore: 48,
  },
}

function mergeInitialUser(): UserProfile {
  const saved = loadAvatarState()
  const profile = loadProfileState()
  const username = profile?.username ?? baseUser.username
  if (!saved) return { ...baseUser, username }
  const fromSave = saved.ownedAvatarIds.filter((id) => AVATAR_CATALOG.some((a) => a.id === id))
  const owned = new Set([...baseUser.ownedAvatarIds, ...fromSave])
  FREE_AVATAR_IDS.forEach((id) => owned.add(id))
  const avatarOk =
    saved.avatarId &&
    owned.has(saved.avatarId) &&
    AVATAR_CATALOG.some((a) => a.id === saved.avatarId)
  const avatarId = avatarOk ? saved.avatarId : baseUser.avatarId
  return {
    ...baseUser,
    username,
    avatarId,
    ownedAvatarIds: [...owned],
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => mergeInitialUser())
  const userRef = useRef(user)
  useEffect(() => {
    userRef.current = user
  }, [user])

  useEffect(() => {
    saveAvatarState(user.avatarId, user.ownedAvatarIds)
  }, [user.avatarId, user.ownedAvatarIds])

  useEffect(() => {
    saveProfileState(user.username)
  }, [user.username])

  const [rankAt] = useState(() => Date.now())
  const [dailyStreak, setDailyStreak] = useState<DailyStreakState>(() => loadDailyStreakState())
  const [pendingLeaderboardRewards, setPendingLeaderboardRewards] = useState<PendingLeaderboardReward[]>(
    () => loadPendingLeaderboardRewards(),
  )

  const [forecasts, setForecasts] = useState<Forecast[]>(MOCK_FORECASTS)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [lovedIds, setLovedIds] = useState<Set<string>>(new Set())
  const [ftueDone, setFtueDone] = useState(() => {
    try {
      return localStorage.getItem('predictx_ftue') === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    saveDailyStreakState(dailyStreak)
  }, [dailyStreak])

  useEffect(() => {
    savePendingLeaderboardRewards(pendingLeaderboardRewards)
  }, [pendingLeaderboardRewards])

  useEffect(() => {
    const now = Date.now()
    setPendingLeaderboardRewards((prev) => {
      const known = new Set(prev.map((r) => r.id))
      const additions: PendingLeaderboardReward[] = []

      LEADERBOARD_SECTIONS.forEach((board) => {
        if (board.endsAt > now) return
        const winnerRow = board.rows.find((row) => row.username === user.username)
        if (!winnerRow) return
        const rewardCoins =
          winnerRow.rank === 1
            ? board.rewards.first
            : winnerRow.rank === 2
              ? board.rewards.second
              : board.rewards.third
        const rewardId = `${board.id}:${board.endsAt}:${user.username}`
        if (known.has(rewardId)) return
        additions.push({
          id: rewardId,
          boardId: board.id,
          boardTitle: board.title,
          place: winnerRow.rank,
          rewardCoins,
          cadence: board.cadence,
          cycleEndsAt: board.endsAt,
          collected: false,
        })
      })

      if (additions.length === 0) return prev
      return [...additions, ...prev]
    })
  }, [user.username])

  const rankedForecastIds = useMemo(() => {
    const ranked = rankForecasts(forecasts, rankAt, user.interests)
    return ranked.map((f) => f.id)
  }, [forecasts, user.interests, rankAt])

  const setInterests = useCallback((cats: string[]) => {
    setUser((u) => ({ ...u, interests: cats }))
  }, [])

  const updateUsername = useCallback((nextUsername: string) => {
    const trimmed = nextUsername.trim().replace(/\s+/g, '_')
    if (!trimmed) return false
    if (trimmed.length < 3 || trimmed.length > 24) return false
    if (!/^[a-zA-Z0-9_.-]+$/.test(trimmed)) return false
    const next = { ...userRef.current, username: trimmed }
    userRef.current = next
    setUser(next)
    return true
  }, [])

  const addCoins = useCallback((n: number) => {
    setUser((u) => {
      const next = {
        ...u,
        balance: u.balance + n,
        xp: u.xp + Math.floor(n / 10),
      }
      userRef.current = next
      return next
    })
  }, [])

  const today = localDayStamp()
  const canClaimDailyStreak = dailyStreak.lastClaimDay !== today
  const previewDay = (() => {
    if (!canClaimDailyStreak) return dailyStreak.streak
    if (!dailyStreak.lastClaimDay) return 1
    const delta = dayDiff(dailyStreak.lastClaimDay, today)
    if (delta === 1) return Math.min(7, dailyStreak.streak + 1)
    return 1
  })()
  const dailyStreakReward = STREAK_REWARDS[Math.max(0, previewDay - 1)]

  const claimDailyStreak = useCallback(() => {
    const claimDay = localDayStamp()
    const prev = dailyStreak
    if (prev.lastClaimDay === claimDay) {
      return { ok: false, reward: 0, day: prev.streak }
    }

    let nextDay = 1
    if (prev.lastClaimDay) {
      const delta = dayDiff(prev.lastClaimDay, claimDay)
      if (delta === 1) nextDay = Math.min(7, prev.streak + 1)
    }
    const reward = STREAK_REWARDS[Math.max(0, nextDay - 1)]

    setDailyStreak({
      streak: nextDay,
      lastClaimDay: claimDay,
    })
    addCoins(reward)
    return { ok: true, reward, day: nextDay }
  }, [addCoins, dailyStreak])

  const collectLeaderboardReward = useCallback(
    (rewardId: string) => {
      let claimed = 0
      setPendingLeaderboardRewards((prev) =>
        prev.map((reward) => {
          if (reward.id !== rewardId || reward.collected) return reward
          claimed = reward.rewardCoins
          return { ...reward, collected: true }
        }),
      )
      if (claimed > 0) {
        addCoins(claimed)
        return true
      }
      return false
    },
    [addCoins],
  )

  const placeStake = useCallback((forecastId: string, optionId: string, stake: number) => {
    if (stake <= 0) return false
    const u = userRef.current
    if (u.balance < stake) return false
    const nextUser = {
      ...u,
      balance: u.balance - stake,
      xp: u.xp + stake,
    }
    userRef.current = nextUser
    setUser(nextUser)

    setForecasts((prev) =>
      prev.map((f) => {
        if (f.id !== forecastId) return f
        return {
          ...f,
          options: f.options.map((o) =>
            o.id === optionId
              ? {
                  ...o,
                  totalWeight: o.totalWeight + stake,
                  totalParticipants: o.totalParticipants + 1,
                }
              : o,
          ),
          engagementScore: f.engagementScore + 1,
        }
      }),
    )
    const pred: Prediction = {
      id: `p-${Date.now()}`,
      userId: u.uid,
      forecastId,
      optionId,
      stake,
      payout: 0,
      timestamp: Date.now(),
    }
    setPredictions((p) => [...p, pred])
    return true
  }, [])

  const purchaseAvatar = useCallback((avatarId: string) => {
    const item = AVATAR_CATALOG.find((a) => a.id === avatarId)
    if (!item) return false
    const u = userRef.current
    if (u.ownedAvatarIds.includes(avatarId)) return false
    if (u.balance < item.cost) return false
    const next = {
      ...u,
      balance: u.balance - item.cost,
      ownedAvatarIds: [...u.ownedAvatarIds, avatarId],
    }
    userRef.current = next
    setUser(next)
    return true
  }, [])

  const equipAvatar = useCallback((avatarId: string) => {
    const u = userRef.current
    if (!u.ownedAvatarIds.includes(avatarId)) return false
    const next = { ...u, avatarId }
    userRef.current = next
    setUser(next)
    return true
  }, [])

  const createForecast = useCallback(
    (draft: CreateForecastDraft) => {
      const id = `f-${Date.now()}`
      const u = userRef.current
      const hasImage = Boolean(draft.mediaImageDataUrl)
      const hasUserVideo = Boolean(draft.mediaVideoObjectUrl)

      const f: Forecast = {
        id,
        creatorId: u.uid,
        creatorUsername: u.username,
        creatorAvatarEmoji: getAvatarGlyph(u.avatarId),
        creatorAvatarId: u.avatarId,
        title: draft.title,
        description: draft.description,
        mediaUrl: hasImage ? draft.mediaImageDataUrl! : null,
        mediaVideoUrl: hasUserVideo
          ? draft.mediaVideoObjectUrl!
          : hasImage
            ? null
            : demoVideoForIndex(Number(id.replace(/\D/g, '')) || Date.now()),
        mediaBackdrop:
          'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        status: 'open',
        options: [
          {
            id: `${id}-a`,
            text: draft.optionA,
            totalWeight: 100,
            totalParticipants: 1,
          },
          {
            id: `${id}-b`,
            text: draft.optionB,
            totalWeight: 100,
            totalParticipants: 1,
          },
        ],
        resolutionCriteria: draft.resolutionCriteria,
        endsAt: draft.endsAt,
        category: draft.category,
        engagementScore: 5,
        createdAt: Date.now(),
      }
      setForecasts((prev) => [f, ...prev])
    },
    [],
  )

  const toggleLove = useCallback((forecastId: string) => {
    setLovedIds((prev) => {
      const next = new Set(prev)
      if (next.has(forecastId)) next.delete(forecastId)
      else next.add(forecastId)
      return next
    })
  }, [])

  const completeFtue = useCallback(() => {
    setFtueDone(true)
    try {
      localStorage.setItem('predictx_ftue', '1')
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      forecasts,
      predictions,
      rankedForecastIds,
      dailyStreakDay: previewDay,
      dailyStreakReward,
      canClaimDailyStreak,
      pendingLeaderboardRewards,
      setInterests,
      updateUsername,
      addCoins,
      claimDailyStreak,
      collectLeaderboardReward,
      placeStake,
      createForecast,
      toggleLove,
      lovedIds,
      ftueDone,
      completeFtue,
      purchaseAvatar,
      equipAvatar,
    }),
    [
      user,
      forecasts,
      predictions,
      rankedForecastIds,
      previewDay,
      dailyStreakReward,
      canClaimDailyStreak,
      pendingLeaderboardRewards,
      setInterests,
      updateUsername,
      addCoins,
      claimDailyStreak,
      collectLeaderboardReward,
      placeStake,
      createForecast,
      toggleLove,
      lovedIds,
      ftueDone,
      completeFtue,
      purchaseAvatar,
      equipAvatar,
    ],
  )

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  )
}
