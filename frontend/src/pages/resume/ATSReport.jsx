import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { CircularProgress } from '../../components/ui/CircularProgress';
import { AIChatBubble } from '../../components/ui/AIChatBubble';
import { mockATSReport } from '../../mocks';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function ATSReport() {
  const report = mockATSReport;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">ATS Analysis Report</h1>
        <p className="text-gray-500 dark:text-gray-400">See how your resume parses in standard Applicant Tracking Systems.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 flex flex-col items-center justify-center py-8">
          <CircularProgress value={report.score} size={160} color={report.score > 75 ? "text-emerald-500" : "text-amber-500"} />
          <h2 className="mt-4 text-2xl font-bold dark:text-white">Good Score</h2>
          <p className="text-gray-500 text-sm text-center px-4 mt-2">Your resume will pass most basic ATS filters, but there is room for improvement.</p>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>AI Recommendations</CardTitle></CardHeader>
          <CardContent>
            <AIChatBubble isUser={false} message={report.aiRecommendations} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 dark:text-red-400 flex items-center gap-2 mb-2"><AlertTriangle size={16}/> Missing Keywords</h4>
                <ul className="list-disc pl-5 text-sm text-red-700 dark:text-red-300">
                  {report.missingKeywords.map((k, i) => <li key={i}>{k}</li>)}
                </ul>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-2"><AlertTriangle size={16}/> Formatting Issues</h4>
                <ul className="list-disc pl-5 text-sm text-amber-700 dark:text-amber-300">
                  {report.formattingSuggestions.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}