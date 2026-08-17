import { memo, useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Activity, Loader2 } from 'lucide-react';
import { resultService } from '../../api/resultService';

const getRelativeTime = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const RecentActivity = memo(() => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchHistory = async () => {
      try {
        const data = await resultService.getUserResults();
        if (mounted) setResults(data.slice(0, 5)); // get top 5 recent
      } catch (err) {
        if (mounted) setError('Failed to load activity');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchHistory();
    return () => { mounted = false; };
  }, []);

  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Activity size={20} className="text-indigo-500" /> Recent Activity
      </h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="text-sm text-red-500 text-center py-4">{error}</div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-6 text-center">
          <p className="text-sm text-gray-500 italic">No recent activity recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result._id} className="flex flex-col border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{result.quiz?.title || 'Unknown Quiz'}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${result.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {result.passed ? 'Pass' : 'Fail'}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">{result.score}/{result.totalQuestions} ({((result.score/result.totalQuestions)*100).toFixed(0)}%)</span>
                <span className="text-xs text-gray-400">{getRelativeTime(result.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
});
RecentActivity.displayName = 'RecentActivity';