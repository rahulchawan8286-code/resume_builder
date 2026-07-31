// Mock data – in production replace each function with a real API/TanStack Query call

export const mockUser = {
  name: 'Rahul Chavan',
  email: 'rahul@example.com',
  profilePhoto: '',
  plan: 'Free',
  aiCredits: 28,
  profileCompletion: 74,
  lastLogin: '2026-07-23T10:00:00Z',
};

export const mockStats = [
  { label: 'Total Resumes',    value: 6,   icon: 'FileText',  trend: +2,  color: '#6366f1' },
  { label: 'Published',        value: 3,   icon: 'Globe',     trend: +1,  color: '#10b981' },
  { label: 'Drafts',           value: 2,   icon: 'PenLine',   trend:  0,  color: '#f59e0b' },
  { label: 'Archived',         value: 1,   icon: 'Archive',   trend: -1,  color: '#6b7280' },
  { label: 'PDF Downloads',    value: 14,  icon: 'Download',  trend: +5,  color: '#3b82f6' },
  { label: 'ATS Avg Score',    value: '82%', icon: 'Target', trend: +3,  color: '#8b5cf6' },
  { label: 'AI Uses (Month)',  value: 22,  icon: 'Sparkles',  trend: +8,  color: '#ec4899' },
  { label: 'Saved Templates',  value: 4,   icon: 'LayoutTemplate', trend: +1, color: '#14b8a6' },
];

export const mockActivity30Days = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  updates: Math.floor(Math.random() * 5),
  exports: Math.floor(Math.random() * 3),
  aiUses:  Math.floor(Math.random() * 4),
}));

export const mockAtsHistory = [
  { week: 'Week 1', score: 58 },
  { week: 'Week 2', score: 65 },
  { week: 'Week 3', score: 71 },
  { week: 'Week 4', score: 78 },
  { week: 'Week 5', score: 82 },
];

export const mockRecentActivity = [
  { id: '1', type: 'created',  label: 'Created "Full Stack Developer Resume"',   time: '2h ago',  color: '#6366f1' },
  { id: '2', type: 'exported', label: 'Exported "Frontend Dev Resume" as PDF',    time: '5h ago',  color: '#10b981' },
  { id: '3', type: 'ai',       label: 'AI generated Career Objective',            time: '1d ago',  color: '#ec4899' },
  { id: '4', type: 'updated',  label: 'Updated Work Experience section',          time: '2d ago',  color: '#f59e0b' },
  { id: '5', type: 'profile',  label: 'Profile photo uploaded',                   time: '3d ago',  color: '#3b82f6' },
  { id: '6', type: 'ats',      label: 'ATS Analysis – scored 82/100',             time: '4d ago',  color: '#8b5cf6' },
];

export const mockResumes = [
  { id: '1', title: 'Full Stack Developer Resume', status: 'published', atsScore: 82, lastUpdated: '2h ago',  template: 'Modern' },
  { id: '2', title: 'Frontend Dev Resume',         status: 'published', atsScore: 78, lastUpdated: '5h ago',  template: 'Classic' },
  { id: '3', title: 'ML Engineer Resume',          status: 'draft',     atsScore: 61, lastUpdated: '1d ago',  template: 'Minimal' },
  { id: '4', title: 'Internship Application',      status: 'draft',     atsScore: 70, lastUpdated: '3d ago',  template: 'Modern' },
  { id: '5', title: 'Open Source Contributor',     status: 'archived',  atsScore: 55, lastUpdated: '1w ago',  template: 'Classic' },
];
