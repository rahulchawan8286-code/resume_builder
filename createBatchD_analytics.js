const fs = require('fs');
const path = require('path');

const writeFiles = (files) => {
  Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.resolve(__dirname, filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content.trim(), 'utf8');
  });
};

const files = {
  "frontend/src/pages/analytics/ProgressDashboard.jsx": `
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { WeeklyProgressChart } from '../../features/dashboard/WeeklyProgressChart';
import { ReadinessScoreCard } from '../../features/dashboard/ReadinessScoreCard';

export default function ProgressDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Progress Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400">Deep dive into your learning metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyProgressChart />
        </div>
        <div>
          <ReadinessScoreCard />
        </div>
      </div>
    </div>
  );
}
  `,
  "frontend/src/pages/analytics/ReadinessDashboard.jsx": `
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { SubjectAnalysis } from '../../features/dashboard/SubjectAnalysis';
import { CodingProgress } from '../../features/dashboard/CodingProgress';
import { AIRecommendationCard } from '../../features/dashboard/AIRecommendationCard';

export default function ReadinessDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Placement Readiness</h1>
        <p className="text-gray-500 dark:text-gray-400">Evaluate your readiness across all required domains.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubjectAnalysis />
        <CodingProgress />
      </div>
      <div className="max-w-2xl">
        <AIRecommendationCard />
      </div>
    </div>
  );
}
  `,
  "frontend/src/pages/analytics/WeeklyReport.jsx": `
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
  `
};

writeFiles(files);
console.log('Batch D - Analytics Pages generated.');
