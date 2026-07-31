const fs = require('fs');
const path = require('path');

const routerPath = path.resolve(__dirname, 'frontend/src/routes/index.jsx');
let routerCode = fs.readFileSync(routerPath, 'utf8');

// Insert lazy imports for Student Module
const newImports = `
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
`;

routerCode = routerCode.replace('// Errors', newImports + '\n// Errors');

// Insert new routes inside ProtectedRoute DashboardLayout children
const newRoutes = `
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
      { path: 'core/practice/:id', element: <PracticeTest /> }
`;

routerCode = routerCode.replace('{ path: \'dashboard\', element: <Dashboard /> }', newRoutes);

fs.writeFileSync(routerPath, routerCode, 'utf8');
console.log('Batch B - Router updated successfully.');
