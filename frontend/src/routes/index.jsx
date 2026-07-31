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


// Batch B Imports
const Profile = lazy(() => import('../pages/student/Profile'));
const Settings = lazy(() => import('../pages/student/Settings'));
const Notifications = lazy(() => import('../pages/student/Notifications'));
const Bookmarks = lazy(() => import('../pages/student/Bookmarks'));

const AptitudeDashboard = lazy(() => import('../pages/placement/AptitudeDashboard'));
const QuizPage = lazy(() => import('../pages/placement/QuizPage'));
const QuizResult = lazy(() => import('../pages/placement/QuizResult'));
const Leaderboard = lazy(() => import('../pages/placement/Leaderboard'));

const Subjects = lazy(() => import('../pages/core/Subjects'));
const SubjectDetails = lazy(() => import('../pages/core/SubjectDetails'));
const NotesViewer = lazy(() => import('../pages/core/NotesViewer'));
const PracticeTest = lazy(() => import('../pages/core/PracticeTest'));


// Batch C Imports
const CodingDashboard = lazy(() => import('../pages/coding/CodingDashboard'));
const ProblemDetails = lazy(() => import('../pages/coding/ProblemDetails'));
const SubmissionHistory = lazy(() => import('../pages/coding/SubmissionHistory'));

const ResumeDashboard = lazy(() => import('../pages/resume/ResumeDashboard'));
const ResumeBuilder = lazy(() => import('../pages/resume/ResumeBuilder'));
const ResumePreview = lazy(() => import('../pages/resume/ResumePreview'));
const ATSReport = lazy(() => import('../pages/resume/ATSReport'));

const CompanyList = lazy(() => import('../pages/companies/CompanyList'));
const CompanyDetails = lazy(() => import('../pages/companies/CompanyDetails'));
const CompanyRoadmap = lazy(() => import('../pages/companies/CompanyRoadmap'));


// Batch D Imports
const AIAssistant = lazy(() => import('../pages/ai/AIAssistant'));
const AIStudyPlanner = lazy(() => import('../pages/ai/AIStudyPlanner'));
const AIMockInterview = lazy(() => import('../pages/ai/AIMockInterview'));
const AIResumeReview = lazy(() => import('../pages/ai/AIResumeReview'));

const ProgressDashboard = lazy(() => import('../pages/analytics/ProgressDashboard'));
const ReadinessDashboard = lazy(() => import('../pages/analytics/ReadinessDashboard'));
const WeeklyReport = lazy(() => import('../pages/analytics/WeeklyReport'));

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const QuestionManagement = lazy(() => import('../pages/admin/QuestionManagement'));
const GenericAdminView = lazy(() => import('../pages/admin/GenericAdminView'));

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
      
      { path: 'dashboard', element: <Dashboard /> },
      // Student
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'bookmarks', element: <Bookmarks /> },
      
      // Placement
      { path: 'placement/aptitude', element: <AptitudeDashboard /> },
      { path: 'placement/quiz/:id', element: <QuizPage /> },
      { path: 'placement/result/:id', element: <QuizResult /> },
      { path: 'placement/leaderboard', element: <Leaderboard /> },
      
      // Core ECE
      { path: 'core/subjects', element: <Subjects /> },
      { path: 'core/subjects/:id', element: <SubjectDetails /> },
      { path: 'core/notes/:id', element: <NotesViewer /> },
      { path: 'core/practice/:id', element: <PracticeTest /> },

      // Coding
      { path: 'coding', element: <CodingDashboard /> },
      { path: 'coding/problem/:id', element: <ProblemDetails /> },
      { path: 'coding/submissions', element: <SubmissionHistory /> },
      
      // Resume
      { path: 'resume', element: <ResumeDashboard /> },
      { path: 'resume/builder', element: <ResumeBuilder /> },
      { path: 'resume/preview', element: <ResumePreview /> },
      { path: 'resume/ats', element: <ATSReport /> },
      
      // Companies
      { path: 'companies', element: <CompanyList /> },
      { path: 'companies/:id', element: <CompanyDetails /> },
      { path: 'companies/roadmap/:id', element: <CompanyRoadmap /> },

      // AI
      { path: 'ai/assistant', element: <AIAssistant /> },
      { path: 'ai/planner', element: <AIStudyPlanner /> },
      { path: 'ai/mock-interview', element: <AIMockInterview /> },
      { path: 'ai/resume-review', element: <AIResumeReview /> },
      
      // Analytics
      { path: 'analytics/progress', element: <ProgressDashboard /> },
      { path: 'analytics/readiness', element: <ReadinessDashboard /> },
      { path: 'analytics/weekly', element: <WeeklyReport /> },



    ]
  },
  
  {
    element: <AdminRoute><Suspense fallback={<GlobalLoader />}><DashboardLayout /></Suspense></AdminRoute>,
    children: [
      { path: 'admin/dashboard', element: <AdminDashboard /> },
      { path: 'admin/users', element: <UserManagement /> },
      { path: 'admin/questions', element: <QuestionManagement /> },
      { path: 'admin/notes', element: <GenericAdminView title="Notes Management" description="Manage ECE notes and study materials" /> },
      { path: 'admin/companies', element: <GenericAdminView title="Company Management" description="Update company hiring process data" /> },
      { path: 'admin/resume-templates', element: <GenericAdminView title="Resume Templates" description="Configure resume ATS templates" /> },
      { path: 'admin/ai-prompts', element: <GenericAdminView title="AI Prompt Management" description="Tune the LLM system prompts" /> },
      { path: 'admin/analytics', element: <GenericAdminView title="Platform Analytics" description="System-wide usage analytics" /> },
      { path: 'admin/settings', element: <GenericAdminView title="Global Settings" description="System configuration and environment variables" /> }
    ]
  },
  { path: 'design-system', element: <Suspense fallback={<GlobalLoader />}><DesignSystem /></Suspense> },
  { path: '401', element: <Suspense fallback={<GlobalLoader />}><Error401 /></Suspense> },
  { path: '403', element: <Suspense fallback={<GlobalLoader />}><Error403 /></Suspense> },
  { path: '500', element: <Suspense fallback={<GlobalLoader />}><Error500 /></Suspense> },
  { path: '*', element: <Suspense fallback={<GlobalLoader />}><Error404 /></Suspense> }
]);