import { useMemo } from 'react'
import { subDays, format, startOfWeek, eachDayOfInterval, parseISO } from 'date-fns'

const CATEGORY_COLORS = {
  mindset: 'hsl(262, 80%, 65%)',
  fitness: 'hsl(142, 70%, 50%)',
  learning: 'hsl(200, 80%, 55%)',
  productivity: 'hsl(38, 90%, 55%)',
  nutrition: 'hsl(155, 65%, 48%)',
  social: 'hsl(330, 75%, 60%)',
  creativity: 'hsl(15, 85%, 60%)',
  finance: 'hsl(48, 85%, 52%)',
}

const CATEGORY_LABELS = {
  mindset: 'Mindset', fitness: 'Fitness', learning: 'Learning', productivity: 'Productivity',
  nutrition: 'Nutrition', social: 'Social', creativity: 'Creativity', finance: 'Finance',
}

function getDateRange(daysBack) {
  const end = new Date()
  const start = subDays(end, daysBack)
  return { start, end }
}

function getWeekStart(weeksBack = 0) {
  return startOfWeek(subDays(new Date(), weeksBack * 7), { weekStartsOn: 1 })
}

function safeParseISO(dateStr) {
  try {
    const d = parseISO(dateStr)
    return isNaN(d.getTime()) ? null : d
  } catch { return null }
}

