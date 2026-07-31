import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Activity } from 'lucide-react';

export const RecentActivity = memo(() => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Activity size={20} className="text-indigo-500" /> Recent Activity
      </h2>
      <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
        <li>Completed Analog Electronics Quiz (85%)</li>
        <li>Solved 3 Python strings problems</li>
        <li>Updated Resume "Projects" section</li>
      </ul>
    </Card>
  );
});
RecentActivity.displayName = 'RecentActivity';