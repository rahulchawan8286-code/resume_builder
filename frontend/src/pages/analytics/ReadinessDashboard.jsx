
import { SubjectAnalysis } from '../../features/dashboard/SubjectAnalysis';
import { CodingProgress } from '../../features/dashboard/CodingProgress';
import { AIRecommendationCard } from '../../features/dashboard/AIRecommendationCard';

export default function ReadinessDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Placement Readiness</h1>
        <p className="text-gray-500 dark:text-gray-400">Evaluate your readiness across all required domains.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubjectAnalysis />
        <CodingProgress />
      </div>
      <div className="max-w-2xl">
        <AIRecommendationCard />
      </div>
    </div>
  );
}