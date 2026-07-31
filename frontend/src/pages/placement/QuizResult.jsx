import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CircularProgress } from '../../components/ui/CircularProgress';
import { AIChatBubble } from '../../components/ui/AIChatBubble';
import { motion } from 'framer-motion';

export default function QuizResult() {
  const { id } = useParams();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Test Results</h1>
        <p className="text-gray-500 dark:text-gray-400">Detailed breakdown of your performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 flex flex-col items-center justify-center py-8">
          <CircularProgress value={85} size={160} color="text-emerald-500" />
          <h2 className="mt-4 text-2xl font-bold dark:text-white">Excellent!</h2>
          <p className="text-gray-500 text-sm">Top 10% of class</p>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>AI Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AIChatBubble isUser={false} message="Great job! Your accuracy in Time & Distance problems is perfect. However, you spent too much time on Percentages. I recommend practicing more percentage tricks." />
            <div className="flex gap-4 mt-6">
              <Button asChild className="bg-indigo-600 text-white"><Link to="/placement/aptitude">Practice Weak Topics</Link></Button>
              <Button variant="outline" asChild><Link to="/placement/leaderboard">View Leaderboard</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}