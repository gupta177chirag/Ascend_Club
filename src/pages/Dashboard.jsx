import { useState } from 'react'
import { mockDashboardState } from '../data/mockDashboardState'
import { useDashboardSelectors } from '../hooks/useDashboardSelectors'
import { AnimatedCounter } from '../components/dashboard/AnimatedCounter'
import { CircularProgress } from '../components/dashboard/CircularProgress'
import { GrowthMomentumChart } from '../components/dashboard/GrowthMomentumChart'
import { SkillDonutChart } from '../components/dashboard/SkillDonutChart'
import { GoalVelocityChart } from '../components/dashboard/GoalVelocityChart'
import { ActivityHeatmap } from '../components/dashboard/ActivityHeatmap'
import { useData } from '../contexts/DataContext'
import { BarChart2, TrendingUp, AlertTriangle, Target, Clock, Activity, Zap } from 'lucide-react'

const CATEGORY_EMOJIS = {
  mindset: '🧠', fitness: '💪', learning: '📚', productivity: '⚡',
  nutrition: '🥗', social: '👥', creativity: '🎨', finance: '💰',
}
const CATEGORY_LABELS = {
  mindset: 'Mindset', fitness: 'Fitness', learning: 'Learning', productivity: 'Productivity',
  nutrition: 'Nutrition', social: 'Social', creativity: 'Creativity', finance: 'Finance',
}
const OVERVIEW_DESCRIPTIONS = {
  weeklyGrowth: { title: 'Weekly Growth Score', description: 'Your overall growth score out of 100 for this week. It combines time logged, habit consistency, and goal progress.' },
  balanceScore: { title: 'Balance Score', description: 'Measures how balanced your effort is across categories. A balanced score means you\'re not over-focusing on one area.' },
  hoursThisWeek: { title: 'Hours This Week', description: 'Total hours of focused effort logged across all your trackers this week.' },
  weakestArea: { title: 'Needs Attention', description: 'The category where your effort dropped the most compared to last week. Use this to spot imbalances.' },
  growthMomentum: { title: 'Growth Momentum', description: 'Weekly growth score trend over the last 8 weeks.' },
  skillDistribution: { title: 'Skill Distribution', description: 'How your effort is split by category this week.' },
  goalVelocity: { title: 'Goal Velocity', description: 'Compares goal progress this month vs last month.' },
  activityHeatmap: { title: 'Activity Heatmap', description: '12 weeks of daily effort scores. Each cell is a day; darker means more activity.' },
}

