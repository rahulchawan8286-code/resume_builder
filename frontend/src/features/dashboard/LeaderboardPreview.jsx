import { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Trophy } from 'lucide-react';

export const LeaderboardPreview = memo(() => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Trophy size={20} className="text-indigo-500" /> Weekly Rank
      </h2>
      <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium">
         <span>#42 Rahul Chavan</span>
         <span>4,250 XP</span>
      </div>
    </Card>
  );
});
LeaderboardPreview.displayName = 'LeaderboardPreview';