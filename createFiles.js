const fs = require('fs');
const path = require('path');

const files = {
  "frontend/src/constants/api.js": `
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  USER: {
    PROFILE: '/users/profile',
  }
};
  `,
  "frontend/src/constants/routes.js": `
export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  APTITUDE: '/aptitude',
  CORE_ECE: '/core-ece',
  CODING: '/coding',
  COMPANIES: '/companies',
  RESUME_BUILDER: '/resume-builder',
  AI_ASSISTANT: '/ai-assistant',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ADMIN: '/admin',
};
  `,
  "frontend/src/constants/storage.js": `
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ece_access_token',
  REFRESH_TOKEN: 'ece_refresh_token',
  THEME: 'ece_theme',
};
  `,
  "frontend/src/constants/theme.js": `
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};
  `,
  "frontend/src/utils/storageHelper.js": `
export const storageHelper = {
  get: (key) => localStorage.getItem(key),
  set: (key, value) => localStorage.setItem(key, value),
  remove: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
};
  `,
  "frontend/src/utils/tokenHelper.js": `
import { storageHelper } from './storageHelper';
import { STORAGE_KEYS } from '../constants/storage';

export const tokenHelper = {
  getAccessToken: () => storageHelper.get(STORAGE_KEYS.ACCESS_TOKEN),
  setAccessToken: (token) => storageHelper.set(STORAGE_KEYS.ACCESS_TOKEN, token),
  getRefreshToken: () => storageHelper.get(STORAGE_KEYS.REFRESH_TOKEN),
  setRefreshToken: (token) => storageHelper.set(STORAGE_KEYS.REFRESH_TOKEN, token),
  clearTokens: () => {
    storageHelper.remove(STORAGE_KEYS.ACCESS_TOKEN);
    storageHelper.remove(STORAGE_KEYS.REFRESH_TOKEN);
  }
};
  `,
  "frontend/src/utils/validationHelper.js": `
export const validationHelper = {
  isEmail: (email) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email),
  isStrongPassword: (password) => password.length >= 8,
};
  `,
  "frontend/src/utils/dateHelper.js": `
import dayjs from 'dayjs';
export const dateHelper = {
  format: (date, formatStr = 'YYYY-MM-DD') => dayjs(date).format(formatStr),
};
  `,
  "frontend/src/utils/formatHelper.js": `
export const formatHelper = {
  currency: (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount),
};
  `,
  "frontend/src/api/apiClient.js": `
import axios from 'axios';
import { tokenHelper } from '../utils/tokenHelper';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const token = tokenHelper.getAccessToken();
  if (token) {
    config.headers.Authorization = \\\`Bearer \\\${token}\\\`;
  }
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use((response) => response, async (error) => {
  const originalRequest = error.config;
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const refreshToken = tokenHelper.getRefreshToken();
      const res = await axios.post(\\\`\\\${apiClient.defaults.baseURL}/auth/refresh\\\`, { token: refreshToken });
      if (res.data.accessToken) {
        tokenHelper.setAccessToken(res.data.accessToken);
        originalRequest.headers.Authorization = \\\`Bearer \\\${res.data.accessToken}\\\`;
        return apiClient(originalRequest);
      }
    } catch (refreshError) {
      tokenHelper.clearTokens();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
});
  `,
  "frontend/src/store/authStore.js": `
import { create } from 'zustand';
import { tokenHelper } from '../utils/tokenHelper';

export const useAuthStore = create((set) => ({
  isAuthenticated: !!tokenHelper.getAccessToken(),
  user: null,
  login: (token, user) => {
    tokenHelper.setAccessToken(token);
    set({ isAuthenticated: true, user });
  },
  logout: () => {
    tokenHelper.clearTokens();
    set({ isAuthenticated: false, user: null });
  },
}));
  `,
  "frontend/src/store/themeStore.js": `
import { create } from 'zustand';
import { storageHelper } from '../utils/storageHelper';
import { STORAGE_KEYS } from '../constants/storage';
import { THEME } from '../constants/theme';

export const useThemeStore = create((set) => ({
  theme: storageHelper.get(STORAGE_KEYS.THEME) || THEME.LIGHT,
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
    storageHelper.set(STORAGE_KEYS.THEME, newTheme);
    return { theme: newTheme };
  }),
}));
  `,
  "frontend/src/store/userStore.js": `
import { create } from 'zustand';
export const useUserStore = create((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));
  `,
  "frontend/src/store/notificationStore.js": `
import { create } from 'zustand';
export const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (notification) => set((state) => ({ notifications: [...state.notifications, notification] })),
}));
  `,
  "frontend/src/store/quizStore.js": `
import { create } from 'zustand';
export const useQuizStore = create((set) => ({
  activeQuiz: null,
  setActiveQuiz: (quiz) => set({ activeQuiz: quiz }),
}));
  `,
  "frontend/src/store/resumeStore.js": `
import { create } from 'zustand';
export const useResumeStore = create((set) => ({
  resumeData: null,
  setResumeData: (data) => set({ resumeData: data }),
}));
  `,
  "frontend/src/store/settingsStore.js": `
import { create } from 'zustand';
export const useSettingsStore = create((set) => ({
  settings: {},
  setSettings: (settings) => set({ settings }),
}));
  `,
  "frontend/src/components/providers/ThemeProvider.jsx": `
import React, { useEffect } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { THEME } from '../../constants/theme';

export const ThemeProvider = ({ children }) => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (theme === THEME.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
};
  `,
  "frontend/src/components/providers/AuthProvider.jsx": `
import React from 'react';

export const AuthProvider = ({ children }) => {
  return <>{children}</>;
};
  `,
  "frontend/src/components/providers/ToastProvider.jsx": `
import React from 'react';
import { Toaster } from 'sonner';

export const ToastProvider = () => {
  return <Toaster position="top-right" richColors />;
};
  `,
  "frontend/src/routes/ErrorBoundary.jsx": `
import React from 'react';
import { useRouteError } from 'react-router-dom';

export const ErrorBoundary = () => {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
      <h1 className="text-3xl font-bold text-red-500">Oops! Something went wrong.</h1>
      <p className="text-gray-500">{error.message || 'An unexpected error occurred.'}</p>
    </div>
  );
};
  `,
  "frontend/src/routes/ProtectedRoute.jsx": `
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../constants/routes';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};
  `,
  "frontend/src/routes/AdminRoute.jsx": `
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../constants/routes';

export const AdminRoute = () => {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'admin';
  return isAdmin ? <Outlet /> : <Navigate to={ROUTES.DASHBOARD} replace />;
};
  `,
  "frontend/src/pages/Landing.jsx": "import React from 'react'; export default function Landing() { return <div>Landing Page</div>; }",
  "frontend/src/pages/Login.jsx": "import React from 'react'; export default function Login() { return <div>Login Page</div>; }",
  "frontend/src/pages/Register.jsx": "import React from 'react'; export default function Register() { return <div>Register Page</div>; }",
  "frontend/src/pages/Dashboard.jsx": "import React from 'react'; export default function Dashboard() { return <div>Dashboard</div>; }",
  "frontend/src/pages/Aptitude.jsx": "import React from 'react'; export default function Aptitude() { return <div>Aptitude</div>; }",
  "frontend/src/pages/CoreECE.jsx": "import React from 'react'; export default function CoreECE() { return <div>Core ECE</div>; }",
  "frontend/src/pages/Coding.jsx": "import React from 'react'; export default function Coding() { return <div>Coding</div>; }",
  "frontend/src/pages/Companies.jsx": "import React from 'react'; export default function Companies() { return <div>Companies</div>; }",
  "frontend/src/pages/ResumeBuilder.jsx": "import React from 'react'; export default function ResumeBuilder() { return <div>Resume Builder</div>; }",
  "frontend/src/pages/AIAssistant.jsx": "import React from 'react'; export default function AIAssistant() { return <div>AI Assistant</div>; }",
  "frontend/src/pages/Profile.jsx": "import React from 'react'; export default function Profile() { return <div>Profile</div>; }",
  "frontend/src/pages/Settings.jsx": "import React from 'react'; export default function Settings() { return <div>Settings</div>; }",
  "frontend/src/pages/Admin.jsx": "import React from 'react'; export default function Admin() { return <div>Admin Dashboard</div>; }",
  "frontend/src/pages/NotFound.jsx": "import React from 'react'; export default function NotFound() { return <div>404 Not Found</div>; }",
  "frontend/src/routes/index.jsx": `
import { createBrowserRouter } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { ROUTES } from '../constants/routes';

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

const Loader = () => <div className="flex h-screen items-center justify-center">Loading...</div>;

export const router = createBrowserRouter([
  {
    path: ROUTES.LANDING,
    element: <Suspense fallback={<Loader />}><Landing /></Suspense>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.LOGIN,
    element: <Suspense fallback={<Loader />}><Login /></Suspense>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.REGISTER,
    element: <Suspense fallback={<Loader />}><Register /></Suspense>,
    errorElement: <ErrorBoundary />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
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
    ],
  },
  {
    element: <AdminRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: ROUTES.ADMIN, element: <Suspense fallback={<Loader />}><Admin /></Suspense> },
    ],
  },
  {
    path: '*',
    element: <Suspense fallback={<Loader />}><NotFound /></Suspense>,
  }
]);
  `,
  "frontend/src/App.jsx": `
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { AuthProvider } from './components/providers/AuthProvider';
import { ToastProvider } from './components/providers/ToastProvider';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastProvider />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
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
console.log('Successfully created all Core Architecture files.');
