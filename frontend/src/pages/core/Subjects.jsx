import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import { mockSubjects } from '../../mocks';
import { motion } from 'framer-motion';

export default function Subjects() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Core ECE Subjects</h1>
        <p className="text-gray-500 dark:text-gray-400">Master the fundamentals of Electronics & Communication.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSubjects.map((sub, i) => (
          <motion.div key={sub.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
            <Card className="h-full flex flex-col hover:border-indigo-500 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${sub.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {sub.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">{sub.estimatedTime}</span>
                </div>
                <CardTitle className="text-lg line-clamp-1">{sub.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium dark:text-white">{sub.progress}%</span>
                  </div>
                  <Progress value={sub.progress} className="h-2" />
                  <p className="text-xs text-gray-500 text-right">{sub.completedTopics} / {sub.totalTopics} topics</p>
                </div>
                <Button asChild className="w-full">
                  <Link to={`/core/subjects/${sub.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}