import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SharkCharacter from './SharkCharacter'
import SharkVideo from './SharkVideo'
import DialogueBox from './DialogueBox'
import DecisionButton from './DecisionButton'
import AudioButton from './AudioButton'
import AnimalCard from './AnimalCard'
import { playCorrect, playClick } from '../utils/sound'

// Helper: renders video if scene.video exists, otherwise static character
function SceneCharacter({ scene, size = 'md', style = {} }) {
  if (scene.video) {
    return (
      <SharkVideo
        src={scene.video}
        fallbackSrc={scene.character}
        fallbackStyle={scene.characterStyle}
        size={size}
        style={style}
      />
    )
  }
  return (
    <SharkCharacter
      src={scene.character}
      characterStyle={scene.characterStyle}
      size={size}
      style={style}
    />
  )
}

// ── Background gradients (used as fallback / overlay) ────────────
const BG_GRADIENTS = {
  ocean_home:    'linear-gradient(180deg, #0077b6 0%, #023e8a 60%, #03045e 100%)',
  coral_reef:    'linear-gradient(180deg, #0096c7 0%, #0077b6 50%, #023e8a 100%)',
  chilean_coast: 'linear-gradient(180deg, #48cae4 0%, #00b4d8 30%, #0077b6 70%, #023e8a 100%)',
  deep_ocean:    'linear-gradient(180deg, #023e8a 0%, #03045e 100%)',
}

// ── Scene wrapper animation ──────────────────────────────────────
const sceneVariants = {
  initial: { opacity: 0, x: 80  },
  animate: { opacity: 1, x: 0   },
  exit:    { opacity: 0, x: -80 },
}

// ── Main Scene component ─────────────────────────────────────────
export default function Scene({ scene, onNext, onPrev, isFirst }) {
  const bg = BG_GRADIENTS[scene.background] || BG_GRADIENTS.ocean_home

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scene.id}
        className="scene"
        style={{ background: bg }}
        variants={sceneVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {/* Ocean decorative bottom */}
        <OceanBottom />

        {/* Scene content */}
        <div className="scene-inner">
          <SceneContent scene={scene} onNext={onNext} />
        </div>

        {/* Navigation arrows */}
        {!isFirst && (
          <button className="nav-arrow nav-left" onClick={onPrev} aria-label="Escena anterior">◀</button>
        )}
        <button className="nav-arrow nav-right" onClick={onNext} aria-label="Siguiente escena">▶</button>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Dispatch to correct scene type ──────────────────────────────
function SceneContent({ scene, onNext }) {
  switch (scene.type) {
    case 'cover':            return <CoverScene    scene={scene} onNext={onNext} />
    case 'info':             return <InfoScene     scene={scene} onNext={onNext} />
    case 'interactive-food': return <FoodScene     scene={scene} onNext={onNext} />
    case 'interactive-map':  return <MapScene      scene={scene} onNext={onNext} />
    case 'interactive-body': return <BodyScene     scene={scene} onNext={onNext} />
    case 'reproduction':     return <ReproScene    scene={scene} onNext={onNext} />
    case 'curiosity':        return <CuriosityScene scene={scene} onNext={onNext} />
    case 'ending':           return <EndingScene   scene={scene} onNext={onNext} />
    default:                 return <InfoScene     scene={scene} onNext={onNext} />
  }
}

// ════════════════════════════════════════════════════════════════
// ESCENA 0 — PORTADA
// ════════════════════════════════════════════════════════════════
function CoverScene({ scene, onNext }) {
  return (
    <>
      <motion.p className="cover-title-sm" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
        {scene.subtitle}
      </motion.p>
      <motion.h1 className="cover-title-lg" initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
        {scene.title}<br/>{scene.titleBig}
      </motion.h1>

      {/* Video con playOnce: toca → reproduce 1 vez con audio → queda estático */}
      {scene.video
        ? (
          <div style={{ marginBottom: '3rem' }}>
            <SharkVideo
              src={scene.video}
              fallbackSrc={scene.character}
              fallbackStyle={scene.characterStyle}
              size="lg"
              playOnce
            />
          </div>
        )
        : <SceneCharacter scene={scene} size="lg" />
      }

      <DialogueBox text={scene.text} />

      <div className="btn-row">
        <AudioButton src={scene.audio} />
        <DecisionButton onClick={onNext} variant="primary">{scene.buttonText}</DecisionButton>
      </div>
    </>
  )
}

// ════════════════════════════════════════════════════════════════
// ESCENA 1 — INFO GENÉRICA
// ════════════════════════════════════════════════════════════════
function InfoScene({ scene, onNext }) {
  return (
    <>
      {scene.question && (
        <motion.div className="question-badge" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.05 }}>
          {scene.emoji} {scene.question}
        </motion.div>
      )}
      <motion.h2 className="scene-title" initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
        {scene.title}
      </motion.h2>

      <SceneCharacter scene={scene} size="md" />

      <DialogueBox text={scene.text} />

      <div className="btn-row">
        <AudioButton src={scene.audio} />
        <DecisionButton onClick={onNext} variant="primary">{scene.buttonText}</DecisionButton>
      </div>
    </>
  )
}