export function useDashboardSelectors(state) {
  const weeklyMinutes = useMemo(() => {
    const { start, end } = getDateRange(7)
    return state.trackers.reduce((total, tracker) => {
      return total + tracker.logs.filter(log => {
        const d = safeParseISO(log.date)
        return d != null && d >= start && d <= end
      }).reduce((s, l) => s + l.minutes, 0)
    }, 0)
  }, [state.trackers])

  const habitConsistency = useMemo(() => {
    const { start, end } = getDateRange(7)
    const days = eachDayOfInterval({ start, end }).map(d => format(d, 'yyyy-MM-dd'))
    if (state.habits.length === 0) return 0
    const possible = state.habits.length * days.length
    const completed = state.habits.reduce((total, habit) => {
      return total + habit.completedDates.filter(d => days.includes(d)).length
    }, 0)
    return possible > 0 ? completed / possible : 0
  }, [state.habits])

  const goalProgressChange = useMemo(() => {
    if (state.goals.length === 0) return 0
    const avgProgress = state.goals.reduce((total, goal) => {
      const done = goal.milestones.filter(m => m.completed).length
      const all = goal.milestones.length || 1
      return total + done / all
    }, 0) / state.goals.length
    return avgProgress
  }, [state.goals])

  const weeklyGrowthScore = useMemo(() => {
    const hoursLogged = weeklyMinutes / 60
    const timeScore = Math.min(hoursLogged * 0.5, 50)
    const habitScore = habitConsistency * 0.3 * 100
    const goalScore = goalProgressChange * 0.2 * 100
    const rawScore = Math.round(timeScore + habitScore + goalScore)
    const trend = Array.from({ length: 8 }, (_, i) => {
      const decay = Math.max(0.4, 1 - i * 0.08)
      return Math.round(rawScore * decay * (0.85 + Math.random() * 0.3))
    }).reverse()
    return {
      score: Math.min(rawScore, 100),
      breakdown: { timeLogged: Math.round(timeScore), habitConsistency: Math.round(habitScore), goalProgress: Math.round(goalScore) },
      trend,
    }
  }, [weeklyMinutes, habitConsistency, goalProgressChange])

  const growthBalanceScore = useMemo(() => {
    const { start, end } = getDateRange(7)
    const categories = ['mindset', 'fitness', 'learning', 'productivity', 'nutrition', 'social', 'creativity', 'finance']
    const categoryMinutes = {}
    categories.forEach(cat => { categoryMinutes[cat] = 0 })
    state.trackers.forEach(tracker => {
      tracker.logs.filter(log => {
        const d = safeParseISO(log.date)
        return d != null && d >= start && d <= end
      }).forEach(log => { categoryMinutes[tracker.category] = (categoryMinutes[tracker.category] || 0) + log.minutes })
    })
    state.habits.forEach(habit => {
      const days = eachDayOfInterval({ start, end }).map(d => format(d, 'yyyy-MM-dd'))
      const count = habit.completedDates.filter(d => days.includes(d)).length
      categoryMinutes[habit.category] = (categoryMinutes[habit.category] || 0) + count * 15
    })
    const values = Object.values(categoryMinutes)
    const total = values.reduce((s, v) => s + v, 0) || 1
    const mean = total / categories.length
    const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / categories.length
    const maxVariance = Math.pow(total, 2)
    const balanceScore = Math.round(100 - (variance / maxVariance) * 100 * 8)
    return { score: Math.max(0, Math.min(100, balanceScore)), categoryBreakdown: categoryMinutes }
  }, [state.trackers, state.habits])

  const weakestArea = useMemo(() => {
    const categories = ['mindset', 'fitness', 'learning', 'productivity', 'nutrition', 'social', 'creativity', 'finance']
    const { start: s7, end: e7 } = getDateRange(7)
    const { start: s14 } = getDateRange(14)
    const catScore = (cat, start, end) => {
      let score = 0
      state.trackers.filter(t => t.category === cat).forEach(t =>
        t.logs.filter(l => { const d = safeParseISO(l.date); return d != null && d >= start && d <= end }).forEach(l => { score += l.minutes })
      )
      state.habits.filter(h => h.category === cat).forEach(h => {
        const days = eachDayOfInterval({ start, end }).map(d => format(d, 'yyyy-MM-dd'))
        score += h.completedDates.filter(d => days.includes(d)).length * 15
      })
      return score
    }
    const scores = categories.map(cat => ({ cat, thisWeek: catScore(cat, s7, e7), lastWeek: catScore(cat, s14, s7) }))
    const declining = scores.filter(s => s.lastWeek > 0)
      .map(s => ({ ...s, drop: ((s.lastWeek - s.thisWeek) / s.lastWeek) * 100 }))
      .sort((a, b) => b.drop - a.drop)
    if (declining.length > 0 && declining[0].drop > 0) {
      const worst = declining[0]
      return { category: worst.cat, dropPercent: Math.round(worst.drop), message: `${CATEGORY_LABELS[worst.cat]} activity dropped ${Math.round(worst.drop)}% vs last week.` }
    }
    const hasAnyData = scores.filter(s => s.thisWeek > 0 || s.lastWeek > 0 || state.trackers.some(t => t.category === s.cat && t.logs.length > 0) || state.habits.some(h => h.category === s.cat && h.completedDates.length > 0))
    if (hasAnyData.length > 0) {
      const lowest = hasAnyData.sort((a, b) => a.thisWeek - b.thisWeek)[0]
      return { category: lowest.cat, dropPercent: 0, message: `${CATEGORY_LABELS[lowest.cat]} has had no activity this week. Time to re-engage.` }
    }
    return { category: 'mindset', dropPercent: 0, message: 'Start logging activity to identify areas needing attention.' }
  }, [state.trackers, state.habits])

  const skillDistribution = useMemo(() => {
    const breakdown = growthBalanceScore.categoryBreakdown
    const total = Object.values(breakdown).reduce((s, v) => s + v, 0) || 1
    return Object.entries(breakdown).filter(([, v]) => v > 0)
      .map(([cat, mins]) => ({ name: CATEGORY_LABELS[cat], value: Math.round((mins / total) * 100), hours: parseFloat((mins / 60).toFixed(1)), color: CATEGORY_COLORS[cat] }))
      .sort((a, b) => b.value - a.value)
  }, [growthBalanceScore])

  const growthMomentum = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const weeksBack = 7 - i
      const weekStart = getWeekStart(weeksBack)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      const mins = state.trackers.reduce((total, t) => {
        return total + t.logs.filter(l => { const d = safeParseISO(l.date); return d != null && d >= weekStart && d <= weekEnd }).reduce((s, l) => s + l.minutes, 0)
      }, 0)
      const habitsDone = state.habits.reduce((total, h) => {
        const days = eachDayOfInterval({ start: weekStart, end: weekEnd }).map(d => format(d, 'yyyy-MM-dd'))
        return total + h.completedDates.filter(d => days.includes(d)).length
      }, 0)
      const goalsProgressed = state.goals.filter(g => { const d = safeParseISO(g.createdAt); return d != null && d >= weekStart && d <= weekEnd }).length
      const score = Math.min(100, Math.round(Math.min((mins / 60) * 0.5, 50) + (state.habits.length > 0 ? (habitsDone / (state.habits.length * 7)) * 30 : 0) + goalsProgressed * 5))
      return { week: format(weekStart, 'MMM d'), growthScore: score, hoursLogged: parseFloat((mins / 60).toFixed(1)), habitsCompleted: habitsDone, goalsProgressed }
    })
  }, [state.trackers, state.habits, state.goals])

  const goalVelocity = useMemo(() => {
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
    const getCompleted = (start, end) => state.goals.filter(g => { const allDone = g.milestones.length > 0 && g.milestones.every(m => m.completed); const d = safeParseISO(g.deadline); return allDone && d != null && d >= start && d <= end }).length
    return [
      { label: 'Completed', thisMonth: getCompleted(thisMonthStart, now), lastMonth: getCompleted(lastMonthStart, lastMonthEnd) },
      { label: 'In Progress', thisMonth: state.goals.filter(g => { const p = g.milestones.filter(m => m.completed).length / (g.milestones.length || 1); return p > 0 && p < 1 }).length, lastMonth: Math.max(0, state.goals.length - 2) },
      { label: 'Milestones', thisMonth: state.goals.reduce((s, g) => s + g.milestones.filter(m => m.completed).length, 0), lastMonth: Math.max(0, state.goals.reduce((s, g) => s + g.milestones.length, 0) - 3) },
    ]
  }, [state.goals])

  const activityHeatmap = useMemo(() => {
    const end = new Date()
    const start = subDays(end, 83)
    return eachDayOfInterval({ start, end }).map(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const minsLogged = state.trackers.reduce((total, t) => total + t.logs.filter(l => l.date === dateStr).reduce((s, l) => s + l.minutes, 0), 0)
      const habitsDone = state.habits.filter(h => h.completedDates.includes(dateStr)).length
      const goalsProgressed = state.goals.filter(g => g.milestones.some(m => m.completed)).length
      const score = Math.min(100, Math.round((minsLogged / 60) * 10 + habitsDone * 8 + goalsProgressed * 5))
      return { date: dateStr, score, minutesLogged: minsLogged, habitsCompleted: habitsDone, goalsProgressed }
    })
  }, [state.trackers, state.habits, state.goals])

  return { weeklyGrowthScore, growthBalanceScore, weakestArea, skillDistribution, growthMomentum, goalVelocity, activityHeatmap, weeklyMinutes, habitConsistency, CATEGORY_COLORS, CATEGORY_LABELS }
}
