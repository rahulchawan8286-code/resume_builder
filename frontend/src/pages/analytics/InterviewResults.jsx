import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { interviewService } from '../../api/interviewService';
import { Trophy, Target, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export default function InterviewResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await interviewService.getSession(id);
        if (res.success && res.data) {
          if (res.data.status !== 'Completed') {
            navigate(`/analytics/mock-interview/${id}`);
            return;
          }
          setSession(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch session results.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id, navigate]);

  if (loading) return <div className="p-8 text-center animate-pulse">Loading Results...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!session) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 pb-12">
      
      <Button variant="ghost" onClick={() => navigate('/analytics/interviews')} className="mb-4 flex items-center gap-2">
         <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Score Card */}
         <Card className="p-8 col-span-1 flex flex-col items-center justify-center text-center bg-indigo-50 border-indigo-100">
            <Trophy className={`w-16 h-16 mb-4 ${session.overallScore >= 70 ? 'text-emerald-500' : 'text-orange-500'}`} />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Overall Score</h2>
            <div className="text-6xl font-black text-indigo-700">
               {session.overallScore !== null ? session.overallScore : 0}
            </div>
            <p className="text-sm text-gray-500 mt-2">out of 100</p>
         </Card>

         {/* Breakdown */}
         <Card className="p-6 col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-500"/> Performance Breakdown</h3>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Technical', val: session.technicalScore },
                 { label: 'Core ECE', val: session.coreEceScore },
                 { label: 'Coding', val: session.codingScore },
                 { label: 'HR', val: session.hrScore }
               ].map(cat => cat.val !== null && (
                 <div key={cat.label} className="p-4 rounded-lg bg-gray-50 border border-gray-100 flex justify-between items-center">
                    <span className="font-semibold text-gray-700">{cat.label}</span>
                    <span className="text-xl font-bold text-indigo-600">{cat.val}</span>
                 </div>
               ))}
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Strengths</h4>
                  {session.strengths?.length > 0 ? (
                     <ul className="text-sm space-y-1 text-gray-700">
                        {session.strengths.map((s,i) => <li key={i}>• {s}</li>)}
                     </ul>
                  ) : <span className="text-sm text-gray-400">None identified</span>}
               </div>
               <div>
                  <h4 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-1"><XCircle className="w-4 h-4"/> Weak Areas</h4>
                  {session.weaknesses?.length > 0 ? (
                     <ul className="text-sm space-y-1 text-gray-700">
                        {session.weaknesses.map((w,i) => <li key={i}>• {w}</li>)}
                     </ul>
                  ) : <span className="text-sm text-gray-400">None identified</span>}
               </div>
            </div>
         </Card>
      </div>

      {/* Recommendations */}
      {session.recommendations?.length > 0 && (
         <Card className="p-6 bg-blue-50 border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 mb-3">Recommendations</h3>
            <ul className="space-y-2">
               {session.recommendations.map((r,i) => (
                  <li key={i} className="text-blue-800 flex items-start gap-2">
                     <span className="mt-1 font-bold text-blue-500">•</span>
                     <span>{r}</span>
                  </li>
               ))}
            </ul>
            <p className="text-xs text-blue-600 mt-4 italic">Note: If these match roadmap skill gaps, add these topics to your preparation priorities.</p>
         </Card>
      )}

      {/* Q&A Review */}
      <h3 className="text-xl font-bold mt-8 mb-4">Question & Answer Review</h3>
      <div className="space-y-6">
         {session.questions.map((q, i) => (
            <Card key={q._id} className="p-6">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                     <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">{i+1}</span>
                     <span className="text-xs font-bold uppercase bg-gray-100 text-gray-600 px-2 py-1 rounded">{q.category}</span>
                  </div>
                  <div className="text-right">
                     <div className="text-sm text-gray-500">Score</div>
                     <div className={`font-bold ${q.score >= 70 ? 'text-emerald-600' : 'text-orange-600'}`}>{q.score !== null ? q.score : 0}/100</div>
                  </div>
               </div>
               
               <h4 className="font-semibold text-lg mb-3">{q.question}</h4>
               
               <div className="bg-gray-50 rounded p-4 mb-4">
                  <span className="text-xs font-bold text-gray-500 uppercase mb-1 block">Your Answer</span>
                  <p className="text-gray-800 whitespace-pre-wrap">{q.userAnswer || <span className="italic text-gray-400">No answer provided</span>}</p>
               </div>
               
               <div className="bg-indigo-50/50 rounded p-4 border border-indigo-100">
                  <span className="text-xs font-bold text-indigo-500 uppercase mb-1 block">AI Evaluator Feedback</span>
                  <p className="text-gray-700">{q.feedback || 'No feedback available.'}</p>
                  
                  {q.expectedTopics?.length > 0 && (
                     <div className="mt-3">
                        <span className="text-xs font-semibold text-gray-500 mb-1 block">Expected Concepts:</span>
                        <div className="flex flex-wrap gap-2">
                           {q.expectedTopics.map((t, idx) => (
                              <span key={idx} className="text-[10px] bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded-full">{t}</span>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            </Card>
         ))}
      </div>

    </div>
  );
}
