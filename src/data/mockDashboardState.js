import { format, subDays } from 'date-fns'

function daysAgo(n) {
  return format(subDays(new Date(), n), 'yyyy-MM-dd')
}

export const mockDashboardState = {
  trackers: [
    {
      id: 't1', title: 'Deep Work Sessions', description: 'Track focused, distraction-free work hours',
      category: 'productivity', unit: 'minutes', target: 120, createdAt: daysAgo(60),
      logs: [
        { id: 'l1', date: daysAgo(0), minutes: 95, category: 'productivity' },
        { id: 'l2', date: daysAgo(1), minutes: 120, category: 'productivity' },
        { id: 'l3', date: daysAgo(2), minutes: 60, category: 'productivity' },
        { id: 'l4', date: daysAgo(3), minutes: 110, category: 'productivity' },
        { id: 'l5', date: daysAgo(5), minutes: 90, category: 'productivity' },
        { id: 'l6', date: daysAgo(6), minutes: 75, category: 'productivity' },
        { id: 'l7', date: daysAgo(8), minutes: 130, category: 'productivity' },
        { id: 'l8', date: daysAgo(9), minutes: 80, category: 'productivity' },
        { id: 'l9', date: daysAgo(14), minutes: 100, category: 'productivity' },
        { id: 'l10', date: daysAgo(15), minutes: 120, category: 'productivity' },
      ],
    },
    {
      id: 't2', title: 'Morning Workout', description: 'Daily strength and cardio training',
      category: 'fitness', unit: 'minutes', target: 60, createdAt: daysAgo(45),
      logs: [
        { id: 'l11', date: daysAgo(0), minutes: 55, category: 'fitness' },
        { id: 'l12', date: daysAgo(1), minutes: 60, category: 'fitness' },
        { id: 'l13', date: daysAgo(3), minutes: 45, category: 'fitness' },
        { id: 'l14', date: daysAgo(4), minutes: 70, category: 'fitness' },
        { id: 'l15', date: daysAgo(6), minutes: 50, category: 'fitness' },
        { id: 'l16', date: daysAgo(8), minutes: 65, category: 'fitness' },
        { id: 'l17', date: daysAgo(10), minutes: 60, category: 'fitness' },
        { id: 'l18', date: daysAgo(13), minutes: 55, category: 'fitness' },
      ],
    },
    {
      id: 't3', title: 'Book Reading', description: 'Non-fiction reading for growth',
      category: 'learning', unit: 'minutes', target: 30, createdAt: daysAgo(30),
      logs: [
        { id: 'l19', date: daysAgo(0), minutes: 35, category: 'learning' },
        { id: 'l20', date: daysAgo(1), minutes: 30, category: 'learning' },
        { id: 'l21', date: daysAgo(2), minutes: 40, category: 'learning' },
        { id: 'l22', date: daysAgo(4), minutes: 25, category: 'learning' },
        { id: 'l23', date: daysAgo(5), minutes: 35, category: 'learning' },
        { id: 'l24', date: daysAgo(7), minutes: 30, category: 'learning' },
        { id: 'l25', date: daysAgo(9), minutes: 45, category: 'learning' },
      ],
    },
    {
      id: 't4', title: 'Meditation Practice', description: 'Mindfulness and mental clarity sessions',
      category: 'mindset', unit: 'minutes', target: 20, createdAt: daysAgo(20),
      logs: [
        { id: 'l26', date: daysAgo(2), minutes: 15, category: 'mindset' },
        { id: 'l27', date: daysAgo(5), minutes: 20, category: 'mindset' },
        { id: 'l28', date: daysAgo(8), minutes: 10, category: 'mindset' },
      ],
    },
  ],
  habits: [
    {
      id: 'h1', title: 'Cold Shower', description: 'Start day with a cold shower', category: 'fitness', createdAt: daysAgo(30),
      completedDates: [daysAgo(0), daysAgo(1), daysAgo(2), daysAgo(3), daysAgo(4), daysAgo(5), daysAgo(7), daysAgo(8), daysAgo(9), daysAgo(10), daysAgo(11), daysAgo(14), daysAgo(15), daysAgo(16)],
    },
    {
      id: 'h2', title: 'Gratitude Journaling', description: 'Write 3 things grateful for', category: 'mindset', createdAt: daysAgo(25),
      completedDates: [daysAgo(0), daysAgo(1), daysAgo(3), daysAgo(4), daysAgo(5), daysAgo(7), daysAgo(8), daysAgo(10), daysAgo(12)],
    },
    {
      id: 'h3', title: 'No Social Media AM', description: 'Avoid social media first 2 hours', category: 'productivity', createdAt: daysAgo(20),
      completedDates: [daysAgo(0), daysAgo(1), daysAgo(2), daysAgo(4), daysAgo(5), daysAgo(6), daysAgo(9), daysAgo(11)],
    },
    {
      id: 'h4', title: 'Protein-First Meals', description: 'Eat protein before carbs', category: 'nutrition', createdAt: daysAgo(15),
      completedDates: [daysAgo(0), daysAgo(1), daysAgo(3), daysAgo(5), daysAgo(7)],
    },
  ],
  goals: [
    {
      id: 'g1', title: 'Launch Side Project', description: 'Build and launch a SaaS product', category: 'productivity',
      deadline: format(subDays(new Date(), -30), 'yyyy-MM-dd'), createdAt: daysAgo(45),
      milestones: [
        { id: 'm1', label: 'Define MVP scope', completed: true },
        { id: 'm2', label: 'Build landing page', completed: true },
        { id: 'm3', label: 'Complete core features', completed: true },
        { id: 'm4', label: 'Beta testing', completed: false },
        { id: 'm5', label: 'Launch & first sale', completed: false },
      ],
    },
    {
      id: 'g2', title: 'Run a Half Marathon', description: 'Complete a 21km race in under 2 hours', category: 'fitness',
      deadline: format(subDays(new Date(), -60), 'yyyy-MM-dd'), createdAt: daysAgo(60),
      milestones: [
        { id: 'm6', label: 'Run 5km consistently', completed: true },
        { id: 'm7', label: 'Run 10km without stopping', completed: true },
        { id: 'm8', label: 'Complete a 15km long run', completed: false },
        { id: 'm9', label: 'Race day preparation', completed: false },
        { id: 'm10', label: 'Complete the race', completed: false },
      ],
    },
    {
      id: 'g3', title: 'Read 24 Books This Year', description: '2 books per month across diverse topics', category: 'learning',
      deadline: format(new Date(new Date().getFullYear(), 11, 31), 'yyyy-MM-dd'), createdAt: daysAgo(90),
      milestones: [
        { id: 'm11', label: 'Complete 6 books', completed: true },
        { id: 'm12', label: 'Complete 12 books', completed: true },
        { id: 'm13', label: 'Complete 18 books', completed: false },
        { id: 'm14', label: 'Complete 24 books', completed: false },
      ],
    },
  ],
  reflections: [
    { id: 'r1', weekStart: daysAgo(7), mood: 4, highlights: 'Great deep work sessions, hit all workout targets', challenges: 'Struggled with meditation consistency' },
    { id: 'r2', weekStart: daysAgo(14), mood: 3, highlights: 'Good reading progress', challenges: 'Work stress affected morning routine' },
  ],
}
