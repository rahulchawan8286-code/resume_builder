import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { useDashboardStore } from '../../store/dashboardStore';

export const ReadinessScoreCard = memo(() => {
  const { readinessData } = useDashboardStore();
  const score = readinessData?.overallScore;
  
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="flex flex-col items-center justify-center py-8">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Overall Readiness</h2>
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="transform -rotate-90 w-40 h-40">
          <circle cx="80" cy="80" r="60" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-200 dark:text-gray-700" />
          <motion.circle
            cx="80" cy="80" r="60" stroke="currentColor" strokeWidth="12" fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-indigo-600"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          {score !== undefined ? (
            <>
              <span className="text-4xl font-bold text-gray-900 dark:text-white">{score}%</span>
              <span className="text-xs font-medium text-emerald-500 uppercase tracking-wider mt-1">
                {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-gray-400">N/A</span>
          )}
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center gap-1 text-center">
        {score !== undefined ? (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400">Target: 90%</p>
            <p className="text-xs text-gray-400">
              Last calculated: {new Date(readinessData.lastCalculatedAt || Date.now()).toLocaleDateString()}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 px-4">Take an assessment to calculate your score</p>
        )}
      </div>
    </Card>
  );
});
ReadinessScoreCard.displayName = 'ReadinessScoreCard';