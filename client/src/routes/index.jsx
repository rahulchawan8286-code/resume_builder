import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute, GuestRoute, AdminRoute } from './guards';
import { PageTransition } from '@/components/shared/PageTransition';
import { Skeleton } from '@/components/shared/Skeleton';

// Lazy-loaded layouts
const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout'));
const AuthLayout      = lazy(() => import('@/layouts/AuthLayout'));

// Lazy-loaded pages — code splitting at the route level
const LoginPage           = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage        = lazy(() => import('@/features/auth/pages/RegisterPage'));
const ForgotPasswordPage  = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage   = lazy(() => import('@/features/auth/pages/ResetPasswordPage'));
const VerifyEmailPage     = lazy(() => import('@/features/auth/pages/VerifyEmailPage'));

const DashboardPage       = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const ProfilePage         = lazy(() => import('@/features/profile/pages/ProfilePage'));
const SettingsPage        = lazy(() => import('@/features/settings/pages/SettingsPage'));

const BuilderPage         = lazy(() => import('@/features/resume-builder/pages/BuilderPage'));
const ResumesPage         = lazy(() => import('@/features/resume-builder/pages/ResumesPage'));

const ProfileSetupPage    = lazy(() => import('@/features/auth/pages/ProfileSetupPage'));
const SessionExpiredPage  = lazy(() => import('@/features/auth/pages/SecurityPages').then(module => ({ default: module.SessionExpiredPage })));
const AccessDeniedPage    = lazy(() => import('@/features/auth/pages/SecurityPages').then(module => ({ default: module.AccessDeniedPage })));

const AdminLayout         = lazy(() => import('@/features/admin/layouts/AdminLayout'));
const AdminDashboardPage  = lazy(() => import('@/features/admin/pages/AdminDashboardPage'));
const AdminUserPage       = lazy(() => import('@/features/admin/pages/AdminUserPage'));
const AdminResumePage     = lazy(() => import('@/features/admin/pages/AdminResumePage'));
const AdminAiPage         = lazy(() => import('@/features/admin/pages/AdminAiPage'));
const AdminTemplatesPage  = lazy(() => import('@/features/admin/pages/AdminTemplatesPage'));
const AdminLogsPage       = lazy(() => import('@/features/admin/pages/AdminLogsPage'));
const AdminSettingsPage   = lazy(() => import('@/features/admin/pages/AdminSettingsPage'));

const NotFoundPage        = lazy(() => import('@/features/errors/pages/NotFoundPage'));
const UnauthorizedPage    = lazy(() => import('@/features/errors/pages/UnauthorizedPage'));

const FallbackSpinner = () => (
  <div className="flex h-screen items-center justify-center bg-background">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const router = createBrowserRouter([
  // ─── Auth Routes (Guest only) ─────────────────────────────────────
  {
    element: <GuestRoute />,
    children: [
      {
        element: <Suspense fallback={<FallbackSpinner />}><AuthLayout /></Suspense>,
        children: [
          { path: '/login',           element: <Suspense fallback={null}><PageTransition><LoginPage /></PageTransition></Suspense> },
          { path: '/register',        element: <Suspense fallback={null}><PageTransition><RegisterPage /></PageTransition></Suspense> },
          { path: '/forgot-password', element: <Suspense fallback={null}><PageTransition><ForgotPasswordPage /></PageTransition></Suspense> },
          { path: '/reset-password',  element: <Suspense fallback={null}><PageTransition><ResetPasswordPage /></PageTransition></Suspense> },
          { path: '/verify-email',    element: <Suspense fallback={null}><PageTransition><VerifyEmailPage /></PageTransition></Suspense> },
          { path: '/profile-setup',   element: <Suspense fallback={null}><PageTransition><ProfileSetupPage /></PageTransition></Suspense> },
        ],
      },
    ],
  },

  // ─── Protected Routes ─────────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Suspense fallback={<FallbackSpinner />}><DashboardLayout /></Suspense>,
        children: [
          { path: '/',          element: <Suspense fallback={null}><PageTransition><DashboardPage /></PageTransition></Suspense> },
          { path: '/dashboard', element: <Suspense fallback={null}><PageTransition><DashboardPage /></PageTransition></Suspense> },
          { path: '/resumes',   element: <Suspense fallback={null}><PageTransition><ResumesPage /></PageTransition></Suspense> },
          { path: '/profile',   element: <Suspense fallback={null}><PageTransition><ProfilePage /></PageTransition></Suspense> },
          { path: '/settings',  element: <Suspense fallback={null}><PageTransition><SettingsPage /></PageTransition></Suspense> },
          { path: '/billing',   element: <Suspense fallback={null}><PageTransition><DashboardPage /></PageTransition></Suspense> },
        ],
      },
    ],
  },

  // ─── Resume Builder (full-screen, protected, no DashboardLayout) ──
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/resumes/new',  element: <Suspense fallback={<FallbackSpinner />}><BuilderPage /></Suspense> },
      { path: '/resumes/:id',  element: <Suspense fallback={<FallbackSpinner />}><BuilderPage /></Suspense> },
    ],
  },

  // ─── Admin Console Routes (Role restricted) ──────────────────────
  {
    element: <AdminRoute />,
    children: [
      {
        element: <Suspense fallback={<FallbackSpinner />}><AdminLayout /></Suspense>,
        children: [
          { path: '/admin',           element: <Suspense fallback={null}><PageTransition><AdminDashboardPage /></PageTransition></Suspense> },
          { path: '/admin/users',     element: <Suspense fallback={null}><PageTransition><AdminUserPage /></PageTransition></Suspense> },
          { path: '/admin/resumes',   element: <Suspense fallback={null}><PageTransition><AdminResumePage /></PageTransition></Suspense> },
          { path: '/admin/ai',        element: <Suspense fallback={null}><PageTransition><AdminAiPage /></PageTransition></Suspense> },
          { path: '/admin/templates', element: <Suspense fallback={null}><PageTransition><AdminTemplatesPage /></PageTransition></Suspense> },
          { path: '/admin/logs',      element: <Suspense fallback={null}><PageTransition><AdminLogsPage /></PageTransition></Suspense> },
          { path: '/admin/settings',  element: <Suspense fallback={null}><PageTransition><AdminSettingsPage /></PageTransition></Suspense> },
        ],
      },
    ],
  },

  // ─── Error Routes ─────────────────────────────────────────────────
  { path: '/session-expired', element: <Suspense fallback={null}><SessionExpiredPage /></Suspense> },
  { path: '/access-denied',   element: <Suspense fallback={null}><AccessDeniedPage /></Suspense> },
  { path: '/unauthorized',    element: <Suspense fallback={null}><UnauthorizedPage /></Suspense> },
  { path: '*',                element: <Suspense fallback={null}><NotFoundPage /></Suspense> },
], {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  }
});

export function AppRouter() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
