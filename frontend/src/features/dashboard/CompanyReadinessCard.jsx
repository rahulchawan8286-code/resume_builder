import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Building2 } from 'lucide-react';

export const CompanyReadinessCard = memo(() => {
  const companies = [
    { name: 'Intel', score: 76, insight: 'Needs Embedded Systems improvement.', color: 'text-blue-500', bar: 'bg-blue-500' },
    { name: 'Qualcomm', score: 85, insight: 'Strong in Digital Electronics.', color: 'text-red-500', bar: 'bg-red-500' },
    { name: 'TCS', score: 92, insight: 'Aptitude is excellent. Ready.', color: 'text-indigo-500', bar: 'bg-indigo-500' },
  ];
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Building2 size={20} className="text-indigo-500" /> Company Readiness
      </h2>
      <div className="space-y-5">
        {companies.map((c) => (
          <div key={c.name}>
            <div className="flex justify-between items-end mb-1">
              <span className="font-semibold text-gray-900 dark:text-white">{c.name}</span>
              <span className={`font-bold ${c.color}`}>{c.score}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-2 overflow-hidden">
              <div className={`h-2 rounded-full ${c.bar}`} style={{ width: `${c.score}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{c.insight}</p>
          </div>
        ))}
      </div>
    </Card>
  );
});
CompanyReadinessCard.displayName = 'CompanyReadinessCard';