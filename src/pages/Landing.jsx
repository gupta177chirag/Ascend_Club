import { useNavigate, Navigate } from 'react-router-dom'
import { ArrowRight, Target, Repeat, Users, TrendingUp, Zap, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const features = [
  { icon: Target, title: 'Goal Tracking', desc: 'Set, track, and crush your goals with milestone-based progress.' },
  { icon: Repeat, title: 'Habit Building', desc: 'Build consistency with streak tracking and visual calendars.' },
  { icon: TrendingUp, title: 'Skill Analytics', desc: 'Log hours, visualize progress, and level up your skills.' },
  { icon: Users, title: 'Communities', desc: 'Join growth-minded groups and share your journey.' },
  { icon: Zap, title: 'Weekly Reflections', desc: 'Reflect on your progress and set intentions weekly.' },
  { icon: Shield, title: 'Privacy First', desc: 'Your data stays yours. No ads, no tracking, ever.' },
]

const communityPreviews = [
  { name: 'Morning Runners', members: '2.3K', category: 'Fitness' },
  { name: 'Code & Coffee', members: '5.1K', category: 'Tech' },
  { name: 'Mindful Living', members: '1.9K', category: 'Wellness' },
]

const Landing = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/favicon.png" alt="Ascend Club" className="h-8 w-8 rounded-full" />
          <span className="text-2xl font-bold text-primary tracking-tight">Ascend Club</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/login')} className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">Log in</button>
          <button onClick={() => navigate('/signup')} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">Sign up</button>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-20 text-center md:py-32">
        <div className="animate-fade-in">
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">Your growth, amplified</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-7xl leading-[1.1]">
            Level up your life,<br /><span className="text-primary">together.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Track goals, build habits, master skills, and grow alongside a community that pushes you forward. Ascend Club is where personal growth meets social accountability.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigate('/signup')} className="group flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
              Join Ascend Club <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button onClick={() => navigate('/explore')} className="rounded-xl border border-border px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
              Explore Communities
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-foreground mb-3">Everything you need to grow</h2>
        <p className="text-center text-muted-foreground mb-12">Powerful tools wrapped in a beautiful, intuitive interface.</p>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition-colors group">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <f.icon size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-foreground mb-12">Join thriving communities</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {communityPreviews.map((c) => (
            <div key={c.name} className="rounded-2xl border border-border bg-card p-6 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => navigate('/signup')}>
              <div className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{c.category}</div>
              <h3 className="text-lg font-semibold text-foreground">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.members} members</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="rounded-3xl bg-primary/5 border border-primary/20 p-12">
          <h2 className="text-3xl font-bold text-foreground">Ready to ascend?</h2>
          <p className="mt-4 text-muted-foreground">Join thousands of people committed to becoming their best selves.</p>
          <button onClick={() => navigate('/signup')} className="mt-8 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            Get Started Free
          </button>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-4 md:flex-row">
          <span className="text-sm text-muted-foreground">© 2026 Ascend Club. All rights reserved.</span>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span className="cursor-pointer hover:text-foreground transition-colors">Privacy</span>
            <span className="cursor-pointer hover:text-foreground transition-colors">Terms</span>
            <span className="cursor-pointer hover:text-foreground transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
