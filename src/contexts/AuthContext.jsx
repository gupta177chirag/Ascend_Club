import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

const MOCK_USER = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@ascend.club',
  username: 'alexj',
  avatar: '',
  bio: 'Growth enthusiast | Building better habits daily',
  messagePrivacy: 'public',
  blockedUsers: [],
}

function normalizeUser(u) {
  return {
    ...u,
    avatar: u.avatar ?? '',
    bio: u.bio ?? '',
    messagePrivacy: u.messagePrivacy ?? 'public',
    blockedUsers: Array.isArray(u.blockedUsers) ? u.blockedUsers : [],
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ascend-user')
    if (!saved) return null
    try {
      const parsed = JSON.parse(saved)
      return parsed ? normalizeUser(parsed) : null
    } catch {
      return null
    }
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) localStorage.setItem('ascend-user', JSON.stringify(user))
    else localStorage.removeItem('ascend-user')
  }, [user])

  const login = async (email, _password) => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setIsLoading(false)
    if (email) { setUser(normalizeUser({ ...MOCK_USER, email })); return true }
    return false
  }

  const signup = async (name, email, _password) => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setUser({
      ...MOCK_USER,
      name,
      email,
      username: name.toLowerCase().replace(/\s/g, ''),
      messagePrivacy: 'public',
      blockedUsers: [],
    })
    setIsLoading(false)
    return true
  }

  const logout = () => setUser(null)

  const updateMessagePrivacy = (messagePrivacy) => {
    setUser(prev => prev ? { ...prev, messagePrivacy } : null)
  }

  const blockUser = (userId) => {
    setUser(prev => {
      if (!prev || prev.blockedUsers.includes(userId)) return prev
      return { ...prev, blockedUsers: [...prev.blockedUsers, userId] }
    })
  }

  const unblockUser = (userId) => {
    setUser(prev => prev ? { ...prev, blockedUsers: prev.blockedUsers.filter(id => id !== userId) } : null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      isLoading,
      updateMessagePrivacy,
      blockUser,
      unblockUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
