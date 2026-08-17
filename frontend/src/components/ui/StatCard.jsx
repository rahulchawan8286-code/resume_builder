import { Card, CardContent } from './Card';
import { cn } from '../../lib/utils';

export function StatCard({ title, value, icon: Icon, trend, className }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h4 className="text-3xl font-bold mt-2 dark:text-white">{value}</h4>
          </div>
          {Icon && (
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Icon size={24} />
            </div>
          )}
        </div>
        {trend && (
          <div className={cn("mt-4 text-sm font-medium", trend.positive ? 'text-emerald-500' : 'text-red-500')}>
            {trend.positive ? '+' : '-'}{Math.abs(trend.value)}% from last week
          </div>
        )}
      </CardContent>
    </Card>
  );
}