import { useState, useEffect, useRef } from 'react'
import { storyScenes } from './data/storyData'
import Scene from './components/Scene'
import ProgressDots from './components/ProgressDots'
import FloatingBubbles from './components/FloatingBubbles'
import { playClick } from './utils/sound'

export default function App() {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [presentationMode, setPresentationMode] = useState(false)
  const [musicEnabled, setMusicEnabled] = useState(false)
  const bgMusicRef = useRef(null)

  const total = storyScenes.length
  const scene = storyScenes[sceneIndex]

  const goNext = () => setSceneIndex(i => Math.min(i + 1, total - 1))
  const goPrev = () => setSceneIndex(i => Math.max(i - 1, 0))
  const goTo   = (i) => setSceneIndex(i)

  // ── Keyboard navigation ────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') { playClick(); goNext() }
      if (e.key === 'ArrowLeft')                       { playClick(); goPrev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Fullscreen presentation mode ───────────────────────────
  const togglePresentation = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setPresentationMode(true)
      } else {
        await document.exitFullscreen()
        setPresentationMode(false)
      }
    } catch {
      setPresentationMode(p => !p)
    }
  }

  useEffect(() => {
    const onFSChange = () => {
      if (!document.fullscreenElement) setPresentationMode(false)
    }
    document.addEventListener('fullscreenchange', onFSChange)
    return () => document.removeEventListener('fullscreenchange', onFSChange)
  }, [])

  // ── Background music ───────────────────────────────────────
  // 📁 Pon tu música en: /public/assets/audio/ocean_loop.mp3
  useEffect(() => {
    if (musicEnabled) {
      const audio = new Audio('/assets/audio/ocean_loop.mp3')
      audio.loop   = true
      audio.volume = 0.25
      audio.play().catch(() => {})
      bgMusicRef.current = audio
    } else {
      bgMusicRef.current?.pause()
      bgMusicRef.current = null
    }
    return () => bgMusicRef.current?.pause()
  }, [musicEnabled])

  return (
    <div className={`app ${presentationMode ? 'presentation-mode' : ''}`}>
      <FloatingBubbles />

      {/* Controls top-right */}
      <div className="top-controls">
        <button
          className="ctrl-btn"
          onClick={() => setMusicEnabled(m => !m)}
          title={musicEnabled ? 'Apagar música' : 'Encender música de fondo'}
          aria-label={musicEnabled ? 'Apagar música' : 'Encender música de fondo'}
        >
          {musicEnabled ? '🔊' : '🔇'}
        </button>
        <button
          className="ctrl-btn"
          onClick={togglePresentation}
          title={presentationMode ? 'Salir de presentación' : 'Modo presentación (pantalla completa)'}
          aria-label="Modo presentación"
        >
          {presentationMode ? '⊡' : '⛶'}
        </button>
      </div>

      {/* Main scene */}
      <Scene
        scene={scene}
        onNext={goNext}
        onPrev={goPrev}
        isFirst={sceneIndex === 0}
        isLast={sceneIndex === total - 1}
      />

      {/* Scene progress dots */}
      <ProgressDots total={total} current={sceneIndex} onDotClick={goTo} />
    </div>
  )
}
