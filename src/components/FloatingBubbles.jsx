import { useMemo } from 'react'

const BUBBLE_COUNT = 18

export default function FloatingBubbles() {
  const bubbles = useMemo(() => {
    return Array.from({ length: BUBBLE_COUNT }, (_, i) => {
      const size   = Math.random() * 28 + 8
      const left   = Math.random() * 100
      const delay  = Math.random() * 12
      const dur    = Math.random() * 10 + 10
      return { id: i, size, left, delay, dur }
    })
  }, [])

  return (
    <div className="bubbles-layer" aria-hidden="true">
      {bubbles.map(b => (
        <div
          key={b.id}
          className="bubble"
          style={{
            width:              b.size,
            height:             b.size,
            left:               `${b.left}%`,
            animationDuration:  `${b.dur}s`,
            animationDelay:     `${b.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
