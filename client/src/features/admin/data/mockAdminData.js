export const mockAdminStats = [
  { label: 'Total Users', value: '4,820', icon: 'Users', trend: +12.4, color: '#6366f1' },
  { label: 'Active Users (24h)', value: '1,248', icon: 'UserCheck', trend: +8.2, color: '#10b981' },
  { label: 'Total Resumes', value: '12,408', icon: 'FileText', trend: +15.1, color: '#3b82f6' },
  { label: 'AI Gen Requests', value: '45,820', icon: 'Sparkles', trend: +24.8, color: '#ec4899' },
  { label: 'PDF Exports', value: '8,924', icon: 'Download', trend: +18.3, color: '#f59e0b' },
  { label: 'Cloudinary Usage', value: '4.8 GB / 10 GB', icon: 'HardDrive', trend: 0, color: '#14b8a6' },
  { label: 'Monthly Revenue', value: '$8,420', icon: 'CreditCard', trend: +9.2, color: '#8b5cf6' },
  { label: 'System Health', value: '99.98%', icon: 'Activity', trend: 0, color: '#10b981' },
];

export const mockAdminUsers = [
  { id: '1', name: 'Ananya Sharma', email: 'ananya@example.com', role: 'user', status: 'active', resumes: 4, joined: '2026-06-15' },
  { id: '2', name: 'B Rahul Chavan', email: 'rahul@example.com', role: 'admin', status: 'active', resumes: 6, joined: '2026-05-10' },
  { id: '3', name: 'John Doe', email: 'john@example.com', role: 'user', status: 'suspended', resumes: 1, joined: '2026-07-01' },
  { id: '4', name: 'Sarah Connor', email: 'sarah@example.com', role: 'user', status: 'active', resumes: 3, joined: '2026-06-28' },
  { id: '5', name: 'Bruce Wayne', email: 'bruce@wayne.com', role: 'user', status: 'active', resumes: 5, joined: '2026-04-12' },
];

export const mockAdminResumes = [
  { id: 'r1', title: 'Senior React Developer Resume', user: 'Ananya Sharma', status: 'published', template: 'Modern', downloads: 12, score: 85 },
  { id: 'r2', title: 'ML Engineer CV', user: 'B Rahul Chavan', status: 'draft', template: 'Classic', downloads: 0, score: 62 },
  { id: 'r3', title: 'Inappropriate Content Resume', user: 'Spammer Bob', status: 'published', template: 'Minimal', downloads: 1, score: 40 },
  { id: 'r4', title: 'Financial Analyst resume', user: 'Sarah Connor', status: 'archived', template: 'Modern', downloads: 4, score: 78 },
];

export const mockAdminAiStats = {
  requests: '45,820',
  tokens: '124.8M',
  responseTime: '480ms',
  cacheHitRate: '42.6%',
  failedRequests: '0.12%',
};

export const mockAdminTemplates = [
  { id: 't1', name: 'Modern Indigo', category: 'Professional', status: 'published', uses: 8400 },
  { id: 't2', name: 'Classic Serif', category: 'Executive', status: 'published', uses: 3200 },
  { id: 't3', name: 'Minimal Stark', category: 'Creative', status: 'draft', uses: 120 },
];

export const mockAdminLogs = [
  { id: 'l1', timestamp: '2026-07-23T11:45:00Z', type: 'auth', message: 'User rahul@example.com successfully logged in (IP: 192.168.1.10)', status: 'success' },
  { id: 'l2', timestamp: '2026-07-23T11:44:12Z', type: 'ai', message: 'AI objective generation success for User ananya@example.com (480ms)', status: 'success' },
  { id: 'l3', timestamp: '2026-07-23T11:42:01Z', type: 'error', message: 'PDF Generation Timeout Error: Puppeteer networkidle0 failed', status: 'failed' },
  { id: 'l4', timestamp: '2026-07-23T11:39:50Z', type: 'upload', message: 'Profile photo uploaded successfully to folder users/profile-photos/', status: 'success' },
  { id: 'l5', timestamp: '2026-07-23T11:30:11Z', type: 'admin', message: 'Admin rahul@example.com suspended user Spammer Bob', status: 'success' },
];

export const mockGrowthData = [
  { month: 'Feb', users: 1200, resumes: 3100 },
  { month: 'Mar', users: 1900, resumes: 4800 },
  { month: 'Apr', users: 2800, resumes: 7200 },
  { month: 'May', users: 3700, resumes: 9600 },
  { month: 'Jun', users: 4820, resumes: 12408 },
];
