import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { Send, MessageCircle, MoreVertical, UserX } from 'lucide-react'

const Messages = () => {
  const { userId } = useParams()
  const { conversations, sendMessage, markAsRead, getOtherUser } = useData()
  const { user, blockUser } = useAuth()
  const convoByPartner = userId ? conversations.find(c => c.partnerId === userId) : null
  const [activeConvo, setActiveConvo] = useState(() => convoByPartner?.id ?? conversations[0]?.id ?? '')

  useEffect(() => {
    if (userId && convoByPartner) setActiveConvo(convoByPartner.id)
  }, [userId, convoByPartner?.id])

  const [input, setInput] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const messagesEnd = useRef(null)
  const currentConvo = conversations.find(c => c.id === activeConvo)
  const partnerId = currentConvo?.partnerId
  const otherUser = partnerId ? getOtherUser(partnerId) : null

  const senderPrivate = user?.messagePrivacy === 'private'
  const receiverBlockedMe = otherUser?.blockedUsers.includes(user?.id ?? '') ?? false
  const receiverPrivate = otherUser?.messagePrivacy === 'private'
  const messagingDisabled = senderPrivate || receiverBlockedMe || receiverPrivate
  const disabledReason = senderPrivate ? 'Messaging disabled due to privacy settings.' : receiverPrivate ? 'Messaging disabled due to privacy settings.' : receiverBlockedMe ? 'You cannot message this user.' : ''

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [currentConvo?.messages.length])

  const handleSend = () => {
    if (!input.trim() || !activeConvo || messagingDisabled) return
    sendMessage(activeConvo, input); setInput('')
  }

  const handleSelectConvo = (id) => {
    setActiveConvo(id); setMenuOpen(false); markAsRead(id)
  }

  const handleBlockUser = () => {
    if (partnerId) {
      blockUser(partnerId); setMenuOpen(false)
      setActiveConvo(conversations.find(c => c.id !== activeConvo)?.id ?? '')
    }
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] rounded-xl border border-border bg-card overflow-hidden animate-fade-in">
      <div className="w-72 border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2"><MessageCircle size={18} /> Messages</h2>
        </div>
        <div className="flex-1 overflow-auto">
          {conversations.map(c => (
            <button key={c.id} onClick={() => handleSelectConvo(c.id)}
              className={`flex w-full items-center gap-3 p-4 text-left hover:bg-accent transition-colors ${activeConvo === c.id ? 'bg-accent' : ''}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary shrink-0">{c.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-foreground">{c.name}</span>
                  {c.unread > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{c.unread}</span>}
                </div>
                <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        {currentConvo ? (
          <>
            <div className="border-b border-border p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">{currentConvo.name.charAt(0)}</div>
                <h3 className="font-semibold text-foreground truncate">{currentConvo.name}</h3>
              </div>
              <div className="relative shrink-0">
                <button onClick={() => setMenuOpen(v => !v)} className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" aria-label="Chat options">
                  <MoreVertical size={18} />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden />
                    <div className="absolute right-0 top-full mt-1 z-20 rounded-lg border border-border bg-card shadow-lg py-1 min-w-[160px]">
                      <button onClick={handleBlockUser} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <UserX size={14} /> Block User
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {currentConvo.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderId === '1' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs rounded-xl px-4 py-2.5 text-sm ${msg.senderId === '1' ? 'bg-primary text-primary-foreground' : 'bg-accent text-foreground'}`}>
                    <p>{msg.content}</p>
                    <div className={`text-xs mt-1 ${msg.senderId === '1' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.timestamp}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEnd} />
            </div>
            <div className="border-t border-border p-3 space-y-2">
              {messagingDisabled && <p className="text-xs text-muted-foreground px-1">{disabledReason}</p>}
              <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={messagingDisabled ? disabledReason : 'Type a message...'}
                  disabled={messagingDisabled}
                  className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow disabled:opacity-60 disabled:cursor-not-allowed" />
                <button onClick={handleSend} disabled={messagingDisabled} className="rounded-lg bg-primary p-2.5 text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"><Send size={16} /></button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">Select a conversation</div>
        )}
      </div>
    </div>
  )
}

export default Messages
