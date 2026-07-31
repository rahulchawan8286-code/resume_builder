import React, { Suspense, lazy } from 'react';

const HeroSection = lazy(() => import('../features/dashboard/HeroSection').then(m => ({ default: m.HeroSection })));
const ReadinessScoreCard = lazy(() => import('../features/dashboard/ReadinessScoreCard').then(m => ({ default: m.ReadinessScoreCard })));
const StatisticsCards = lazy(() => import('../features/dashboard/StatisticsCards').then(m => ({ default: m.StatisticsCards })));
const WeeklyProgressChart = lazy(() => import('../features/dashboard/WeeklyProgressChart').then(m => ({ default: m.WeeklyProgressChart })));
const CompanyReadinessCard = lazy(() => import('../features/dashboard/CompanyReadinessCard').then(m => ({ default: m.CompanyReadinessCard })));
const AIRecommendationCard = lazy(() => import('../features/dashboard/AIRecommendationCard').then(m => ({ default: m.AIRecommendationCard })));
const StudyPlanCard = lazy(() => import('../features/dashboard/StudyPlanCard').then(m => ({ default: m.StudyPlanCard })));
const UpcomingTests = lazy(() => import('../features/dashboard/UpcomingTests').then(m => ({ default: m.UpcomingTests })));
const RecentActivity = lazy(() => import('../features/dashboard/RecentActivity').then(m => ({ default: m.RecentActivity })));
const SubjectAnalysis = lazy(() => import('../features/dashboard/SubjectAnalysis').then(m => ({ default: m.SubjectAnalysis })));
const CodingProgress = lazy(() => import('../features/dashboard/CodingProgress').then(m => ({ default: m.CodingProgress })));
const ResumeATSCard = lazy(() => import('../features/dashboard/ResumeATSCard').then(m => ({ default: m.ResumeATSCard })));
const MockInterviewCard = lazy(() => import('../features/dashboard/MockInterviewCard').then(m => ({ default: m.MockInterviewCard })));
const LeaderboardPreview = lazy(() => import('../features/dashboard/LeaderboardPreview').then(m => ({ default: m.LeaderboardPreview })));

const widgets = {
  HeroSection, ReadinessScoreCard, StatisticsCards, WeeklyProgressChart,
  CompanyReadinessCard, AIRecommendationCard, StudyPlanCard, UpcomingTests,
  RecentActivity, SubjectAnalysis, CodingProgress, ResumeATSCard,
  MockInterviewCard, LeaderboardPreview
};

const Fallback = () => <div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl w-full"></div>;

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <Suspense fallback={<Fallback />}><widgets.HeroSection /></Suspense>
      <Suspense fallback={<Fallback />}><widgets.StatisticsCards /></Suspense>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
           <Suspense fallback={<Fallback />}><widgets.ReadinessScoreCard score={82} /></Suspense>
           <Suspense fallback={<Fallback />}><widgets.AIRecommendationCard /></Suspense>
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