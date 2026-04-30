import { createContext } from 'react'
import type { Forecast, Prediction, UserProfile } from '../types'

export type CreateForecastDraft = {
  title: string
  description: string
  category: string
  optionA: string
  optionB: string
  endsAt: number
  resolutionCriteria: string
  /** data:image/… from FileReader */
  mediaImageDataUrl?: string | null
  /** `URL.createObjectURL` from user video — session only */
  mediaVideoObjectUrl?: string | null
}

export type StoreOffer = {
  id: string
  label: string
  coins: number
  price: string
  tier: 0 | 1 | 2
}

export type AppStateValue = {
  user: UserProfile
  forecasts: Forecast[]
  predictions: Prediction[]
  rankedForecastIds: string[]
  dailyStreakDay: number
  dailyStreakReward: number
  canClaimDailyStreak: boolean
  welcomeBonusCoins: number
  streakRewards: number[]
  storeOffers: StoreOffer[]
  leaderboardRewards: Record<string, { first: number; second: number; third: number }>
  pendingLeaderboardRewards: {
    id: string
    boardId: string
    boardTitle: string
    place: 1 | 2 | 3
    rewardCoins: number
    cadence: 'daily' | 'weekly'
    cycleEndsAt: number
    collected: boolean
  }[]
  setInterests: (cats: string[]) => void
  updateUsername: (nextUsername: string) => boolean
  updateWelcomeBonusCoins: (coins: number) => void
  updateStreakRewardForDay: (day: number, coins: number) => void
  updateLeaderboardReward: (boardId: string, place: 1 | 2 | 3, coins: number) => void
  reorderStoreOffers: (fromIndex: number, toIndex: number) => void
  updateStoreOffer: (offerId: string, patch: Partial<Pick<StoreOffer, 'label' | 'coins' | 'price' | 'tier'>>) => void
  addCoins: (n: number) => void
  claimDailyStreak: () => { ok: boolean; reward: number; day: number }
  collectLeaderboardReward: (rewardId: string) => boolean
  placeStake: (forecastId: string, optionId: string, stake: number) => boolean
  createForecast: (draft: CreateForecastDraft) => void
  toggleLove: (forecastId: string) => void
  lovedIds: Set<string>
  ftueDone: boolean
  completeFtue: () => void
  purchaseAvatar: (avatarId: string) => boolean
  equipAvatar: (avatarId: string) => boolean
}

export const AppStateContext = createContext<AppStateValue | null>(null)
