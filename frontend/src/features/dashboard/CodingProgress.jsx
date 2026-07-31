import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Code2 } from 'lucide-react';

export const CodingProgress = memo(() => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Code2 size={20} className="text-indigo-500" /> Coding Skills
      </h2>
      <div className="flex items-center justify-between mb-2">
         <span className="text-sm font-medium">Python</span>
         <span className="text-sm font-bold text-emerald-500">Advanced</span>
      </div>
      <div className="flex items-center justify-between mb-2">
         <span className="text-sm font-medium">C++</span>
         <span className="text-sm font-bold text-yellow-500">Intermediate</span>
      </div>
      <div className="flex items-center justify-between">
         <span className="text-sm font-medium">SQL</span>
         <span className="text-sm font-bold text-red-500">Beginner</span>
      </div>
    </Card>
  );
});
CodingProgress.displayName = 'CodingProgress';