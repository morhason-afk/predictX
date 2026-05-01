import { createClient, type RealtimeChannel, type SupabaseClient } from '@supabase/supabase-js'
import type { Forecast, Prediction } from '../types'
import type { LeaderboardSection } from '../data/leaderboardMock'
import type { StoreOffer } from '../context/AppStateContext'

const TABLE = 'predictx_global_state'
const ROW_ID = 'main'

export type SharedBackofficeConfig = {
  welcomeBonusCoins: number
  streakRewards: number[]
  leaderboardRewards: Record<string, { first: number; second: number; third: number }>
  storeOffers: StoreOffer[]
}

export type SharedGlobalPayload = {
  schemaVersion: 1
  forecasts: Forecast[]
  predictions: Prediction[]
  backofficeConfig: SharedBackofficeConfig
  leaderboardSections: LeaderboardSection[]
}

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSharedCloudMode = Boolean(url && anonKey)

let client: SupabaseClient | null = null

function getClient(): SupabaseClient | null {
  if (!isSharedCloudMode) return null
  if (!client) client = createClient(url!, anonKey!)
  return client
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return Boolean(x) && typeof x === 'object' && !Array.isArray(x)
}

export function normalizeSharedPayload(raw: unknown): SharedGlobalPayload | null {
  if (!isRecord(raw)) return null
  if (raw.schemaVersion !== 1) return null
  if (!Array.isArray(raw.forecasts)) return null
  if (!Array.isArray(raw.predictions)) return null
  if (!isRecord(raw.backofficeConfig)) return null
  if (!Array.isArray(raw.leaderboardSections)) return null
  return raw as unknown as SharedGlobalPayload
}

export async function fetchSharedGlobalPayload(): Promise<SharedGlobalPayload | null> {
  const sb = getClient()
  if (!sb) return null
  const { data, error } = await sb.from(TABLE).select('payload').eq('id', ROW_ID).maybeSingle()
  if (error) {
    console.warn('[PredictX] shared state fetch failed', error.message)
    return null
  }
  if (!data || !isRecord(data) || data.payload == null) return null
  return normalizeSharedPayload(data.payload)
}

export async function upsertSharedGlobalPayload(payload: SharedGlobalPayload): Promise<boolean> {
  const sb = getClient()
  if (!sb) return false
  const { error } = await sb.from(TABLE).upsert(
    {
      id: ROW_ID,
      payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  )
  if (error) {
    console.warn('[PredictX] shared state save failed', error.message)
    return false
  }
  return true
}

/** Subscribe to Postgres changes on the global row. Requires Realtime enabled for this table in Supabase. */
export function subscribeSharedGlobal(onChange: () => void): () => void {
  const sb = getClient()
  if (!sb) return () => {}

  let channel: RealtimeChannel | null = null
  try {
    channel = sb
      .channel('predictx-global-state')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE, filter: `id=eq.${ROW_ID}` },
        () => onChange(),
      )
      .subscribe()
  } catch {
    /* ignore */
  }

  return () => {
    if (channel && sb) sb.removeChannel(channel)
  }
}
