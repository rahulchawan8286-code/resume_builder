import { memo } from 'react';
import { Card } from '../../components/ui/Card';
import {  } from 'recharts';
import { TrendingUp } from 'lucide-react';

// const data = [];

export const WeeklyProgressChart = memo(() => {
  return (
    <Card className="h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp size={20} className="text-indigo-500" />
          Weekly Analytics
        </h2>
        <select className="bg-gray-50 dark:bg-gray-800 border-none text-sm rounded-lg py-1 px-3 text-gray-600 dark:text-gray-300">
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>
      <div className="flex-1 w-full flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-gray-500 dark:text-gray-400">Not enough historical data to generate analytics.</p>
          <p className="text-xs text-gray-400">Check back after you have completed more assessments.</p>
        </div>
      </div>
    </Card>
  );
});
WeeklyProgressChart.displayName = 'WeeklyProgressChart';