import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../../store/interviewStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Brain, CheckCircle2, ChevronRight, ChevronLeft, Loader2, AlertTriangle, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function ActiveInterview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    activeSession, 
    getSession, 
    submitAnswer, 
    finishSession, 
    isSubmitting, 
    isLoading, 
    currentQuestionIndex, 
    setCurrentQuestionIndex 
  } = useInterviewStore();
  
  const [answerText, setAnswerText] = useState('');

  useEffect(() => {
    getSession(id);
  }, [id, getSession]);

  useEffect(() => {
    if (activeSession && activeSession.questions[currentQuestionIndex]) {
       const q = activeSession.questions[currentQuestionIndex];
       setAnswerText(q.userAnswer || '');
    }
  }, [activeSession, currentQuestionIndex]);

  if (isLoading && !activeSession) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!activeSession) {
    return <div className="p-8 text-center text-red-500">Session not found.</div>;
  }

  if (activeSession.status === 'Completed') {
    navigate(`/interviews/results/${id}`);
    return null;
  }

  const questions = activeSession.questions || [];
  const currentQ = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const hasAnswered = currentQ?.score !== null || currentQ?.evaluationFailed;
  const allQuestionsAnswered = questions.every(q => q.userAnswer && !q.evaluationFailed);

  const handleNext = () => {
    if (!isLastQuestion) setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePrev = () => {
    if (!isFirstQuestion) setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleSubmit = async () => {
    if (!answerText.trim()) {
      toast.error('Please enter an answer before submitting.');
      return;
    }
    await submitAnswer(currentQ._id, answerText);
  };

  const handleFinish = async () => {
    if (!allQuestionsAnswered) {
       toast.error('Please complete and successfully evaluate all questions before finishing.');
       return;
    }
    try {
      await finishSession();
      navigate(`/interviews/results/${id}`);
    } catch (e) {
      // error handled in store
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Brain className="text-indigo-500" /> Mock Interview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeSession.sessionType} • {activeSession.difficulty}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Progress {currentQuestionIndex + 1} / {questions.length}
          </p>
          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
             <div 
               className="h-full bg-indigo-500 transition-all duration-300"
               style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
             />
          </div>
        </div>
      </div>

      <Card className="p-6 md:p-8">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 mb-4">
            {currentQ.category}
          </span>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
            {currentQ.question}
          </h2>
        </div>

        <div className="space-y-4">
          <textarea
            className="w-full h-48 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-gray-700 dark:text-gray-200 transition-all"
            placeholder="Type your detailed answer here..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            disabled={isSubmitting}
          />
          
          {hasAnswered && (
             <div className={`p-4 rounded-lg border ${currentQ.evaluationFailed ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/10 dark:border-emerald-900/30'}`}>
               <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
                 {currentQ.evaluationFailed ? (
                   <><AlertTriangle size={16} className="text-red-500"/> Evaluation Failed</>
                 ) : (
                   <><CheckCircle2 size={16} className="text-emerald-500"/> Evaluated Successfully (Score: {currentQ.score}/100)</>
                 )}
               </h4>
               <p className="text-sm">{currentQ.feedback}</p>
             </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrev} disabled={isFirstQuestion || isSubmitting}>
                <ChevronLeft size={16} className="mr-1" /> Previous
              </Button>
              <Button variant="outline" onClick={handleNext} disabled={isLastQuestion || isSubmitting}>
                Next <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !answerText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin mr-2"/> : <Send size={16} className="mr-2"/>}
                {currentQ.evaluationFailed ? 'Retry Evaluation' : 'Submit Answer'}
              </Button>
              
              {isLastQuestion && (
                <Button 
                  onClick={handleFinish} 
                  disabled={!allQuestionsAnswered || isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Finish Interview
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
