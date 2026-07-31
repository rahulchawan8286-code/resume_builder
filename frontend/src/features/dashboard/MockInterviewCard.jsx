import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Bot } from 'lucide-react';

export const MockInterviewCard = memo(() => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Bot size={20} className="text-indigo-500" /> Mock Interviews
      </h2>
      <div className="space-y-3">
         <div className="flex justify-between items-center text-sm"><span>Technical</span><span className="font-bold">8/10</span></div>
         <div className="flex justify-between items-center text-sm"><span>HR</span><span className="font-bold text-red-500">4/10</span></div>
         <div className="flex justify-between items-center text-sm"><span>Communication</span><span className="font-bold">7/10</span></div>
      </div>
    </Card>
  );
});
MockInterviewCard.displayName = 'MockInterviewCard';