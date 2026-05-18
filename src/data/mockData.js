function generateDates(count) {
  const dates = []
  const today = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

export const mockGoals = [
  {
    id: '1', title: 'Run a Marathon', description: 'Complete a full 42km marathon by end of year',
    progress: 50, category: 'Fitness', createdAt: '2025-01-15',
    milestones: [
      { id: '1', title: 'Run 5km without stopping', completed: true },
      { id: '2', title: 'Complete a 10km race', completed: true },
      { id: '3', title: 'Run a half marathon', completed: false },
      { id: '4', title: 'Complete the marathon', completed: false },
    ],
  },
  {
    id: '2', title: 'Learn React JS', description: 'Master React JS for production applications',
    progress: 67, category: 'Skills', createdAt: '2025-02-01',
    milestones: [
      { id: '1', title: 'Basic components & hooks', completed: true },
      { id: '2', title: 'State management & context', completed: true },
      { id: '3', title: 'Build a full project', completed: false },
    ],
  },
  {
    id: '3', title: 'Read 24 Books', description: '2 books per month challenge',
    progress: 25, category: 'Learning', createdAt: '2025-01-01',
    milestones: [
      { id: '1', title: 'First 6 books', completed: true },
      { id: '2', title: '12 books (halfway)', completed: false },
      { id: '3', title: '18 books', completed: false },
      { id: '4', title: 'All 24 books', completed: false },
    ],
  },
]

export const mockHabits = [
  { id: '1', title: 'Morning Meditation', icon: '🧘', streak: 12, completedDates: generateDates(12), category: 'Mindfulness' },
  { id: '2', title: 'Exercise', icon: '💪', streak: 8, completedDates: generateDates(8), category: 'Fitness' },
  { id: '3', title: 'Read 30 mins', icon: '📚', streak: 15, completedDates: generateDates(15), category: 'Learning' },
  { id: '4', title: 'Journal', icon: '✍️', streak: 5, completedDates: generateDates(5), category: 'Mindfulness' },
  { id: '5', title: 'No Social Media', icon: '📵', streak: 3, completedDates: generateDates(3), category: 'Focus' },
]

export const mockTrackers = [
  {
    id: '1', title: 'Coding', metric: 'Hours', unit: 'hrs', icon: '💻', total: 120, category: 'technology',
    logs: [
      { id: '1', value: 3, date: '2026-02-18', note: 'React project' },
      { id: '2', value: 2, date: '2026-02-17', note: 'Study session' },
      { id: '3', value: 4, date: '2026-02-16' },
      { id: '4', value: 1.5, date: '2026-02-15' },
      { id: '5', value: 3, date: '2026-02-14' },
    ],
  },
  {
    id: '2', title: 'Running', metric: 'Distance', unit: 'km', icon: '🏃', total: 85, category: 'fitness',
    logs: [
      { id: '1', value: 5, date: '2026-02-18' },
      { id: '2', value: 8, date: '2026-02-16' },
      { id: '3', value: 3, date: '2026-02-14' },
    ],
  },
  {
    id: '3', title: 'Reading', metric: 'Pages', unit: 'pg', icon: '📖', total: 450, category: 'reading',
    logs: [
      { id: '1', value: 30, date: '2026-02-18' },
      { id: '2', value: 25, date: '2026-02-17' },
      { id: '3', value: 40, date: '2026-02-16' },
    ],
  },
]

export const mockCommunities = [
  {
    id: '1', name: 'Morning Runners', description: 'Early birds who love to run', members: 2340, category: 'Fitness', creatorName: 'Sarah K.',
    image: '', joined: true,
    feed: [
      { id: '1', user: 'Sarah K.', avatar: '', content: 'Just completed my first 10K! 🎉', timestamp: '2h ago', type: 'milestone' },
      { id: '2', user: 'Mike R.', avatar: '', content: 'Logged 5km morning run', timestamp: '4h ago', type: 'log' },
    ],
  },
  {
    id: '2', name: 'Code & Coffee', description: 'Developers leveling up together', members: 5120, category: 'Tech', creatorName: 'Dev Dan',
    image: '', joined: true,
    feed: [
      { id: '1', user: 'Dev Dan', avatar: '', content: 'Shipped my side project! 🚀', timestamp: '1h ago', type: 'milestone' },
    ],
  },
  {
    id: '3', name: 'Mindful Living', description: 'Meditation and mindfulness practice', members: 1890, category: 'Wellness', creatorName: 'Jordan L.',
    image: '', joined: false, feed: [],
  },
  {
    id: '4', name: 'Book Worms', description: 'Reading challenges and discussions', members: 3200, category: 'Learning', creatorName: 'Casey T.',
    image: '', joined: false, feed: [],
  },
  {
    id: '5', name: 'Startup Grind', description: 'Entrepreneurs building together', members: 4100, category: 'Business', creatorName: 'Morgan B.',
    image: '', joined: false, feed: [],
  },
  {
    id: '6', name: 'Design Daily', description: 'UI/UX designers sharing work', members: 2750, category: 'Creative', creatorName: 'Alex J.',
    image: '', joined: false, feed: [],
  },
]

export const mockConversations = [
  {
    id: '1', partnerId: '2', name: 'Sarah K.', avatar: '', lastMessage: 'See you at the run tomorrow!', unread: 2,
    messages: [
      { id: '1', senderId: '2', content: 'Hey! Great run today', timestamp: '10:30 AM' },
      { id: '2', senderId: '1', content: 'Thanks! Felt amazing', timestamp: '10:32 AM' },
      { id: '3', senderId: '2', content: 'See you at the run tomorrow!', timestamp: '10:35 AM' },
    ],
  },
  {
    id: '2', partnerId: '3', name: 'Dev Dan', avatar: '', lastMessage: 'Check out this new library', unread: 0,
    messages: [
      { id: '1', senderId: '3', content: 'Check out this new library', timestamp: '9:00 AM' },
      { id: '2', senderId: '1', content: 'Looks awesome, will try it!', timestamp: '9:15 AM' },
    ],
  },
  {
    id: '3', partnerId: '4', name: 'Jordan L.', avatar: '', lastMessage: 'How is your reading goal going?', unread: 1,
    messages: [
      { id: '1', senderId: '4', content: 'How is your reading goal going?', timestamp: '8:00 AM' },
    ],
  },
]

export const mockOtherUsers = {
  '2': { messagePrivacy: 'public', blockedUsers: [] },
  '3': { messagePrivacy: 'public', blockedUsers: [] },
  '4': { messagePrivacy: 'public', blockedUsers: [] },
  '5': { messagePrivacy: 'public', blockedUsers: [] },
  '6': { messagePrivacy: 'public', blockedUsers: [] },
}

export const mockUserIdByUsername = {
  sarahk: '2',
  devdan: '3',
  jordanl: '4',
}

export const mockNotifications = [
  { id: '1', title: 'New Follower', message: 'Sarah K. started following you', read: false, timestamp: '5m ago', link: '/profile/sarahk' },
  { id: '2', title: 'Goal Milestone', message: 'You completed "Run 10km"!', read: false, timestamp: '1h ago', link: '/goals' },
  { id: '3', title: 'Community', message: 'New post in Morning Runners', read: true, timestamp: '3h ago', link: '/communities/1' },
  { id: '4', title: 'Streak', message: 'You hit a 12-day meditation streak! 🔥', read: true, timestamp: '1d ago', link: '/habits' },
]
