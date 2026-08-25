import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { Bell, Moon, Sun, Search, Menu } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

export default function Topbar() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { toggleSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-6 lg:px-8">
      {/* Left side: Mobile menu & Breadcrumbs/Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">Here is what's happening with your resumes today.</p>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-3 sm:gap-5">
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition-colors shadow-sm">
          <Search className="h-4 w-4" />
        </button>
        
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition-colors shadow-sm">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
        </button>

        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition-colors shadow-sm"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="h-8 w-[1px] bg-border mx-1" />

        {/* Profile Dropdown Trigger */}
        <button className="flex items-center gap-3 p-1 pr-3 rounded-full border border-border bg-card hover:bg-muted transition-colors shadow-sm">
          <img 
            src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
            alt="Profile" 
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="hidden md:flex flex-col items-start text-sm">
            <span className="font-medium leading-none">{user?.name || 'My Account'}</span>
            <span className="text-xs text-muted-foreground mt-1">{user?.role || 'Free Plan'}</span>
          </div>
        </button>
      </div>
    </header>
  );
}
