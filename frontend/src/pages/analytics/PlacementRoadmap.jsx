import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import { readinessService } from '../../api/readinessService';
import { roadmapService } from '../../api/roadmapService';
import { Map, RefreshCw, CheckCircle, Brain, Target, AlertCircle, Clock } from 'lucide-react';
import { apiClient } from '../../api/apiClient';

export default function PlacementRoadmap() {
  const [readiness, setReadiness] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch readiness first
      const rRes = await readinessService.getReadiness();
      if (rRes.success && rRes.data) {
        setReadiness(rRes.data);
      }

      // Fetch roadmap
      const rmRes = await roadmapService.getRoadmap();
      if (rmRes.success && rmRes.data) {
        setRoadmap(rmRes.data);
        if (rmRes.data.targetCompany) setSelectedCompanyId(rmRes.data.targetCompany._id);
      }

      // Fetch companies
      try {
         const cRes = await apiClient.get('/company');
         if (cRes.data && cRes.data.data) {
           setCompanies(cRes.data.data);
         }
      } catch (err) {
         console.error('Failed to load companies:', err);
      }

    } catch (err) {
      setError(err.message || 'Failed to fetch roadmap data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      await roadmapService.generateRoadmap(selectedCompanyId || null);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to generate roadmap.');
      setLoading(false);
    }
  };

  const handleAiPersonalize = async () => {
    try {
      setAiLoading(true);
      await roadmapService.generateAiPersonalization();
      await fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to apply AI personalization.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      // Optimistic update
      const updatedRoadmap = { ...roadmap };
      let found = false;
      updatedRoadmap.weeks.forEach(w => {
        w.tasks.forEach(t => {
          if (t._id === taskId) {
            t.isCompleted = !currentStatus;
            t.completedAt = t.isCompleted ? new Date() : null;
            found = true;
          }
        });
      });
      if (found) setRoadmap(updatedRoadmap);

      // Backend update
      const res = await roadmapService.updateTask(taskId, !currentStatus);
      if (res.success) {
        setRoadmap(prev => ({ ...prev, overallProgress: res.data.progress }));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update task.');
      fetchData(); // Revert on failure
    }
  };

  if (loading && !roadmap) {
    return <div className="p-8 text-center animate-pulse">Loading Personalized Roadmap...</div>;
  }

  if (error) {
    return (
       <div className="p-8 text-center text-gray-600">
         <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
         <p>{error}</p>
         <Button onClick={fetchData} className="mt-4">Retry</Button>
       </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <Map className="w-16 h-16 mx-auto mb-6 text-indigo-400" />
        <h2 className="text-2xl font-bold mb-4">Your Placement Journey Starts Here</h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">
          Complete a few placement activities (like quizzes, coding practice, or resume building) to generate your personalized step-by-step roadmap.
        </p>
        <div className="flex items-center justify-center gap-4 max-w-sm mx-auto mb-8">
           <select 
              value={selectedCompanyId} 
              onChange={e => setSelectedCompanyId(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm text-sm"
           >
              <option value="">No specific target company</option>
              {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
           </select>
        </div>
        <Button onClick={handleGenerate} className="px-8 py-3 text-lg">Generate My Roadmap</Button>
      </div>
    );
  }

  const { overallProgress, skillGaps, weeks, targetCompany, lastAiPersonalizedAt } = roadmap;

  const priorityColors = {
    'Critical': 'text-red-600 bg-red-50 border-red-200',
    'High': 'text-orange-600 bg-orange-50 border-orange-200',
    'Medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'Low': 'text-blue-600 bg-blue-50 border-blue-200',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 pb-12">
      {/* Header & Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="p-6 col-span-1 md:col-span-2 flex flex-col justify-center border-indigo-100 bg-indigo-50/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your Placement Roadmap</h1>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <Target className="w-4 h-4 text-indigo-500" />
                  Target: <span className="font-semibold text-gray-900">{targetCompany ? targetCompany.name : 'General ECE Placement'}</span>
                </div>
              </div>
              <Button onClick={handleAiPersonalize} disabled={aiLoading} size="sm" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
                {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                {lastAiPersonalizedAt ? 'Regenerate AI Tips' : 'AI Personalize'}
              </Button>
            </div>
            
            <div className="space-y-2 mt-4">
               <div className="flex justify-between text-sm font-medium">
                 <span className="text-gray-700">Roadmap Progress</span>
                 <span className="text-indigo-600">{overallProgress}%</span>
               </div>
               <Progress value={overallProgress} className="h-3" />
            </div>
         </Card>

         <Card className="p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Current Readiness</h3>
            <div className="text-5xl font-black text-gray-900 mb-2">
              {readiness?.overallScore !== null ? `${readiness?.overallScore}` : '-'}
              <span className="text-xl text-gray-400 font-normal">/100</span>
            </div>
            <p className="text-xs text-gray-400">Determined by Phase 6 Engine</p>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Col: Skill Gaps */}
         <div className="lg:col-span-1 space-y-6">
           <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Priority Skill Gaps</h2>
                <Button variant="outline" size="sm" onClick={handleGenerate} className="text-xs h-7 px-2">Recalculate</Button>
              </div>
              
              {skillGaps && skillGaps.length > 0 ? (
                <div className="space-y-4">
                  {skillGaps.map((gap, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${priorityColors[gap.priority]}`}>
                       <div className="flex justify-between items-center mb-1">
                         <span className="font-bold">{gap.skill}</span>
                         <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/50">{gap.priority}</span>
                       </div>
                       <p className="text-xs opacity-80">{gap.reason}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic text-center py-4">No critical skill gaps identified.</p>
              )}
           </Card>
         </div>

         {/* Right Col: Weekly Plan */}
         <div className="lg:col-span-2 space-y-8">
            {weeks && weeks.map((week) => (
              <div key={week.weekNumber} className="relative">
                 <div className="sticky top-0 bg-white/90 backdrop-blur-sm py-2 mb-4 border-b z-10 flex items-end justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Week {week.weekNumber}</h3>
                      <p className="text-sm text-gray-500">{week.title}</p>
                    </div>
                    {/* Calculate weekly progress */}
                    <div className="text-sm font-semibold text-indigo-600">
                      {Math.round((week.tasks.filter(t => t.isCompleted).length / Math.max(1, week.tasks.length)) * 100)}%
                    </div>
                 </div>

                 <div className="space-y-3">
                   {week.tasks.map((task) => (
                     <div key={task._id} className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${task.isCompleted ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-indigo-300 shadow-sm'}`}>
                        <button 
                          onClick={() => handleToggleTask(task._id, task.isCompleted)}
                          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 text-transparent hover:border-indigo-400'}`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1 flex-wrap">
                             <h4 className={`font-semibold text-base ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</h4>
                             <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{task.category}</span>
                             {task.priority === 'Critical' && <span className="w-2 h-2 rounded-full bg-red-500" title="Critical Priority"></span>}
                           </div>
                           <p className={`text-sm ${task.isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>{task.description}</p>
                           
                           <div className="flex items-center gap-4 mt-3">
                             <div className="flex items-center gap-1 text-xs font-medium text-gray-400">
                               <Clock className="w-3.5 h-3.5" />
                               {task.estimatedMinutes} mins
                             </div>
                             {task.isCompleted && task.completedAt && (
                               <div className="text-xs text-emerald-600 font-medium">
                                 Completed {new Date(task.completedAt).toLocaleDateString()}
                               </div>
                             )}
                           </div>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
