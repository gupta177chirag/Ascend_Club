import { useEffect, useState } from 'react'

export const AnimatedCounter = ({ value, duration = 1200, decimals = 0, suffix = '', prefix = '', className = '' }) => {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplay(value * eased)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value, duration])

  return <span className={className}>{prefix}{display.toFixed(decimals)}{suffix}</span>
}
