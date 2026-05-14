import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SharkCharacter from './SharkCharacter'

// ─────────────────────────────────────────────────────────────────
// SharkVideo
//
//  playOnce={false}  (default) → autoplay muted en loop.
//                                Botón 🔊 para activar sonido.
//
//  playOnce={true}             → thumbnail estático con overlay
//                                de PLAY. Al click reproduce UNA
//                                vez con sonido al máximo.
//                                Al terminar: frame estático +
//                                botón "🔊 Escúchame de nuevo".
// ─────────────────────────────────────────────────────────────────
export default function SharkVideo({
  src,
  fallbackSrc,
  fallbackStyle = 'sticker-cyan',
  size          = 'md',
  playOnce      = false,
  style         = {},
}) {
  const videoRef            = useRef(null)
  const [error,   setError] = useState(false)
  const [ready,   setReady] = useState(false)   // video data loaded
  const [phase,   setPhase] = useState('idle')  // 'idle' | 'playing' | 'done'
  const [muted,   setMuted] = useState(true)    // loop mode only

  const sizeMap = { sm: 140, md: 210, lg: 280 }
  const maxW    = sizeMap[size] || 210

  // Reset on scene change
  useEffect(() => {
    const v = videoRef.current
    if (v) { v.pause(); v.currentTime = 0 }
    setReady(false)
    setError(false)
    setPhase('idle')
    setMuted(true)
  }, [src])

  // ── Video metadata ready ─────────────────────────────────────
  const handleLoaded = () => {
    setReady(true)
    const v = videoRef.current
    if (!v) return

    if (!playOnce) {
      // Loop mode: try with sound first (works if user already clicked something).
      // If the browser blocks it, fall back to muted automatically.
      v.muted  = false
      v.volume = 0.85
      v.play().catch(() => {
        v.muted = true
        setMuted(true)
        v.play().catch(() => {})
      })
    } else {
      // Once mode: stay paused at frame 0, wait for user tap
      v.pause()
      v.currentTime = 0
    }
  }

  // ── ONCE MODE: user clicks to play ──────────────────────────
  const playNow = () => {
    const v = videoRef.current
    if (!v || phase === 'playing') return
    v.currentTime = 0
    v.muted       = false
    v.volume      = 1.0
    v.play()
      .then(() => setPhase('playing'))
      .catch(() => {
        // Browser blocked sound — play muted and show notice
        v.muted = true
        v.play().then(() => setPhase('playing')).catch(() => {})
      })
  }

  // ── ONCE MODE: video ended ───────────────────────────────────
  const handleEnded = () => setPhase('done')

  // ── LOOP MODE: toggle mute ───────────────────────────────────
  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    if (v.muted) {
      v.muted = false; v.volume = 0.8; v.currentTime = 0
    } else {
      v.muted = true
    }
    setMuted(v.muted)
  }

  if (!src || error) {
    return <SharkCharacter src={fallbackSrc} characterStyle={fallbackStyle} size={size} style={style} />
  }

  const isOnceIdle = playOnce && ready && phase === 'idle'
  const isOnceDone = playOnce && phase === 'done'

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', ...style }}>

      {/* ── Video container ── */}
      <div
        onClick={isOnceIdle || isOnceDone ? playNow : undefined}
        style={{
          position:     'relative',
          width:        maxW,
          borderRadius: '1.5rem',
          overflow:     'hidden',
          boxShadow:    '0 8px 32px rgba(0,0,80,0.55)',
          border:       `3px solid ${isOnceIdle ? 'rgba(255,107,107,0.9)' : 'rgba(255,255,255,0.5)'}`,
          background:   '#001a2e',
          cursor:       isOnceIdle || isOnceDone ? 'pointer' : 'default',
          animation:    'sharkFloat 3.5s ease-in-out infinite',
          transition:   'border-color 0.3s',
        }}
      >
        {/* Loading shimmer */}
        {!ready && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 3,
            background: 'linear-gradient(135deg, #0077b6, #023e8a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem',
          }}>🦈</div>
        )}

        <video
          ref={videoRef}
          src={src}
          loop={!playOnce}
          playsInline
          preload="auto"
          onLoadedData={handleLoaded}
          onEnded={playOnce ? handleEnded : undefined}
          onError={() => setError(true)}
          style={{ width: '100%', display: 'block', objectFit: 'cover' }}
        />

        {/* ── ONCE MODE: big play overlay ── */}
        <AnimatePresence>
          {isOnceIdle && (
            <motion.div
              key="play-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position:        'absolute', inset: 0, zIndex: 4,
                background:      'rgba(0,20,60,0.35)',
                display:         'flex',
                flexDirection:   'column',
                alignItems:      'center',
                justifyContent:  'center',
                gap:             '0.5rem',
              }}
            >
              {/* Pulsing play circle */}
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
                style={{
                  background:   'rgba(255,107,107,0.9)',
                  borderRadius: '50%',
                  width:  70, height: 70,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 0 8px rgba(255,107,107,0.3)',
                  fontSize: '2rem',
                }}
              >
                ▶
              </motion.div>
              <span style={{
                color: '#fff', fontFamily: 'Nunito, sans-serif',
                fontWeight: 900, fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                textShadow: '0 2px 6px rgba(0,0,0,0.8)',
              }}>
                👆 ¡Tócame para escuchar!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── LOOP MODE: mute / unmute icon ── */}
        {!playOnce && ready && (
          <button onClick={toggleMute} style={iconBtnStyle}>
            {muted ? '🔇' : '🔊'}
          </button>
        )}
      </div>

      {/* ── ONCE MODE: replay button (below video) ── */}
      <AnimatePresence>
        {isOnceDone && (
          <motion.button
            key="replay"
            onClick={playNow}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              background:   'linear-gradient(135deg, #00b4d8, #0077b6)',
              border:       '3px solid rgba(255,255,255,0.7)',
              borderRadius: 999,
              padding:      '0.5rem 1.6rem',
              color:        '#fff',
              fontFamily:   'Nunito, sans-serif',
              fontWeight:   900,
              fontSize:     'clamp(0.9rem, 2.5vw, 1.1rem)',
              cursor:       'pointer',
              boxShadow:    '0 4px 16px rgba(0,119,182,0.5)',
              display:      'flex', alignItems: 'center', gap: '0.4rem',
              whiteSpace:   'nowrap',
            }}
          >
            🔊 ¡Escúchame de nuevo!
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

const iconBtnStyle = {
  position: 'absolute', bottom: 8, right: 8, zIndex: 5,
  background: 'rgba(0,0,0,0.45)', border: '2px solid rgba(255,255,255,0.5)',
  borderRadius: '50%', width: 34, height: 34,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '1rem', cursor: 'pointer', color: 'white',
}
