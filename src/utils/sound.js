// Sound utility — loads audio lazily and plays it on demand.
// All functions are fire-and-forget; missing files never throw.

const cache = {}

function play(src, volume = 0.6) {
  try {
    if (!cache[src]) {
      cache[src] = new Audio(src)
      cache[src].volume = volume
    }
    const a = cache[src]
    a.currentTime = 0
    a.play().catch(() => {})
  } catch {}
}

export const playClick   = () => play('/assets/audio/click.mp3',   0.5)
export const playCorrect = () => play('/assets/audio/correct.mp3', 0.7)
export const playSplash  = () => play('/assets/audio/scene_03.mp3',0.5)
