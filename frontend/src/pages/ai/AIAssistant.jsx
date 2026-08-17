import { Card } from '../../components/ui/Card';
import { Bot, Construction } from 'lucide-react';

export default function AIAssistant() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2"><Bot /> Career Mentor AI</h1>
          <p className="text-gray-500 dark:text-gray-400">Ask any technical, HR, or career related questions.</p>
        </div>
      </div>

      <Card className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 dark:bg-gray-900/50">
        <Construction className="w-16 h-16 text-indigo-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Under Construction</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          The interactive AI Assistant is currently in development. Please check out the AI Career Intelligence insights on your Dashboard or try a Mock Interview!
        </p>
      </Card>
    </div>
  );
}