import { Outlet, NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import {
  Shield,
  Users,
  FileText,
  Sparkles,
  LayoutTemplate,
  Terminal,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Search,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { label: 'Admin Dashboard', icon: Shield,         to: '/admin' },
  { label: 'User Operations', icon: Users,          to: '/admin/users' },
  { label: 'Resume Audits',   icon: FileText,       to: '/admin/resumes' },
  { label: 'AI Operations',   icon: Sparkles,       to: '/admin/ai' },
  { label: 'Template Engine', icon: LayoutTemplate, to: '/admin/templates' },
  { label: 'System Logs',     icon: Terminal,       to: '/admin/logs' },
  { label: 'Global Settings', icon: Settings,       to: '/admin/settings' },
];

export default function AdminLayout() {
  const { theme, setTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* ── Sidebar ── */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        className="relative z-20 flex flex-col h-full bg-sidebar-bg border-r border-border transition-all duration-300"
      >
        <div className="flex h-20 items-center justify-between px-4 pt-4">
          <div className={cn("flex items-center gap-3 overflow-hidden whitespace-nowrap", collapsed && "justify-center w-full")}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive text-white shadow-lg">
              <Shield className="h-5 w-5" />
            </div>
            {!collapsed && <span className="text-xl font-bold text-white tracking-tight">AdminPanel</span>}
          </div>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-foreground hover:shadow-md transition-all"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        <div className="flex-1 overflow-y-auto py-6 px-3">
          <nav className="flex flex-col gap-2">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) => cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-destructive text-white shadow-md shadow-destructive/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", !collapsed && "group-hover:scale-110 transition-transform")} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className={cn(
              "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 hover:bg-destructive/10 hover:text-destructive transition-all",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Exit Admin</span>}
          </button>
        </div>
      </motion.aside>

      {/* ── Main Panel ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight">System Control Console</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition-colors shadow-sm"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <div className="h-8 w-[1px] bg-border mx-1" />

            <div className="flex items-center gap-3">
              <img
                src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=ef4444&color=fff`}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="hidden md:flex flex-col items-start text-sm">
                <span className="font-medium leading-none">{user?.name || 'Console Admin'}</span>
                <span className="text-xs text-red-500 font-semibold mt-1">Superuser</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
