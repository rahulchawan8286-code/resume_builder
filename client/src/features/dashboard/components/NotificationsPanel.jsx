import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle2, Sparkles, User, FileDown } from 'lucide-react';

const notifications = [
  { id: '1', type: 'save',    title: 'Resume autosaved',           desc: '2 minutes ago',    read: false, icon: CheckCircle2, color: '#10b981' },
  { id: '2', type: 'ai',     title: 'AI Suggestion Ready',         desc: 'Career objective improved', read: false, icon: Sparkles,  color: '#ec4899' },
  { id: '3', type: 'export', title: 'PDF Export Complete',          desc: 'Full Stack Dev Resume.pdf', read: true,  icon: FileDown,  color: '#6366f1' },
  { id: '4', type: 'profile',title: 'Complete your profile',        desc: '26% remaining for 100%',   read: true,  icon: User,      color: '#f59e0b' },
];

export default function NotificationsPanel() {
  const [items, setItems] = useState(notifications);
  const unread = items.filter((n) => !n.read).length;

  const dismiss = (id) => setItems((prev) => prev.filter((n) => n.id !== id));
  const markRead = (id) => setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <h3 className="text-sm font-bold">Notifications</h3>
          {unread > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </div>
        <button
          onClick={() => setItems((p) => p.map((n) => ({ ...n, read: true })))}
          className="text-xs text-primary hover:underline"
        >
          Mark all read
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {items.map((notif) => {
            const Icon = notif.icon;
            return (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => markRead(notif.id)}
                className={`group flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                  notif.read ? 'border-border bg-transparent' : 'border-primary/20 bg-primary/5'
                }`}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${notif.color}18` }}
                >
                  <Icon className="h-4 w-4" style={{ color: notif.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${notif.read ? 'text-foreground' : 'text-foreground'}`}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{notif.desc}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {items.length === 0 && (
          <p className="py-6 text-center text-xs text-muted-foreground">All caught up! 🎉</p>
        )}
      </div>
    </div>
  );
}
