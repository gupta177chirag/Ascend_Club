import { createContext, useContext, useState } from 'react'
import { mockGoals, mockHabits, mockTrackers, mockCommunities, mockConversations, mockNotifications, mockOtherUsers } from '../data/mockData'

const DataContext = createContext(null)

export const useData = () => {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

export const DataProvider = ({ children }) => {
  const [goals, setGoals] = useState(mockGoals)
  const [habits, setHabits] = useState(mockHabits)
  const [trackers, setTrackers] = useState(mockTrackers)
  const [communities, setCommunities] = useState(mockCommunities)
  const [conversations, setConversations] = useState(mockConversations)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activityFeed, setActivityFeed] = useState([
    { action: 'Completed morning meditation', timestamp: '2h ago' },
    { action: 'Logged 3hrs of coding', timestamp: '4h ago' },
    { action: 'Reached 10km running milestone', timestamp: '1d ago' },
  ])

  const addActivity = (action) => setActivityFeed(prev => [{ action, timestamp: 'Just now' }, ...prev])

  // Goals
  const addGoal = (goal) => {
    setGoals(prev => [...prev, { ...goal, id: Date.now().toString(), progress: 0, createdAt: new Date().toISOString().split('T')[0] }])
    addActivity(`Created goal: ${goal.title}`)
  }
  const updateGoal = (id, updates) => setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
  const deleteGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id))
  const toggleMilestone = (goalId, milestoneId) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g
      const milestones = g.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m)
      const completed = milestones.filter(m => m.completed).length
      const progress = Math.round((completed / milestones.length) * 100)
      if (progress === 100) addActivity(`Completed goal: ${g.title}! 🎉`)
      return { ...g, milestones, progress }
    }))
  }

  // Habits
  const addHabit = (habit) => {
    setHabits(prev => [...prev, { ...habit, id: Date.now().toString(), streak: 0, completedDates: [] }])
  }
  const toggleHabit = (id) => {
    const today = new Date().toISOString().split('T')[0]
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h
      const isCompleted = h.completedDates.includes(today)
      const completedDates = isCompleted ? h.completedDates.filter(d => d !== today) : [...h.completedDates, today]
      let streak = 0
      const sorted = [...completedDates].sort().reverse()
      const now = new Date()
      for (let i = 0; i < sorted.length; i++) {
        const expected = new Date(now)
        expected.setDate(expected.getDate() - i)
        if (sorted[i] === expected.toISOString().split('T')[0]) streak++
        else break
      }
      if (!isCompleted) addActivity(`Completed habit: ${h.title}`)
      return { ...h, completedDates, streak }
    }))
  }
  const deleteHabit = (id) => setHabits(prev => prev.filter(h => h.id !== id))

  // Trackers
  const addTracker = (tracker) => {
    setTrackers(prev => [...prev, { ...tracker, id: Date.now().toString(), logs: [], total: 0 }])
  }
  const logTracker = (trackerId, log) => {
    setTrackers(prev => prev.map(t => {
      if (t.id !== trackerId) return t
      const newLog = { ...log, id: Date.now().toString() }
      const logs = [newLog, ...t.logs]
      const total = Math.round(logs.reduce((s, l) => s + l.value, 0) * 10) / 10
      addActivity(`Logged ${log.value} ${t.unit} of ${t.title}`)
      return { ...t, logs, total }
    }))
  }
  const deleteTracker = (id) => setTrackers(prev => prev.filter(t => t.id !== id))
  const deleteTrackerLog = (trackerId, logId) => {
    setTrackers(prev => prev.map(t => {
      if (t.id !== trackerId) return t
      const logs = t.logs.filter(l => l.id !== logId)
      const total = Math.round(logs.reduce((s, l) => s + l.value, 0) * 10) / 10
      return { ...t, logs, total }
    }))
  }

  // Communities
  const joinCommunity = (id) => {
    setCommunities(prev => prev.map(c => c.id === id ? { ...c, joined: true, members: c.members + 1 } : c))
    const community = communities.find(c => c.id === id)
    if (community) addActivity(`Joined community: ${community.name}`)
  }
  const leaveCommunity = (id) => setCommunities(prev => prev.map(c => c.id === id ? { ...c, joined: false, members: c.members - 1 } : c))

  // Messages
  const sendMessage = (conversationId, content) => {
    setConversations(prev => prev.map(c => {
      if (c.id !== conversationId) return c
      const newMsg = { id: Date.now().toString(), senderId: '1', content, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      return { ...c, messages: [...c.messages, newMsg], lastMessage: content }
    }))
  }
  const markAsRead = (conversationId) => setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unread: 0 } : c))

  const getOtherUser = (userId) => mockOtherUsers[userId] ?? null

  // Notifications
  const markNotificationRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  return (
    <DataContext.Provider value={{
      goals, addGoal, updateGoal, deleteGoal, toggleMilestone,
      habits, addHabit, toggleHabit, deleteHabit,
      trackers, addTracker, logTracker, deleteTracker, deleteTrackerLog,
      communities, joinCommunity, leaveCommunity,
      conversations, sendMessage, markAsRead, getOtherUser,
      notifications, markNotificationRead,
      activityFeed,
    }}>
      {children}
    </DataContext.Provider>
  )
}