// ════════════════════════════════════════════════════════════════
// ESCENA 2 — INTERACTIVA: ¿QUÉ COMO?
// ════════════════════════════════════════════════════════════════
function FoodScene({ scene, onNext }) {
  const [states, setStates]     = useState({})  // { foodId: 'correct' | 'incorrect' }
  const [feedback, setFeedback] = useState('')
  const [allDone,  setAllDone]  = useState(false)

  const handleCard = useCallback((food) => {
    const result = food.correct ? 'correct' : 'incorrect'
    if (food.correct) playCorrect()
    setStates(prev => ({ ...prev, [food.id]: result }))
    setFeedback(food.correct ? scene.correctMsg : scene.wrongMsg)

    setStates(prev => {
      const next = { ...prev, [food.id]: result }
      const allCorrectFound = scene.foods.every(f => !f.correct || next[f.id] === 'correct')
      if (allCorrectFound) setTimeout(() => setAllDone(true), 600)
      return next
    })
  }, [scene])

  return (
    <>
      <motion.div className="question-badge" initial={{ opacity:0 }} animate={{ opacity:1 }}>
        {scene.emoji} {scene.question}
      </motion.div>
      <motion.h2 className="scene-title" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
        {scene.title}
      </motion.h2>

      <div className="food-grid">
        {scene.foods.map((food, i) => (
          <motion.div key={food.id} initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }} transition={{ delay: i * 0.1 + 0.2 }}>
            <AnimalCard food={food} state={states[food.id] || null} onClick={() => handleCard(food)} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.p className="feedback-msg" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
            {feedback}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="btn-row">
        <AudioButton src={scene.audio} />
        <DecisionButton onClick={onNext} variant="primary">{scene.buttonText}</DecisionButton>
      </div>
    </>
  )
}

// ════════════════════════════════════════════════════════════════
// ESCENA 3 — INTERACTIVA: ¿DÓNDE VIVO? (mapa)
// ════════════════════════════════════════════════════════════════
function MapScene({ scene, onNext }) {
  const [mapError, setMapError] = useState(false)

  return (
    <>
      <motion.div className="question-badge" initial={{ opacity:0 }} animate={{ opacity:1 }}>
        {scene.emoji} {scene.question}
      </motion.div>
      <motion.h2 className="scene-title" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
        {scene.title}
      </motion.h2>

      <div className="map-container">
        {/* Chile map — replace /public/assets/objects/map_chile.png */}
        <motion.div className="map-visual" initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.2 }}>
          {scene.mapImage && !mapError
            ? <img src={scene.mapImage} alt="Mapa de Chile" className="map-img" onError={() => setMapError(true)} />
            : <ChileFallbackMap />
          }
        </motion.div>

        <SceneCharacter scene={scene} size="sm"
          style={{ marginTop: '-1rem', position: 'relative', zIndex: 2 }} />
      </div>

      <DialogueBox text={scene.text} />

      <div className="btn-row">
        <AudioButton src={scene.audio} />
        <DecisionButton onClick={onNext} variant="primary">{scene.buttonText}</DecisionButton>
      </div>
    </>
  )
}

