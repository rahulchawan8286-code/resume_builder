import React from 'react';
import { cn } from '../../lib/utils';

export function Timeline({ items, className }) {
  return (
    <div className={cn("space-y-4 border-l-2 border-gray-200 dark:border-gray-800 ml-3", className)}>
      {items.map((item, i) => (
        <div key={i} className="relative pl-6">
          <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white bg-indigo-500 dark:border-gray-950" />
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
        </div>
      ))}
    </div>
  );
}