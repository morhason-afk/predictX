const ANON_UID_KEY = 'predictx_anon_uid'

/** Stable per-browser id so stakes and created forecasts are attributed to distinct users in shared cloud mode. */
export function getOrCreateAnonUid(): string {
  try {
    let id = localStorage.getItem(ANON_UID_KEY)
    if (!id) {
      id =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `u-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
      localStorage.setItem(ANON_UID_KEY, id)
    }
    return id
  } catch {
    return `u-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  }
}
