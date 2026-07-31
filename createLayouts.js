const fs = require('fs');
const path = require('path');

const files = {
  "frontend/src/components/ui/Card.jsx": `
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ className, children, ...props }) {
  return (
    <div className={twMerge(clsx("bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 backdrop-blur-md bg-opacity-90 dark:bg-opacity-80 transition-all hover:shadow-md", className))} {...props}>
      {children}
    </div>
  );
}
  `,
  "frontend/src/components/ui/Button.jsx": `
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ className, variant = 'primary', size = 'md', children, ...props }) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
    outline: "border-2 border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 text-gray-900 dark:text-gray-100",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button className={twMerge(clsx(baseClasses, variants[variant], sizes[size], className))} {...props}>
      {children}
    </button>
  );
}
  `,
  "frontend/src/components/ui/Skeleton.jsx": `
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Skeleton({ className, ...props }) {
  return (
    <div className={twMerge(clsx("animate-pulse rounded-md bg-gray-200 dark:bg-gray-800", className))} {...props} />
  );
}
  `,
  "frontend/src/components/layout/Sidebar.jsx": `
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../../constants/routes';
import { 
  LayoutDashboard, Brain, Cpu, Code2, Building2, 
  FileText, Bot, TrendingUp, Bookmark, User, Settings, ShieldAlert, X
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
  const { user } = useAuthStore();
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
                className={({ isActive }) => \`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 \${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}\`}
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
              className={({ isActive }) => \`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 \${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}\`}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          ))}
          
          {isAdmin && (
             <NavLink
             to={ROUTES.ADMIN}
             className={({ isActive }) => \`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 \${isActive ? 'bg-red-600 text-white shadow-md shadow-red-200 dark:shadow-none' : 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'}\`}
           >
             <ShieldAlert size={20} />
             <span className="font-medium text-sm">Admin</span>
           </NavLink>
          )}
        </div>
      </motion.aside>
    </>
  );
}
  `,
  "frontend/src/components/layout/Navbar.jsx": `
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
            const to = \`/\${pathnames.slice(0, index + 1).join('/')}\`;
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
  `,
  "frontend/src/layouts/DashboardLayout.jsx": `
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location]);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#09090b] text-gray-900 dark:text-gray-100 font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="flex-1 p-6 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
  `,
  "frontend/src/layouts/AuthLayout.jsx": `
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
  `,
  "frontend/src/pages/Dashboard.jsx": `
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Brain, Cpu, TrendingUp, Trophy, ArrowRight, BookOpen, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 70 },
  { name: 'Wed', score: 68 },
  { name: 'Thu', score: 85 },
  { name: 'Fri', score: 82 },
  { name: 'Sat', score: 90 },
  { name: 'Sun', score: 95 },
];

export default function Dashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="relative rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Rahul! 👋</h1>
          <p className="text-indigo-100 text-lg mb-6">Your placement readiness score has increased by 5% this week. Keep up the great work!</p>
          <div className="flex gap-4">
            <Button className="bg-white text-indigo-600 hover:bg-gray-50">Continue Learning</Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 dark:text-white dark:border-white/30">Take Mock Test</Button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Readiness Score', value: '82%', icon: Target, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { title: 'Study Streak', value: '14 Days', icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
          { title: 'Tests Completed', value: '28', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
          { title: 'Subject Mastery', value: '4/8', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
        ].map((stat, i) => (
          <Card key={i} className="flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
            <div className={\`p-3 rounded-2xl \${stat.bg}\`}>
              <stat.icon className={\`\${stat.color}\`} size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-500" />
                Performance Analytics
              </h2>
              <select className="bg-gray-50 dark:bg-gray-800 border-none text-sm rounded-lg py-1 px-3 text-gray-600 dark:text-gray-300">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '3 3'}}
                  />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Upcoming Tasks & Recommendations */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upcoming Goals</h2>
            <div className="space-y-4">
              {[
                { title: 'Digital Electronics Mock Test', time: 'Today, 6:00 PM', type: 'Test' },
                { title: 'Complete Intel Roadmap', time: 'Tomorrow', type: 'Prep' },
                { title: 'Update Resume Skills', time: 'In 2 days', type: 'Task' }
              ].map((task, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{task.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">AI Suggestion</h2>
              <Brain className="text-indigo-500" size={20} />
            </div>
            <p className="text-sm text-indigo-800/80 dark:text-indigo-200/80 mb-4 leading-relaxed">
              Based on your recent tests, you are struggling with <strong>Analog Electronics</strong>. Try reviewing Op-Amps before your next mock test.
            </p>
            <Button size="sm" variant="outline" className="w-full justify-between border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
              Review Notes <ArrowRight size={16} />
            </Button>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
  `,
  "frontend/src/routes/index.jsx": `
import { createBrowserRouter } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { ROUTES } from '../constants/routes';

// Layouts
const MainLayout = lazy(() => import('../layouts/DashboardLayout'));
const AuthLayout = lazy(() => import('../layouts/AuthLayout'));

// Lazy load pages
const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Aptitude = lazy(() => import('../pages/Aptitude'));
const CoreECE = lazy(() => import('../pages/CoreECE'));
const Coding = lazy(() => import('../pages/Coding'));
const Companies = lazy(() => import('../pages/Companies'));
const ResumeBuilder = lazy(() => import('../pages/ResumeBuilder'));
const AIAssistant = lazy(() => import('../pages/AIAssistant'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Admin = lazy(() => import('../pages/Admin'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Premium loading skeleton
const Loader = () => (
  <div className="flex h-screen items-center justify-center bg-[#f8fafc] dark:bg-[#09090b]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: ROUTES.LANDING,
    element: <Suspense fallback={<Loader />}><Landing /></Suspense>,
    errorElement: <ErrorBoundary />,
  },
  {
    element: <Suspense fallback={<Loader />}><AuthLayout /></Suspense>,
    errorElement: <ErrorBoundary />,
    children: [
      { path: ROUTES.LOGIN, element: <Login /> },
      { path: ROUTES.REGISTER, element: <Register /> },
    ]
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <Suspense fallback={<Loader />}><MainLayout /></Suspense>,
        children: [
          { path: ROUTES.DASHBOARD, element: <Suspense fallback={<Loader />}><Dashboard /></Suspense> },
          { path: ROUTES.APTITUDE, element: <Suspense fallback={<Loader />}><Aptitude /></Suspense> },
          { path: ROUTES.CORE_ECE, element: <Suspense fallback={<Loader />}><CoreECE /></Suspense> },
          { path: ROUTES.CODING, element: <Suspense fallback={<Loader />}><Coding /></Suspense> },
          { path: ROUTES.COMPANIES, element: <Suspense fallback={<Loader />}><Companies /></Suspense> },
          { path: ROUTES.RESUME_BUILDER, element: <Suspense fallback={<Loader />}><ResumeBuilder /></Suspense> },
          { path: ROUTES.AI_ASSISTANT, element: <Suspense fallback={<Loader />}><AIAssistant /></Suspense> },
          { path: ROUTES.PROFILE, element: <Suspense fallback={<Loader />}><Profile /></Suspense> },
          { path: ROUTES.SETTINGS, element: <Suspense fallback={<Loader />}><Settings /></Suspense> },
        ]
      }
    ],
  },
  {
    element: <AdminRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <Suspense fallback={<Loader />}><MainLayout /></Suspense>,
        children: [
          { path: ROUTES.ADMIN, element: <Suspense fallback={<Loader />}><Admin /></Suspense> },
        ]
      }
    ],
  },
  {
    path: '*',
    element: <Suspense fallback={<Loader />}><NotFound /></Suspense>,
  }
]);
  `
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.resolve(__dirname, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
});
console.log('Successfully created all Layout System files.');
