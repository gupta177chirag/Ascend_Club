import { cn } from '../../lib/utils'

export const CircularProgress = ({ value, size = 120, strokeWidth = 10, label, sublabel, color = 'hsl(var(--accent-glow))', trackColor = 'hsl(var(--surface-elevated))', className }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)' }} />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        {label && <span className="text-2xl font-bold text-foreground font-display">{label}</span>}
        {sublabel && <span className="text-xs text-muted-foreground mt-0.5">{sublabel}</span>}
      </div>
    </div>
  )
}
