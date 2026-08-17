import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { interviewService } from '../../api/interviewService';
import { ArrowRight, CheckCircle, BrainCircuit, Loader } from 'lucide-react';

export default function MockInterview() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await interviewService.getSession(id);
        if (res.success && res.data) {
          if (res.data.status === 'Completed') {
            navigate(`/analytics/interview-results/${id}`);
            return;
          }
          setSession(res.data);
          // Find first unanswered
          const unansweredIdx = res.data.questions.findIndex(q => !q.userAnswer);
          setCurrentIdx(unansweredIdx !== -1 ? unansweredIdx : res.data.questions.length - 1);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch session.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id, navigate]);

  const handleSubmit = async () => {
    if (!answer.trim()) {
       alert('Please provide an answer before submitting.');
       return;
    }
    
    try {
      setSubmitting(true);
      const q = session.questions[currentIdx];
      await interviewService.submitAnswer(id, q._id, answer);
      
      setAnswer('');
      if (currentIdx < session.questions.length - 1) {
         setCurrentIdx(currentIdx + 1);
      } else {
         // Finished last question
         await interviewService.finishSession(id);
         navigate(`/analytics/interview-results/${id}`);
      }
    } catch (err) {
      alert('Failed to submit answer: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinishEarly = async () => {
      if(window.confirm('Are you sure you want to finish the interview early? Unanswered questions will receive a 0 score.')) {
          try {
             setSubmitting(true);
             await interviewService.finishSession(id);
             navigate(`/analytics/interview-results/${id}`);
          } catch(err) {
             alert('Failed to finish session.');
             setSubmitting(false);
          }
      }
  };

  if (loading) return <div className="p-8 text-center animate-pulse flex flex-col items-center"><Loader className="w-8 h-8 animate-spin mb-4" /> Loading Interview Environment...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!session) return null;

  const currentQuestion = session.questions[currentIdx];

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 pb-12">
       
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             <BrainCircuit className="w-6 h-6 text-indigo-600" />
             <h1 className="text-xl font-bold text-gray-900">{session.sessionType} Interview</h1>
          </div>
          <div className="text-sm font-semibold text-gray-500">
             Question {currentIdx + 1} of {session.questions.length}
          </div>
       </div>

       <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
             className="bg-indigo-600 h-full transition-all duration-500" 
             style={{ width: `${((currentIdx) / session.questions.length) * 100}%` }}
          />
       </div>

       <Card className="p-8 border-indigo-100 shadow-md">
          <div className="flex gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2 py-1 rounded">
               {currentQuestion.category}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider bg-orange-50 text-orange-600 px-2 py-1 rounded">
               {currentQuestion.difficulty}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
             {currentQuestion.question}
          </h2>

          <div className="space-y-4">
             <label className="block text-sm font-semibold text-gray-700">Your Answer</label>
             <textarea 
                className="w-full h-48 p-4 rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                placeholder="Type your detailed answer here..."
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                disabled={submitting}
             />
             <p className="text-xs text-gray-400">Aim for clarity, technical correctness, and completeness. AI will evaluate your response.</p>
          </div>

          <div className="mt-8 flex justify-between items-center">
             <button onClick={handleFinishEarly} disabled={submitting} className="text-sm text-red-500 hover:text-red-700 font-medium">
                End Interview Early
             </button>

             <Button 
                onClick={handleSubmit} 
                disabled={submitting || !answer.trim()}
                className="px-8 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
             >
                {submitting ? <Loader className="w-4 h-4 animate-spin" /> : (
                  currentIdx === session.questions.length - 1 ? <CheckCircle className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />
                )}
                {currentIdx === session.questions.length - 1 ? 'Submit & Finish' : 'Submit & Next'}
             </Button>
          </div>
       </Card>
    </div>
  );
}
