
import { WeeklyProgressChart } from '../../features/dashboard/WeeklyProgressChart';
import { ReadinessScoreCard } from '../../features/dashboard/ReadinessScoreCard';

export default function ProgressDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Progress Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400">Deep dive into your learning metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyProgressChart />
        </div>
        <div>
          <ReadinessScoreCard />
        </div>
      </div>
    </div>
  );
}