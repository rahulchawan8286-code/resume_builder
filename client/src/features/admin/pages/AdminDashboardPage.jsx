import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  FileText,
  Sparkles,
  Download,
  HardDrive,
  CreditCard,
  Activity
} from 'lucide-react';
import { mockAdminStats, mockGrowthData } from '../data/mockAdminData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const ICON_MAP = { Users, UserCheck, FileText, Sparkles, Download, HardDrive, CreditCard, Activity };

function StatCard({ stat, index }) {
  const Icon = ICON_MAP[stat.icon] || Users;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="relative rounded-2xl border border-border bg-card p-5 overflow-hidden transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${stat.color}15` }}
        >
          <Icon className="h-5 w-5" style={{ color: stat.color }} />
        </div>
        {stat.trend !== 0 && (
          <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400">
            ↑ +{stat.trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <span className="text-2xl font-extrabold tracking-tight">{stat.value}</span>
        <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
      </div>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Console Overview</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Real-time SaaS operational indicators.</p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {mockAdminStats.map((s, i) => (
          <StatCard key={s.label} stat={s} index={i} />
        ))}
      </div>

      {/* Growth Chart */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-bold mb-4">SaaS Platform Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockGrowthData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorResumes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="users" stroke="#6366f1" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
            <Area type="monotone" dataKey="resumes" stroke="#3b82f6" fillOpacity={1} fill="url(#colorResumes)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
