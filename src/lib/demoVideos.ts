/**
 * Looping demo clips from `/public/demo-videos` (same origin → reliable on localhost).
 * Google’s public `gtv-videos-bucket` sample URLs now return **403** anonymously, which
 * broke `<video src="https://…">` in the browser.
 */
const base = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`

function demoPath(file: string): string {
  return `${base}demo-videos/${file}`
}

export const DEMO_VIDEO_URLS = [
  demoPath('flower.mp4'),
  demoPath('bbb.mp4'),
  demoPath('movie.mp4'),
] as const

export function demoVideoForIndex(i: number): string {
  return DEMO_VIDEO_URLS[i % DEMO_VIDEO_URLS.length]!
}
