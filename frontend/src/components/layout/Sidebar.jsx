import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../../constants/routes';
import { 
  LayoutDashboard, Brain, Cpu, Code2, Building2, 
  FileText, Bot, TrendingUp, Bookmark, User, Settings, ShieldAlert, X, LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const menuItems = [
  { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: 'Aptitude', path: ROUTES.APTITUDE, icon: Brain },
  { name: 'Core ECE', path: ROUTES.CORE_ECE, icon: Cpu },
  { name: 'Coding Practice', path: ROUTES.CODING, icon: Code2 },
  { name: 'Company Roadmaps', path: ROUTES.COMPANIES, icon: Building2 },
  { name: 'Resume Builder', path: ROUTES.RESUME_BUILDER, icon: FileText },
  { name: 'AI Assistant', path: ROUTES.AI_ASSISTANT, icon: Bot },
  { name: 'Progress Analytics', path: ROUTES.PROFILE, icon: TrendingUp }, // Temporary path
  { name: 'Bookmarks', path: ROUTES.PROFILE, icon: Bookmark }, // Temporary path
];

const bottomItems = [
  { name: 'Profile', path: ROUTES.PROFILE, icon: User },
  { name: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
];

export function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between p-4 overflow-y-auto"
      >
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              ECE Compass
            </span>
            <button onClick={onClose} className="lg:hidden p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <item.icon size={20} />
                <span className="font-medium text-sm">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-8 space-y-1">
          {bottomItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          ))}
          
          {isAdmin && (
             <NavLink
             to={ROUTES.ADMIN}
             className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-red-600 text-white shadow-md shadow-red-200 dark:shadow-none' : 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
           >
             <ShieldAlert size={20} />
             <span className="font-medium text-sm">Admin</span>
           </NavLink>
          )}

          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}