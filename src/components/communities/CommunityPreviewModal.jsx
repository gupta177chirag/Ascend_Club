import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Users, User } from 'lucide-react'

export function CommunityPreviewModal({ community, onClose, onJoin, onLeave }) {
  const navigate = useNavigate()

  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [handleEscape])

  const handleOpenCommunity = () => {
    onClose()
    navigate(`/communities/${community.id}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div role="dialog" aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-2xl border-2 border-primary/30 bg-card shadow-xl"
        onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-foreground pr-8">{community.name}</h2>
            <button onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary mb-3">{community.category}</span>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{community.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5"><Users size={14} /> {community.members.toLocaleString()} members</span>
            {community.creatorName && <span className="flex items-center gap-1.5"><User size={14} /> {community.creatorName}</span>}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => community.joined ? onLeave(community.id) : onJoin(community.id)}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${community.joined ? 'border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30' : 'bg-primary text-primary-foreground hover:opacity-90'}`}>
              {community.joined ? 'Leave Community' : 'Join Community'}
            </button>
            <button onClick={handleOpenCommunity}
              className="flex-1 rounded-xl border-2 border-primary/40 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/15 transition-colors">
              Open Community
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
