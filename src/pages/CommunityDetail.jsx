import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { MessageButton } from '../components/MessageButton'
import { Users, ArrowLeft, Send, User, Activity, TrendingUp } from 'lucide-react'

const MOCK_MEMBER_IDS = { 'Alex J.': '1', 'Sarah K.': '2', 'Mike R.': '3', 'Jordan L.': '4', 'Casey T.': '5', 'Morgan B.': '6' }

const CommunityDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { communities, joinCommunity, leaveCommunity } = useData()
  const [activeTab, setActiveTab] = useState('feed')
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { user: 'Sarah K.', message: 'Great session today! 💪', time: '10:30 AM' },
    { user: 'Mike R.', message: 'Who is joining the morning run?', time: '10:45 AM' },
    { user: 'Jordan L.', message: 'Count me in! See you at 6am', time: '11:00 AM' },
  ])

  const community = communities.find(c => c.id === id)
  if (!community) return <div className="p-6 text-muted-foreground">Community not found</div>

  const tabs = ['feed', 'trackers', 'members', 'chat', 'about']
  const activityThisWeek = useMemo(() => community.feed.filter(f => f.timestamp?.includes('h')).length + 3, [community.feed])
  const activeMembersCount = Math.min(community.members, Math.max(12, Math.floor(community.members * 0.02)))
  const chatDisabled = user?.messagePrivacy === 'private'

  const sendChat = () => {
    if (!chatInput.trim() || chatDisabled) return
    setChatMessages(prev => [...prev, { user: 'You', message: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    setChatInput('')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={() => navigate('/communities')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="relative rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0">
              <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary mb-3">{community.category}</span>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{community.name}</h1>
              <p className="mt-2 text-muted-foreground leading-relaxed">{community.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Users size={14} /> {community.members.toLocaleString()} members</span>
                {community.creatorName && <span className="flex items-center gap-1.5"><User size={14} /> {community.creatorName}</span>}
              </div>
            </div>
            <div className="shrink-0">
              <button onClick={() => community.joined ? leaveCommunity(community.id) : joinCommunity(community.id)}
                className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${community.joined ? 'border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive' : 'bg-primary text-primary-foreground hover:opacity-90'}`}>
                {community.joined ? 'Leave Community' : 'Join Community'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Activity size={14} /><span className="text-xs font-medium uppercase tracking-wider">Activity this week</span></div>
          <p className="text-2xl font-bold text-foreground">{activityThisWeek}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Users size={14} /><span className="text-xs font-medium uppercase tracking-wider">Active members</span></div>
          <p className="text-2xl font-bold text-foreground">{activeMembersCount.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><TrendingUp size={14} /><span className="text-xs font-medium uppercase tracking-wider">Weekly growth</span></div>
          <p className="text-2xl font-bold text-foreground">+{Math.round(community.members * 0.01)}</p>
        </div>
      </div>

      <div className="flex gap-1 rounded-xl bg-accent p-1">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'feed' && (
        <div className="space-y-3">
          {community.feed.length === 0
            ? <p className="text-muted-foreground text-sm p-4">No posts yet. Be the first to share!</p>
            : community.feed.map(item => (
              <div key={item.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{item.user.charAt(0)}</div>
                  <span className="font-medium text-sm text-foreground">{item.user}</span>
                  <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                  {item.type === 'milestone' && <span className="rounded-full bg-chart-4/10 px-2 py-0.5 text-xs text-chart-4 font-medium">Milestone</span>}
                </div>
                <p className="text-sm text-foreground">{item.content}</p>
              </div>
            ))}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-4">{community.members.toLocaleString()} members</p>
          {['Alex J.', 'Sarah K.', 'Mike R.', 'Jordan L.', 'Casey T.', 'Morgan B.'].map(name => {
            const memberId = MOCK_MEMBER_IDS[name]
            return (
              <div key={name} className="flex items-center justify-between gap-3 py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">{name.charAt(0)}</div>
                  <span className="text-sm font-medium text-foreground">{name}</span>
                </div>
                {memberId && <MessageButton userId={memberId} className="shrink-0" />}
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="h-80 overflow-auto p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs rounded-xl px-4 py-2.5 text-sm ${msg.user === 'You' ? 'bg-primary text-primary-foreground' : 'bg-accent text-foreground'}`}>
                  {msg.user !== 'You' && <div className="text-xs font-medium mb-1 text-primary">{msg.user}</div>}
                  <p>{msg.message}</p>
                  <div className={`text-xs mt-1 ${msg.user === 'You' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border p-3 space-y-2">
            {chatDisabled && <p className="text-xs text-muted-foreground px-1">Messaging disabled due to privacy settings.</p>}
            <div className="flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder={chatDisabled ? 'Messaging disabled due to privacy settings.' : 'Type a message...'}
                disabled={chatDisabled}
                className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60 disabled:cursor-not-allowed" />
              <button onClick={sendChat} disabled={chatDisabled} className="rounded-lg bg-primary p-2.5 text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"><Send size={16} /></button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-2">About {community.name}</h3>
          <p className="text-sm text-muted-foreground">{community.description}</p>
          <div className="mt-4 space-y-1 text-sm text-muted-foreground">
            <p>Category: <span className="text-foreground">{community.category}</span></p>
            <p>Members: <span className="text-foreground">{community.members.toLocaleString()}</span></p>
          </div>
        </div>
      )}

      {activeTab === 'trackers' && (
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="text-sm text-muted-foreground">Community trackers will be available with a backend connection.</p>
        </div>
      )}
    </div>
  )
}

export default CommunityDetail
