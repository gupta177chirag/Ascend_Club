import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-sm p-3 shadow-card text-sm">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.map((p, i) => <p key={i} style={{ color: p.color }} className="text-xs">{p.name}: <span className="font-bold">{p.value}</span></p>)}
      </div>
    )
  }
  return null
}

export const GoalVelocityChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={200}>
    <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
      <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} allowDecimals={false} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }} />
      <Bar dataKey="thisMonth" name="This Month" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} animationDuration={900} />
      <Bar dataKey="lastMonth" name="Last Month" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} fillOpacity={0.6} animationDuration={900} />
    </BarChart>
  </ResponsiveContainer>
)
