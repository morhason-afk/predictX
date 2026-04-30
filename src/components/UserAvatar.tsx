import { getAvatarGlyph } from '../data/avatarCatalog'

type Props = {
  avatarId?: string | null
  emojiFallback?: string
  /** Savant glow (e.g. rank #1) */
  savant?: boolean
  className?: string
}

export function UserAvatar({ avatarId, emojiFallback, savant, className = '' }: Props) {
  const glyph = getAvatarGlyph(avatarId, emojiFallback ?? '❔')
  return (
    <span
      className={`user-avatar${savant ? ' user-avatar--savant' : ''}${className ? ` ${className}` : ''}`.trim()}
      aria-hidden
    >
      {glyph}
    </span>
  )
}
