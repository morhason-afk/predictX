import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../context/useAppState'

const CATS = ['Sports', 'Politics', 'Crypto', 'Pop Culture', 'Personal']

const MAX_IMAGE_BYTES = 2.5 * 1024 * 1024
const MAX_VIDEO_BYTES = 28 * 1024 * 1024

export function CreateForecastPage() {
  const { createForecast } = useAppState()
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Sports')
  const [optionA, setOptionA] = useState('Yes')
  const [optionB, setOptionB] = useState('No')
  const [resolutionCriteria, setResolutionCriteria] = useState('')
  const [hours, setHours] = useState(48)
  const [mediaImageDataUrl, setMediaImageDataUrl] = useState<string | null>(null)
  const [mediaVideoObjectUrl, setMediaVideoObjectUrl] = useState<string | null>(null)
  const [mediaHint, setMediaHint] = useState<string | null>(null)
  const videoRevokeRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (videoRevokeRef.current) {
        URL.revokeObjectURL(videoRevokeRef.current)
        videoRevokeRef.current = null
      }
    }
  }, [])

  const clearVideo = () => {
    if (videoRevokeRef.current) {
      URL.revokeObjectURL(videoRevokeRef.current)
      videoRevokeRef.current = null
    }
    setMediaVideoObjectUrl(null)
  }

  const onPickMedia = (file: File | null) => {
    setMediaHint(null)
    if (!file) return

    if (file.type.startsWith('video/')) {
      if (file.size > MAX_VIDEO_BYTES) {
        setMediaHint('Video must be under ~28MB for this demo.')
        return
      }
      setMediaImageDataUrl(null)
      clearVideo()
      const url = URL.createObjectURL(file)
      videoRevokeRef.current = url
      setMediaVideoObjectUrl(url)
      return
    }

    if (file.type.startsWith('image/')) {
      if (file.size > MAX_IMAGE_BYTES) {
        setMediaHint('Image must be under ~2.5MB (try compressing).')
        return
      }
      clearVideo()
      const reader = new FileReader()
      reader.onload = () => {
        const r = reader.result
        if (typeof r === 'string') setMediaImageDataUrl(r)
      }
      reader.readAsDataURL(file)
      return
    }

    setMediaHint('Use an image (JPEG/PNG/WebP/GIF) or MP4/WebM video.')
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !resolutionCriteria.trim()) return
    createForecast({
      title: title.trim(),
      description: description.trim(),
      category,
      optionA: optionA.trim(),
      optionB: optionB.trim(),
      endsAt: Date.now() + hours * 3600_000,
      resolutionCriteria: resolutionCriteria.trim(),
      mediaImageDataUrl,
      mediaVideoObjectUrl,
    })
    videoRevokeRef.current = null
    nav('/')
  }

  return (
    <div className="mobile-screen">
      <header className="mobile-screen__header">
        <h1 className="screen-title">Create</h1>
        <p className="screen-lead tight">Resolvable rules — optional cover image or clip.</p>
      </header>
      <div className="mobile-screen__scroll">
        <form className="form" onSubmit={submit}>
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <p className="form-ai-hint">Refine this title’s copy with AI for a sharper hook in the main reel.</p>

          <label>
            Details
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </label>
          <p className="form-ai-hint">Create or refine the full write-up with AI before you publish.</p>

          <label className="media-upload">
            <span className="media-upload__label">Cover image or video</span>
            <input
              type="file"
              accept="image/*,video/mp4,video/webm,video/quicktime"
              className="media-upload__input"
              onChange={(e) => onPickMedia(e.target.files?.[0] ?? null)}
            />
            <div className="media-upload__preview">
              {mediaVideoObjectUrl && (
                <video src={mediaVideoObjectUrl} muted playsInline controls className="media-upload__pv" />
              )}
              {mediaImageDataUrl && !mediaVideoObjectUrl && (
                <img src={mediaImageDataUrl} alt="" className="media-upload__pv" />
              )}
              {!mediaVideoObjectUrl && !mediaImageDataUrl && <span className="muted">Tap to choose — or leave empty for default reel.</span>}
            </div>
            {(mediaImageDataUrl || mediaVideoObjectUrl) && (
              <button
                type="button"
                className="btn-ghost media-upload__clear"
                onClick={() => {
                  setMediaImageDataUrl(null)
                  clearVideo()
                }}
              >
                Remove media
              </button>
            )}
            {mediaHint && <p className="media-upload__hint">{mediaHint}</p>}
          </label>
          <p className="form-ai-hint">Create an image or short clip with AI, then attach it here for the hero slot.</p>
          <label>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <div className="form-row">
            <label>
              Side A
              <input value={optionA} onChange={(e) => setOptionA(e.target.value)} />
            </label>
            <label>
              Side B
              <input value={optionB} onChange={(e) => setOptionB(e.target.value)} />
            </label>
          </div>
          <label>
            Resolution rule
            <textarea
              value={resolutionCriteria}
              onChange={(e) => setResolutionCriteria(e.target.value)}
              rows={2}
              required
              placeholder="What exact source settles this?"
            />
          </label>
          <label>
            Ends in (hours)
            <input
              type="number"
              min={1}
              max={720}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
            />
          </label>
          <button type="submit" className="btn-primary">
            Publish
          </button>
        </form>
      </div>
    </div>
  )
}
