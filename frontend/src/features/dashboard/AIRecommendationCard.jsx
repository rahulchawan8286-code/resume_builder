import { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Brain, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

import { useDashboardStore } from '../../store/dashboardStore';

export const AIRecommendationCard = memo(() => {
  const { readinessData } = useDashboardStore();
  const recommendations = readinessData?.recommendations || [];
  
  return (
    <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">AI Recommendations</h2>
          <Brain className="text-indigo-500" size={24} />
        </div>
        <ul className="space-y-3 mb-6">
          {recommendations.length > 0 ? (
            recommendations.slice(0, 3).map((rec, idx) => (
              <li key={idx} className="flex gap-2 text-sm text-indigo-800/90 dark:text-indigo-200/90">
                 <span className="text-indigo-500">•</span> {rec}
              </li>
            ))
          ) : (
            <li className="text-sm text-indigo-800/70 dark:text-indigo-200/70 italic">
              Complete more assessments to generate insights.
            </li>
          )}
        </ul>
      </div>
      <Button size="sm" variant="outline" className="w-full justify-between border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
        Generate New Insights <ArrowRight size={16} />
      </Button>
    </Card>
  );
});
AIRecommendationCard.displayName = 'AIRecommendationCard';