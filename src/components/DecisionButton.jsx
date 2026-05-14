import { motion } from 'framer-motion'
import { playClick } from '../utils/sound'

export default function DecisionButton({ onClick, children, variant = 'primary', disabled = false, style = {} }) {
  const handleClick = () => {
    playClick()
    onClick?.()
  }

  return (
    <motion.button
      className={`btn btn-${variant}`}
      onClick={handleClick}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer', ...style }}
      whileTap={{ scale: 0.93 }}
      whileHover={{ scale: 1.06 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {children}
    </motion.button>
  )
}
