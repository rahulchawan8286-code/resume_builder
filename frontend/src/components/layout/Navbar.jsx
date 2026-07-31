import React from 'react';
import { useThemeStore } from '../../store/themeStore';
import { THEME } from '../../constants/theme';
import { Search, Sun, Moon, Bell, Menu, ChevronRight } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <Menu size={20} />
        </button>
        
        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
          {pathnames.map((value, index) => {
            const isLast = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            return (
              <React.Fragment key={to}>
                <ChevronRight size={16} className="mx-1" />
                {isLast ? (
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{value.replace('-', ' ')}</span>
                ) : (
                  <Link to={to} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors capitalize">
                    {value.replace('-', ' ')}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-transparent rounded-full focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-64 dark:text-white"
          />
        </div>

        {/* Action Buttons */}
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
          {theme === THEME.DARK ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
        </button>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 shadow-md">
          RC
        </div>
      </div>
    </header>
  );
}