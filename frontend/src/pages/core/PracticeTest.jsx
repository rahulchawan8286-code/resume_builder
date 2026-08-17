import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Play } from 'lucide-react';

export default function PracticeTest() {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-12">
      <Card className="text-center py-12">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 mb-4">
            <Play size={32} />
          </div>
          <CardTitle className="text-3xl">Digital Electronics Practice Test</CardTitle>
          <CardDescription className="text-lg mt-2">Test your knowledge before the final interview.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 mt-4">
          <div className="flex justify-center gap-8 text-sm">
            <div>
              <p className="text-gray-500">Questions</p>
              <p className="font-bold text-xl dark:text-white">30</p>
            </div>
            <div>
              <p className="text-gray-500">Duration</p>
              <p className="font-bold text-xl dark:text-white">45 mins</p>
            </div>
            <div>
              <p className="text-gray-500">Passing Score</p>
              <p className="font-bold text-xl dark:text-white">70%</p>
            </div>
          </div>
          <Button size="lg" className="bg-indigo-600 text-white w-full max-w-sm mt-8" asChild>
            <Link to={`/placement/quiz/${id}`}>Start Test Now</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}