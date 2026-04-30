export type AvatarItem = {
  id: string
  glyph: string
  name: string
  cost: number
}

/** First 5 are free; remaining 15 cost X-Coins (buy once, equip anytime). */
export const AVATAR_CATALOG: AvatarItem[] = [
  { id: 'av0', glyph: '🦊', name: 'Fox', cost: 0 },
  { id: 'av1', glyph: '🐼', name: 'Panda', cost: 0 },
  { id: 'av2', glyph: '🦉', name: 'Owl', cost: 0 },
  { id: 'av3', glyph: '🐺', name: 'Wolf', cost: 0 },
  { id: 'av4', glyph: '🐧', name: 'Penguin', cost: 0 },
  { id: 'av5', glyph: '🐯', name: 'Tiger', cost: 150 },
  { id: 'av6', glyph: '🦁', name: 'Lion', cost: 180 },
  { id: 'av7', glyph: '🦄', name: 'Unicorn', cost: 220 },
  { id: 'av8', glyph: '🐉', name: 'Dragon', cost: 260 },
  { id: 'av9', glyph: '🦅', name: 'Eagle', cost: 300 },
  { id: 'av10', glyph: '🦈', name: 'Shark', cost: 320 },
  { id: 'av11', glyph: '🐙', name: 'Octopus', cost: 350 },
  { id: 'av12', glyph: '🦖', name: 'Rex', cost: 400 },
  { id: 'av13', glyph: '👾', name: 'Invader', cost: 420 },
  { id: 'av14', glyph: '🤖', name: 'Bot', cost: 450 },
  { id: 'av15', glyph: '🎭', name: 'Mask', cost: 480 },
  { id: 'av16', glyph: '🔱', name: 'Trident', cost: 500 },
  { id: 'av17', glyph: '⚡', name: 'Bolt', cost: 520 },
  { id: 'av18', glyph: '🌙', name: 'Moon', cost: 550 },
  { id: 'av19', glyph: '✨', name: 'Spark', cost: 600 },
]

export const FREE_AVATAR_IDS = AVATAR_CATALOG.filter((a) => a.cost === 0).map((a) => a.id)

export function getAvatarById(id: string): AvatarItem | undefined {
  return AVATAR_CATALOG.find((a) => a.id === id)
}

export function getAvatarGlyph(id: string | null | undefined, fallback = '❔'): string {
  if (!id) return fallback
  return getAvatarById(id)?.glyph ?? fallback
}
