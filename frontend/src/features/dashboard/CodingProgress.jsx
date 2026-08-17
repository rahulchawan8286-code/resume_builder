import { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Code2 } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';

export const CodingProgress = memo(() => {
  const { readinessData } = useDashboardStore();
  const score = readinessData?.components?.coding?.score;
  
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Code2 size={20} className="text-indigo-500" /> Coding Skills
      </h2>
      {score !== undefined ? (
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Score</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{score}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${score}%` }}></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-4 text-center">
          <span className="text-sm text-gray-500 italic">No coding assessments taken yet.</span>
        </div>
      )}
    </Card>
  );
});
CodingProgress.displayName = 'CodingProgress';