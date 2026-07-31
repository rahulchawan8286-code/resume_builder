import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Clock } from 'lucide-react';

export const UpcomingTests = memo(() => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Clock size={20} className="text-indigo-500" /> Upcoming Tests
      </h2>
      <div className="space-y-3">
        {[
          { title: 'Digital Electronics Mock Test', time: 'Today, 6:00 PM' },
          { title: 'TCS NQT Aptitude Pattern', time: 'Tomorrow, 10:00 AM' }
        ].map((task, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
            <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{task.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
});
UpcomingTests.displayName = 'UpcomingTests';