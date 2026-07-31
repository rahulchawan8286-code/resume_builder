import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { mockQuizzes } from '../../mocks';

export default function AptitudeDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Aptitude Practice</h1>
        <p className="text-gray-500 dark:text-gray-400">Master quantitative and logical reasoning for placements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockQuizzes.filter(q => q.category === 'Aptitude').map(quiz => (
          <Card key={quiz.id}>
            <CardHeader>
              <CardTitle className="text-xl">{quiz.title}</CardTitle>
              <CardDescription>{quiz.totalQuestions} Questions • {quiz.duration} mins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-medium px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 rounded-md">
                  {quiz.difficulty}
                </span>
                <Button asChild>
                  <Link to={`/placement/quiz/${quiz.id}`}>Start Test</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}