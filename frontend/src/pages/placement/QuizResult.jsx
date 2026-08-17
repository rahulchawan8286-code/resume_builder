import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CircularProgress } from '../../components/ui/CircularProgress';
import { AIChatBubble } from '../../components/ui/AIChatBubble';
import { resultService } from '../../api/resultService';
import { Loader2 } from 'lucide-react';
import { ErrorState } from '../../components/ui/ErrorState';

export default function QuizResult() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchResult = async () => {
      try {
        const data = await resultService.getResultById(id);
        if (mounted) setResult(data);
      } catch (err) {
        if (mounted) setError('Failed to load result. Please try again.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchResult();
    return () => { mounted = false; };
  }, [id]);

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

  const percentage = (result.score / result.totalQuestions) * 100;
  const passed = result.passed;

  return (
    <div className="space-y-8 pt-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Test Results: {result.quiz?.title}</h1>
        <p className="text-gray-500 dark:text-gray-400">Detailed breakdown of your performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 flex flex-col items-center justify-center py-8">
          <CircularProgress value={percentage} size={160} color={passed ? "text-emerald-500" : "text-rose-500"} />
          <h2 className="mt-4 text-2xl font-bold dark:text-white">{passed ? 'Passed!' : 'Needs Improvement'}</h2>
          <p className="text-gray-500 text-sm">{result.score} / {result.totalQuestions} Correct</p>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Subject:</span>
                <span className="font-medium dark:text-gray-200">{result.quiz?.subject?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Passing Score Required:</span>
                <span className="font-medium dark:text-gray-200">{result.quiz?.passingScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Your Accuracy:</span>
                <span className="font-medium dark:text-gray-200">{percentage.toFixed(1)}%</span>
              </div>
            </div>
            {/* Keeping the AI chat bubble as a placeholder for future AI integration as it's part of the design system */}
            <AIChatBubble isUser={false} message={`You ${passed ? 'successfully passed' : 'did not pass'} this test. ${passed ? 'Great job! Keep practicing to maintain your skills.' : 'Review the concepts and try again.'}`} />
            
            <div className="flex gap-4 mt-6">
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white"><Link to="/placement/aptitude">Back to Practice</Link></Button>
              <Button variant="outline" asChild><Link to="/dashboard">Go to Dashboard</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}