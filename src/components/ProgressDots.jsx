import { motion } from 'framer-motion'

export default function ProgressDots({ total, current, onDotClick }) {
  return (
    <div className="progress-bar" role="navigation" aria-label="Progreso de la historia">
      {Array.from({ length: total }, (_, i) => (
        <motion.button
          key={i}
          className={`progress-dot ${i === current ? 'active' : ''}`}
          onClick={() => onDotClick(i)}
          whileHover={{ scale: 1.4 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Ir a escena ${i + 1}`}
          aria-current={i === current ? 'step' : undefined}
        />
      ))}
    </div>
  )
}
