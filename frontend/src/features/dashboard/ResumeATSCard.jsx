import { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { FileText } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';

export const ResumeATSCard = memo(() => {
  const { readinessData } = useDashboardStore();
  const score = readinessData?.components?.resume?.score;
  
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <FileText size={20} className="text-indigo-500" /> Resume Quality
      </h2>
      {score !== undefined ? (
        <>
          <div className="flex flex-col items-center justify-center">
             <span className="text-4xl font-bold text-emerald-500 mb-2">{score}%</span>
             <span className="text-sm text-gray-500">ATS Score</span>
          </div>
          <p className="text-xs text-center text-gray-400 mt-4">Keep improving your resume to boost this score!</p>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center mt-4 text-center h-20">
          <span className="text-sm text-gray-500 italic">No resume data analyzed yet.</span>
        </div>
      )}
    </Card>
  );
});
ResumeATSCard.displayName = 'ResumeATSCard';