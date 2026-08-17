import { memo } from 'react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useDashboardStore } from '../../store/dashboardStore';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const HeroSection = memo(() => {
  const { user } = useAuthStore();
  const { readinessData } = useDashboardStore();
  
  const score = readinessData?.overallScore || 0;
  
  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg overflow-hidden">
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</h1>
        <p className="text-indigo-100 text-lg mb-6">
          {score > 0 
            ? `Your placement probability is at ${score}%. Keep up the good work!` 
            : `Let's get started on your placement journey. Complete an assessment to see your score.`}
        </p>
        <div className="flex gap-4">
          <Link to={ROUTES.APTITUDE}>
            <Button className="bg-white text-indigo-600 hover:bg-gray-50">Practice Aptitude</Button>
          </Link>
          <Link to={ROUTES.RESUME_BUILDER}>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 dark:text-white dark:border-white/30">Build Resume</Button>
          </Link>
        </div>
      </div>
      <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
    </div>
  );
});
HeroSection.displayName = 'HeroSection';