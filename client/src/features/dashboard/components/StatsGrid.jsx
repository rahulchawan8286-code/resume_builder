import { motion } from 'framer-motion';
import {
  FileText, Globe, PenLine, Archive,
  Download, Target, Sparkles, LayoutTemplate
} from 'lucide-react';
import { mockStats } from '../data/mockData';

const ICON_MAP = { FileText, Globe, PenLine, Archive, Download, Target, Sparkles, LayoutTemplate };

function AnimatedNumber({ value }) {
  const isNumeric = typeof value === 'number';
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-3xl font-extrabold tracking-tight"
    >
      {value}
    </motion.span>
  );
}

function StatCard({ stat, index }) {
  const Icon = ICON_MAP[stat.icon] || FileText;
  const isPositive = stat.trend > 0;
  const isNeutral  = stat.trend === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -3, boxShadow: `0 12px 40px ${stat.color}22` }}
      className="group relative rounded-2xl border border-border bg-card p-5 overflow-hidden cursor-default transition-all duration-300"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${stat.color}, transparent)` }} />

      {/* Glow orb on hover */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
        style={{ backgroundColor: stat.color }}
      />

      <div className="flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${stat.color}18` }}
        >
          <Icon className="h-5 w-5" style={{ color: stat.color }} />
        </div>

        {/* Trend badge */}
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
          isNeutral  ? 'bg-muted text-muted-foreground' :
          isPositive ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                       'bg-red-500/10 text-red-600 dark:text-red-400'
        }`}>
          {isNeutral ? '—' : isPositive ? `↑ +${stat.trend}` : `↓ ${stat.trend}`}
        </span>
      </div>

      <div className="mt-4">
        <AnimatedNumber value={stat.value} />
        <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
      </div>
    </motion.div>
  );
}

export default function StatsGrid() {
  return (
    <div className="col-span-full grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {mockStats.map((stat, i) => (
        <StatCard key={stat.label} stat={stat} index={i} />
      ))}
    </div>
  );
}
