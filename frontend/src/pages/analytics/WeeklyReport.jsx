import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function WeeklyReport() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Weekly Report</h1>
          <p className="text-gray-500 dark:text-gray-400">Week of July 17 - July 24, 2026</p>
        </div>
        <Button variant="outline">Download PDF</Button>
      </div>

      <Card className="bg-indigo-600 text-white">
        <CardContent className="p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">Great Job this week! 🎉</h2>
          <p className="text-indigo-100">You completed 85% of your scheduled tasks and improved your coding accuracy by 12%.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-6 text-center"><p className="text-sm text-gray-500">Hours Studied</p><p className="text-3xl font-bold dark:text-white mt-2">14.5</p></CardContent></Card>
        <Card><CardContent className="p-6 text-center"><p className="text-sm text-gray-500">Problems Solved</p><p className="text-3xl font-bold dark:text-white mt-2">24</p></CardContent></Card>
        <Card><CardContent className="p-6 text-center"><p className="text-sm text-gray-500">Tests Taken</p><p className="text-3xl font-bold dark:text-white mt-2">3</p></CardContent></Card>
      </div>
    </div>
  );
}