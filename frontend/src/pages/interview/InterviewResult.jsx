import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInterviewStore } from '../../store/interviewStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Trophy, ArrowLeft, Target, AlertCircle, CheckCircle2, Award, BookOpen } from 'lucide-react';

export default function InterviewResult() {
  const { id } = useParams();
  const { activeSession, getSession, isLoading } = useInterviewStore();

  useEffect(() => {
    getSession(id);
  }, [id, getSession]);

  if (isLoading && !activeSession) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"/></div>;
  }

  if (!activeSession) return <div className="p-8 text-center text-red-500">Result not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <Link to="/interviews">
          <Button variant="ghost" size="sm" className="text-gray-500"><ArrowLeft size={16} className="mr-2"/> Back to Dashboard</Button>
        </Link>
      </div>

      {/* Header Overview */}
      <Card className="p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white overflow-hidden relative">
        <Trophy className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 rotate-12" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Interview Completed!</h1>
          <p className="text-indigo-100 mb-8">{activeSession.sessionType} • {activeSession.difficulty}</p>
          
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-indigo-200 text-sm font-semibold uppercase tracking-wider mb-1">Overall Score</p>
              <div className="text-5xl font-extrabold">{activeSession.overallScore}<span className="text-2xl text-indigo-300">/100</span></div>
            </div>
            {['Technical', 'Core ECE', 'Coding', 'HR'].map((cat) => {
               const scoreName = cat.replace(' ', '').toLowerCase() + 'Score';
               const score = activeSession[cat === 'Core ECE' ? 'coreEceScore' : cat === 'HR' ? 'hrScore' : scoreName];
               if (score === null) return null;
               return (
                 <div key={cat}>
                   <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">{cat}</p>
                   <div className="text-2xl font-bold">{score}<span className="text-sm text-indigo-300">/100</span></div>
                 </div>
               )
            })}
          </div>
        </div>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="p-6 border-emerald-100 bg-emerald-50/30 dark:bg-emerald-900/10 dark:border-emerald-900/20">
           <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-400 mb-4 flex items-center gap-2">
             <CheckCircle2 className="text-emerald-500" /> Key Strengths
           </h3>
           <ul className="space-y-2">
             {activeSession.strengths?.length > 0 ? activeSession.strengths.map((s, i) => (
               <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                 <span className="text-emerald-500 mt-1">•</span> {s}
               </li>
             )) : <li className="text-sm text-gray-500">Not enough data to determine strengths yet.</li>}
           </ul>
         </Card>
         <Card className="p-6 border-amber-100 bg-amber-50/30 dark:bg-amber-900/10 dark:border-amber-900/20">
           <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-400 mb-4 flex items-center gap-2">
             <Target className="text-amber-500" /> Areas for Improvement
           </h3>
           <ul className="space-y-2">
             {activeSession.weaknesses?.length > 0 ? activeSession.weaknesses.map((w, i) => (
               <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                 <span className="text-amber-500 mt-1">•</span> {w}
               </li>
             )) : <li className="text-sm text-gray-500">No major weaknesses identified!</li>}
           </ul>
         </Card>
      </div>

      {/* Question Review */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="text-indigo-500" /> Detailed Review
        </h2>
        
        {activeSession.questions.map((q, idx) => (
          <Card key={q._id} className="p-6 md:p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6">
              
              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-2 mb-2">
                   <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400">Q{idx + 1}</span>
                   <span className="px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-900/30 text-xs font-semibold text-indigo-600 dark:text-indigo-400">{q.category}</span>
                 </div>
                 <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{q.question}</h4>
                 <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                   <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2 uppercase text-xs tracking-wider">Your Answer:</p>
                   <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{q.userAnswer}</p>
                 </div>
              </div>

              <div className="md:w-80 space-y-4">
                 <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                   <div className="flex items-center justify-between mb-3">
                     <p className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">AI Evaluation</p>
                     {q.evaluationFailed ? (
                       <span className="text-red-500 text-sm font-bold flex items-center gap-1"><AlertCircle size={14}/> Failed</span>
                     ) : (
                       <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300">{q.score}<span className="text-sm font-normal text-indigo-400">/100</span></div>
                     )}
                   </div>
                   
                   <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                     {q.feedback}
                   </p>

                   {q.missingConcepts?.length > 0 && (
                     <div className="mb-3">
                       <p className="text-xs uppercase font-bold text-amber-600 dark:text-amber-500 mb-1">Missing Concepts</p>
                       <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                         {q.missingConcepts.map((c,i) => <li key={i}>• {c}</li>)}
                       </ul>
                     </div>
                   )}

                   {q.improvementSuggestion && (
                     <div>
                       <p className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-500 mb-1 flex items-center gap-1"><Award size={12}/> Suggestion</p>
                       <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{q.improvementSuggestion}</p>
                     </div>
                   )}
                 </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
