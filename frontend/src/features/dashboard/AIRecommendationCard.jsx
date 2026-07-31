import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Brain, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AIRecommendationCard = memo(() => {
  return (
    <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">AI Recommendations</h2>
          <Brain className="text-indigo-500" size={24} />
        </div>
        <ul className="space-y-3 mb-6">
          <li className="flex gap-2 text-sm text-indigo-800/90 dark:text-indigo-200/90">
             <span className="text-indigo-500">•</span> Improve Communication Systems (Current: 58%)
          </li>
          <li className="flex gap-2 text-sm text-indigo-800/90 dark:text-indigo-200/90">
             <span className="text-indigo-500">•</span> Solve 5 SQL problems this week
          </li>
          <li className="flex gap-2 text-sm text-indigo-800/90 dark:text-indigo-200/90">
             <span className="text-indigo-500">•</span> Practice HR Interviews (Weakness detected)
          </li>
        </ul>
      </div>
      <Button size="sm" variant="outline" className="w-full justify-between border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
        Generate New Insights <ArrowRight size={16} />
      </Button>
    </Card>
  );
});
AIRecommendationCard.displayName = 'AIRecommendationCard';