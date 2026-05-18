import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { Sun, Moon, Lock, Globe, UserX, Shield, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { mockConversations } from '../data/mockData'

// Map user IDs to display names for the blocked users list
const USER_NAMES = {
  '2': 'Sarah K.',
  '3': 'Dev Dan',
  '4': 'Jordan L.',
  '5': 'Casey T.',
  '6': 'Morgan B.',
}

const Settings = () => {
  const { isDark, toggleTheme, accentPresets, accentColor, setAccentColor } = useTheme()
  const { user, updateMessagePrivacy, blockUser, unblockUser } = useAuth()
  const messagePrivacy = user?.messagePrivacy ?? 'public'
  const blockedUsers = user?.blockedUsers ?? []

  const [showBlockInput, setShowBlockInput] = useState(false)
  const [blockTarget, setBlockTarget] = useState('')
  const [blockError, setBlockError] = useState('')
  const [blockSuccess, setBlockSuccess] = useState('')

  // Collect all known user IDs from conversations to allow blocking
  const knownUsers = Object.entries(USER_NAMES).filter(([id]) => id !== user?.id)

  const handleBlockFromList = (userId) => {
    blockUser(userId)
    setBlockSuccess(`Blocked ${USER_NAMES[userId] || userId}`)
    setTimeout(() => setBlockSuccess(''), 2500)
  }

  const handleUnblock = (userId) => {
    unblockUser(userId)
    setBlockSuccess(`Unblocked ${USER_NAMES[userId] || userId}`)
    setTimeout(() => setBlockSuccess(''), 2500)
  }

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      {/* Appearance */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-5">Appearance</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Theme</p>
              <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
            </div>
            <button onClick={toggleTheme}
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Accent Color</p>
            <p className="text-sm text-muted-foreground mb-3">Choose your preferred accent color</p>
            <div className="flex gap-3">
              {accentPresets.map(preset => (
                <button key={preset.name} onClick={() => setAccentColor(preset.value)}
                  className={`h-9 w-9 rounded-full transition-all hover:scale-110 ${accentColor === preset.value ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card' : ''}`}
                  style={{ backgroundColor: `hsl(${preset.value})` }} title={preset.name} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-5">Privacy Settings</h2>
        <p className="text-sm text-muted-foreground mb-4">Control who can send you messages.</p>
        <div className="space-y-3">
          <label className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all ${messagePrivacy === 'public' ? 'border-primary bg-primary/10' : 'border-border/60 hover:border-border'}`}>
            <input type="radio" name="messagePrivacy" value="public" checked={messagePrivacy === 'public'} onChange={() => updateMessagePrivacy('public')} className="sr-only" />
            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${messagePrivacy === 'public' ? 'border-primary bg-primary' : 'border-muted-foreground/50'}`}>
              {messagePrivacy === 'public' && <span className="w-2 h-2 rounded-full bg-primary-foreground" />}
            </span>
            <Globe size={18} className={messagePrivacy === 'public' ? 'text-primary' : 'text-muted-foreground'} />
            <div>
              <span className={`text-sm font-medium ${messagePrivacy === 'public' ? 'text-foreground' : 'text-muted-foreground'}`}>Public</span>
              <p className="text-xs text-muted-foreground">Anyone can message you</p>
            </div>
          </label>
          <label className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all ${messagePrivacy === 'private' ? 'border-primary bg-primary/10' : 'border-border/60 hover:border-border'}`}>
            <input type="radio" name="messagePrivacy" value="private" checked={messagePrivacy === 'private'} onChange={() => updateMessagePrivacy('private')} className="sr-only" />
            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${messagePrivacy === 'private' ? 'border-primary bg-primary' : 'border-muted-foreground/50'}`}>
              {messagePrivacy === 'private' && <span className="w-2 h-2 rounded-full bg-primary-foreground" />}
            </span>
            <Lock size={18} className={messagePrivacy === 'private' ? 'text-primary' : 'text-muted-foreground'} />
            <div>
              <span className={`text-sm font-medium ${messagePrivacy === 'private' ? 'text-foreground' : 'text-muted-foreground'}`}>Private</span>
              <p className="text-xs text-muted-foreground">Disable incoming messages</p>
            </div>
          </label>
        </div>
      </div>

      {/* Block Users — NEW SECTION */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={18} className="text-destructive" />
          <h2 className="text-lg font-semibold text-foreground">Blocked Users</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">Block users to prevent them from messaging you.</p>

        {blockSuccess && (
          <div className="mb-4 rounded-lg bg-primary/10 border border-primary/30 px-4 py-2.5 text-sm text-primary font-medium animate-fade-in">
            {blockSuccess}
          </div>
        )}

        {/* Currently blocked users */}
        {blockedUsers.length > 0 ? (
          <div className="mb-5 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Currently blocked</p>
            {blockedUsers.map(id => (
              <div key={id} className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center text-xs font-bold text-destructive">
                    {(USER_NAMES[id] || id).charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{USER_NAMES[id] || `User ${id}`}</p>
                    <p className="text-xs text-muted-foreground">Blocked · cannot message you</p>
                  </div>
                </div>
                <button onClick={() => handleUnblock(id)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  Unblock
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-5 rounded-xl border border-dashed border-border p-4 text-center">
            <UserX size={20} className="mx-auto text-muted-foreground mb-1.5" />
            <p className="text-sm text-muted-foreground">No blocked users</p>
          </div>
        )}

        {/* Block a user from the list */}
        <div>
          <button onClick={() => setShowBlockInput(!showBlockInput)}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors w-full justify-between">
            <span className="flex items-center gap-2"><UserX size={16} className="text-destructive" /> Block a user</span>
            {showBlockInput ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showBlockInput && (
            <div className="mt-3 rounded-xl border border-border bg-background/50 p-4 animate-fade-in">
              <p className="text-xs text-muted-foreground mb-3">Select a user to block:</p>
              <div className="space-y-2">
                {knownUsers.map(([id, name]) => {
                  const isBlocked = blockedUsers.includes(id)
                  return (
                    <div key={id} className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-3 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-foreground">{name}</span>
                      </div>
                      {isBlocked ? (
                        <button onClick={() => handleUnblock(id)}
                          className="rounded-lg px-3 py-1 text-xs font-medium text-muted-foreground border border-border hover:bg-accent transition-colors">
                          Unblock
                        </button>
                      ) : (
                        <button onClick={() => handleBlockFromList(id)}
                          className="rounded-lg px-3 py-1 text-xs font-medium text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors">
                          Block
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Blocked users won't be able to message you, and their messages will be hidden in chats.</p>
            </div>
          )}
        </div>
      </div>

      {/* Account */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-5">Account</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Name</span>
            <span className="text-sm font-medium text-foreground">{user?.name || 'User'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm font-medium text-foreground">{user?.email || 'user@email.com'}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Username</span>
            <span className="text-sm font-medium text-foreground">@{user?.username || 'user'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
