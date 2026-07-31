const fs = require('fs');
const path = require('path');

const routerPath = path.resolve(__dirname, 'frontend/src/routes/index.jsx');
let routerCode = fs.readFileSync(routerPath, 'utf8');

const newImports = `
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
`;

routerCode = routerCode.replace('// Errors', newImports + '\n// Errors');

const newRoutes = `
      // AI
      { path: 'ai/assistant', element: <AIAssistant /> },
      { path: 'ai/planner', element: <AIStudyPlanner /> },
      { path: 'ai/mock-interview', element: <AIMockInterview /> },
      { path: 'ai/resume-review', element: <AIResumeReview /> },
      
      // Analytics
      { path: 'analytics/progress', element: <ProgressDashboard /> },
      { path: 'analytics/readiness', element: <ReadinessDashboard /> },
      { path: 'analytics/weekly', element: <WeeklyReport /> },
`;

// Inject into DashboardLayout (ProtectedRoute)
routerCode = routerCode.replace('{ path: \'companies/roadmap/:id\', element: <CompanyRoadmap /> },', '{ path: \'companies/roadmap/:id\', element: <CompanyRoadmap /> },\n' + newRoutes);

// Inject Admin routes (AdminRoute + DashboardLayout)
const adminRoutes = `
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
`;

// Insert admin routes before the design-system route
routerCode = routerCode.replace('{ path: \'design-system\'', adminRoutes + '  { path: \'design-system\'');

fs.writeFileSync(routerPath, routerCode, 'utf8');
console.log('Batch D - Router updated successfully.');
