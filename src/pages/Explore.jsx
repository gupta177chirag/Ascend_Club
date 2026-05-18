import { useState, useMemo } from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Search, Users } from 'lucide-react'
import { CommunityPreviewModal } from '../components/communities/CommunityPreviewModal'

const categories = ['All', 'Fitness', 'Tech', 'Wellness', 'Learning', 'Business', 'Creative']
const sortOptions = ['Popular', 'Name A-Z']

const Explore = () => {
  const { communities, joinCommunity, leaveCommunity } = useData()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('Popular')
  const [previewCommunityId, setPreviewCommunityId] = useState(null)

  const filtered = useMemo(() => {
    let result = communities
    if (category !== 'All') result = result.filter(c => c.category === category)
    if (search) result = result.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'Popular') result = [...result].sort((a, b) => b.members - a.members)
    if (sort === 'Name A-Z') result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    return result
  }, [communities, category, search, sort])

  const previewCommunity = previewCommunityId ? communities.find(c => c.id === previewCommunityId) : null

  const handleJoin = (id) => {
    if (!isAuthenticated) { navigate('/signup'); return }
    joinCommunity(id)
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/favicon.png" alt="Ascend Club" className="h-8 w-8 rounded-full" />
          <span className="text-2xl font-bold text-primary tracking-tight">Ascend Club</span>
        </div>
        <div className="flex gap-3">
          {isAuthenticated ? (
            <button onClick={() => navigate('/dashboard')} className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">← Dashboard</button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">Log in</button>
              <button onClick={() => navigate('/signup')} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">Sign up</button>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Explore Communities</h1>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search communities..."
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow" />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none text-foreground">
            {sortOptions.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${category === cat ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground hover:text-foreground'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(c => (
            <div key={c.id} role="button" tabIndex={0}
              onClick={() => setPreviewCommunityId(c.id)}
              onKeyDown={e => e.key === 'Enter' && setPreviewCommunityId(c.id)}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors cursor-pointer">
              <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary mb-2">{c.category}</span>
              <h3 className="text-lg font-semibold text-foreground">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Users size={12} /> {c.members.toLocaleString()}</span>
                {c.joined
                  ? <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Joined ✓</span>
                  : <span className="rounded-lg bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Click to preview</span>}
              </div>
            </div>
          ))}
        </div>

        {previewCommunity && (
          <CommunityPreviewModal community={previewCommunity} onClose={() => setPreviewCommunityId(null)} onJoin={handleJoin} onLeave={leaveCommunity} />
        )}

        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No communities found matching your criteria.</p>}
      </div>
    </div>
  )
}

export default Explore
