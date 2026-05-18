import { Search, Bell, MessageCircle, Sun, Moon, User, LogOut, Settings } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const Topbar = () => {
  const { isDark, toggleTheme, accentPresets, setAccentColor, accentColor } = useTheme()
  const { user, logout } = useAuth()
  const { notifications, markNotificationRead } = useData()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showAccent, setShowAccent] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const notifRef = useRef(null)
  const profileRef = useRef(null)
  const accentRef = useRef(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
      if (accentRef.current && !accentRef.current.contains(e.target)) setShowAccent(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 shrink-0">
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow" />
      </div>
      <div className="flex items-center gap-1">
        <div ref={accentRef} className="relative">
          <button onClick={() => setShowAccent(!showAccent)} className="rounded-full p-2 hover:bg-accent transition-colors" title="Accent color">
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: `hsl(${accentColor})` }} />
          </button>
          {showAccent && (
            <div className="absolute right-0 top-full z-50 mt-2 flex gap-2 rounded-xl border border-border bg-card p-3 shadow-lg animate-fade-in">
              {accentPresets.map(preset => (
                <button key={preset.name} onClick={() => { setAccentColor(preset.value); setShowAccent(false) }}
                  className={`h-6 w-6 rounded-full transition-all hover:scale-110 ${accentColor === preset.value ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card' : ''}`}
                  style={{ backgroundColor: `hsl(${preset.value})` }} title={preset.name} />
              ))}
            </div>
          )}
        </div>

        <button onClick={toggleTheme} className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" title="Toggle theme">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button onClick={() => navigate('/messages')} className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <MessageCircle size={18} />
        </button>

        <div ref={notifRef} className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Bell size={18} />
            {unreadCount > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{unreadCount}</span>}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-card shadow-lg animate-fade-in">
              <div className="p-3 font-semibold text-sm border-b border-border">Notifications</div>
              <div className="max-h-64 overflow-auto">
                {notifications.map(n => (
                  <button key={n.id} onClick={() => { markNotificationRead(n.id); navigate(n.link); setShowNotifications(false) }}
                    className={`w-full p-3 text-left text-sm hover:bg-accent transition-colors ${!n.read ? 'bg-primary/5' : ''}`}>
                    <div className="font-medium text-foreground">{n.title}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">{n.message}</div>
                    <div className="text-muted-foreground text-xs mt-1">{n.timestamp}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div ref={profileRef} className="relative ml-1">
          <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </button>
          {showProfile && (
            <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-border bg-card shadow-lg animate-fade-in overflow-hidden">
              <button onClick={() => { navigate(`/profile/${user?.username}`); setShowProfile(false) }} className="flex w-full items-center gap-2 p-3 text-sm text-foreground hover:bg-accent transition-colors">
                <User size={16} /> Profile
              </button>
              <button onClick={() => { navigate('/settings'); setShowProfile(false) }} className="flex w-full items-center gap-2 p-3 text-sm text-foreground hover:bg-accent transition-colors">
                <Settings size={16} /> Settings
              </button>
              <div className="border-t border-border" />
              <button onClick={() => { logout(); navigate('/') }} className="flex w-full items-center gap-2 p-3 text-sm text-destructive hover:bg-accent transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
