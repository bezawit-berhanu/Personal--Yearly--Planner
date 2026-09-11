export const STORAGE_KEY = 'bezawit_planner_2027_v1';

export const defaultData = {
  activeTab: 'dashboard',
  sidebarOpen: true,

  tasks: [
    { id: 1, title: 'Finalize Q1 Strategic Roadmap', category: 'Career', priority: 'High', date: '2027-04-01', status: 'In Progress', notes: 'Review with partners' },
    { id: 2, title: 'Complete Half Marathon Training (15km)', category: 'Health', priority: 'Medium', date: '2027-04-03', status: 'Completed', notes: 'Felt great' },
    { id: 3, title: 'Prepare investor pitch deck', category: 'Business', priority: 'High', date: '2027-04-10', status: 'Pending', notes: '' },
  ],

  goals: [
    { id: 1, title: 'Launch AI Venture Platform V2', category: 'Career & Business', priority: 'High', deadline: '2027-06-30', progress: 65, status: 'In Progress', why: 'Scale deep tech footprint', next: 'Finalize pilot testing' },
    { id: 2, title: 'Run a half-marathon', category: 'Health & Wellness', priority: 'Medium', deadline: '2027-09-15', progress: 40, status: 'In Progress', why: 'Physical resilience', next: 'Weekly long runs' },
    { id: 3, title: 'Read 24 books', category: 'Learning', priority: 'Medium', deadline: '2027-12-31', progress: 33, status: 'In Progress', why: 'Compound knowledge', next: 'Finish current book' },
  ],

  habits: [
    { id: 1, name: 'Morning Journaling & Reflection', frequency: 'Daily', streak: 12, target: 7, history: [1,1,1,1,1,1,1] },
    { id: 2, name: 'Deep Work (4 hours)', frequency: 'Daily', streak: 5, target: 5, history: [1,1,1,1,0,1,1] },
    { id: 3, name: 'Exercise / Movement', frequency: 'Daily', streak: 8, target: 5, history: [1,0,1,1,1,1,1] },
    { id: 4, name: 'Evening Reading', frequency: 'Daily', streak: 3, target: 5, history: [0,1,0,1,1,1,1] },
  ],

  ceoDashboard: [
    { id: 1, initiative: 'AI Platform V2 Launch', owner: 'Owner', status: 'In Progress', priority: 'High', deadline: '2027-06-30', notes: 'Pilot underway' },
    { id: 2, initiative: 'Fundraising Seed Round', owner: 'Owner', status: 'Active', priority: 'High', deadline: '2027-08-01', notes: 'Term sheets pending' },
  ],

  startupOS: [
    { id: 1, title: 'Multi-Agent Workflow Architecture', category: 'Core Product', status: 'In Progress', priority: 'High', notes: 'V2 deployment Q2' },
    { id: 2, title: 'Go-to-Market Strategy', category: 'Sales', status: 'Drafting', priority: 'High', notes: 'Target enterprise clients' },
  ],

  investorCRM: [
    { id: 1, title: 'Venture Capital Partners', category: 'Seed Round', status: 'Active', stage: 'Term Sheet', contact: '', notes: 'Follow up Q2' },
    { id: 2, title: 'Angel Network Ethiopia', category: 'Pre-Seed', status: 'Evaluating', stage: 'Intro', contact: '', notes: 'Warm intro needed' },
  ],

  grantTracker: [
    { id: 1, title: 'AI Research Grant', category: 'Non-dilutive', amount: 50000, status: 'Submitted', deadline: '2027-05-01', notes: 'Pending review' },
    { id: 2, title: 'African Innovation Fund', category: 'Non-dilutive', amount: 25000, status: 'Researching', deadline: '2027-07-15', notes: '' },
  ],

  competitionTracker: [
    { id: 1, title: 'Global Tech Innovation Challenge', category: 'Pitch', prize: '$50,000', status: 'Registered', date: '2027-06-20', notes: 'Deck ready' },
  ],

  acceleratorTracker: [
    { id: 1, title: 'DeepTech Ventures Cohort', category: 'Incubation', status: 'Interviewing', deadline: '2027-05-15', notes: 'Call scheduled' },
  ],

  readingDatabase: [
    { id: 1, title: 'The Sovereign Individual', author: 'James Dale Davidson', genre: 'Economics', status: 'Completed', rating: 5, notes: 'Life-changing' },
    { id: 2, title: 'Zero to One', author: 'Peter Thiel', genre: 'Business', status: 'Completed', rating: 5, notes: 'Essential reading' },
    { id: 3, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Psychology', status: 'Reading', rating: 4, notes: '' },
    { id: 4, title: 'The Art of Learning', author: 'Josh Waitzkin', genre: 'Self-Development', status: 'To Read', rating: 0, notes: '' },
  ],

  networkingCRM: [
    { id: 1, person: 'Dr. Sarah Jenkins', field: 'AI Research', organization: 'MIT CSAIL', status: 'Connected', lastContact: '2027-03-20', notes: 'Met at NeurIPS' },
    { id: 2, person: 'Ato Kebede Haile', field: 'VC', organization: 'Novastar Ventures', status: 'Warm', lastContact: '2027-02-10', notes: 'Intro via LinkedIn' },
  ],

  careerTracker: [
    { id: 1, role: 'Lead AI Architect', organization: 'iCog Labs', status: 'Active', startDate: '2025-01-01', notes: 'Executing roadmap' },
    { id: 2, role: 'Advisory Board Member', organization: 'AI Ethics Forum', status: 'Active', startDate: '2026-06-01', notes: 'Quarterly meetings' },
  ],

  travelPlanner: [
    { id: 1, destination: 'San Francisco, CA', dates: '2027-09-10', purpose: 'Tech Conference', status: 'Planned', budget: 2500, notes: '' },
    { id: 2, destination: 'Nairobi, Kenya', dates: '2027-07-01', purpose: 'Business Meeting', status: 'Planned', budget: 1200, notes: '' },
  ],

  knowledgeDatabase: [
    { id: 1, topic: 'Vector Retrieval Optimization', category: 'Engineering', source: 'Papers With Code', notes: 'HNSW index tuning' },
    { id: 2, topic: 'Transformer Scaling Laws', category: 'ML Theory', source: 'Arxiv', notes: 'Chinchilla paper' },
  ],

  relationshipManager: [
    { id: 1, person: 'Family Sunday Dinners', category: 'Family', status: 'Active', frequency: 'Weekly', notes: 'Consistent cadence' },
    { id: 2, person: 'Mentor - Dr. Asrat Mulatu', category: 'Mentor', status: 'Active', frequency: 'Monthly', notes: 'Career guidance' },
  ],

  contentPlanner: [
    { id: 1, title: 'The Future of Decentralized AI', platform: 'Substack', status: 'Drafting', date: '2027-04-12', notes: '' },
    { id: 2, title: 'Building in Africa: Lessons from iCog', platform: 'LinkedIn', status: 'Idea', date: '2027-05-01', notes: '' },
  ],

  aiSecondBrain: [
    { id: 1, prompt: 'Autonomous Agent Loop Refinement', category: 'Prompt Engineering', model: 'Gemini Ultra', notes: 'Saved template' },
    { id: 2, prompt: 'Investor Email Follow-up Generator', category: 'Business Writing', model: 'GPT-4', notes: 'Works great' },
  ],

  opportunityTracker: [
    { id: 1, title: 'Strategic Advisory Role', category: 'Consulting', potential: 'High', status: 'Evaluating', deadline: '', notes: 'High upside' },
    { id: 2, title: 'Board Seat - EdTech Startup', category: 'Board', potential: 'Medium', status: 'Considering', deadline: '2027-06-01', notes: '' },
  ],

  learningOS: [
    { id: 1, course: 'Advanced Reinforcement Learning', platform: 'DeepLearning.AI', status: 'In Progress', hours: 45, totalHours: 60, notes: '' },
    { id: 2, course: 'Financial Modeling Masterclass', platform: 'CFI', status: 'Planned', hours: 0, totalHours: 40, notes: '' },
    { id: 3, course: 'Spanish for Business', platform: 'Pimsleur', status: 'In Progress', hours: 12, totalHours: 30, notes: '' },
  ],

  healthDashboard: [
    { id: 1, metric: 'Sleep', value: 7.5, unit: 'hrs', target: 8, status: 'Good', date: '2027-04-07', notes: '' },
    { id: 2, metric: 'Steps', value: 8500, unit: 'steps', target: 10000, status: 'Good', date: '2027-04-07', notes: '' },
    { id: 3, metric: 'Water Intake', value: 2.5, unit: 'L', target: 3, status: 'Good', date: '2027-04-07', notes: '' },
    { id: 4, metric: 'Resting Heart Rate', value: 58, unit: 'bpm', target: 60, status: 'Optimal', date: '2027-04-07', notes: '' },
    { id: 5, metric: 'Weight', value: 65, unit: 'kg', target: 63, status: 'On Track', date: '2027-04-07', notes: '' },
  ],

  financeTracker: [
    { id: 1, source: 'iCog Labs Salary', category: 'Income', amount: 4500, date: '2027-04-01', notes: '' },
    { id: 2, source: 'Freelance Consulting', category: 'Income', amount: 1200, date: '2027-04-05', notes: 'AI strategy' },
    { id: 3, source: 'Side Project Revenue', category: 'Income', amount: 350, date: '2027-04-10', notes: '' },
    { id: 4, source: 'Rent', category: 'Expense', amount: 800, date: '2027-04-01', notes: '' },
    { id: 5, source: 'Groceries', category: 'Expense', amount: 250, date: '2027-04-07', notes: '' },
    { id: 6, source: 'Books & Courses', category: 'Expense', amount: 180, date: '2027-04-10', notes: 'Investment' },
    { id: 7, source: 'Utilities', category: 'Expense', amount: 120, date: '2027-04-05', notes: '' },
    { id: 8, source: 'Savings Transfer', category: 'Savings', amount: 1500, date: '2027-04-01', notes: 'Emergency fund' },
  ],

  lifePlanning: [
    { id: 1, domain: 'Career & Business', vision: 'Lead transformative AI ventures in Africa and globally', status: 'Active', timeline: '2027-2030', notes: '' },
    { id: 2, domain: 'Personal Growth', vision: 'Cultivate deep presence, mastery, and intellectual depth', status: 'Active', timeline: 'Ongoing', notes: '' },
    { id: 3, domain: 'Health & Wellness', vision: 'Peak physical and mental health for sustained performance', status: 'Active', timeline: '2027', notes: '' },
    { id: 4, domain: 'Relationships', vision: 'Deep, intentional connections with family, mentors, peers', status: 'Active', timeline: 'Ongoing', notes: '' },
    { id: 5, domain: 'Financial Freedom', vision: 'Build net worth of $1M+ and passive income streams', status: 'In Progress', timeline: '2030', notes: '' },
  ],

  annualPlanning: [
    { id: 1, quarter: 'Q1 2027', focus: 'AI Product Launch & Wealth Foundation', status: 'Completed', keyWin: 'Platform beta launched', notes: '' },
    { id: 2, quarter: 'Q2 2027', focus: 'Fundraising & Market Expansion', status: 'In Progress', keyWin: '', notes: '' },
    { id: 3, quarter: 'Q3 2027', focus: 'Team Building & Partnerships', status: 'Planned', keyWin: '', notes: '' },
    { id: 4, quarter: 'Q4 2027', focus: 'Revenue Scale & Personal Excellence', status: 'Planned', keyWin: '', notes: '' },
  ],

  quarterlyPlanning: [
    { id: 1, milestone: 'Complete Pilot Testing', category: 'Product', status: 'In Progress', dueDate: '2027-05-15', priority: 'High', notes: '' },
    { id: 2, milestone: 'Close $500K Seed Round', category: 'Finance', status: 'Active', dueDate: '2027-06-30', priority: 'High', notes: '' },
    { id: 3, milestone: 'Hire 2 Senior Engineers', category: 'Team', status: 'Recruiting', dueDate: '2027-06-01', priority: 'Medium', notes: '' },
  ],

  reflectionJournal: [
    { id: 1, date: '2027-04-01', mood: 'Focused', reflection: 'Patience and focused execution compound rapidly. Trust the process.', gratitude: 'Health, purpose, momentum', wins: 'Launched beta, 3 investor calls' },
    { id: 2, date: '2027-03-25', mood: 'Energized', reflection: 'Reading Zero to One again reminded me to aim for breakthrough rather than incremental.', gratitude: 'Mentors, time, clarity', wins: 'Completed pitch deck' },
  ],

  decisionJournal: [
    { id: 1, date: '2027-04-01', decision: 'Adopt Vector Search DB (Weaviate)', rationale: 'Scalability & retrieval speed for agent memory', outcome: 'Successful - 40% query improvement', notes: '' },
    { id: 2, date: '2027-03-15', decision: 'Decline advisory role at FinTech startup', rationale: 'Misaligned with core mission', outcome: 'Pending validation', notes: 'Time saved for core work' },
  ],

  weeklyPlanner: [
    { id: 1, week: 'Week 14 (Apr 7-13)', priority: 'Submit grant proposal', status: 'In Progress', focus: 'Deep work on AI product', energyLevel: 'High', notes: '' },
    { id: 2, week: 'Week 15 (Apr 14-20)', priority: '3 investor calls', status: 'Planned', focus: 'Fundraising push', energyLevel: 'High', notes: '' },
  ],

  dailyPlanner: [
    { id: 1, date: '2027-04-07', task: 'Review architecture docs', status: 'Completed', timeBlock: '09:00', energy: 'High', notes: '' },
    { id: 2, date: '2027-04-07', task: 'Investor email follow-ups', status: 'Pending', timeBlock: '14:00', energy: 'Medium', notes: '' },
    { id: 3, date: '2027-04-07', task: 'Evening run 5km', status: 'Pending', timeBlock: '18:30', energy: 'Medium', notes: '' },
  ],

  kpiDashboard: [
    { id: 1, kpi: 'Goal Completion Rate', value: 65, target: 80, unit: '%', category: 'Performance' },
    { id: 2, kpi: 'Revenue Growth', value: 28, target: 40, unit: '%', category: 'Finance' },
    { id: 3, kpi: 'Books Read', value: 8, target: 24, unit: 'books', category: 'Learning' },
    { id: 4, kpi: 'Habit Consistency', value: 78, target: 90, unit: '%', category: 'Wellness' },
    { id: 5, kpi: 'Investor Meetings', value: 6, target: 10, unit: 'meetings', category: 'Business' },
    { id: 6, kpi: 'Savings Rate', value: 25, target: 35, unit: '%', category: 'Finance' },
  ],

  substackIdeas: [
    { id: 1, title: 'Autonomous Multi-Agent Frameworks in 2027', topic: 'AI', priority: 'High', status: 'Drafting', notes: '' },
    { id: 2, title: 'Building AI Startups in Africa: The Real Story', topic: 'Entrepreneurship', priority: 'High', status: 'Idea', notes: '' },
    { id: 3, title: 'The Compound Effect of Daily Habits', topic: 'Personal Growth', priority: 'Medium', status: 'Idea', notes: '' },
  ],

  substackReads: [
    { id: 1, title: 'State of AI 2027', author: 'Air Street Capital', status: 'To Read', url: '', notes: '' },
    { id: 2, title: 'The Weekly Strategy', author: 'Lenny Rachitsky', status: 'Reading', url: '', notes: '' },
    { id: 3, title: 'Stratechery Weekly', author: 'Ben Thompson', status: 'Subscribed', url: '', notes: 'Essential reading' },
  ],

  journalingIdeas: [
    { id: 1, prompt: 'What am I optimizing for this quarter?', category: 'Purpose', notes: '' },
    { id: 2, prompt: 'What would I do differently if I had 10x more courage?', category: 'Growth', notes: '' },
    { id: 3, prompt: 'Who are my five closest relationships and how can I deepen them?', category: 'Relationships', notes: '' },
  ],

  toVisit: [
    { id: 1, place: 'Lalibela Rock-Hewn Churches', location: 'Ethiopia', status: 'Planned', priority: 'High', estimatedCost: 500, notes: '' },
    { id: 2, place: 'Cape Town', location: 'South Africa', status: 'Wishlist', priority: 'Medium', estimatedCost: 1500, notes: 'AfricaCom conference' },
    { id: 3, place: 'Tokyo', location: 'Japan', status: 'Wishlist', priority: 'Low', estimatedCost: 3000, notes: 'Tech & culture' },
  ],

  toBuy: [
    { id: 1, item: 'Ergonomic Keyboard', price: 180, status: 'Wishlist', priority: 'Medium', category: 'Tech', notes: '' },
    { id: 2, item: 'Standing Desk Mat', price: 60, status: 'To Buy', priority: 'High', category: 'Home Office', notes: '' },
    { id: 3, item: 'Noise-cancelling Headphones', price: 350, status: 'Saved For', priority: 'Medium', category: 'Tech', notes: '' },
  ],

  hobbies: [
    { id: 1, hobby: 'Classical Piano', status: 'Exploring', priority: 'Medium', timePerWeek: '2 hrs', notes: 'Taking lessons' },
    { id: 2, hobby: 'Watercolor Painting', status: 'Interested', priority: 'Low', timePerWeek: '', notes: '' },
    { id: 3, hobby: 'Distance Running', status: 'Active', priority: 'High', timePerWeek: '4 hrs', notes: 'Half-marathon prep' },
  ],

  passwords: [
    { id: 1, service: 'Substack', username: 'user@example.com', purpose: 'Publishing', notes: '' },
    { id: 2, service: 'LinkedIn Premium', username: 'user@example.com', purpose: 'Networking', notes: '' },
    { id: 3, service: 'GitHub', username: 'user-dev', purpose: 'Code', notes: '' },
  ],

  debts: [
    { id: 1, person: 'Equipment Loan (Bank)', original: 5000, remaining: 3000, monthlyPayment: 250, status: 'Active', dueDate: '2027-12-31', notes: '' },
    { id: 2, person: 'Friend - Habtamu', original: 500, remaining: 500, monthlyPayment: 0, status: 'Owed', dueDate: '2027-06-01', notes: 'No rush' },
  ],

  courses: [
    { id: 1, course: 'Advanced RL', platform: 'DeepLearning.AI', status: 'In Progress', priority: 'High', url: 'deeplearning.ai', notes: '' },
    { id: 2, course: 'Y Combinator Startup School', platform: 'YC', status: 'Completed', priority: 'High', url: 'startupschool.org', notes: 'Excellent' },
    { id: 3, course: 'Financial Modeling', platform: 'CFI', status: 'Planned', priority: 'Medium', url: 'corporatefinanceinstitute.com', notes: '' },
  ],

  ideasRemember: [
    { id: 1, idea: 'P2P Inference Networks', category: 'Tech', importance: 'High', notes: 'Distribute model inference across devices' },
    { id: 2, idea: 'AI-Powered Language Preservation Tool', category: 'Social Impact', importance: 'High', notes: 'For Ethiopian languages' },
    { id: 3, idea: 'Agent Memory as a Service', category: 'Business', importance: 'Medium', notes: 'SaaS offering' },
  ],

  ideasResearch: [
    { id: 1, topic: 'Horn of Africa Monetary History', priority: 'Medium', status: 'Pending', source: '', notes: '' },
    { id: 2, topic: 'Decentralized AI Governance Frameworks', priority: 'High', status: 'Started', source: 'Arxiv', notes: '' },
    { id: 3, topic: 'Ethiopian Startup Ecosystem Analysis', priority: 'High', status: 'Pending', source: '', notes: '' },
  ],

  peopleToKnow: [
    { id: 1, person: 'Dr. Ben Goertzel', field: 'AGI', why: 'Pioneer in OpenCog & decentralized AI', status: 'To Connect', notes: '' },
    { id: 2, person: 'Timnit Gebru', field: 'AI Ethics', why: 'Africa + AI ethics intersection', status: 'Following', notes: '' },
    { id: 3, person: 'Naveen Jain', field: 'Entrepreneurship', why: 'Moonshot thinking', status: 'Following', notes: '' },
  ],

  birthdays: [
    { id: 1, person: 'Sosi (Sister)', birthday: '1999-05-12', relationship: 'Family', giftIdea: 'Ceramic tea set', notes: '' },
    { id: 2, person: 'Mekdes (Close Friend)', birthday: '1998-08-23', relationship: 'Friend', giftIdea: 'Book + journal set', notes: '' },
    { id: 3, person: 'Dr. Asrat (Mentor)', birthday: '1975-11-04', relationship: 'Mentor', giftIdea: 'Fine whiskey', notes: '' },
  ],

  giftIdeas: [
    { id: 1, person: 'Sister', gift: 'Ceramic tea set', price: 65, status: 'Idea', occasion: 'Birthday', notes: '' },
    { id: 2, person: 'Mom', gift: 'Spa day voucher', price: 120, status: 'Planned', occasion: "Mother's Day", notes: '' },
    { id: 3, person: 'Mentor', gift: 'Premium leather notebook', price: 80, status: 'Idea', occasion: 'Appreciation', notes: '' },
  ],

  artFigures: [
    { id: 1, artist: 'Afewerk Tekle', field: 'Fine Art', era: '20th Century', nationality: 'Ethiopian', notes: 'National treasure, murals at UNECA' },
    { id: 2, artist: 'Julie Mehretu', field: 'Contemporary Art', era: '21st Century', nationality: 'Ethiopian-American', notes: 'Abstract architectural paintings' },
    { id: 3, artist: 'El Anatsui', field: 'Sculpture', era: '21st Century', nationality: 'Ghanaian', notes: 'Bottle-cap tapestries' },
  ],

  philosophyIdeas: [
    { id: 1, concept: 'Stoic Dichotomy of Control', philosopher: 'Epictetus', school: 'Stoicism', notes: 'Focus only on what is within your control', status: 'Internalized' },
    { id: 2, concept: 'The Last Lecture Philosophy', philosopher: 'Randy Pausch', school: 'Modern', notes: 'Live as if it matters', status: 'Studying' },
    { id: 3, concept: "Nietzsche's Will to Power", philosopher: 'Nietzsche', school: 'Existentialism', notes: 'Striving for self-mastery', status: 'Exploring' },
  ],

  bookReview: [
    { id: 1, book: 'The Sovereign Individual', author: 'James Dale Davidson', rating: 5, status: 'Completed', genre: 'Economics', notes: 'Prescient about crypto and digital sovereignty' },
    { id: 2, book: 'Zero to One', author: 'Peter Thiel', rating: 5, status: 'Completed', genre: 'Business', notes: 'Think in secrets and monopolies' },
    { id: 3, book: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', rating: 4, status: 'Completed', genre: 'Psychology', notes: 'System 1 vs System 2 framing is essential' },
  ],
};
