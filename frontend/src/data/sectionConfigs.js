// Central configuration for all planner sections with enriched fields.

export const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed', 'Active', 'On Hold', 'Blocked'];
export const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

// ─── Navigation groups for Top Navbar & Dropdowns ──────────────────────────
export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard',       label: 'Dashboard',        icon: 'LayoutDashboard' },
      { id: 'kpiDashboard',    label: 'KPI Dashboard',    icon: 'BarChart3' },
      { id: 'files',           label: 'Files & Scans',    icon: 'FileText' },
    ],
  },
  {
    label: 'My Goals',
    items: [
      { id: 'goals',           label: 'Goal Tracker',     icon: 'Target' },
      { id: 'tasks',           label: 'Task Manager',     icon: 'CheckSquare' },
      { id: 'habits',          label: 'Habit Tracker',    icon: 'Repeat' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { id: 'financeCashflow', label: 'Cashflow Statement', icon: 'DollarSign' },
      { id: 'financeBudget',   label: 'Monthly Budgeting',  icon: 'PieChart' },
      { id: 'debts',           label: 'Debts & Loans',      icon: 'CreditCard' },
      { id: 'toBuy',           label: 'To Buy List',        icon: 'ShoppingBag' },
    ],
  },
  {
    label: 'Business',
    items: [
      { id: 'ceoDashboard',        label: 'CEO Dashboard',        icon: 'Crown' },
      { id: 'startupOS',           label: 'Startup OS',           icon: 'Rocket' },
      { id: 'investorCRM',         label: 'Investor CRM',         icon: 'Users' },
      { id: 'grantTracker',        label: 'Grant Tracker',        icon: 'Award' },
      { id: 'competitionTracker',  label: 'Competitions',         icon: 'Trophy' },
      { id: 'acceleratorTracker',  label: 'Accelerators',         icon: 'Zap' },
      { id: 'opportunityTracker',  label: 'Opportunities',        icon: 'Compass' },
    ],
  },
  {
    label: 'Career & Learning',
    items: [
      { id: 'careerTracker',   label: 'Career Tracker',   icon: 'Briefcase' },
      { id: 'learningOS',      label: 'Learning OS',      icon: 'GraduationCap' },
      { id: 'courses',         label: 'Courses to Take',  icon: 'BookMarked' },
      { id: 'readingDatabase', label: 'Reading Database', icon: 'BookOpen' },
      { id: 'bookReview',      label: 'Book Reviews',     icon: 'Star' },
    ],
  },
  {
    label: 'Health & Lifestyle',
    items: [
      { id: 'healthDashboard', label: 'Health Dashboard', icon: 'Activity' },
      { id: 'hobbies',         label: 'Hobbies',          icon: 'Smile' },
      { id: 'travelPlanner',   label: 'Travel Planner',   icon: 'Plane' },
      { id: 'toVisit',         label: 'To Visit List',    icon: 'MapPin' },
    ],
  },
  {
    label: 'Planning',
    items: [
      { id: 'dailyPlanner',      label: 'Daily Planner',      icon: 'CalendarCheck' },
      { id: 'weeklyPlanner',     label: 'Weekly Planner',     icon: 'CalendarRange' },
      { id: 'quarterlyPlanning', label: 'Quarterly Planning', icon: 'Calendar' },
      { id: 'annualPlanning',    label: 'Annual Planning',    icon: 'CalendarDays' },
      { id: 'lifePlanning',      label: 'Life Planning',      icon: 'Sun' },
    ],
  },
  {
    label: 'Knowledge & Ideas',
    items: [
      { id: 'knowledgeDatabase', label: 'Knowledge Base',   icon: 'Database' },
      { id: 'aiSecondBrain',     label: 'AI Second Brain',  icon: 'Cpu' },
      { id: 'ideasRemember',     label: 'Ideas to Remember',icon: 'Lightbulb' },
      { id: 'ideasResearch',     label: 'Ideas to Research',icon: 'Search' },
      { id: 'philosophyIdeas',   label: 'Philosophy',       icon: 'Feather' },
      { id: 'artFigures',        label: 'Art Figures',      icon: 'Palette' },
    ],
  },
  {
    label: 'Content & Journal',
    items: [
      { id: 'contentPlanner',  label: 'Content Planner',  icon: 'PenTool' },
      { id: 'substackIdeas',   label: 'Substack Ideas',   icon: 'FileText' },
      { id: 'substackReads',   label: 'Substack Reads',   icon: 'Bookmark' },
      { id: 'journalingIdeas', label: 'Journal Prompts',  icon: 'BookHeart' },
      { id: 'reflectionJournal', label: 'Reflection Journal', icon: 'Book' },
      { id: 'decisionJournal',   label: 'Decision Journal',   icon: 'CheckCircle2' },
    ],
  },
  {
    label: 'People & CRM',
    items: [
      { id: 'relationshipManager',label: 'Relationships & Contacts', icon: 'HeartHandshake' },
      { id: 'networkingCRM',      label: 'Networking CRM',    icon: 'Network' },
      { id: 'peopleToKnow',       label: 'People to Know',    icon: 'UserCheck' },
      { id: 'birthdays',          label: 'Birthdays',         icon: 'Cake' },
      { id: 'giftIdeas',          label: 'Gift Ideas',        icon: 'Gift' },
    ],
  },
  {
    label: 'System & Theme',
    items: [
      { id: 'appearance', label: 'Aesthetic Theme',   icon: 'Palette' },
      { id: 'passwords',  label: 'Emails & Passwords', icon: 'Shield' },
    ],
  },
];

