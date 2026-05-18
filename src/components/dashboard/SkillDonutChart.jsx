import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    return (
      <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-sm p-3 shadow-card text-sm">
        <p className="font-semibold" style={{ color: d.color }}>{d.name}</p>
        <p className="text-muted-foreground mt-1">{d.value}% · <span className="text-foreground font-medium">{d.hours}h</span></p>
      </div>
    )
  }
  return null
}

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-3">
    {payload?.map((entry, i) => (
      <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: entry.color }} />
        {entry.value}
      </div>
    ))}
  </div>
)

export const SkillDonutChart = ({ data, totalHours }) => (
  <div className="relative">
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={3} dataKey="value" animationDuration={900} animationBegin={100}>
          {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
    <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
      <p className="text-2xl font-bold text-foreground font-display">{totalHours.toFixed(1)}h</p>
      <p className="text-xs text-muted-foreground">this week</p>
    </div>
  </div>
)
