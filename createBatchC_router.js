const fs = require('fs');
const path = require('path');

const routerPath = path.resolve(__dirname, 'frontend/src/routes/index.jsx');
let routerCode = fs.readFileSync(routerPath, 'utf8');

const newImports = `
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
`;

routerCode = routerCode.replace('// Errors', newImports + '\n// Errors');

const newRoutes = `
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
`;

// Inject below core ece paths
routerCode = routerCode.replace('{ path: \'core/practice/:id\', element: <PracticeTest /> }', '{ path: \'core/practice/:id\', element: <PracticeTest /> },\n' + newRoutes);

fs.writeFileSync(routerPath, routerCode, 'utf8');
console.log('Batch C - Router updated successfully.');
