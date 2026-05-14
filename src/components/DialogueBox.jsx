import { motion } from 'framer-motion'

export default function DialogueBox({ text, subText, children }) {
  return (
    <motion.div
      className="dialogue-box"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      {text && <p>{text}</p>}
      {subText && <p className="sub-text">{subText}</p>}
      {children}
    </motion.div>
  )
}