// ─── Complete Enriched Section Config Definitions ──────────────────────────

export const SECTION_CONFIGS = {
  tasks: {
    title: 'Task Manager',
    dataKey: 'tasks',
    viewType: 'table',
    fields: [
      { key: 'title',    label: 'Task',      type: 'text',     required: true, placeholder: 'What needs to be done?' },
      { key: 'category', label: 'Category',  type: 'select',   options: ['Career', 'Health', 'Finance', 'Learning', 'Personal', 'Business', 'Relationships'] },
      { key: 'priority', label: 'Priority',  type: 'select',   options: PRIORITY_OPTIONS },
      { key: 'date',     label: 'Due Date',  type: 'date' },
      { key: 'status',   label: 'Status',    type: 'select',   options: ['Pending', 'In Progress', 'Completed', 'Blocked'] },
      { key: 'notes',    label: 'Notes',     type: 'textarea', tableVisible: false },
    ],
    tableFields: ['title', 'category', 'priority', 'date', 'status'],
    summary: (items) => [
      { label: 'Total Tasks',   value: items.length },
      { label: 'Completed',     value: items.filter(i => i.status === 'Completed').length, color: 'green' },
      { label: 'In Progress',   value: items.filter(i => i.status === 'In Progress').length, color: 'amber' },
      { label: 'Completion %',  value: items.length ? `${Math.round((items.filter(i=>i.status==='Completed').length/items.length)*100)}%` : '0%', color: 'blue' },
    ],
  },

  goals: {
    title: 'Goal Tracker',
    dataKey: 'goals',
    viewType: 'goals',
    fields: [
      { key: 'title',    label: 'Goal Title',        type: 'text',     required: true, placeholder: 'What is your goal?' },
      { key: 'category', label: 'Life Area',          type: 'select',   options: ['Career & Business', 'Health & Wellness', 'Finance', 'Learning', 'Relationships', 'Personal Growth', 'Creativity'] },
      { key: 'priority', label: 'Priority',           type: 'select',   options: PRIORITY_OPTIONS },
      { key: 'deadline', label: 'Deadline',           type: 'date' },
      { key: 'progress', label: 'Progress (%)',       type: 'progress', min: 0, max: 100 },
      { key: 'status',   label: 'Status',             type: 'select',   options: ['Not Started', 'In Progress', 'Completed', 'On Hold', 'Abandoned'] },
      { key: 'why',      label: 'Why This Matters',  type: 'textarea', placeholder: 'Your deep reason...' },
      { key: 'next',     label: 'Next Action',        type: 'text',     placeholder: 'Immediate next step' },
    ],
    tableFields: ['title', 'category', 'deadline', 'progress', 'status'],
    summary: (items) => [
      { label: 'Total Goals',    value: items.length },
      { label: 'In Progress',    value: items.filter(i => i.status === 'In Progress').length, color: 'amber' },
      { label: 'Completed',      value: items.filter(i => i.status === 'Completed').length, color: 'green' },
      { label: 'Avg Progress',   value: items.length ? `${Math.round(items.reduce((s,i)=>s+(i.progress||0),0)/items.length)}%` : '0%', color: 'blue' },
    ],
  },

  habits: {
    title: 'Habit Tracker',
    dataKey: 'habits',
    viewType: 'habits',
    fields: [
      { key: 'name',      label: 'Habit',     type: 'text',   required: true, placeholder: 'Name your habit' },
      { key: 'frequency', label: 'Frequency', type: 'select', options: ['Daily', 'Weekly', 'Mon/Wed/Fri', 'Weekdays', 'Weekends'] },
      { key: 'streak',    label: 'Streak',    type: 'number', min: 0 },
      { key: 'target',    label: 'Weekly Target (days)', type: 'number', min: 1, max: 7 },
    ],
    tableFields: ['name', 'frequency', 'streak', 'target'],
    summary: (items) => [
      { label: 'Total Habits',  value: items.length },
      { label: 'Best Streak',   value: items.length ? Math.max(...items.map(i=>i.streak||0)) + ' days' : '0', color: 'green' },
      { label: 'Avg Streak',    value: items.length ? Math.round(items.reduce((s,i)=>s+(i.streak||0),0)/items.length) + ' days' : '0', color: 'amber' },
    ],
  },

  relationshipManager: {
    title: 'Relationships & Contacts',
    dataKey: 'relationshipManager',
    viewType: 'table',
    fields: [
      { key: 'person',       label: 'Person Name',    type: 'text',   required: true },
      { key: 'category',     label: 'Category',       type: 'select', options: ['Family', 'Romantic', 'Friend', 'Mentor', 'Colleague', 'Community'] },
      { key: 'status',       label: 'Status',         type: 'select', options: ['Active', 'Nurturing', 'Reconnect', 'Past'] },
      { key: 'phone',        label: 'Phone Number(s)', type: 'text',   placeholder: '+251... (comma separated for multiple)' },
      { key: 'email',        label: 'Email Address(es)', type: 'text', placeholder: 'email@example.com (comma separated)' },
      { key: 'birthday',     label: 'Birthday',       type: 'date' },
      { key: 'lastContact',  label: 'Last Contact Date', type: 'date' },
      { key: 'notes',        label: 'Notes & Context', type: 'textarea', tableVisible: true },
    ],
    tableFields: ['person', 'category', 'status', 'phone', 'email', 'lastContact'],
    summary: (items) => [
      { label: 'Contacts',   value: items.length },
      { label: 'Active',     value: items.filter(i=>i.status==='Active').length, color: 'green' },
    ],
  },

  passwords: {
    title: 'Emails & Passwords',
    dataKey: 'passwords',
    viewType: 'table',
    fields: [
      { key: 'service',  label: 'Service / Platform', type: 'text', required: true, placeholder: 'GitHub, Gmail, Bank...' },
      { key: 'username', label: 'Email / Username',  type: 'text', required: true },
      { key: 'password', label: 'Password',          type: 'password', required: true },
      { key: 'purpose',  label: 'Purpose / Category', type: 'text' },
      { key: 'recoveryEmail', label: 'Recovery Email', type: 'text' },
      { key: 'notes',    label: 'Notes',             type: 'textarea', tableVisible: false },
    ],
    tableFields: ['service', 'username', 'password', 'purpose', 'recoveryEmail'],
    summary: (items) => [{ label: 'Accounts Saved', value: items.length }],
  },

  ceoDashboard: {
    title: 'CEO Dashboard',
    dataKey: 'ceoDashboard',
    viewType: 'table',
    fields: [
      { key: 'initiative', label: 'Strategic Initiative', type: 'text', required: true },
      { key: 'owner',      label: 'Owner / Lead',         type: 'text' },
      { key: 'category',   label: 'Category',             type: 'select', options: ['Product', 'Sales & Growth', 'Fundraising', 'Operations', 'Hiring', 'Legal'] },
      { key: 'status',     label: 'Status',               type: 'select', options: STATUS_OPTIONS },
      { key: 'priority',   label: 'Priority',             type: 'select', options: PRIORITY_OPTIONS },
      { key: 'budget',     label: 'Budget ($)',           type: 'number', min: 0 },
      { key: 'deadline',   label: 'Deadline',             type: 'date' },
      { key: 'notes',      label: 'Notes',                type: 'textarea', tableVisible: false },
    ],
    tableFields: ['initiative', 'owner', 'category', 'status', 'priority', 'deadline']
  },

  startupOS: {
    title: 'Startup OS',
    dataKey: 'startupOS',
    viewType: 'table',
    fields: [
      { key: 'title',      label: 'Initiative', type: 'text', required: true },
      { key: 'category',   label: 'Category',   type: 'select', options: ['Core Product', 'GTM / Sales', 'Marketing', 'Ops', 'Hiring', 'Finance', 'Legal'] },
      { key: 'status',     label: 'Status',     type: 'select', options: STATUS_OPTIONS },
      { key: 'priority',   label: 'Priority',   type: 'select', options: PRIORITY_OPTIONS },
      { key: 'targetDate', label: 'Target Date',type: 'date' },
      { key: 'notes',      label: 'Notes',      type: 'textarea', tableVisible: false },
    ],
    tableFields: ['title', 'category', 'status', 'priority', 'targetDate']
  },

  investorCRM: {
    title: 'Investor CRM',
    dataKey: 'investorCRM',
    viewType: 'table',
    fields: [
      { key: 'title',     label: 'Investor / Fund Name', type: 'text', required: true },
      { key: 'category',  label: 'Stage / Type',        type: 'select', options: ['Angel', 'Pre-Seed', 'Seed Round', 'Series A', 'Venture Debt'] },
      { key: 'status',    label: 'Status',               type: 'select', options: ['Researching', 'Contacted', 'Intro Meeting', 'DD / Pipeline', 'Term Sheet', 'Closed', 'Passed'] },
      { key: 'checkSize', label: 'Est Check ($)',        type: 'number' },
      { key: 'contact',   label: 'Key Contact Person',   type: 'text' },
      { key: 'email',     label: 'Contact Email',        type: 'text' },
      { key: 'followUpDate', label: 'Follow Up Date',     type: 'date' },
      { key: 'notes',     label: 'Notes & Context',      type: 'textarea', tableVisible: false },
    ],
    tableFields: ['title', 'category', 'status', 'checkSize', 'contact', 'followUpDate']
  },

  grantTracker: {
    title: 'Grant Tracker',
    dataKey: 'grantTracker',
    viewType: 'table',
    fields: [
      { key: 'title',    label: 'Grant Name',   type: 'text', required: true },
      { key: 'category', label: 'Grantor / Org', type: 'text' },
      { key: 'amount',   label: 'Grant Value ($)', type: 'number' },
      { key: 'status',   label: 'Status',       type: 'select', options: ['Researching', 'Drafting', 'Submitted', 'Under Review', 'Awarded', 'Rejected'] },
      { key: 'deadline', label: 'Submission Deadline', type: 'date' },
      { key: 'notes',    label: 'Notes',        type: 'textarea', tableVisible: false },
    ],
    tableFields: ['title', 'category', 'amount', 'status', 'deadline']
  },

  competitionTracker: {
    title: 'Competitions & Pitch Contests',
    dataKey: 'competitionTracker',
    viewType: 'table',
    fields: [
      { key: 'title',    label: 'Competition Name', type: 'text', required: true },
      { key: 'prize',    label: 'Prize ($ / Benefits)', type: 'text' },
      { key: 'status',   label: 'Status',      type: 'select', options: ['Researching', 'Applied', 'Shortlisted', 'Finalist', 'Won', 'Passed'] },
      { key: 'date',     label: 'Event Date',  type: 'date' },
      { key: 'url',      label: 'Website URL', type: 'text' },
      { key: 'notes',    label: 'Notes',       type: 'textarea', tableVisible: false },
    ],
    tableFields: ['title', 'prize', 'status', 'date']
  },

  acceleratorTracker: {
    title: 'Accelerator Tracker',
    dataKey: 'acceleratorTracker',
    viewType: 'table',
    fields: [
      { key: 'title',    label: 'Program Name', type: 'text', required: true },
      { key: 'equity',   label: 'Equity / Terms', type: 'text', placeholder: '7% for $125k' },
      { key: 'status',   label: 'Status',       type: 'select', options: ['Applying', 'Interviewing', 'Accepted', 'Rejected', 'Alumni'] },
      { key: 'deadline', label: 'App Deadline', type: 'date' },
      { key: 'notes',    label: 'Notes',        type: 'textarea', tableVisible: false },
    ],
    tableFields: ['title', 'equity', 'status', 'deadline']
  },

  opportunityTracker: {
    title: 'Opportunity Tracker',
    dataKey: 'opportunityTracker',
    viewType: 'table',
    fields: [
      { key: 'title',     label: 'Opportunity', type: 'text', required: true },
      { key: 'category',  label: 'Category',    type: 'select', options: ['Consulting', 'Board', 'Speaking', 'Partnership', 'Investment', 'Employment'] },
      { key: 'potential', label: 'Potential',   type: 'select', options: ['Very High', 'High', 'Medium', 'Low'] },
      { key: 'status',    label: 'Status',      type: 'select', options: ['Researching', 'Evaluating', 'Pursuing', 'Accepted', 'Passed'] },
      { key: 'deadline',  label: 'Deadline',    type: 'date' },
      { key: 'notes',     label: 'Notes',       type: 'textarea', tableVisible: false },
    ],
    tableFields: ['title', 'category', 'potential', 'status', 'deadline']
  },

  careerTracker: {
    title: 'Career Tracker',
    dataKey: 'careerTracker',
    viewType: 'table',
    fields: [
      { key: 'role',         label: 'Role Title',    type: 'text', required: true },
      { key: 'organization', label: 'Company / Org', type: 'text' },
      { key: 'status',       label: 'Status',        type: 'select', options: ['Active', 'Exploring', 'Applied', 'Interviewing', 'Offer'] },
      { key: 'salary',       label: 'Salary ($)',    type: 'number' },
      { key: 'startDate',    label: 'Start Date',    type: 'date' },
      { key: 'notes',        label: 'Notes',         type: 'textarea', tableVisible: false },
    ],
    tableFields: ['role', 'organization', 'status', 'salary', 'startDate']
  },

  learningOS: {
    title: 'Learning OS',
    dataKey: 'learningOS',
    viewType: 'table',
    fields: [
      { key: 'course',     label: 'Subject / Course', type: 'text', required: true },
      { key: 'platform',   label: 'Platform / Source',type: 'text' },
      { key: 'status',     label: 'Status',           type: 'select', options: ['Planned', 'In Progress', 'Completed'] },
      { key: 'hours',      label: 'Hours Completed',  type: 'number' },
      { key: 'totalHours', label: 'Total Hours',      type: 'number' },
      { key: 'notes',      label: 'Key Concepts',     type: 'textarea', tableVisible: false },
    ],
    tableFields: ['course', 'platform', 'status', 'hours', 'totalHours']
  },

  courses: {
    title: 'Courses to Take',
    dataKey: 'courses',
    viewType: 'table',
    fields: [
      { key: 'course',   label: 'Course Name', type: 'text', required: true },
      { key: 'platform', label: 'Platform',    type: 'text' },
      { key: 'priority', label: 'Priority',    type: 'select', options: PRIORITY_OPTIONS },
      { key: 'status',   label: 'Status',      type: 'select', options: ['Planned', 'Enrolled', 'Completed'] },
      { key: 'url',      label: 'Course Link', type: 'text' },
      { key: 'notes',    label: 'Notes',       type: 'textarea', tableVisible: false },
    ],
    tableFields: ['course', 'platform', 'priority', 'status']
  },

  readingDatabase: {
    title: 'Reading Database',
    dataKey: 'readingDatabase',
    viewType: 'table',
    fields: [
      { key: 'title',     label: 'Book Title', type: 'text', required: true },
      { key: 'author',    label: 'Author',     type: 'text' },
      { key: 'genre',     label: 'Genre',      type: 'select', options: ['Business', 'Technology', 'Science', 'Self-Dev', 'Philosophy', 'Fiction', 'History'] },
      { key: 'status',    label: 'Status',     type: 'select', options: ['To Read', 'Reading', 'Completed'] },
      { key: 'rating',    label: 'Rating',     type: 'rating' },
      { key: 'notes',     label: 'Notes',      type: 'textarea', tableVisible: false },
    ],
    tableFields: ['title', 'author', 'genre', 'status', 'rating']
  },

  bookReview: {
    title: 'Book Reviews',
    dataKey: 'bookReview',
    viewType: 'table',
    fields: [
      { key: 'book',   label: 'Book Title', type: 'text', required: true },
      { key: 'author', label: 'Author',     type: 'text' },
      { key: 'rating', label: 'Rating',     type: 'rating' },
      { key: 'status', label: 'Status',     type: 'select', options: ['Completed', 'Reading'] },
      { key: 'notes',  label: 'Detailed Review & Takeaways', type: 'textarea', tableVisible: true },
    ],
    tableFields: ['book', 'author', 'rating', 'status', 'notes']
  },

  networkingCRM: {
    title: 'Networking CRM',
    dataKey: 'networkingCRM',
    viewType: 'table',
    fields: [
      { key: 'person',       label: 'Name',         type: 'text', required: true },
      { key: 'organization', label: 'Organization', type: 'text' },
      { key: 'role',         label: 'Role / Field', type: 'text' },
      { key: 'status',       label: 'Status',       type: 'select', options: ['To Connect', 'Connected', 'Warm Lead', 'Mentor'] },
      { key: 'lastContact',  label: 'Last Contact Date', type: 'date' },
      { key: 'notes',        label: 'Notes',        type: 'textarea', tableVisible: false },
    ],
    tableFields: ['person', 'organization', 'role', 'status', 'lastContact']
  },

  peopleToKnow: {
    title: 'People to Know',
    dataKey: 'peopleToKnow',
    viewType: 'table',
    fields: [
      { key: 'person', label: 'Person Name', type: 'text', required: true },
      { key: 'field',  label: 'Field / Industry', type: 'text' },
      { key: 'why',    label: 'Why Connect?', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'select', options: ['To Connect', 'Following', 'Connected'] },
    ],
    tableFields: ['person', 'field', 'why', 'status']
  },

  birthdays: {
    title: 'Birthdays',
    dataKey: 'birthdays',
    viewType: 'table',
    fields: [
      { key: 'person',       label: 'Name',         type: 'text', required: true },
      { key: 'birthday',     label: 'Birthday',     type: 'date' },
      { key: 'relationship', label: 'Relationship', type: 'select', options: ['Family', 'Friend', 'Colleague', 'Partner'] },
      { key: 'giftIdea',     label: 'Gift Idea',    type: 'text' },
    ],
    tableFields: ['person', 'birthday', 'relationship', 'giftIdea']
  },

  giftIdeas: {
    title: 'Gift Ideas',
    dataKey: 'giftIdeas',
    viewType: 'table',
    fields: [
      { key: 'person',   label: 'For Person', type: 'text', required: true },
      { key: 'gift',     label: 'Gift Idea',  type: 'text', required: true },
      { key: 'price',    label: 'Price ($)',  type: 'number' },
      { key: 'status',   label: 'Status',     type: 'select', options: ['Idea', 'Planned', 'Purchased', 'Given'] },
      { key: 'occasion', label: 'Occasion',   type: 'text' },
    ],
    tableFields: ['person', 'gift', 'price', 'status', 'occasion']
  },

  healthDashboard: {
    title: 'Health Dashboard',
    dataKey: 'healthDashboard',
    viewType: 'health',
    fields: [
      { key: 'metric', label: 'Metric', type: 'text', required: true },
      { key: 'value',  label: 'Value',  type: 'number' },
      { key: 'unit',   label: 'Unit (hrs, steps, kg...)', type: 'text' },
      { key: 'target', label: 'Target', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['Optimal', 'Good', 'Needs Work'] },
    ],
    tableFields: ['metric', 'value', 'unit', 'target', 'status']
  },

  hobbies: {
    title: 'Hobbies & Interests',
    dataKey: 'hobbies',
    viewType: 'table',
    fields: [
      { key: 'hobby',       label: 'Hobby',       type: 'text', required: true },
      { key: 'status',      label: 'Status',      type: 'select', options: ['Exploring', 'Active', 'Paused'] },
      { key: 'timePerWeek', label: 'Hours / Week', type: 'text' },
      { key: 'notes',       label: 'Notes',       type: 'textarea', tableVisible: false },
    ],
    tableFields: ['hobby', 'status', 'timePerWeek']
  },

  travelPlanner: {
    title: 'Travel Planner',
    dataKey: 'travelPlanner',
    viewType: 'table',
    fields: [
      { key: 'destination', label: 'Destination', type: 'text', required: true },
      { key: 'dates',       label: 'Travel Dates',type: 'date' },
      { key: 'purpose',     label: 'Purpose',     type: 'select', options: ['Vacation', 'Business', 'Conference', 'Exploration'] },
      { key: 'status',      label: 'Status',      type: 'select', options: ['Wishlist', 'Planned', 'Booked', 'Completed'] },
      { key: 'budget',      label: 'Budget ($)',  type: 'number' },
      { key: 'notes',       label: 'Notes',       type: 'textarea', tableVisible: false },
    ],
    tableFields: ['destination', 'dates', 'purpose', 'status', 'budget']
  },

  toVisit: {
    title: 'To Visit List',
    dataKey: 'toVisit',
    viewType: 'table',
    fields: [
      { key: 'place',         label: 'Place Name', type: 'text', required: true },
      { key: 'location',      label: 'City / Region', type: 'text' },
      { key: 'status',        label: 'Status',     type: 'select', options: ['Wishlist', 'Planned', 'Visited'] },
      { key: 'estimatedCost', label: 'Est. Cost ($)', type: 'number' },
    ],
    tableFields: ['place', 'location', 'status', 'estimatedCost']
  },

  toBuy: {
    title: 'To Buy List',
    dataKey: 'toBuy',
    viewType: 'table',
    fields: [
      { key: 'item',     label: 'Item Name', type: 'text', required: true },
      { key: 'price',    label: 'Price ($)', type: 'number' },
      { key: 'category', label: 'Category',  type: 'select', options: ['Tech', 'Home Office', 'Fashion', 'Books', 'Tools'] },
      { key: 'priority', label: 'Priority',  type: 'select', options: PRIORITY_OPTIONS },
      { key: 'status',   label: 'Status',    type: 'select', options: ['Idea', 'Wishlist', 'To Buy', 'Purchased'] },
    ],
    tableFields: ['item', 'price', 'category', 'priority', 'status']
  },

  debts: {
    title: 'Debts & Loans',
    dataKey: 'debts',
    viewType: 'table',
    fields: [
      { key: 'person',         label: 'To (Person / Bank)', type: 'text', required: true },
      { key: 'original',       label: 'Original Amount ($)', type: 'number' },
      { key: 'remaining',      label: 'Remaining ($)',       type: 'number' },
      { key: 'monthlyPayment', label: 'Monthly Payment ($)', type: 'number' },
      { key: 'status',         label: 'Status',              type: 'select', options: ['Active', 'Paid Off'] },
      { key: 'dueDate',        label: 'Due Date',            type: 'date' },
    ],
    tableFields: ['person', 'original', 'remaining', 'monthlyPayment', 'status', 'dueDate']
  },

  dailyPlanner: {
    title: 'Daily Planner',
    dataKey: 'dailyPlanner',
    viewType: 'table',
    fields: [
      { key: 'date',      label: 'Date',       type: 'date', required: true },
      { key: 'task',      label: 'Task / Schedule', type: 'text', required: true },
      { key: 'timeBlock', label: 'Time Slot',  type: 'text', placeholder: '09:00 - 10:30' },
      { key: 'status',    label: 'Status',     type: 'select', options: ['Pending', 'Completed', 'Skipped'] },
      { key: 'energy',    label: 'Energy Level', type: 'select', options: ['High', 'Medium', 'Low'] },
    ],
    tableFields: ['date', 'task', 'timeBlock', 'status', 'energy']
  },

  weeklyPlanner: {
    title: 'Weekly Planner',
    dataKey: 'weeklyPlanner',
    viewType: 'table',
    fields: [
      { key: 'week',     label: 'Week String', type: 'text', required: true, placeholder: 'Week 12 (Mar 18-24)' },
      { key: 'priority', label: 'Top Priority', type: 'text' },
      { key: 'focus',    label: 'Focus Theme',  type: 'text' },
      { key: 'status',   label: 'Status',       type: 'select', options: ['Planned', 'In Progress', 'Completed'] },
    ],
    tableFields: ['week', 'priority', 'focus', 'status']
  },

  quarterlyPlanning: {
    title: 'Quarterly Planning',
    dataKey: 'quarterlyPlanning',
    viewType: 'table',
    fields: [
      { key: 'milestone', label: 'Milestone Name', type: 'text', required: true },
      { key: 'category',  label: 'Category',       type: 'select', options: ['Product', 'Finance', 'Team', 'Health', 'Learning'] },
      { key: 'status',    label: 'Status',         type: 'select', options: STATUS_OPTIONS },
      { key: 'dueDate',   label: 'Target Date',    type: 'date' },
    ],
    tableFields: ['milestone', 'category', 'status', 'dueDate']
  },

  annualPlanning: {
    title: 'Annual Planning',
    dataKey: 'annualPlanning',
    viewType: 'table',
    fields: [
      { key: 'quarter', label: 'Quarter',     type: 'select', options: ['Q1 2027','Q2 2027','Q3 2027','Q4 2027'], required: true },
      { key: 'focus',   label: 'Quarterly Theme', type: 'text' },
      { key: 'status',  label: 'Status',      type: 'select', options: ['Planned', 'In Progress', 'Completed'] },
      { key: 'keyWin',  label: 'Key Target Win', type: 'text' },
    ],
    tableFields: ['quarter', 'focus', 'status', 'keyWin']
  },

  lifePlanning: {
    title: 'Life Planning',
    dataKey: 'lifePlanning',
    viewType: 'table',
    fields: [
      { key: 'domain',   label: 'Life Domain', type: 'text', required: true },
      { key: 'vision',   label: 'Long Term Vision', type: 'textarea', required: true },
      { key: 'timeline', label: 'Target Timeline', type: 'text', placeholder: '5 Years, 10 Years...' },
    ],
    tableFields: ['domain', 'vision', 'timeline']
  },

  kpiDashboard: {
    title: 'KPI Dashboard',
    dataKey: 'kpiDashboard',
    viewType: 'kpi',
    fields: [
      { key: 'kpi',      label: 'KPI Name', type: 'text', required: true },
      { key: 'value',    label: 'Current Value', type: 'number' },
      { key: 'target',   label: 'Target Value',  type: 'number' },
      { key: 'unit',     label: 'Unit (%, $, books...)', type: 'text' },
      { key: 'category', label: 'Category', type: 'select', options: ['Performance', 'Finance', 'Learning', 'Wellness', 'Business'] },
    ],
    tableFields: ['kpi', 'value', 'target', 'unit', 'category']
  },

  knowledgeDatabase: {
    title: 'Knowledge Base',
    dataKey: 'knowledgeDatabase',
    viewType: 'table',
    fields: [
      { key: 'topic',    label: 'Topic / Title', type: 'text', required: true },
      { key: 'category', label: 'Category',      type: 'select', options: ['Engineering', 'Business', 'Philosophy', 'Science', 'Finance'] },
      { key: 'source',   label: 'Source / Link', type: 'text' },
      { key: 'notes',    label: 'Key Notes & Concepts', type: 'textarea', tableVisible: true },
    ],
    tableFields: ['topic', 'category', 'source', 'notes']
  },

  aiSecondBrain: {
    title: 'AI Second Brain',
    dataKey: 'aiSecondBrain',
    viewType: 'table',
    fields: [
      { key: 'prompt',   label: 'Prompt / Concept', type: 'text', required: true },
      { key: 'category', label: 'Category',         type: 'text' },
      { key: 'model',    label: 'AI Model Used',    type: 'text' },
      { key: 'notes',    label: 'Output & Insight', type: 'textarea', tableVisible: true },
    ],
    tableFields: ['prompt', 'category', 'model', 'notes']
  },

  ideasRemember: {
    title: 'Ideas to Remember',
    dataKey: 'ideasRemember',
    viewType: 'table',
    fields: [
      { key: 'idea',       label: 'Idea Description', type: 'textarea', required: true },
      { key: 'category',   label: 'Category',         type: 'select', options: ['Tech', 'Business', 'Creative', 'Life'] },
      { key: 'importance', label: 'Importance',       type: 'select', options: PRIORITY_OPTIONS },
    ],
    tableFields: ['idea', 'category', 'importance']
  },

  ideasResearch: {
    title: 'Ideas to Research',
    dataKey: 'ideasResearch',
    viewType: 'table',
    fields: [
      { key: 'topic',    label: 'Research Topic', type: 'text', required: true },
      { key: 'priority', label: 'Priority',       type: 'select', options: PRIORITY_OPTIONS },
      { key: 'status',   label: 'Status',         type: 'select', options: ['Pending', 'In Progress', 'Completed'] },
      { key: 'source',   label: 'Source / Link',  type: 'text' },
    ],
    tableFields: ['topic', 'priority', 'status', 'source']
  },

  philosophyIdeas: {
    title: 'Philosophy',
    dataKey: 'philosophyIdeas',
    viewType: 'table',
    fields: [
      { key: 'concept',     label: 'Concept',     type: 'text', required: true },
      { key: 'philosopher', label: 'Philosopher', type: 'text' },
      { key: 'school',      label: 'School of Thought', type: 'text' },
      { key: 'notes',       label: 'Reflection',  type: 'textarea', tableVisible: true },
    ],
    tableFields: ['concept', 'philosopher', 'school', 'notes']
  },

  artFigures: {
    title: 'Art Figures',
    dataKey: 'artFigures',
    viewType: 'table',
    fields: [
      { key: 'artist', label: 'Artist Name', type: 'text', required: true },
      { key: 'field',  label: 'Artistic Field', type: 'text' },
      { key: 'era',    label: 'Era / Movement', type: 'text' },
    ],
    tableFields: ['artist', 'field', 'era']
  },

  contentPlanner: {
    title: 'Content Planner',
    dataKey: 'contentPlanner',
    viewType: 'table',
    fields: [
      { key: 'title',    label: 'Content Title', type: 'text', required: true },
      { key: 'platform', label: 'Platform',      type: 'select', options: ['Substack', 'LinkedIn', 'YouTube', 'Twitter/X', 'Blog'] },
      { key: 'status',   label: 'Status',        type: 'select', options: ['Idea', 'Drafting', 'Scheduled', 'Published'] },
      { key: 'date',     label: 'Publish Date',  type: 'date' },
    ],
    tableFields: ['title', 'platform', 'status', 'date']
  },

  substackIdeas: {
    title: 'Substack Ideas',
    dataKey: 'substackIdeas',
    viewType: 'table',
    fields: [
      { key: 'title',    label: 'Post Title', type: 'text', required: true },
      { key: 'topic',    label: 'Topic',      type: 'text' },
      { key: 'priority', label: 'Priority',   type: 'select', options: PRIORITY_OPTIONS },
      { key: 'status',   label: 'Status',     type: 'select', options: ['Idea', 'Drafting', 'Published'] },
    ],
    tableFields: ['title', 'topic', 'priority', 'status']
  },

  substackReads: {
    title: 'Substack Reads',
    dataKey: 'substackReads',
    viewType: 'table',
    fields: [
      { key: 'title',  label: 'Article Title', type: 'text', required: true },
      { key: 'author', label: 'Author / Substack', type: 'text' },
      { key: 'url',    label: 'Article Link', type: 'text' },
      { key: 'status', label: 'Status',       type: 'select', options: ['To Read', 'Reading', 'Completed'] },
    ],
    tableFields: ['title', 'author', 'url', 'status']
  },

  journalingIdeas: {
    title: 'Journal Prompts',
    dataKey: 'journalingIdeas',
    viewType: 'table',
    fields: [
      { key: 'prompt',   label: 'Journal Prompt', type: 'textarea', required: true },
      { key: 'category', label: 'Category',       type: 'text' },
    ],
    tableFields: ['prompt', 'category']
  },

  reflectionJournal: {
    title: 'Reflection Journal',
    dataKey: 'reflectionJournal',
    viewType: 'table',
    fields: [
      { key: 'date',       label: 'Date',       type: 'date', required: true },
      { key: 'mood',       label: 'Mood',       type: 'select', options: ['Energized', 'Focused', 'Calm', 'Tired', 'Inspired', 'Grateful'] },
      { key: 'reflection', label: 'Reflection', type: 'textarea', required: true },
      { key: 'gratitude',  label: 'Gratitude List', type: 'textarea', tableVisible: false },
    ],
    tableFields: ['date', 'mood', 'reflection']
  },

  decisionJournal: {
    title: 'Decision Journal',
    dataKey: 'decisionJournal',
    viewType: 'table',
    fields: [
      { key: 'date',      label: 'Date',       type: 'date', required: true },
      { key: 'decision',  label: 'Decision Made', type: 'text', required: true },
      { key: 'rationale', label: 'Rationale',  type: 'textarea' },
      { key: 'outcome',   label: 'Actual Outcome', type: 'text' },
    ],
    tableFields: ['date', 'decision', 'rationale', 'outcome']
  }
};
