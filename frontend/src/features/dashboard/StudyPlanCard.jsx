import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Calendar } from 'lucide-react';

export const StudyPlanCard = memo(() => {
  const plan = [
    { day: 'Today', tasks: ['Digital Electronics', 'SQL Practice'] },
    { day: 'Tomorrow', tasks: ['Aptitude (Speed Math)', 'HR Interview Mock'] },
    { day: 'Wednesday', tasks: ['Resume Review', 'Embedded Systems'] },
  ];
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Calendar size={20} className="text-indigo-500" /> AI Study Plan
      </h2>
      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 dark:before:via-gray-700 before:to-transparent">
        {plan.map((item, i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-[.is-active]:bg-indigo-600 group-[.is-active]:text-emerald-50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
               <span className="text-xs font-bold">{i+1}</span>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 shadow-sm">
              <div className="font-bold text-gray-900 dark:text-white mb-1">{item.day}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{item.tasks.join(', ')}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
});
StudyPlanCard.displayName = 'StudyPlanCard';