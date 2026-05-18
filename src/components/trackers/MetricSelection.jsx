import { Clock, Hash, Route, Scale, CheckSquare, Gauge } from 'lucide-react'
import { cn } from '../../lib/utils'

export const METRIC_TYPES = [
  { id: 'time', title: 'Time', description: 'Track duration (sessions, focus time, etc.)', icon: Clock },
  { id: 'count', title: 'Count', description: 'Whole numbers (reps, sessions, items)', icon: Hash },
  { id: 'distance', title: 'Distance', description: 'Track distance (running, cycling, etc.)', icon: Route },
  { id: 'weight', title: 'Weight', description: 'Track weight (body, lifting, etc.)', icon: Scale },
  { id: 'boolean', title: 'Boolean', description: 'Yes/No or completed (no numeric input)', icon: CheckSquare },
  { id: 'numeric', title: 'Numeric', description: 'Custom numeric value with your own unit label', icon: Gauge },
]

const UNIT_OPTIONS = {
  time: [{ value: 'minutes', label: 'Minutes' }, { value: 'hours', label: 'Hours' }],
  count: 'implicit',
  distance: [{ value: 'km', label: 'Km' }, { value: 'miles', label: 'Miles' }],
  weight: [{ value: 'kg', label: 'Kg' }, { value: 'lbs', label: 'Lbs' }],
  boolean: 'implicit',
  numeric: 'custom',
}

export function MetricSelection({ metricType, setMetricType, unit, setUnit, customUnitLabel, setCustomUnitLabel }) {
  const handleSelectType = (id) => {
    if (!id) return
    setMetricType(id)
    setUnit(null)
    setCustomUnitLabel('')
    if (id === 'count') setUnit('integer')
    if (id === 'boolean') setUnit('completed')
  }

  const unitConfig = metricType ? UNIT_OPTIONS[metricType] : null
  const showUnitRadios = unitConfig && Array.isArray(unitConfig) && unitConfig.length > 0
  const showCustomLabel = unitConfig === 'custom'

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Step 1 — Choose metric type</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {METRIC_TYPES.map((m) => {
            const Icon = m.icon
            const selected = metricType === m.id
            return (
              <button key={m.id} type="button" onClick={() => handleSelectType(m.id)}
                className={cn('rounded-xl border p-3 text-left transition-all duration-200 hover:border-border/80',
                  selected ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary/20 opacity-100' : 'border-border/60 bg-card/50 opacity-70 hover:opacity-90')}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', selected ? 'bg-primary/20 text-primary' : 'bg-surface-elevated text-muted-foreground')}>
                    <Icon size={16} />
                  </div>
                  <span className={cn('text-sm font-medium', selected ? 'text-foreground' : 'text-muted-foreground')}>{m.title}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">{m.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {metricType && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Step 2 — Choose unit</p>
          {showUnitRadios && (
            <div className="flex flex-wrap gap-3">
              {unitConfig.map((opt) => {
                const isSelected = unit === opt.value
                return (
                  <label key={opt.value}
                    className={cn('flex items-center gap-2.5 rounded-xl border px-4 py-2.5 cursor-pointer transition-all',
                      isSelected ? 'border-primary bg-primary/10' : 'border-border/60 hover:border-border')}>
                    <input type="radio" name="unit" value={opt.value} checked={isSelected} onChange={() => setUnit(opt.value)} className="sr-only" />
                    <span className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors', isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/50')}>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-primary-foreground" />}
                    </span>
                    <span className={cn('text-sm', isSelected ? 'font-semibold text-foreground' : 'text-muted-foreground')}>{opt.label}</span>
                  </label>
                )
              })}
            </div>
          )}
          {metricType === 'count' && <p className="text-sm text-muted-foreground">Integer — no additional unit. Count whole numbers.</p>}
          {metricType === 'boolean' && <p className="text-sm text-muted-foreground">Completed — log as done; no numeric value.</p>}
          {showCustomLabel && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground block">Unit label (text only)</label>
              <input type="text" placeholder="e.g. pages, reps" value={customUnitLabel}
                onChange={(e) => { const v = e.target.value.replace(/[^a-zA-Z\s]/g, ''); setCustomUnitLabel(v); setUnit(v.trim() || null) }}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              <p className="text-[11px] text-muted-foreground">Values logged will be numeric only.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function getEffectiveUnit(metricType, unit, customUnitLabel) {
  if (!metricType) return null
  if (metricType === 'count') return 'integer'
  if (metricType === 'boolean') return 'completed'
  if (metricType === 'numeric') return customUnitLabel.trim() || null
  return unit
}

export function isMetricSelectionComplete(metricType, unit, customUnitLabel) {
  if (!metricType) return false
  const effective = getEffectiveUnit(metricType, unit, customUnitLabel)
  return effective != null && effective.length > 0
}
