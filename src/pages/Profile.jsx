import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { MessageButton } from '../components/MessageButton'
import { mockUserIdByUsername } from '../data/mockData'
import { UserPlus, UserMinus } from 'lucide-react'

const Profile = () => {
  const { username } = useParams()
  const { user } = useAuth()
  const { trackers, goals } = useData()
  const navigate = useNavigate()
  const [following, setFollowing] = useState(false)
  const isOwnProfile = user?.username === username
  const otherUserId = username ? mockUserIdByUsername[username.toLowerCase()] : undefined

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shrink-0">
            {(isOwnProfile ? user?.name : username || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground">{isOwnProfile ? user?.name : username}</h1>
            <p className="text-sm text-muted-foreground">@{username}</p>
            {isOwnProfile && user?.bio && <p className="mt-2 text-sm text-muted-foreground">{user.bio}</p>}
          </div>
          {!isOwnProfile && (
            <div className="flex gap-2">
              {otherUserId && <MessageButton userId={otherUserId} variant="icon" className="rounded-lg border border-border p-2.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" />}
              <button onClick={() => setFollowing(!following)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${following ? 'border border-border text-muted-foreground hover:bg-accent' : 'bg-primary text-primary-foreground hover:opacity-90'}`}>
                {following ? <><UserMinus size={14} /> Unfollow</> : <><UserPlus size={14} /> Follow</>}
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Trackers</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {trackers.map(t => (
            <div key={t.id} className="rounded-xl border border-border bg-card p-4 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-2"><span className="text-lg">{t.icon}</span><h3 className="font-medium text-foreground">{t.title}</h3></div>
              <div className="mt-2 text-2xl font-bold text-primary">{t.total} <span className="text-sm font-normal text-muted-foreground">{t.unit}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Goals</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {goals.map(g => (
            <div key={g.id} className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-medium text-foreground">{g.title}</h3>
              <div className="mt-2 h-2 rounded-full bg-accent overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${g.progress}%` }} />
              </div>
              <span className="text-xs text-muted-foreground mt-1 block">{g.progress}% complete</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile
