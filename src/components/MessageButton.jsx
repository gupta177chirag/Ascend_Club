import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { MessageCircle } from 'lucide-react'

export function MessageButton({ userId, className = '', children, variant = 'button' }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getOtherUser } = useData()
  const otherUser = getOtherUser(userId)

  const isSelf = userId === user?.id
  const isPrivate = otherUser?.messagePrivacy === 'private'
  const hasBlockedMe = otherUser?.blockedUsers.includes(user?.id ?? '') ?? false
  const canMessage = user && !isSelf && !isPrivate && !hasBlockedMe

  if (!canMessage) return null

  const handleClick = () => navigate(`/messages/${userId}`)

  if (variant === 'icon') {
    return (
      <button type="button" onClick={handleClick}
        className={className || 'rounded-lg border border-border p-2.5 text-muted-foreground hover:bg-accent hover:text-primary transition-colors'}
        title="Message">
        {children ?? <MessageCircle size={16} />}
      </button>
    )
  }

  return (
    <button type="button" onClick={handleClick}
      className={className || 'flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/30 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors'}>
      {children ?? <><MessageCircle size={14} /> Message</>}
    </button>
  )
}
