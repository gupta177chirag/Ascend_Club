import { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { Plus, Edit2, Trash2, X, CheckCircle2, Target } from 'lucide-react'
import { CATEGORY_OPTIONS } from '../data/categories'

const Goals = () => {
  const { goals, addGoal, updateGoal, deleteGoal, toggleMilestone } = useData()
  const [showModal, setShowModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [milestoneInputs, setMilestoneInputs] = useState([''])

  const openAdd = () => {
    setEditingGoal(null); setTitle(''); setDescription(''); setCategory(''); setMilestoneInputs(['']); setShowModal(true)
  }
  const openEdit = (g) => {
    setEditingGoal(g); setTitle(g.title); setDescription(g.description); setCategory(g.category)
    setMilestoneInputs(g.milestones.map(m => m.title)); setShowModal(true)
  }
  const handleSubmit = () => {
    if (!title.trim()) return
    const milestones = milestoneInputs.filter(m => m.trim()).map((m, i) => ({ id: (i + 1).toString(), title: m, completed: editingGoal?.milestones[i]?.completed || false }))
    if (editingGoal) updateGoal(editingGoal.id, { title, description, category, milestones })
    else addGoal({ title, description, category, milestones })
    setShowModal(false)
  }
  const getCategoryIcon = (cat) => CATEGORY_OPTIONS.find(c => c.value === cat)?.emoji ?? '🎯'

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2"><Target size={18} className="text-accent-text" /><h1 className="text-2xl font-bold font-display text-foreground">Growth Goals</h1></div>
          <p className="text-sm text-muted-foreground mt-1">Design and track the milestones that matter most.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-xl bg-surface-elevated border border-border/60 px-4 py-2.5 text-sm font-medium text-foreground hover:border-accent-border hover:shadow-glow transition-all">
          <Plus size={16} /> Add Goal
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {goals.map(goal => {
          const completed = goal.milestones.filter(m => m.completed).length
          const total = goal.milestones.length || 1
          const progressPct = Math.round((completed / total) * 100)
          const icon = getCategoryIcon(goal.category)
          return (
            <div key={goal.id} className="group relative bg-card border border-border/60 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-border hover:shadow-glow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-surface-elevated border border-border/80">{icon}</div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{goal.title}</h3>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-0.5 text-primary">
                        <span className="text-xs">{getCategoryIcon(goal.category)}</span>
                        {CATEGORY_OPTIONS.find(c => c.value === goal.category)?.label || goal.category || 'Uncategorized'}
                      </span>
                      <span>{completed}/{total} milestones</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(goal)} className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-elevated hover:text-foreground transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => deleteGoal(goal.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              {goal.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{goal.description}</p>}
              <div className="mb-3">
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-accent-text">{progressPct}%</span>
                </div>
                <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%`, background: progressPct === 100 ? 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--chart-3)))' : 'hsl(var(--primary))' }} />
                </div>
              </div>
              <div className="space-y-1.5 mt-3">
                {goal.milestones.map(m => (
                  <button key={m.id} onClick={() => toggleMilestone(goal.id, m.id)} className="w-full flex items-center gap-2.5 text-xs text-left group/m">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${m.completed ? 'border-transparent bg-accent-text' : 'border-border bg-card'}`}>
                      {m.completed && <CheckCircle2 size={10} className="text-white" />}
                    </div>
                    <span className={`transition-colors ${m.completed ? 'text-muted-foreground line-through' : 'text-muted-foreground group-hover/m:text-foreground'}`}>{m.title}</span>
                  </button>
                ))}
              </div>
              {progressPct === 100 && (
                <div className="mt-3 flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-semibold bg-accent/20 text-accent-text">
                  <CheckCircle2 size={12} /> Goal complete — great work!
                </div>
              )}
            </div>
          )
        })}
      </div>

      {goals.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center">
          <p className="text-sm text-muted-foreground mb-2">You don't have any goals yet.</p>
          <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-surface-elevated border border-border/60 px-4 py-2 text-sm font-medium text-foreground hover:border-accent-border hover:shadow-glow transition-all">
            <Plus size={14} /> Create your first goal
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">{editingGoal ? 'Edit Goal' : 'New Goal'}</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Goal title" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={2}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
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
                <label className="text-sm font-medium text-foreground mb-1.5 block">Milestones</label>
                {milestoneInputs.map((m, i) => (
                  <input key={i} placeholder={`Milestone ${i + 1}`} value={m}
                    onChange={e => { const arr = [...milestoneInputs]; arr[i] = e.target.value; setMilestoneInputs(arr) }}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 mb-2" />
                ))}
                <button onClick={() => setMilestoneInputs([...milestoneInputs, ''])} className="text-sm text-primary hover:underline">+ Add milestone</button>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-accent">Cancel</button>
              <button onClick={handleSubmit} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">{editingGoal ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Goals
