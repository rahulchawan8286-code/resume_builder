import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useInterviewStore } from '../../store/interviewStore';
import { PlayCircle, Target, Trophy, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../../api/apiClient';

export default function InterviewDashboard() {
  const { performance, getPerformance, startSession, error: storeError, clearActiveSession } = useInterviewStore();
  const [localLoading, setLocalLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    clearActiveSession();
    const fetchData = async () => {
      try {
        await getPerformance();
        const cRes = await apiClient.get('/company');
        if (cRes.data && cRes.data.data) {
          setCompanies(cRes.data.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch interview data.');
      } finally {
        setLocalLoading(false);
      }
    };
    fetchData();
  }, [getPerformance, clearActiveSession]);

  const handleStart = async (type) => {
    try {
      setIsStarting(true);
      const session = await startSession(type, difficulty, selectedCompanyId || null);
      if (session && session._id) {
        navigate(`/interviews/session/${session._id}`);
      }
    } catch (err) {
      // Error handled in store, shown via toast
    } finally {
      setIsStarting(false);
    }
  };

  if (localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 pb-12">
      
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mock Interviews</h1>
           <p className="text-gray-500 dark:text-gray-400">Practice under pressure. AI-evaluated technical and behavioral sessions.</p>
        </div>
        {performance && (
          <div className="text-right">
             <div className="text-sm font-semibold text-gray-500 uppercase">Average Score</div>
             <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{performance.overall || 0}</div>
          </div>
        )}
      </div>

      {(error || storeError) && (
         <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-4 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400">
           <AlertCircle className="w-5 h-5 flex-shrink-0" />
           {error || storeError}
         </div>
      )}

      {!performance && !localLoading && !error && (
        <Card className="p-8 text-center border-dashed border-2 bg-gray-50 dark:bg-gray-900/50">
           <Trophy className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
           <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">You haven&apos;t completed a mock interview yet.</h3>
           <p className="text-gray-500 dark:text-gray-400 mb-4">Start your first interview below to baseline your skills.</p>
        </Card>
      )}

      {/* Start New Session Panel */}
      <Card className="p-6 border-indigo-100 dark:border-indigo-900/30">
         <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Target className="text-indigo-500"/> Start a New Mock Interview</h2>
         <div className="flex flex-wrap gap-4 mb-6">
           <div className="flex-1 min-w-[200px]">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Company <span className="text-xs text-indigo-500 font-normal">(Tailors questions to company requirements)</span></label>
             <select 
               value={selectedCompanyId} 
               onChange={e => setSelectedCompanyId(e.target.value)}
               className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm text-sm p-2 outline-none focus:border-indigo-500"
             >
               <option value="">No specific target</option>
               {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
             </select>
           </div>
           <div className="flex-1 min-w-[200px]">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
             <select 
               value={difficulty} 
               onChange={e => setDifficulty(e.target.value)}
               className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm text-sm p-2 outline-none focus:border-indigo-500"
             >
               <option value="Easy">Easy</option>
               <option value="Medium">Medium</option>
               <option value="Hard">Hard</option>
             </select>
           </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {['Technical', 'Core ECE', 'Coding', 'HR', 'Mixed'].map(type => (
             <Button 
                key={type} 
                variant="outline"
                disabled={isStarting}
                onClick={() => handleStart(type)}
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-gray-200 dark:border-gray-800 transition-colors"
             >
               {isStarting ? <Loader2 className="w-8 h-8 text-indigo-500 mb-1 animate-spin" /> : <PlayCircle className="w-8 h-8 text-indigo-500 mb-1" />}
               <span className="font-bold text-gray-800 dark:text-gray-200">{type} Interview</span>
               <span className="text-xs text-gray-500 font-normal">5 AI Generated Questions</span>
             </Button>
           ))}
         </div>
      </Card>

      {/* History */}
      {performance && performance.history && performance.history.length > 0 && (
         <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Recent Sessions</h2>
            <div className="space-y-3">
              {performance.history.map((h, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                   <div>
                     <span className="font-bold text-gray-800 dark:text-gray-200">{h.type} Interview</span>
                     <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(h.date).toLocaleString()}
                     </div>
                   </div>
                   <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                     {h.score} <span className="text-sm font-normal text-gray-400">/100</span>
                   </div>
                </div>
              ))}
            </div>
         </Card>
      )}

    </div>
  );
}
