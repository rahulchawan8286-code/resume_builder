import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { mockActivity30Days, mockAtsHistory } from '../data/mockData';
import { motion } from 'framer-motion';

const CHART_COLORS = {
  updates: '#6366f1',
  exports: '#10b981',
  aiUses:  '#ec4899',
  score:   '#8b5cf6',
};

function ChartCard({ title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <div className="mb-4">
        <h3 className="text-sm font-bold">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-lg text-xs">
      <p className="font-semibold mb-1.5">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="flex gap-2">
          <span className="capitalize">{p.dataKey}:</span>
          <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

// Last 14 data points to keep the chart clean
const recentActivity = mockActivity30Days.slice(-14);

export function ActivityChart() {
  return (
    <ChartCard title="Resume Activity" subtitle="Last 14 days — updates, exports & AI usage">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={recentActivity} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
          <defs>
            {Object.entries(CHART_COLORS).slice(0, 3).map(([key, color]) => (
              <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={2} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Area type="monotone" dataKey="updates" stroke={CHART_COLORS.updates} fill={`url(#grad-updates)`} strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="exports" stroke={CHART_COLORS.exports} fill={`url(#grad-exports)`} strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="aiUses"  stroke={CHART_COLORS.aiUses}  fill={`url(#grad-aiUses)`}  strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function AtsScoreChart() {
  return (
    <ChartCard title="ATS Score Trend" subtitle="Your resume score over the last 5 weeks">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={mockAtsHistory} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="week" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis domain={[40, 100]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke={CHART_COLORS.score}
            strokeWidth={2.5}
            dot={{ r: 4, fill: CHART_COLORS.score, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
