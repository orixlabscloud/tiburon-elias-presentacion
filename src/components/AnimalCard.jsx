import { motion } from 'framer-motion'
import { playClick } from '../utils/sound'

export default function AnimalCard({ food, state, onClick }) {
  const handleClick = () => {
    playClick()
    onClick?.()
  }

  return (
    <motion.button
      className={`food-card ${state || ''}`}
      onClick={handleClick}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.07 }}
      transition={{ type: 'spring', stiffness: 350, damping: 18 }}
      aria-label={food.name}
    >
      <span className="food-emoji" role="img" aria-hidden="true">{food.emoji}</span>
      <span className="food-name">{food.name}</span>
      {state === 'correct'   && <span style={{ fontSize: '1.4rem' }}>✅</span>}
      {state === 'incorrect' && <span style={{ fontSize: '1.4rem' }}>❌</span>}
    </motion.button>
  )
}
