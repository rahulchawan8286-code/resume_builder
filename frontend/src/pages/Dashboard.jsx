import { Suspense, lazy, useEffect } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { Button } from '../components/ui/Button';

// Lazy load all heavy widgets to reduce bundle size
const widgets = [
  'HeroSection', 'ReadinessScoreCard', 'StatisticsCards', 'WeeklyProgressChart',
  'CompanyReadinessCard', 'AICareerInsightsCard', 'StudyPlanCard', 'UpcomingTests',
  'RecentActivity', 'SubjectAnalysis', 'CodingProgress', 'ResumeATSCard',
  'MockInterviewCard', 'LeaderboardPreview'
].reduce((acc, name) => {
  acc[name] = lazy(() => import(`../features/dashboard/${name}.jsx`).then(m => ({ default: m[name] })));
  return acc;
}, {});

const Fallback = () => <div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl w-full"></div>;

export default function Dashboard() {
  const { fetchDashboardData, error, retry } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button onClick={retry}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <Suspense fallback={<Fallback />}><widgets.HeroSection /></Suspense>
      <Suspense fallback={<Fallback />}><widgets.StatisticsCards /></Suspense>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
           <Suspense fallback={<Fallback />}><widgets.ReadinessScoreCard /></Suspense>
           <Suspense fallback={<Fallback />}><widgets.AICareerInsightsCard /></Suspense>
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
           <Suspense fallback={<Fallback />}><widgets.WeeklyProgressChart /></Suspense>
        </div>
      </div>
      <Suspense fallback={<Fallback />}><widgets.SubjectAnalysis /></Suspense>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Suspense fallback={<Fallback />}><widgets.StudyPlanCard /></Suspense>
        <Suspense fallback={<Fallback />}><widgets.CompanyReadinessCard /></Suspense>
        <Suspense fallback={<Fallback />}><widgets.CodingProgress /></Suspense>
        <Suspense fallback={<Fallback />}><widgets.ResumeATSCard /></Suspense>
        <Suspense fallback={<Fallback />}><widgets.MockInterviewCard /></Suspense>
        <Suspense fallback={<Fallback />}><widgets.UpcomingTests /></Suspense>
        <Suspense fallback={<Fallback />}><widgets.RecentActivity /></Suspense>
        <Suspense fallback={<Fallback />}><widgets.LeaderboardPreview /></Suspense>
      </div>
    </div>
  );
}