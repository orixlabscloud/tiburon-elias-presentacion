import { useState } from 'react'
import { motion } from 'framer-motion'

// ── Sticker styles ────────────────────────────────────────────────
// sticker-cyan  → tiburón cute azul: muestra fondo como parte del diseño
// sticker-white → tiburón lateral sobre fondo blanco: mezcla con multiply

const stickerStyles = {
  'sticker-cyan': {
    // El fondo cyan se convierte en un marco de color que combina con el océano
    background: 'linear-gradient(135deg, #48cae4, #00b4d8)',
    borderRadius: '50%',
    padding: '6px',
    border: '3px solid rgba(255,255,255,0.6)',
    boxShadow: '0 8px 30px rgba(0,0,80,0.5), 0 0 0 2px rgba(255,255,255,0.2)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  'sticker-white': {
    // Fondo blanco: tarjeta con borde y sombra, parece un sticker editorial
    background: 'rgba(255,255,255,0.92)',
    borderRadius: '1.5rem',
    padding: '8px 12px',
    border: '3px solid rgba(255,255,255,0.9)',
    boxShadow: '0 8px 30px rgba(0,0,80,0.5)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

const sizeMap = {
  sm: { wrapSize: 110, imgSize: '100%'  },
  md: { wrapSize: 170, imgSize: '100%'  },
  lg: { wrapSize: 230, imgSize: '100%'  },
}

export default function SharkCharacter({ src, characterStyle = 'sticker-cyan', size = 'md', style = {} }) {
  const [imgError, setImgError] = useState(false)

  const { wrapSize } = sizeMap[size] || sizeMap.md
  const wrapStyle    = stickerStyles[characterStyle] || stickerStyles['sticker-cyan']

  if (src && !imgError) {
    return (
      <motion.div
        className="shark-wrap"
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1,    opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        style={{
          ...wrapStyle,
          width:  wrapSize,
          height: wrapSize,
          ...style,
        }}
      >
        <motion.img
          src={src}
          alt="Tiburoncito Elías"
          onError={() => setImgError(true)}
          style={{
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            display:    'block',
            animation:  'sharkFloat 3s ease-in-out infinite',
          }}
        />
      </motion.div>
    )
  }

  // ── Emoji fallback (si la imagen no se encuentra) ─────────────
  return (
    <motion.div
      className="shark-wrap"
      initial={{ scale: 0.75, opacity: 0 }}
      animate={{ scale: 1,    opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      style={style}
    >
      <span
        className="shark-fallback"
        role="img"
        aria-label="Tiburón amigable"
        style={{ fontSize: Math.round(wrapSize * 0.65) }}
      >
        🦈
      </span>
    </motion.div>
  )
}
