import { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Bot } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';

export const MockInterviewCard = memo(() => {
  const { readinessData } = useDashboardStore();
  const score = readinessData?.components?.mockInterview?.score;

  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Bot size={20} className="text-indigo-500" /> Mock Interviews
      </h2>
      {score !== undefined ? (
        <div className="flex flex-col items-center justify-center">
           <span className="text-4xl font-bold text-indigo-500 mb-2">{score}%</span>
           <span className="text-sm text-gray-500">Average Performance</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-4 text-center h-20">
          <span className="text-sm text-gray-500 italic">No mock interviews completed.</span>
        </div>
      )}
    </Card>
  );
});
MockInterviewCard.displayName = 'MockInterviewCard';