// SVG placeholder shaped like the Chilean coastline
function ChileFallbackMap() {
  return (
    <div className="map-fallback" style={{ textAlign: 'center' }}>
      <svg width="80" height="160" viewBox="0 0 80 160" aria-label="Silueta de Chile">
        <defs>
          <linearGradient id="mapGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#48cae4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0077b6" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {/* Simplified Chile silhouette */}
        <path
          d="M38,5 C44,6 50,10 52,18 C55,28 53,42 50,55 C48,65 45,75 43,90 C41,105 40,120 36,135 C33,148 28,155 24,158 C20,155 22,140 24,128 C26,115 27,100 28,85 C29,70 28,55 26,42 C24,28 22,15 28,8 Z"
          fill="url(#mapGrad)"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.5"
        />
        {/* Waves */}
        {[40, 70, 100, 130].map(y => (
          <g key={y}>
            <path d={`M56,${y} Q62,${y-4} 68,${y} Q74,${y+4} 78,${y}`} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
          </g>
        ))}
      </svg>
      <div style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, marginTop: 4, opacity: 0.8 }}>🇨🇱 Chile</div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// ESCENA 4 — INTERACTIVA: ¿CÓMO ES MI CUERPO?
// ════════════════════════════════════════════════════════════════
function BodyScene({ scene, onNext }) {
  const [selected, setSelected] = useState(null)

  const active = scene.bodyParts.find(p => p.id === selected)

  return (
    <>
      <motion.div className="question-badge" initial={{ opacity:0 }} animate={{ opacity:1 }}>
        {scene.emoji} {scene.question}
      </motion.div>
      <motion.h2 className="scene-title" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
        {scene.title}
      </motion.h2>

      <SharkBodySVG selected={selected} onSelect={setSelected} imgSrc={scene.character} />

      <div className="body-buttons">
        {scene.bodyParts.map(part => (
          <motion.button
            key={part.id}
            className={`body-btn ${selected === part.id ? 'selected' : ''}`}
            onClick={() => setSelected(selected === part.id ? null : part.id)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.08 }}
          >
            {part.emoji} {part.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            className="dialogue-box"
            initial={{ opacity:0, y:10 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-10 }}
            transition={{ duration: 0.25 }}
          >
            <p>{active.description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="btn-row">
        <AudioButton src={scene.audio} />
        <DecisionButton onClick={onNext} variant="primary">{scene.buttonText}</DecisionButton>
      </div>
    </>
  )
}

// Shark body display: real image with glowing hotspot overlays
// Hotspot positions are calibrated for the smiling lateral shark image (shark_body.jpg)
const HOTSPOTS = {
  fins:  { top: '10%',  left: '43%', label: 'Aletas'  },
  tail:  { top: '28%',  left: '82%', label: 'Cola'    },
  teeth: { top: '38%',  left: '12%', label: 'Dientes' },
}

function SharkBodySVG({ selected, onSelect, imgSrc }) {
  const [imgErr, setImgErr] = useState(false)

  return (
    <motion.div
      initial={{ opacity:0, scale:0.85 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ delay:0.2 }}
      style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '1.5rem',
        border: '3px solid rgba(255,255,255,0.9)',
        boxShadow: '0 8px 30px rgba(0,0,80,0.5)',
        overflow: 'hidden',
        width: 'min(360px, 90vw)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Shark image or SVG fallback */}
      {imgSrc && !imgErr
        ? <img src={imgSrc} alt="Cuerpo del tiburón" onError={() => setImgErr(true)}
            style={{ width: '100%', display: 'block' }} />
        : <FallbackSharkSVG selected={selected} onSelect={onSelect} />
      }

      {/* Glowing hotspot overlays */}
      {Object.entries(HOTSPOTS).map(([part, pos]) => {
        const isActive = selected === part
        return (
          <motion.button
            key={part}
            onClick={() => onSelect(isActive ? null : part)}
            title={pos.label}
            style={{
              position: 'absolute',
              top: pos.top, left: pos.left,
              transform: 'translate(-50%, -50%)',
              width:  isActive ? 58 : 46,
              height: isActive ? 58 : 46,
              borderRadius: '50%',
              border: `3px solid ${isActive ? '#ffd166' : 'rgba(255,255,255,0.8)'}`,
              background: isActive ? 'rgba(255,209,102,0.45)' : 'rgba(255,255,255,0.3)',
              boxShadow: isActive ? '0 0 18px 6px rgba(255,209,102,0.7)' : '0 0 10px rgba(255,255,255,0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.6rem',
              fontWeight: 900,
              color: isActive ? '#7a4000' : 'transparent',
              transition: 'all 0.25s',
              outline: 'none',
            }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            aria-label={pos.label}
          >
            {isActive && pos.label}
          </motion.button>
        )
      })}
    </motion.div>
  )
}

// Fallback SVG if no image available
function FallbackSharkSVG({ selected, onSelect }) {
  const hl = (p) => selected === p ? '#ffd166' : 'rgba(100,180,220,0.3)'
  const sk = (p) => selected === p ? '#f4a261' : 'rgba(0,119,182,0.5)'
  return (
    <svg viewBox="0 0 320 160" width="100%" style={{ display:'block' }}>
      <ellipse cx="150" cy="85" rx="110" ry="40" fill="#00b4d8" stroke="#0077b6" strokeWidth="2"/>
      <ellipse cx="150" cy="95" rx="80"  ry="22" fill="#90e0ef" opacity="0.7"/>
      <circle cx="228" cy="76" r="7" fill="white"/><circle cx="229" cy="76" r="4" fill="#03045e"/>
      <path d="M218,92 Q228,100 238,92" fill="none" stroke="#023e8a" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M120,45 L145,85 L95,85 Z" fill={hl('fins')} stroke={sk('fins')} strokeWidth="2" style={{cursor:'pointer'}} onClick={() => onSelect('fins')}/>
      <path d="M170,100 L200,130 L155,110 Z" fill={hl('fins')} stroke={sk('fins')} strokeWidth="2" style={{cursor:'pointer'}} onClick={() => onSelect('fins')}/>
      <path d="M40,85 L10,60 L10,110 Z"  fill={hl('tail')} stroke={sk('tail')} strokeWidth="2" style={{cursor:'pointer'}} onClick={() => onSelect('tail')}/>
      <ellipse cx="240" cy="86" rx="22" ry="14" fill={hl('teeth')} stroke={sk('teeth')} strokeWidth="2" style={{cursor:'pointer'}} onClick={() => onSelect('teeth')}/>
    </svg>
  )
}

// ════════════════════════════════════════════════════════════════
// ESCENA 5 — REPRODUCCIÓN
// ════════════════════════════════════════════════════════════════
function ReproScene({ scene, onNext }) {
  return (
    <>
      <motion.div className="question-badge" initial={{ opacity:0 }} animate={{ opacity:1 }}>
        {scene.emoji} {scene.question}
      </motion.div>
      <motion.h2 className="scene-title" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
        {scene.title}
      </motion.h2>

      <div className="repro-cards">
        <ReproCard emoji="🦈" label="Mamá tiburón" imgSrc={scene.character} characterStyle={scene.characterStyle} />
        <ReproCard emoji="🥚" label="Huevo tiburón" imgSrc={scene.eggImage} />
        <ReproCard emoji="🦈" label="Bebé tiburón"  imgSrc={scene.babyImage} small />
      </div>

      <DialogueBox text={scene.text} />

      <div className="btn-row">
        <AudioButton src={scene.audio} />
        <DecisionButton onClick={onNext} variant="primary">{scene.buttonText}</DecisionButton>
      </div>
    </>
  )
}

function ReproCard({ emoji, label, imgSrc, characterStyle, small }) {
  const [err, setErr] = useState(false)
  const h = small ? 50 : 70

  // For the cute shark (sticker-cyan), apply circle crop to look tidy in a small card
  const imgStyle = characterStyle === 'sticker-cyan'
    ? { height: h, width: h, objectFit: 'cover', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)' }
    : { height: h, objectFit: 'contain' }

  return (
    <motion.div
      className="repro-card"
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: 0.2 }}
    >
      {imgSrc && !err
        ? <img src={imgSrc} alt={label} onError={() => setErr(true)} style={imgStyle} />
        : <span className="repro-emoji">{emoji}</span>
      }
      <span className="repro-label">{label}</span>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════
// ESCENA 6 — DATO CURIOSO + CONFETTI
// ════════════════════════════════════════════════════════════════
function CuriosityScene({ scene, onNext }) {
  const [boom, setBoom] = useState(false)
  const [confetti, setConfetti] = useState([])

  const handleBoom = () => {
    playClick()
    setBoom(true)
    const pieces = Array.from({ length: 55 }, (_, i) => ({
      id: i,
      left:  Math.random() * 100,
      delay: Math.random() * 0.8,
      dur:   Math.random() * 1.5 + 1.5,
      color: ['#ffd166','#ff6b6b','#06d6a0','#90e0ef','#ffffff','#f4a261'][Math.floor(Math.random()*6)],
      size:  Math.random() * 12 + 6,
    }))
    setConfetti(pieces)
    setTimeout(onNext, 2200)
  }

  return (
    <>
      {/* Confetti layer */}
      {confetti.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left:              `${p.left}%`,
          top:               0,
          width:             p.size,
          height:            p.size,
          background:        p.color,
          animationDuration: `${p.dur}s`,
          animationDelay:    `${p.delay}s`,
        }}/>
      ))}

      <motion.div className="question-badge" initial={{ opacity:0 }} animate={{ opacity:1 }}>
        {scene.emoji} {scene.question}
      </motion.div>
      <motion.h2 className="scene-title" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
        {scene.title}
      </motion.h2>

      {/* Video tiburón + dinosaurio real */}
      <div style={{ display:'flex', alignItems:'flex-end', gap:'0.75rem', flexWrap:'wrap', justifyContent:'center' }}>
        <SceneCharacter scene={scene} size="md" />
        <DinosaurImage src={scene.dinosaurImage} />
      </div>

      <DialogueBox text={scene.text} subText={scene.subtext} />

      {boom && (
        <motion.div className="stars-row" initial={{ opacity:0 }} animate={{ opacity:1 }}>
          {'⭐'.repeat(5).split('').map((s,i) => <span key={i}>{s}</span>)}
        </motion.div>
      )}

      <div className="btn-row">
        <AudioButton src={scene.audio} />
        {!boom && (
          <DecisionButton onClick={handleBoom} variant="sand">{scene.buttonText}</DecisionButton>
        )}
        {boom && (
          <DecisionButton onClick={onNext} variant="primary">Ir al final 🎉</DecisionButton>
        )}
      </div>
    </>
  )
}

// ════════════════════════════════════════════════════════════════
// ── Dinosaur image with fallback ────────────────────────────────
function DinosaurImage({ src }) {
  const [err, setErr] = useState(false)
  if (!src || err) {
    return (
      <span className="curiosity-dino" role="img" aria-label="Dinosaurio">🦕</span>
    )
  }
  return (
    <motion.img
      src={src}
      alt="Dinosaurio"
      onError={() => setErr(true)}
      initial={{ opacity:0, x:30 }}
      animate={{ opacity:1, x:0 }}
      transition={{ delay:0.3 }}
      style={{
        height: 'clamp(100px, 18vh, 180px)',
        objectFit: 'contain',
        filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.5))',
      }}
    />
  )
}

