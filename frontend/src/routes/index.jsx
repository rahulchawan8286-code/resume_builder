import { createBrowserRouter, Navigate } from 'react-router-dom';
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
const Landing = lazy(() => import('../pages/public/Landing'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Aptitude = lazy(() => import('../pages/placement/AptitudeDashboard'));
const Subjects = lazy(() => import('../pages/core/Subjects'));
const CodingDashboard = lazy(() => import('../pages/coding/CodingDashboard'));
const CompanyList = lazy(() => import('../pages/companies/CompanyList'));
const CompanyDetails = lazy(() => import('../pages/companies/CompanyDetails'));
const CompanyRoadmap = lazy(() => import('../pages/companies/CompanyRoadmap'));
const ResumeDashboard = lazy(() => import('../pages/resume/ResumeDashboard'));
const ResumeBuilder = lazy(() => import('../pages/resume/ResumeBuilder'));
const ATSReport = lazy(() => import('../pages/resume/ATSReport'));
const AIAssistant = lazy(() => import('../pages/AIAssistant'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Admin = lazy(() => import('../pages/Admin'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Placement / Quiz pages
const QuizPage = lazy(() => import('../pages/placement/QuizPage'));
const QuizResult = lazy(() => import('../pages/placement/QuizResult'));

// Core ECE pages
const SubjectDetails = lazy(() => import('../pages/core/SubjectDetails'));
const NotesViewer = lazy(() => import('../pages/core/NotesViewer'));
const PracticeTest = lazy(() => import('../pages/core/PracticeTest'));

// Coding Practice pages
const ProblemDetails = lazy(() => import('../pages/coding/ProblemDetails'));
const SubmissionHistory = lazy(() => import('../pages/coding/SubmissionHistory'));

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
          { path: ROUTES.CORE_ECE, element: <Suspense fallback={<Loader />}><Subjects /></Suspense> },
          { path: ROUTES.CODING, element: <Suspense fallback={<Loader />}><CodingDashboard /></Suspense> },
          { path: ROUTES.COMPANIES, element: <Suspense fallback={<Loader />}><CompanyList /></Suspense> },
          { path: '/companies/:id', element: <Suspense fallback={<Loader />}><CompanyDetails /></Suspense> },
          { path: '/companies/roadmap/:id', element: <Suspense fallback={<Loader />}><CompanyRoadmap /></Suspense> },
          { path: ROUTES.RESUME_BUILDER, element: <Suspense fallback={<Loader />}><ResumeDashboard /></Suspense> },
          { path: '/resume/builder/:id', element: <Suspense fallback={<Loader />}><ResumeBuilder /></Suspense> },
          { path: '/resume/ats/:id', element: <Suspense fallback={<Loader />}><ATSReport /></Suspense> },
          { path: ROUTES.AI_ASSISTANT, element: <Suspense fallback={<Loader />}><AIAssistant /></Suspense> },
          { path: ROUTES.PROFILE, element: <Suspense fallback={<Loader />}><Profile /></Suspense> },
          { path: ROUTES.SETTINGS, element: <Suspense fallback={<Loader />}><Settings /></Suspense> },
          
          { path: '/placement/quiz/:id', element: <Suspense fallback={<Loader />}><QuizPage /></Suspense> },
          { path: '/placement/result/:id', element: <Suspense fallback={<Loader />}><QuizResult /></Suspense> },
          
          { path: '/core/subjects/:id', element: <Suspense fallback={<Loader />}><SubjectDetails /></Suspense> },
          { path: '/core/notes/:id', element: <Suspense fallback={<Loader />}><NotesViewer /></Suspense> },
          { path: '/core/practice/:id', element: <Suspense fallback={<Loader />}><PracticeTest /></Suspense> },
          
          { path: '/coding/problem/:id', element: <Suspense fallback={<Loader />}><ProblemDetails /></Suspense> },
          { path: '/coding/history', element: <Suspense fallback={<Loader />}><SubmissionHistory /></Suspense> },
          
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
    path: '/placement/*',
    element: <Navigate to={ROUTES.APTITUDE} replace />,
  },
  {
    path: '*',
    element: <Suspense fallback={<Loader />}><NotFound /></Suspense>,
  }
]);