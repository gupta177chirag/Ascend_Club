import { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { Plus, Trash2, X, Flame } from 'lucide-react'
import { CATEGORY_OPTIONS } from '../data/categories'

const Habits = () => {
  const { habits, addHabit, toggleHabit, deleteHabit } = useData()
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('✨')
  const [category, setCategory] = useState('')
  const today = new Date().toISOString().split('T')[0]

  const handleAdd = () => {
    if (!title.trim()) return
    addHabit({ title, description: description.trim() || undefined, icon, category })
    setShowModal(false); setTitle(''); setDescription(''); setIcon('✨'); setCategory('')
  }

  const last28Days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (27 - i)); return d.toISOString().split('T')[0]
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2"><Flame size={18} className="text-accent-text" /><h1 className="text-2xl font-bold font-display text-foreground">Daily Habits</h1></div>
          <p className="text-sm text-muted-foreground mt-1">Build streaks with the small actions you repeat every day.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-xl bg-surface-elevated border border-border/60 px-4 py-2.5 text-sm font-medium text-foreground hover:border-accent-border hover:shadow-glow transition-all">
          <Plus size={16} /> Add Habit
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {habits.map(habit => {
          const isCompletedToday = habit.completedDates.includes(today)
          return (
            <div key={habit.id} className="group rounded-2xl border border-border/60 bg-card p-5 hover:border-accent-border hover:shadow-glow transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleHabit(habit.id)}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg transition-all ${isCompletedToday ? 'bg-primary/20 scale-105' : 'bg-surface-elevated hover:bg-surface-elevated/80'}`}>
                    {habit.icon}
                  </button>
                  <div>
                    <h3 className={`font-semibold text-sm ${isCompletedToday ? 'text-accent-text' : 'text-foreground'}`}>{habit.title}</h3>
                    {habit.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{habit.description}</p>}
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-0.5 text-primary">
                        <span className="text-xs">{CATEGORY_OPTIONS.find(c => c.value === habit.category)?.emoji ?? '●'}</span>
                        {CATEGORY_OPTIONS.find(c => c.value === habit.category)?.label || habit.category || 'Uncategorized'}
                      </span>
                      <Flame size={11} className="text-chart-4" />
                      <span>{habit.streak} day streak</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteHabit(habit.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button onClick={() => toggleHabit(habit.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all border ${isCompletedToday ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:bg-accent'}`}>
                  {isCompletedToday ? 'Completed today ✓' : 'Mark complete'}
                </button>
                <span className="text-[11px] text-muted-foreground">Tap to toggle today</span>
              </div>
              <div className="mt-4 flex gap-[3px] flex-wrap">
                {last28Days.map(date => {
                  const done = habit.completedDates.includes(date)
                  return (
                    <div key={date} className="h-3 w-3 rounded-sm transition-colors"
                      style={{ backgroundColor: done ? 'hsl(var(--primary))' : 'hsl(var(--surface-elevated))', opacity: done ? 1 : 0.45 }}
                      title={date} />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {habits.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center">
          <p className="text-sm text-muted-foreground mb-2">No habits yet. Start with one tiny behavior you want to repeat.</p>
          <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-surface-elevated border border-border/60 px-4 py-2 text-sm font-medium text-foreground hover:border-accent-border hover:shadow-glow transition-all">
            <Plus size={14} /> Create your first habit
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">New Habit</h2>
              <button onClick={() => setShowModal(false)}><X size={18} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Habit name" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              <textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} rows={2}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              <input placeholder="Icon emoji" value={icon} onChange={e => setIcon(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
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
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-accent">Cancel</button>
              <button onClick={handleAdd} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Habits
