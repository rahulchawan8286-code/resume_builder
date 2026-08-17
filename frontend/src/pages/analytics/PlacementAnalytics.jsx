import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { analyticsService } from '../../api/analyticsService';
import { Loader, Target, Activity, AlertCircle, Sparkles, Briefcase } from 'lucide-react';

export default function PlacementAnalytics() {
  const [data, setData] = useState(null);
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [insightLoading, setInsightLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await analyticsService.getOverview();
        if (res.success) {
          setData(res.data);
          generateInsight();
        }
      } catch (err) {
        setError(err.message || 'Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const generateInsight = async () => {
     setInsightLoading(true);
     try {
        const res = await analyticsService.getAiInsight();
        if (res.success) setInsight(res.data.insight);
     } catch (err) {
        console.error('Insight failure:', err);
     } finally {
        setInsightLoading(false);
     }
  };

  if (loading) return <div className="p-8 text-center animate-pulse flex flex-col items-center"><Loader className="w-8 h-8 animate-spin mb-4" /> Loading Analytics...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 pb-12">
      
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900">Placement Analytics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* 1. Overall Readiness */}
         <Card className="p-6 col-span-1 lg:col-span-1 flex flex-col justify-center text-center border-indigo-100 bg-indigo-50">
            <h2 className="text-lg font-bold text-gray-700 mb-2">Placement Readiness</h2>
            <div className="text-6xl font-black text-indigo-700">
               {data.readiness.score !== null ? data.readiness.score : '--'}
            </div>
            <div className="text-sm text-gray-500 mt-2">out of 100</div>
            {data.readiness.trend.length <= 1 && (
               <div className="text-xs text-gray-400 mt-4">First assessment: Not available</div>
            )}
         </Card>

         {/* 2. AI Insight */}
         <Card className="p-6 col-span-1 lg:col-span-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3 text-purple-700">
               <Sparkles className="w-5 h-5" />
               <h2 className="text-lg font-bold">Weekly Insight</h2>
            </div>
            {insightLoading ? (
               <div className="flex items-center gap-2 text-sm text-gray-500"><Loader className="w-4 h-4 animate-spin" /> Generating AI insight...</div>
            ) : (
               <p className="text-gray-800 text-lg leading-relaxed font-medium">
                  {insight || data.deterministicInsight}
               </p>
            )}
         </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* 3. Roadmap Progress */}
         <Card className="p-5">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Roadmap Progress</h3>
            <div className="text-3xl font-black text-gray-800 mb-1">{data.roadmap.progress}%</div>
            <div className="text-xs text-gray-500">
               Completed: {data.roadmap.completed} | Remaining: {data.roadmap.remaining} | Total: {data.roadmap.total}
            </div>
         </Card>

         {/* 4. Interview Average */}
         <Card className="p-5">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Interview Avg</h3>
            {data.interviews.count > 0 ? (
               <>
                 <div className="text-3xl font-black text-gray-800 mb-1">{data.interviews.average}</div>
                 <div className="text-xs text-gray-500">Across {data.interviews.count} sessions. Best: {data.interviews.best}</div>
               </>
            ) : (
               <div className="text-sm text-gray-400 mt-4">No interviews completed yet.</div>
            )}
         </Card>

         {/* 5. Coding Analytics */}
         <Card className="p-5">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Coding Acceptance</h3>
            {data.coding.total > 0 ? (
               <>
                 <div className="text-3xl font-black text-gray-800 mb-1">{data.coding.acceptanceRate}%</div>
                 <div className="text-xs text-gray-500">{data.coding.accepted} accepted out of {data.coding.total} submissions.</div>
               </>
            ) : (
               <div className="text-sm text-gray-400 mt-4">Data unavailable.</div>
            )}
         </Card>

         {/* 6. Academic (Aptitude/ECE) */}
         <Card className="p-5">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Academics Avg</h3>
            {data.academics.totalAttempts > 0 ? (
               <>
                 <div className="text-3xl font-black text-gray-800 mb-1">{data.academics.averageScore}%</div>
                 <div className="text-xs text-gray-500">Across {data.academics.totalAttempts} assessments.</div>
               </>
            ) : (
               <div className="text-sm text-gray-400 mt-4">Data unavailable.</div>
            )}
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* 7. Component Performance */}
         <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-500"/> Component Performance</h3>
            <div className="space-y-3">
               {Object.keys(data.components).map(k => (
                  <div key={k} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                     <span className="font-semibold text-gray-700">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                     <span className="font-bold text-indigo-600">{data.components[k] !== null ? data.components[k] : 'N/A'}</span>
                  </div>
               ))}
            </div>
         </Card>

         {/* 8. Persistent Weaknesses */}
         <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-orange-500"/> Persistent Weak Areas</h3>
            {data.persistentWeaknesses.length > 0 ? (
               <div className="space-y-3">
                  {data.persistentWeaknesses.map((w, idx) => (
                     <div key={idx} className="p-3 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg">
                        <div className="font-bold text-orange-800">{w.area}</div>
                        <div className="text-xs text-orange-600">Detected in {w.frequency} modules (Readiness/Interview/Roadmap). Priority: Critical.</div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="text-gray-500 text-sm">No persistent weaknesses detected across multiple modules yet.</div>
            )}
         </Card>
      </div>

      {/* 9. Company Preparation & Resume */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-emerald-500"/> Target Company</h3>
            {data.company.target ? (
               <div className="text-center p-6 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="text-xl font-bold text-emerald-800 mb-2">{data.company.target}</div>
                  <div className="text-sm text-emerald-600">Preparation Score: <span className="font-bold">{data.company.preparationScore || 'N/A'}</span></div>
               </div>
            ) : (
               <div className="text-gray-500 text-sm italic">Select a target company in your Roadmap to see company-specific analytics.</div>
            )}
         </Card>

         <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Resume Analytics</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
               <div className="p-3 bg-gray-50 rounded-lg border">
                  <div className="text-2xl font-black text-gray-800">{data.resume.skillsCount}</div>
                  <div className="text-xs text-gray-500">Listed Skills</div>
               </div>
               <div className="p-3 bg-gray-50 rounded-lg border">
                  <div className="text-2xl font-black text-gray-800">{data.resume.projectsCount}</div>
                  <div className="text-xs text-gray-500">Projects</div>
               </div>
            </div>
         </Card>
      </div>
      
    </div>
  );
}
