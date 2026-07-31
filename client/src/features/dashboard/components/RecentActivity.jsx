import { motion } from 'framer-motion';
import { mockRecentActivity } from '../data/mockData';
import { FileText, Download, Sparkles, PenLine, User, Target } from 'lucide-react';

const ICON_MAP = {
  created:  { icon: FileText, bg: '#6366f1' },
  exported: { icon: Download, bg: '#10b981' },
  ai:       { icon: Sparkles, bg: '#ec4899' },
  updated:  { icon: PenLine,  bg: '#f59e0b' },
  profile:  { icon: User,     bg: '#3b82f6' },
  ats:      { icon: Target,   bg: '#8b5cf6' },
};

export default function RecentActivity() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold">Recent Activity</h3>
        <button className="text-xs text-primary hover:underline">View all</button>
      </div>

      <div className="relative space-y-4">
        {/* Vertical timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

        {mockRecentActivity.map((item, i) => {
          const config = ICON_MAP[item.type] || ICON_MAP.updated;
          const Icon = config.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              className="relative flex items-start gap-4 pl-10"
            >
              {/* Dot icon */}
              <div
                className="absolute left-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm"
                style={{ backgroundColor: `${config.bg}18`, border: `1.5px solid ${config.bg}40` }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color: config.bg }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
