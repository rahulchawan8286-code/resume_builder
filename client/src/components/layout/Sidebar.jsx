import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  FileText,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'My Resumes', href: '/resumes' },
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: CreditCard, label: 'Billing', href: '/billing' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { logout } = useAuthStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 260 : 80 }}
      className="relative z-20 flex flex-col h-full bg-sidebar-bg border-r border-border transition-all duration-300"
    >
      {/* Logo Area */}
      <div className="flex h-20 items-center justify-between px-4 pt-4">
        <div className={cn("flex items-center gap-3 overflow-hidden whitespace-nowrap transition-all", !sidebarOpen && "justify-center w-full")}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-primary">
            <span className="text-lg font-black text-white">AI</span>
          </div>
          {sidebarOpen && (
            <span className="text-xl font-bold text-white tracking-tight">ResumeAI</span>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-foreground hover:shadow-md transition-all"
      >
        {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => cn(
                "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", !sidebarOpen && "mx-auto")} />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className={cn(
            "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 hover:bg-destructive/10 hover:text-destructive transition-all",
            !sidebarOpen && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
