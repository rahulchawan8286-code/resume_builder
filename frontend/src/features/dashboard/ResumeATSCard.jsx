import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { FileText } from 'lucide-react';

export const ResumeATSCard = memo(() => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <FileText size={20} className="text-indigo-500" /> Resume Quality
      </h2>
      <div className="flex flex-col items-center justify-center">
         <span className="text-4xl font-bold text-emerald-500 mb-2">88%</span>
         <span className="text-sm text-gray-500">ATS Score</span>
      </div>
      <p className="text-xs text-center text-gray-400 mt-4">Missing keywords: "Agile", "REST APIs"</p>
    </Card>
  );
});
ResumeATSCard.displayName = 'ResumeATSCard';