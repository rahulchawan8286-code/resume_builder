import { createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { ROUTES } from '../constants/routes';
import { Loader } from '../components/ui/Loader';

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

// Interview pages
const InterviewDashboard = lazy(() => import('../pages/analytics/InterviewDashboard'));
const ActiveInterview = lazy(() => import('../pages/interview/ActiveInterview'));
const InterviewResult = lazy(() => import('../pages/interview/InterviewResult'));


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
          
          { path: '/interviews', element: <Suspense fallback={<Loader />}><InterviewDashboard /></Suspense> },
          { path: '/interviews/session/:id', element: <Suspense fallback={<Loader />}><ActiveInterview /></Suspense> },
          { path: '/interviews/results/:id', element: <Suspense fallback={<Loader />}><InterviewResult /></Suspense> },
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