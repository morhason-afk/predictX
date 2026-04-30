export type ForecastStatus = 'open' | 'locked' | 'resolved' | 'cancelled'

export type ForecastOption = {
  id: string
  text: string
  totalWeight: number
  totalParticipants: number
}

export type Forecast = {
  id: string
  creatorId: string
  creatorUsername: string
  creatorAvatarEmoji: string
  /** Catalog id for `UserAvatar`; optional on older mocks */
  creatorAvatarId?: string | null
  title: string
  description: string
  mediaUrl: string | null
  /** Looping demo clip (MP4); falls back to `mediaBackdrop` if missing or on error */
  mediaVideoUrl?: string | null
  /** CSS gradient or image URL for MVP placeholder “video” */
  mediaBackdrop: string
  status: ForecastStatus
  options: ForecastOption[]
  resolutionCriteria: string
  endsAt: number
  category: string
  engagementScore: number
  createdAt: number
  verifiedCreator?: boolean
}

export type Prediction = {
  id: string
  userId: string
  forecastId: string
  optionId: string
  stake: number
  payout: number
  timestamp: number
}

export type UserProfile = {
  uid: string
  username: string
  avatarUrl: string
  /** Equipped avatar from `AVATAR_CATALOG` */
  avatarId: string
  /** Owned forever after purchase (includes free starters). */
  ownedAvatarIds: string[]
  cosmeticFrameId: string | null
  balance: number
  xp: number
  level: number
  interests: string[]
  stats: {
    totalWins: number
    totalLosses: number
    underdogWins: number
    creatorScore: number
  }
}
