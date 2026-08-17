import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useRoadmapStore } from '../../store/roadmapStore';
import { useCompanyStore } from '../../store/companyStore';
import { Loader2, ChevronLeft, CheckCircle2, Circle, Sparkles, Map } from 'lucide-react';
import { ErrorState } from '../../components/ui/ErrorState';

export default function CompanyRoadmap() {
  const { id } = useParams(); // Company ID
  const { currentCompany, fetchCompanyById } = useCompanyStore();
  const { roadmap, fetchRoadmap, generateRoadmap, isLoading, error, progress, toggleTaskStatus } = useRoadmapStore();
  
  const [activeWeek, setActiveWeek] = useState(1);

  useEffect(() => {
    fetchCompanyById(id);
    fetchRoadmap(id);
  }, [id, fetchCompanyById, fetchRoadmap]);

  const handleGenerate = () => {
    generateRoadmap(id);
  };

  if (isLoading && !roadmap && !currentCompany) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6 pb-12">
      <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2"><Link to={`/companies/${id}`}><ChevronLeft size={20} className="mr-1"/> Back to {currentCompany?.name || 'Company'}</Link></Button>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{currentCompany?.name} - Preparation Roadmap</h1>
        <p className="text-gray-500 dark:text-gray-400">Your personalized guide to cracking {currentCompany?.name}.</p>
      </div>

      {!roadmap && !isLoading && !error && (
        <Card className="text-center py-16 px-4 border-dashed">
          <Map size={48} className="mx-auto text-indigo-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Generate Your Personalized Roadmap</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">We will analyze {currentCompany?.name}&apos;s requirements against your current skills and readiness scores to create a custom study plan.</p>
          <Button onClick={handleGenerate} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Sparkles size={16} className="mr-2"/> Generate Roadmap</Button>
        </Card>
      )}

      {error && !roadmap && <ErrorState message={error} onRetry={() => fetchRoadmap(id)} />}

      {roadmap && (
        <>
          <Card className="overflow-hidden bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
              <div>
                <h3 className="font-semibold text-lg dark:text-white">Overall Progress</h3>
                <p className="text-sm text-gray-500">{progress}% Completed</p>
              </div>
              <div className="w-64 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            
            <div className="p-6 overflow-x-auto">
              <div className="flex gap-4 min-w-max">
                {roadmap.weeks.map((week) => (
                  <button 
                    key={week.weekNumber}
                    onClick={() => setActiveWeek(week.weekNumber)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeWeek === week.weekNumber 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300' 
                        : 'bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    {week.title}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            {roadmap.weeks.find(w => w.weekNumber === activeWeek)?.tasks.map((task) => (
              <Card key={task._id} className={`transition-all duration-200 ${task.isCompleted ? 'bg-gray-50 dark:bg-gray-800/50 opacity-75' : 'bg-white dark:bg-gray-900 shadow-sm'}`}>
                <div className="p-5 flex items-start gap-4">
                  <button 
                    onClick={() => toggleTaskStatus(task._id, task.isCompleted)}
                    disabled={isLoading}
                    className={`mt-1 flex-shrink-0 transition-colors ${task.isCompleted ? 'text-emerald-500' : 'text-gray-300 hover:text-indigo-400 dark:text-gray-600 dark:hover:text-indigo-400'}`}
                  >
                    {task.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className={`font-semibold ${task.isCompleted ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                        {task.title}
                      </h4>
                      <Badge variant="outline" className={`text-[10px] ${task.priority === 'Critical' ? 'border-red-200 text-red-700 bg-red-50 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400' : task.priority === 'High' ? 'border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400' : ''}`}>
                        {task.priority} Priority
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">{task.category}</Badge>
                      <span className="text-xs text-gray-500 ml-auto">{task.estimatedMinutes} mins</span>
                    </div>
                    <p className={`text-sm ${task.isCompleted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                      {task.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
            
            {roadmap.weeks.find(w => w.weekNumber === activeWeek)?.tasks.length === 0 && (
              <div className="text-center py-8 text-gray-500">No tasks for this week.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}