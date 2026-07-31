const fs = require('fs');
const path = require('path');

const writeFiles = (files) => {
  Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.resolve(__dirname, filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content.trim(), 'utf8');
  });
};

const files = {
  "frontend/src/pages/error/Error401.jsx": `
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export default function Error401() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 text-center">
      <h1 className="text-9xl font-black text-gray-200 dark:text-gray-800">401</h1>
      <h2 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">Unauthorized</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">You need to be logged in to view this page.</p>
      <Button asChild className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white">
        <Link to="/login">Go to Login</Link>
      </Button>
    </div>
  );
}
  `,
  "frontend/src/pages/error/Error403.jsx": `
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export default function Error403() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 text-center">
      <h1 className="text-9xl font-black text-gray-200 dark:text-gray-800">403</h1>
      <h2 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">Forbidden</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">You do not have permission to access this resource.</p>
      <Button asChild className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white">
        <Link to="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
  `,
  "frontend/src/pages/error/Error404.jsx": `
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export default function Error404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 text-center">
      <h1 className="text-9xl font-black text-gray-200 dark:text-gray-800">404</h1>
      <h2 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">Page Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Button asChild className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white">
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  );
}
  `,
  "frontend/src/pages/error/Error500.jsx": `
import React from 'react';
import { Button } from '../../components/ui/Button';

export default function Error500() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 text-center">
      <h1 className="text-9xl font-black text-gray-200 dark:text-gray-800">500</h1>
      <h2 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">Internal Server Error</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">Something went completely wrong on our end. Please try refreshing.</p>
      <Button onClick={() => window.location.reload()} className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white">
        Refresh Page
      </Button>
    </div>
  );
}
  `,
  "frontend/src/routes/RouteGuards.jsx": `
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export function GuestRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user?.role !== 'admin') {
    return <Navigate to="/403" replace />;
  }
  return children;
}
  `,
  "frontend/src/routes/index.jsx": `
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute, GuestRoute, AdminRoute } from './RouteGuards';

// Layouts
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));
const AuthLayout = lazy(() => import('../layouts/AuthLayout'));
const PublicLayout = lazy(() => import('../layouts/PublicLayout'));

// Global Loading
const GlobalLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
  </div>
);

// Pages
const Landing = lazy(() => import('../pages/public/Landing'));
const About = lazy(() => import('../pages/public/About'));
const Features = lazy(() => import('../pages/public/Features'));
const Contact = lazy(() => import('../pages/public/Contact'));
const FAQ = lazy(() => import('../pages/public/FAQ'));
const PrivacyPolicy = lazy(() => import('../pages/public/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('../pages/public/TermsAndConditions'));

const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const EmailVerification = lazy(() => import('../pages/auth/EmailVerification'));

const Dashboard = lazy(() => import('../pages/Dashboard')); // We keep the one we built
const DesignSystem = lazy(() => import('../pages/DesignSystem'));

// Errors
const Error401 = lazy(() => import('../pages/error/Error401'));
const Error403 = lazy(() => import('../pages/error/Error403'));
const Error404 = lazy(() => import('../pages/error/Error404'));
const Error500 = lazy(() => import('../pages/error/Error500'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Suspense fallback={<GlobalLoader />}><PublicLayout /></Suspense>,
    errorElement: <Suspense fallback={<GlobalLoader />}><Error500 /></Suspense>,
    children: [
      { index: true, element: <Landing /> },
      { path: 'about', element: <About /> },
      { path: 'features', element: <Features /> },
      { path: 'contact', element: <Contact /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'privacy', element: <PrivacyPolicy /> },
      { path: 'terms', element: <TermsAndConditions /> }
    ]
  },
  {
    element: <GuestRoute><Suspense fallback={<GlobalLoader />}><AuthLayout /></Suspense></GuestRoute>,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'verify-email', element: <EmailVerification /> }
    ]
  },
  {
    element: <ProtectedRoute><Suspense fallback={<GlobalLoader />}><DashboardLayout /></Suspense></ProtectedRoute>,
    children: [
      { path: 'dashboard', element: <Dashboard /> }
    ]
  },
  { path: 'design-system', element: <Suspense fallback={<GlobalLoader />}><DesignSystem /></Suspense> },
  { path: '401', element: <Suspense fallback={<GlobalLoader />}><Error401 /></Suspense> },
  { path: '403', element: <Suspense fallback={<GlobalLoader />}><Error403 /></Suspense> },
  { path: '500', element: <Suspense fallback={<GlobalLoader />}><Error500 /></Suspense> },
  { path: '*', element: <Suspense fallback={<GlobalLoader />}><Error404 /></Suspense> }
]);
  `
};

writeFiles(files);
console.log('Batch A - Error pages and Routing updated.');
