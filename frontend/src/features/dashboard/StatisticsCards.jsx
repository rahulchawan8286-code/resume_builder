import { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Trophy, Brain, Target, BookOpen } from 'lucide-react';

export const StatisticsCards = memo(() => {
  const stats = [
    { title: 'XP Points', value: '4,250', icon: Target, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Daily Streak', value: '14 Days', icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { title: 'Tests Done', value: '28', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { title: 'Rank', value: '#42', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
          <div className={`p-3 rounded-2xl ${stat.bg}`}>
             <stat.icon className={`${stat.color}`} size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
});
StatisticsCards.displayName = 'StatisticsCards';