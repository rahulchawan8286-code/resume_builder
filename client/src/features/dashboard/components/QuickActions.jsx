import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FilePlus, Copy, ImageUp, Sparkles, FileDown } from 'lucide-react';

const actions = [
  { label: 'New Resume',      icon: FilePlus,  to: '/resumes/new', color: '#6366f1', desc: 'Start from scratch' },
  { label: 'Duplicate',       icon: Copy,      to: '/dashboard',   color: '#10b981', desc: 'Clone an existing one' },
  { label: 'Upload Photo',    icon: ImageUp,   to: '/profile',     color: '#3b82f6', desc: 'Update your avatar' },
  { label: 'AI Assistant',    icon: Sparkles,  to: '/dashboard',   color: '#ec4899', desc: 'Generate content with AI' },
  { label: 'Export PDF',      icon: FileDown,  to: '/dashboard',   color: '#f59e0b', desc: 'Download your latest resume' },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link
                to={action.to}
                className="group flex items-center gap-3 rounded-xl border border-border p-3 hover:border-primary/40 hover:bg-muted/50 transition-all duration-200"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <Icon className="h-4 w-4" style={{ color: action.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