const Dashboard = () => {
  const [state] = useState(mockDashboardState)
  const [detailModal, setDetailModal] = useState(null)
  const { activityFeed } = useData()
  const {
    weeklyGrowthScore, growthBalanceScore, weakestArea,
    skillDistribution, growthMomentum, goalVelocity,
    activityHeatmap, weeklyMinutes,
  } = useDashboardSelectors(state)

  const totalWeeklyHours = parseFloat(((weeklyMinutes ?? 0) / 60).toFixed(1))
  const safeGrowthScore = weeklyGrowthScore?.score ?? 0
  const safeBreakdown = weeklyGrowthScore?.breakdown ?? { timeLogged: 0, habitConsistency: 0, goalProgress: 0 }
  const safeBalanceScore = growthBalanceScore?.score ?? 0
  const safeSkillDist = Array.isArray(skillDistribution) ? skillDistribution : []
  const safeMomentum = Array.isArray(growthMomentum) ? growthMomentum : []
  const safeVelocity = Array.isArray(goalVelocity) ? goalVelocity : []
  const safeHeatmap = Array.isArray(activityHeatmap) ? activityHeatmap : []

  return (
    <>
      <div className="w-full min-h-full bg-background text-foreground animate-fade-in">
        <div className="w-full max-w-[1600px] px-4 py-6 space-y-8">

          <header className="mb-2">
            <h1 className="text-2xl font-bold font-display text-foreground tracking-tight">Overview</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Your growth at a glance</p>
          </header>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Weekly Growth */}
            <div role="button" tabIndex={0}
              onClick={() => setDetailModal(OVERVIEW_DESCRIPTIONS.weeklyGrowth)}
              onKeyDown={e => e.key === 'Enter' && setDetailModal(OVERVIEW_DESCRIPTIONS.weeklyGrowth)}
              className="bg-card border border-border/50 rounded-2xl p-6 relative overflow-hidden hover:border-amber-500/40 hover:shadow-glow transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 to-transparent pointer-events-none rounded-2xl" />
              <div className="flex items-center gap-2 mb-3">
                <Zap size={14} className="text-amber-400" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Weekly Growth</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black font-display text-foreground">
                  <AnimatedCounter value={safeGrowthScore} />
                </span>
                <span className="text-lg text-muted-foreground">/100</span>
              </div>
              <div className="mt-3 space-y-1.5">
                {[
                  { label: 'Time logged', val: safeBreakdown.timeLogged, color: 'bg-amber-400' },
                  { label: 'Habit consistency', val: safeBreakdown.habitConsistency, color: 'bg-blue-400' },
                  { label: 'Goal progress', val: safeBreakdown.goalProgress, color: 'bg-green-400' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-muted-foreground flex-1">{item.label}</span>
                    <span className="text-foreground font-medium">+{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Balance Score */}
            <div role="button" tabIndex={0}
              onClick={() => setDetailModal(OVERVIEW_DESCRIPTIONS.balanceScore)}
              onKeyDown={e => e.key === 'Enter' && setDetailModal(OVERVIEW_DESCRIPTIONS.balanceScore)}
              className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-blue-500/40 hover:shadow-glow transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-2 mb-3 self-start">
                <BarChart2 size={14} className="text-blue-400" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Balance Score</span>
              </div>
              <CircularProgress value={safeBalanceScore} size={110} strokeWidth={9}
                label={`${safeBalanceScore}`} sublabel="balanced"
                color="hsl(200, 80%, 55%)" trackColor="hsl(var(--surface-elevated))" />
            </div>

            {/* Hours */}
            <div role="button" tabIndex={0}
              onClick={() => setDetailModal(OVERVIEW_DESCRIPTIONS.hoursThisWeek)}
              onKeyDown={e => e.key === 'Enter' && setDetailModal(OVERVIEW_DESCRIPTIONS.hoursThisWeek)}
              className="bg-card border border-border/50 rounded-2xl p-6 relative overflow-hidden hover:border-green-500/40 hover:shadow-glow transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/8 to-transparent pointer-events-none rounded-2xl" />
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-green-400" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Hours This Week</span>
              </div>
              <div className="text-5xl font-black font-display text-foreground">
                <AnimatedCounter value={totalWeeklyHours} decimals={1} />
              </div>
              <p className="text-sm text-muted-foreground mt-2">hours of focused effort</p>
              <div className="mt-3 h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (totalWeeklyHours / 20) * 100)}%`, background: 'hsl(142, 70%, 50%)' }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">Goal: 20h/week</p>
            </div>

            {/* Weakest Area */}
            <div role="button" tabIndex={0}
              onClick={() => setDetailModal(OVERVIEW_DESCRIPTIONS.weakestArea)}
              onKeyDown={e => e.key === 'Enter' && setDetailModal(OVERVIEW_DESCRIPTIONS.weakestArea)}
              className="bg-card border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden hover:border-amber-500/60 hover:shadow-glow transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 to-transparent pointer-events-none rounded-2xl" />
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-amber-400" />
                <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Needs Attention</span>
              </div>
              {weakestArea && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{CATEGORY_EMOJIS[weakestArea.category]}</span>
                    <span className="font-bold text-foreground font-display text-base">{CATEGORY_LABELS[weakestArea.category]}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{weakestArea.message}</p>
                  {weakestArea.dropPercent > 0 && (
                    <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-medium">
                      ↓ {weakestArea.dropPercent}% vs last week
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div role="button" tabIndex={0}
              onClick={() => setDetailModal(OVERVIEW_DESCRIPTIONS.growthMomentum)}
              className="lg:col-span-2 bg-card border border-border/50 rounded-2xl p-6 cursor-pointer hover:border-amber-500/40 hover:shadow-glow transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-amber-400" />
                    <h3 className="font-semibold text-foreground text-sm">Growth Momentum</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Weekly growth score trend over 8 weeks</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-3 h-0.5 bg-amber-400 rounded" />Growth Score
                </div>
              </div>
              <GrowthMomentumChart data={safeMomentum} />
            </div>

            <div role="button" tabIndex={0}
              onClick={() => setDetailModal(OVERVIEW_DESCRIPTIONS.skillDistribution)}
              className="bg-card border border-border/50 rounded-2xl p-6 cursor-pointer hover:border-blue-500/40 hover:shadow-glow transition-all duration-300">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <BarChart2 size={14} className="text-blue-400" />
                  <h3 className="font-semibold text-foreground text-sm">Skill Distribution</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Effort by category this week</p>
              </div>
              {safeSkillDist.length > 0
                ? <SkillDonutChart data={safeSkillDist} totalHours={totalWeeklyHours} />
                : <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">No activity logged yet</div>}
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div role="button" tabIndex={0}
              onClick={() => setDetailModal(OVERVIEW_DESCRIPTIONS.goalVelocity)}
              className="bg-card border border-border/50 rounded-2xl p-6 cursor-pointer hover:border-blue-500/40 hover:shadow-glow transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-blue-400" />
                    <h3 className="font-semibold text-foreground text-sm">Goal Velocity</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">This month vs last month</p>
                </div>
              </div>
              <GoalVelocityChart data={safeVelocity} />
            </div>

            <div role="button" tabIndex={0}
              onClick={() => setDetailModal(OVERVIEW_DESCRIPTIONS.activityHeatmap)}
              className="bg-card border border-border/50 rounded-2xl p-6 cursor-pointer hover:border-green-500/40 hover:shadow-glow transition-all duration-300">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-green-400" />
                    <h3 className="font-semibold text-foreground text-sm">Activity Heatmap</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">12 weeks of daily effort scores</p>
                </div>
              </div>
              <ActivityHeatmap data={safeHeatmap} />
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-card border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={14} className="text-muted-foreground" />
              <h3 className="font-semibold text-foreground text-sm">Recent Activity</h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activityFeed.slice(0, 8).map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-xl bg-accent/40 px-3 py-2.5 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="text-foreground leading-relaxed">{item.action}</p>
                    <p className="text-muted-foreground mt-0.5">{item.timestamp}</p>
                  </div>
                </div>
              ))}
              {activityFeed.length === 0 && (
                <p className="text-xs text-muted-foreground col-span-full">No activity yet. Log a tracker session, complete a habit, or update a goal milestone!</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setDetailModal(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl"
            onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-foreground mb-2">{detailModal.title}</h2>
            <p className="text-sm text-muted-foreground">{detailModal.description}</p>
            <button onClick={() => setDetailModal(null)}
              className="mt-4 rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-accent">Close</button>
          </div>
        </div>
      )}
    </>
  )
}

export default Dashboard
