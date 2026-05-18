import { useMemo, useState } from 'react'
import { useData } from '../contexts/DataContext'
import { Plus, Trash2, X, Activity, TrendingUp } from 'lucide-react'
import { CATEGORY_OPTIONS } from '../data/categories'
import { MetricSelection, getEffectiveUnit, isMetricSelectionComplete } from '../components/trackers/MetricSelection'

const Trackers = () => {
  const { trackers, addTracker, logTracker, deleteTracker, deleteTrackerLog } = useData()
  const [showCreate, setShowCreate] = useState(false)
  const [showLog, setShowLog] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [metricType, setMetricType] = useState(null)
  const [unit, setUnit] = useState(null)
  const [customUnitLabel, setCustomUnitLabel] = useState('')
  const [category, setCategory] = useState('')
  const [icon, setIcon] = useState('📊')
  const [logValue, setLogValue] = useState('')
  const [logNote, setLogNote] = useState('')

  const resetCreateForm = () => { setTitle(''); setDescription(''); setMetricType(null); setUnit(null); setCustomUnitLabel(''); setCategory(''); setIcon('📊') }

  const handleCreate = () => {
    const effectiveUnit = getEffectiveUnit(metricType, unit, customUnitLabel)
    if (!title.trim() || !metricType || !effectiveUnit) return
    addTracker({ title: title.trim(), description: description.trim() || undefined, metric: metricType, unit: effectiveUnit, icon, category: category || undefined })
    setShowCreate(false); resetCreateForm()
  }

  const canCreate = title.trim().length > 0 && isMetricSelectionComplete(metricType, unit, customUnitLabel)

  const handleLog = () => {
    if (!showLog || !logValue) return
    logTracker(showLog, { value: parseFloat(logValue), date: new Date().toISOString().split('T')[0], note: logNote || undefined })
    setShowLog(null); setLogValue(''); setLogNote('')
  }

  const last7Days = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toISOString().split('T')[0]
  }), [])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2"><Activity size={18} className="text-accent-text" /><h1 className="text-2xl font-bold font-display text-foreground">Activity Trackers</h1></div>
          <p className="text-sm text-muted-foreground mt-1">Log the metrics that show your effort over time.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-xl bg-surface-elevated border border-border/60 px-4 py-2.5 text-sm font-medium text-foreground hover:border-accent-border hover:shadow-glow transition-all">
          <Plus size={16} /> New Tracker
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trackers.map(t => {
          const today = new Date().toISOString().split('T')[0]
          const todayTotal = t.logs.filter(l => l.date === today).reduce((s, l) => s + l.value, 0)
          const sparkline = last7Days.map(d => t.logs.filter(l => l.date === d).reduce((s, l) => s + l.value, 0))
          const maxSpark = Math.max(...sparkline, 1)
          return (
            <div key={t.id} className="group rounded-2xl border border-border/60 bg-card p-5 hover:border-accent-border hover:shadow-glow transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-surface-elevated border border-border/80">{t.icon}</div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{t.title}</h3>
                    {t.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{t.description}</p>}
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span>{CATEGORY_OPTIONS.find(c => c.value === t.category)?.emoji ?? '●'}</span>
                      <span>{CATEGORY_OPTIONS.find(c => c.value === t.category)?.label || t.metric || 'Custom metric'}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteTracker(t.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="mb-3 flex items-end justify-between">
                <div><div className="text-2xl font-bold text-foreground font-display">{t.total}</div><div className="text-xs text-muted-foreground">Total {t.unit}</div></div>
                <div className="text-right"><div className="text-sm font-semibold text-accent-text">{todayTotal} {t.unit}</div><div className="text-[11px] text-muted-foreground">Today's total</div></div>
              </div>
              <div className="mb-3">
                <div className="flex items-center gap-1 mb-1.5"><TrendingUp size={11} className="text-muted-foreground" /><span className="text-[11px] text-muted-foreground">Last 7 days</span></div>
                <div className="flex gap-[3px] h-10 items-end">
                  {sparkline.map((v, i) => (
                    <div key={`${t.id}-${i}`} className="flex-1 rounded-full bg-surface-elevated"
                      style={{ height: `${10 + (v / maxSpark) * 30}px`, background: v === 0 ? 'hsl(var(--surface-elevated))' : 'hsl(200,80%,55%)', opacity: v === 0 ? 0.4 : 1 }}
                      title={`${v} ${t.unit}`} />
                  ))}
                </div>
              </div>
              {t.logs.length > 0 && (
                <div className="mt-3 space-y-1.5 max-h-28 overflow-auto">
                  {t.logs.slice(0, 4).map(log => (
                    <div key={log.id} className="flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-1.5 text-[11px]">
                      <span className="text-foreground">{log.value} {t.unit} — {log.date}{log.note ? ` · ${log.note}` : ''}</span>
                      <button onClick={() => deleteTrackerLog(t.id, log.id)} className="text-muted-foreground hover:text-destructive ml-2 shrink-0"><Trash2 size={10} /></button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <button onClick={() => setShowLog(t.id)} className="rounded-xl border border-border/70 bg-surface-elevated px-3 py-1.5 text-xs font-medium text-foreground hover:border-accent-border hover:bg-accent/20 transition-all">
                  + Log entry
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {trackers.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center">
          <p className="text-sm text-muted-foreground mb-2">No trackers yet. Create one to start logging your effort.</p>
          <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 rounded-xl bg-surface-elevated border border-border/60 px-4 py-2 text-sm font-medium text-foreground hover:border-accent-border hover:shadow-glow transition-all">
            <Plus size={14} /> Create your first tracker
          </button>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => { setShowCreate(false); resetCreateForm() }}>
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl animate-slide-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Create Tracker</h2>
              <button onClick={() => { setShowCreate(false); resetCreateForm() }} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Tracker name</label>
                <input placeholder="e.g. Deep work, Running" value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Description (optional)</label>
                <textarea placeholder="What are you tracking and why?" value={description} onChange={e => setDescription(e.target.value)} rows={2}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <MetricSelection metricType={metricType} setMetricType={setMetricType} unit={unit} setUnit={setUnit} customUnitLabel={customUnitLabel} setCustomUnitLabel={setCustomUnitLabel} />
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORY_OPTIONS.map(opt => (
                    <button key={opt.value} type="button" onClick={() => setCategory(opt.value)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${category === opt.value ? 'border-accent-border bg-primary/10 text-foreground' : 'border-border/70 bg-background text-muted-foreground hover:border-accent-border'}`}>
                      <span className="text-lg">{opt.emoji}</span><span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Icon (optional)</label>
                <input placeholder="📊" value={icon} onChange={e => setIcon(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => { setShowCreate(false); resetCreateForm() }} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-accent">Cancel</button>
              <button onClick={handleCreate} disabled={!canCreate} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none">Create Tracker</button>
            </div>
          </div>
        </div>
      )}

      {showLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowLog(null)}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Log Session</h2>
              <button onClick={() => setShowLog(null)}><X size={18} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <input type="number" placeholder="Value" value={logValue} onChange={e => setLogValue(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              <input placeholder="Note (optional)" value={logNote} onChange={e => setLogNote(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowLog(null)} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-accent">Cancel</button>
              <button onClick={handleLog} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Trackers