// ════════════════════════════════════════════════════════════════
// ESCENA 7 — CIERRE
// ════════════════════════════════════════════════════════════════
function EndingScene({ scene, onNext }) {
  return (
    <>
      <motion.span style={{ fontSize: 'clamp(3rem,10vw,6rem)' }}
        initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:180, damping:12, delay:0.1 }}>
        {scene.emoji}
      </motion.span>

      <motion.h2 className="scene-title" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }}>
        {scene.title}
      </motion.h2>

      <SceneCharacter scene={scene} size="md" />

      <DialogueBox text={scene.text} subText={scene.subtext} />

      <div className="btn-row">
        <AudioButton src={scene.audio} />
        <DecisionButton onClick={() => window.location.reload()} variant="secondary">🏠 Volver al inicio</DecisionButton>
        <DecisionButton onClick={() => { window.location.reload() }} variant="primary">🔄 Repetir aventura</DecisionButton>
      </div>

      <p className="ending-credit">{scene.credit}</p>
    </>
  )
}

// ── Ocean bottom decoration SVG ────────────────────────────────
function OceanBottom() {
  return (
    <div className="ocean-bottom" aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width:'100%', height:'100%' }}>
        <path
          d="M0,40 C200,70 400,20 600,50 C800,80 1000,30 1200,55 C1300,65 1380,45 1440,50 L1440,80 L0,80 Z"
          fill="rgba(3,4,94,0.5)"
        />
        {/* Seaweed */}
        {[80,200,350,520,700,900,1100,1300].map(x => (
          <g key={x} transform={`translate(${x},40)`}>
            <path d={`M0,40 Q8,20 0,0 Q-8,20 0,40`} fill="rgba(6,214,160,0.4)" />
          </g>
        ))}
      </svg>
    </div>
  )
}
