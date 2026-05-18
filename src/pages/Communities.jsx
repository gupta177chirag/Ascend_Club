import { useData } from '../contexts/DataContext'
import { useNavigate } from 'react-router-dom'
import { Users, Plus, X } from 'lucide-react'
import { useState } from 'react'

const Communities = () => {
  const { communities, leaveCommunity } = useData()
  const navigate = useNavigate()
  const [showCreate, setShowCreate] = useState(false)
  const joinedCommunities = communities.filter(c => c.joined)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">My Communities</h1>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus size={16} /> Create
        </button>
      </div>

      {joinedCommunities.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Users size={40} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">You haven't joined any communities yet.</p>
          <button onClick={() => navigate('/explore')} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Explore Communities</button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {joinedCommunities.map(c => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-5 cursor-pointer hover:border-primary/20 transition-colors" onClick={() => navigate(`/communities/${c.id}`)}>
              <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary mb-2">{c.category}</span>
              <h3 className="text-lg font-semibold text-foreground">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Users size={12} /> {c.members.toLocaleString()}</span>
                <button onClick={e => { e.stopPropagation(); leaveCommunity(c.id) }}
                  className="rounded-lg border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors">Leave</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Create Community</h2>
              <button onClick={() => setShowCreate(false)}><X size={18} className="text-muted-foreground" /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Community creation will be available when a backend is connected. For now, explore and join existing communities!</p>
            <div className="flex justify-end">
              <button onClick={() => { setShowCreate(false); navigate('/explore') }} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Explore</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Communities
