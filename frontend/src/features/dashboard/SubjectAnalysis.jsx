import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { BookOpen } from 'lucide-react';

export const SubjectAnalysis = memo(() => {
  const subjects = [
    { name: 'Digital Electronics', score: 92, status: 'Excellent', color: 'bg-emerald-500' },
    { name: 'Communication Systems', score: 58, status: 'Needs Practice', color: 'bg-yellow-500' },
    { name: 'Power Electronics', score: 81, status: 'Good', color: 'bg-blue-500' },
  ];
  return (
    <Card className="col-span-full">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <BookOpen size={20} className="text-indigo-500" /> Subject Analysis
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subjects.map(sub => (
          <div key={sub.name} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">{sub.name}</h3>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold">{sub.score}%</span>
              <span className={`text-xs px-2 py-1 rounded-full text-white ${sub.color}`}>{sub.status}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div className={`h-1.5 rounded-full ${sub.color}`} style={{ width: `${sub.score}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
});
SubjectAnalysis.displayName = 'SubjectAnalysis';