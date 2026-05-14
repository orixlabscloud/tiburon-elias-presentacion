import { useState, useRef, useEffect } from 'react'

// Shows the button whenever `src` is provided.
// Creates the Audio object lazily (on first click) to avoid browser restrictions.
// Resets automatically when the scene changes.
export default function AudioButton({ src }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  // Stop and reset when the scene (src) changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setPlaying(false)
  }, [src])

  // Don't render if no audio for this scene
  if (!src) return null

  const toggle = () => {
    // Create audio instance on first interaction (required by browser autoplay policy)
    if (!audioRef.current) {
      const a = new Audio(src)
      a.onended = () => setPlaying(false)
      a.onerror = () => { setPlaying(false); audioRef.current = null }
      audioRef.current = a
    }

    if (playing) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setPlaying(false)
    } else {
      audioRef.current.play().catch(() => setPlaying(false))
      setPlaying(true)
    }
  }

  return (
    <button
      className={`audio-btn ${playing ? 'playing' : ''}`}
      onClick={toggle}
      aria-label={playing ? 'Pausar' : 'Escuchar'}
    >
      {playing ? '⏸ Pausar' : '🔊 Escuchar'}
    </button>
  )
}
