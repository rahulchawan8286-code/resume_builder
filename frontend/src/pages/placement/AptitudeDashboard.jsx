import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { quizService } from '../../api/quizService';
import { Loader2, AlertCircle } from 'lucide-react';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

export default function AptitudeDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await quizService.getQuizzes();
      // Filter for Aptitude subjects (code starts with APT)
      const aptQuizzes = data.filter(q => q.subject?.code?.startsWith('APT'));
      setQuizzes(aptQuizzes);
    } catch (err) {
      setError('Failed to load aptitude tests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchQuizzes} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Aptitude Practice</h1>
        <p className="text-gray-500 dark:text-gray-400">Master quantitative and logical reasoning for placements.</p>
      </div>

      {quizzes.length === 0 ? (
        <EmptyState 
          icon={<AlertCircle className="w-12 h-12 text-gray-400" />}
          title="No Aptitude Tests Found"
          description="Check back later for new tests."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <Card key={quiz._id}>
              <CardHeader>
                <CardTitle className="text-xl">{quiz.title}</CardTitle>
                <CardDescription>{quiz.timeLimit} mins • Pass: {quiz.passingScore}%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 h-10 overflow-hidden">
                  {quiz.description}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm font-medium px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 rounded-md">
                    {quiz.subject?.name}
                  </span>
                  <Button asChild>
                    <Link to={`/placement/quiz/${quiz._id}`}>Start Test</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}