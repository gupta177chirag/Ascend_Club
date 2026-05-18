import { useMemo, useState } from 'react'
import { format, parseISO, getDay } from 'date-fns'

function getIntensityColor(score) {
  if (score === 0) return 'hsl(var(--surface-elevated))'
  if (score < 20) return 'hsl(200,70%,25%)'
  if (score < 40) return 'hsl(200,75%,35%)'
  if (score < 60) return 'hsl(200,80%,45%)'
  if (score < 80) return 'hsl(200,85%,55%)'
  return 'hsl(var(--primary))'
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const ActivityHeatmap = ({ data }) => {
  const [tooltip, setTooltip] = useState(null)

  const weeks = useMemo(() => {
    const result = []
    let currentWeek = []
    if (data.length > 0) {
      const firstDow = getDay(parseISO(data[0].date))
      const leadingEmpties = firstDow === 0 ? 6 : firstDow - 1
      for (let i = 0; i < leadingEmpties; i++) currentWeek.push(null)
    }
    data.forEach((day) => {
      currentWeek.push(day)
      if (currentWeek.length === 7) { result.push(currentWeek); currentWeek = [] }
    })
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null)
      result.push(currentWeek)
    }
    return result
  }, [data])

  const monthLabels = useMemo(() => {
    const labels = []
    let lastMonth = ''
    weeks.forEach((week, wIdx) => {
      const firstDay = week.find(d => d !== null)
      if (firstDay) {
        const month = format(parseISO(firstDay.date), 'MMM')
        if (month !== lastMonth) { labels.push({ text: month, colIndex: wIdx }); lastMonth = month }
      }
    })
    return labels
  }, [weeks])

  return (
    <div className="relative overflow-x-auto">
      <div className="flex mb-1 ml-8">
        {weeks.map((_, wIdx) => {
          const label = monthLabels.find(l => l.colIndex === wIdx)
          return <div key={wIdx} className="text-[10px] text-muted-foreground" style={{ width: 16, minWidth: 16, marginRight: 2 }}>{label ? label.text : ''}</div>
        })}
      </div>
      <div className="flex">
        <div className="flex flex-col mr-1.5 mt-0.5" style={{ gap: 2 }}>
          {DAYS.map((day, i) => (
            <div key={day} className="text-[10px] text-muted-foreground flex items-center" style={{ height: 14, lineHeight: '14px' }}>
              {i % 2 === 0 ? day.slice(0, 1) : ''}
            </div>
          ))}
        </div>
        <div className="flex" style={{ gap: 2 }}>
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col" style={{ gap: 2 }}>
              {week.map((day, dIdx) => (
                <div key={dIdx} className="rounded-sm cursor-pointer transition-transform hover:scale-125"
                  style={{ width: 14, height: 14, background: day ? getIntensityColor(day.score) : 'transparent' }}
                  onMouseEnter={(e) => {
                    if (day) { const rect = e.target.getBoundingClientRect(); setTooltip({ day, x: rect.left, y: rect.top }) }
                  }}
                  onMouseLeave={() => setTooltip(null)} />
              ))}
            </div>
          ))}
        </div>
      </div>
      {tooltip && (
        <div className="fixed z-50 pointer-events-none rounded-lg border border-border/50 bg-card/95 backdrop-blur-sm p-2.5 shadow-card text-xs"
          style={{ top: tooltip.y - 90, left: tooltip.x - 60 }}>
          <p className="font-semibold text-foreground mb-1">{format(parseISO(tooltip.day.date), 'MMM d, yyyy')}</p>
          <p className="text-muted-foreground">Score: <span className="text-foreground font-medium">{tooltip.day.score}</span></p>
          <p className="text-muted-foreground">{Math.round((tooltip.day.minutesLogged / 60) * 10) / 10}h logged</p>
          <p className="text-muted-foreground">{tooltip.day.habitsCompleted} habits done</p>
        </div>
      )}
      <div className="flex items-center gap-1.5 mt-2 ml-8">
        <span className="text-[10px] text-muted-foreground">Less</span>
        {[0, 20, 40, 60, 80].map(score => (
          <div key={score} className="rounded-sm" style={{ width: 14, height: 14, background: getIntensityColor(score === 0 ? 0 : score + 1) }} />
        ))}
        <span className="text-[10px] text-muted-foreground">More</span>
      </div>
    </div>
  )
}
