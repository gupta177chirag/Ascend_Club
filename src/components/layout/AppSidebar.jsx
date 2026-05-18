import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Target, Repeat, Activity, Users, Compass, MessageCircle, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Goals', path: '/goals', icon: Target },
  { label: 'Habits', path: '/habits', icon: Repeat },
  { label: 'Trackers', path: '/trackers', icon: Activity },
  { label: 'Communities', path: '/communities', icon: Users },
  { label: 'Explore', path: '/explore', icon: Compass },
  { label: 'Messages', path: '/messages', icon: MessageCircle },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} flex flex-col border-r border-border bg-card transition-all duration-300 shrink-0`}>
      <div className={`flex flex-col gap-1 ${collapsed ? 'items-center' : ''} px-3 pt-4 pb-2`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} min-h-10`}>
          {!collapsed && <span className="text-xl font-bold text-primary tracking-tight">Ascend Club</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        {!collapsed && user?.name && (
          <p className="text-sm text-muted-foreground">Hey, {user.name}.</p>
        )}
      </div>
      <nav className="flex-1 space-y-0.5 px-2 py-4">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path === '/communities' && location.pathname.startsWith('/communities/'))
          return (
            <NavLink key={item.path} to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
            >
              <item.icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>
      {!collapsed && (
        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground">Ascend Club v1.0</p>
        </div>
      )}
    </aside>
  )
}
