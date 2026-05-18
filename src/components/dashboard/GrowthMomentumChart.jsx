import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    return (
      <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-sm p-3 shadow-card text-sm">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-accent-text">Growth Score: <span className="font-bold">{d.growthScore}</span></p>
          <p className="text-muted-foreground">Hours logged: <span className="text-foreground font-medium">{d.hoursLogged}h</span></p>
          <p className="text-muted-foreground">Habits done: <span className="text-foreground font-medium">{d.habitsCompleted}</span></p>
          <p className="text-muted-foreground">Goals moved: <span className="text-foreground font-medium">{d.goalsProgressed}</span></p>
        </div>
      </div>
    )
  }
  return null
}

export const GrowthMomentumChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={200}>
    <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
      <defs>
        <linearGradient id="momentumGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
      <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} domain={[0, 100]} />
      <Tooltip content={<CustomTooltip />} />
      <Area type="monotone" dataKey="growthScore" stroke="hsl(var(--primary))" strokeWidth={2.5}
        fill="url(#momentumGrad)" dot={{ fill: 'hsl(var(--primary))', r: 4, strokeWidth: 0 }}
        activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
        animationDuration={1000} />
    </AreaChart>
  </ResponsiveContainer>
)
