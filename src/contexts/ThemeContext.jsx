import { createContext, useContext, useEffect, useState } from 'react'

export const ACCENT_PRESETS = [
  { name: 'Teal', value: '172 80% 45%' },
  { name: 'Blue', value: '217 91% 60%' },
  { name: 'Violet', value: '263 70% 58%' },
  { name: 'Rose', value: '330 80% 60%' },
  { name: 'Amber', value: '25 95% 53%' },
  { name: 'Emerald', value: '142 71% 45%' },
]

const ThemeContext = createContext(null)

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('ascend-theme')
    return saved ? saved === 'dark' : true
  })
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('ascend-accent') || '172 80% 45%'
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('ascend-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--primary', accentColor)
    root.style.setProperty('--ring', accentColor)
    root.style.setProperty('--sidebar-primary', accentColor)
    root.style.setProperty('--sidebar-ring', accentColor)
    root.style.setProperty('--chart-1', accentColor)
    root.style.setProperty('--accent-glow', accentColor)
    root.style.setProperty('--accent-text', accentColor)
    root.style.setProperty('--accent-border', accentColor)
    localStorage.setItem('ascend-accent', accentColor)
  }, [accentColor])

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(p => !p), accentColor, setAccentColor, accentPresets: ACCENT_PRESETS }}>
      {children}
    </ThemeContext.Provider>
  )
}
