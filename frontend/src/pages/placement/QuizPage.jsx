import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import { quizService } from '../../api/quizService';
import { useQuizStore } from '../../store/quizStore';
import { Loader2, AlertCircle, Clock } from 'lucide-react';
import { ErrorState } from '../../components/ui/ErrorState';
import { toast } from 'sonner';

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    questions,
    answers,
    timeRemaining,
    isSubmitting,
    startQuiz,
    setAnswer,
    decrementTime,
    setTimerInterval,
    setSubmitting,
    clearQuiz
  } = useQuizStore();

  useEffect(() => {
    let mounted = true;
    const fetchQuiz = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await quizService.getQuizQuestions(id);
        if (mounted) {
          startQuiz(data.quiz, data.questions);
          // start timer
          const interval = setInterval(() => {
            const currentRemaining = useQuizStore.getState().timeRemaining;
            if (currentRemaining <= 0) {
              clearInterval(interval);
              handleAutoSubmit();
            } else {
              decrementTime();
            }
          }, 1000);
          setTimerInterval(interval);
        }
      } catch (err) {
        if (mounted) setError('Failed to load quiz. Please try again.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchQuiz();

    return () => {
      mounted = false;
      clearQuiz();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAutoSubmit = async () => {
    toast.error("Time's up! Submitting your answers automatically.");
    await submitTest();
  };

  const handleManualSubmit = async () => {
    if (window.confirm('Are you sure you want to submit your test?')) {
      await submitTest();
    }
  };

  const submitTest = async () => {
    const storeState = useQuizStore.getState();
    if (storeState.isSubmitting) return;

    setSubmitting(true);
    try {
      const resultData = await quizService.submitQuiz(id, storeState.answers);
      clearQuiz();
      navigate(`/placement/result/${resultData.resultId}`);
    } catch (err) {
      toast.error('Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  };

  const handleSelect = (optionId) => {
    if (!questions[currentIdx]) return;
    setAnswer(questions[currentIdx]._id, optionId);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 pt-16">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return <div className="pt-16"><ErrorState message={error} onRetry={() => window.location.reload()} /></div>;
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="pt-16 text-center text-gray-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        No questions found for this quiz.
      </div>
    );
  }

  const question = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  // Format time (mm:ss)
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold dark:text-white">Question {currentIdx + 1} of {questions.length}</h2>
        <div className={`flex items-center gap-2 text-lg font-mono ${timeRemaining < 60 ? 'text-red-600 animate-pulse' : 'text-indigo-600 dark:text-indigo-400'}`}>
          <Clock size={20} />
          <span>{timeString}</span>
        </div>
      </div>
      <Progress value={progress} className="h-2" />

      <Card className="mt-8">
        <CardContent className="p-8">
          <h3 className="text-xl font-medium mb-8 dark:text-gray-100">{question.text}</h3>
          <div className="space-y-4">
            {question.options.map((opt) => (
              <button
                key={opt._id}
                onClick={() => handleSelect(opt._id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[question._id] === opt._id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100' : 'border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:text-gray-300'}`}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}>
          Previous
        </Button>
        {currentIdx === questions.length - 1 ? (
          <Button onClick={handleManualSubmit} isLoading={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Submit Test
          </Button>
        ) : (
          <Button onClick={handleNext}>Next Question</Button>
        )}
      </div>
    </div>
  );
}