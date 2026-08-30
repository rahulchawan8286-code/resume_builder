import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Play, AlertCircle } from 'lucide-react';

export default function PracticeTest() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    import('../../api/quizService').then(({ quizService }) => {
      // First, try treating 'id' as a specific quizId
      quizService.getQuizQuestions(id)
        .then(data => {
          if (!isMounted) return;
          if (data && data.quiz) {
            setQuiz(data.quiz);
            setQuestionsCount(data.questions?.length || 0);
            setIsLoading(false);
          } else {
            throw new Error("Not a direct quiz");
          }
        })
        .catch(() => {
          // Fallback: treat 'id' as a subjectId
          quizService.getQuizzes(id)
            .then(quizzes => {
              if (!isMounted) return;
              if (quizzes && quizzes.length > 0) {
                // If there are multiple quizzes for the subject, default to the first one
                const currentQuiz = quizzes[0];
                setQuiz(currentQuiz);
                
                // Fetch questions to get the exact count
                quizService.getQuizQuestions(currentQuiz._id)
                  .then(data => {
                    if (isMounted && data && data.questions) {
                      setQuestionsCount(data.questions.length);
                    }
                    setIsLoading(false);
                  })
                  .catch(err => {
                    console.error('Failed to fetch quiz questions', err);
                    if (isMounted) setIsLoading(false);
                  });
              } else {
                setIsLoading(false);
              }
            })
            .catch(err => {
              console.error('Failed to fetch quizzes', err);
              if (isMounted) {
                setError('Failed to load the practice test. Please try again.');
                setIsLoading(false);
              }
            });
        });
    });

    return () => { isMounted = false; };
  }, [id]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-12">
        <Card className="text-center py-12 border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-lg font-medium text-red-800 dark:text-red-400">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-12">
      <Card className="text-center py-12">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 mb-4">
            <Play size={32} />
          </div>
          <CardTitle className="text-3xl">
            {isLoading ? 'Loading Practice Test...' : (quiz ? quiz.title : 'Practice Test')}
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            {quiz ? (quiz.description || 'Test your knowledge before the final interview.') : 'Test your knowledge before the final interview.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 mt-4">
          <div className="flex justify-center gap-8 text-sm">
            <div>
              <p className="text-gray-500">Questions</p>
              <p className="font-bold text-xl dark:text-white">
                {isLoading ? '-' : (quiz ? questionsCount : '0')}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Duration</p>
              <p className="font-bold text-xl dark:text-white">
                {isLoading ? '-' : (quiz ? `${quiz.timeLimit} mins` : '0 mins')}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Passing Score</p>
              <p className="font-bold text-xl dark:text-white">
                {isLoading ? '-' : (quiz ? `${quiz.passingScore}%` : '0%')}
              </p>
            </div>
          </div>
          <Button size="lg" className="bg-indigo-600 text-white w-full max-w-sm mt-8 hover:bg-indigo-700 transition-colors" asChild disabled={isLoading || !quiz || questionsCount === 0}>
            {quiz && questionsCount > 0 ? (
              <Link to={`/placement/quiz/${quiz._id}`}>Start Test Now</Link>
            ) : (
              <span>{isLoading ? 'Loading...' : 'No Test Available'}</span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}