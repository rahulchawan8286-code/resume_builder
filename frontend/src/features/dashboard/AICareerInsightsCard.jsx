import { memo, useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Brain, RefreshCw, AlertCircle, ChevronDown, ChevronUp, CheckCircle2, TrendingUp, Target, Map } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAiStore } from '../../store/aiStore';

export const AICareerInsightsCard = memo(() => {
  const { insights, emptyState, emptyMessage, isLoading, isRefreshing, error, fetchInsights, refreshInsights, lastAnalyzedAt } = useAiStore();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  if (isLoading && !insights) {
    return (
      <Card className="h-full flex flex-col items-center justify-center py-12 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mb-4" />
        <p className="text-sm text-indigo-600/70 font-medium">Analyzing your career data...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full flex flex-col items-center justify-center py-12 text-center border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30">
        <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
        <h3 className="font-semibold text-red-800 dark:text-red-400 mb-1">AI Analysis Unavailable</h3>
        <p className="text-sm text-red-600/80 max-w-sm mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchInsights} className="border-red-200 text-red-700 hover:bg-red-100">
          <RefreshCw size={14} className="mr-2" /> Retry Analysis
        </Button>
      </Card>
    );
  }

  if (emptyState) {
    return (
      <Card className="h-full flex flex-col items-center justify-center py-12 text-center bg-gray-50 dark:bg-gray-800/50">
        <Brain className="w-10 h-10 text-gray-400 mb-3" />
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Unlock AI Insights</h3>
        <p className="text-sm text-gray-500 max-w-sm">{emptyMessage}</p>
      </Card>
    );
  }

  if (!insights) return null;

  return (
    <Card className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 border-b border-indigo-500/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
            <Brain className="text-indigo-500" size={20} /> AI Career Intelligence
          </h2>
          {lastAnalyzedAt && (
            <p className="text-[10px] text-indigo-400/80 mt-1 uppercase tracking-wider font-semibold">
              Updated: {new Date(lastAnalyzedAt).toLocaleString()}
            </p>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={refreshInsights} 
          disabled={isRefreshing}
          className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
          title="Refresh Analysis"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        
        {/* Summary */}
        <div>
          <p className="text-sm text-indigo-950/80 dark:text-indigo-200/90 leading-relaxed font-medium">
            {insights.summary}
          </p>
        </div>

        {/* Priority Gaps & Next Action */}
        <div className="bg-white/60 dark:bg-gray-900/40 rounded-xl p-4 border border-indigo-100 dark:border-indigo-500/10">
          <h4 className="text-xs uppercase font-bold text-indigo-400 mb-3 flex items-center gap-1"><Target size={14} /> Highest Priorities</h4>
          <ul className="space-y-2 mb-4">
            {insights.priorityGaps?.slice(0, 2).map((gap, i) => (
              <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <span className="text-red-400 mt-1 flex-shrink-0">•</span> {gap}
              </li>
            ))}
          </ul>
          
          <div className="pt-3 border-t border-indigo-500/10">
            <h4 className="text-xs uppercase font-bold text-emerald-500 mb-2 flex items-center gap-1"><TrendingUp size={14}/> Recommended Next Action</h4>
            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
               {insights.recommendations?.[0] || 'Continue with your current study plan.'}
            </p>
          </div>
        </div>

        {/* Expandable Details */}
        <div className="pt-2">
          <Button 
            variant="ghost" 
            onClick={() => setExpanded(!expanded)} 
            className="w-full text-xs text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 flex items-center justify-center gap-1"
          >
            {expanded ? 'Hide Details' : 'View Full AI Analysis'}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
          
          {expanded && (
            <div className="mt-4 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Strengths & Weaknesses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                  <h4 className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Strengths
                  </h4>
                  <ul className="space-y-2">
                    {insights.strengths?.map((item, i) => (
                      <li key={i} className="text-xs text-emerald-800 dark:text-emerald-300/80 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/20">
                  <h4 className="text-xs uppercase font-bold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1">
                    <AlertCircle size={14} /> Areas to Improve
                  </h4>
                  <ul className="space-y-2">
                    {insights.weaknesses?.map((item, i) => (
                      <li key={i} className="text-xs text-amber-800 dark:text-amber-300/80 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Company Insights */}
              {insights.companyInsights?.length > 0 && (
                <div className="bg-white/60 dark:bg-gray-900/40 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/10">
                  <h4 className="text-xs uppercase font-bold text-indigo-500 mb-2 flex items-center gap-1"><Target size={14} /> Target Company Insights</h4>
                  <ul className="space-y-2">
                    {insights.companyInsights.map((item, i) => (
                      <li key={i} className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Study & Resume Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {insights.studyPlan?.length > 0 && (
                  <div className="bg-white/60 dark:bg-gray-900/40 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h4 className="text-xs uppercase font-bold text-gray-500 mb-2 flex items-center gap-1"><Map size={12}/> Study Plan Focus</h4>
                    <ul className="space-y-1">
                      {insights.studyPlan.map((item, i) => <li key={i} className="text-xs text-gray-600 dark:text-gray-400">• {item}</li>)}
                    </ul>
                  </div>
                 )}
                 {insights.resumeSuggestions?.length > 0 && (
                  <div className="bg-white/60 dark:bg-gray-900/40 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h4 className="text-xs uppercase font-bold text-gray-500 mb-2 flex items-center gap-1"><Target size={12}/> Resume Polish</h4>
                    <ul className="space-y-1">
                      {insights.resumeSuggestions.map((item, i) => <li key={i} className="text-xs text-gray-600 dark:text-gray-400">• {item}</li>)}
                    </ul>
                  </div>
                 )}
              </div>
            </div>
          )}
        </div>

      </div>
    </Card>
  );
});
AICareerInsightsCard.displayName = 'AICareerInsightsCard';
