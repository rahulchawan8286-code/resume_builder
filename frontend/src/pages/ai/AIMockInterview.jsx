import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AIChatBubble } from '../../components/ui/AIChatBubble';
import { mockAIMockInterview } from '../../mocks';

export default function AIMockInterview() {
  const interview = mockAIMockInterview;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">AI Mock Interview</h1>
        <p className="text-gray-500 dark:text-gray-400">Practice real interview scenarios with voice/text feedback.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Interview Simulator</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center animate-pulse">
                <span className="text-4xl">🎙️</span>
              </div>
              <p className="text-lg font-medium text-center">&quot;Tell me about a time you had to optimize a complex circuit design.&quot;</p>
              <div className="flex gap-4">
                <Button className="bg-red-500 hover:bg-red-600 text-white">Stop Recording</Button>
                <Button variant="outline">Type Answer Instead</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Last Interview Feedback</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b dark:border-gray-800">
                <span className="text-gray-500">Overall Score</span>
                <span className="text-2xl font-bold text-emerald-500">{interview.score}/100</span>
              </div>
              <AIChatBubble isUser={false} message={interview.feedback} />
              <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-md text-sm text-amber-800 dark:text-amber-300">
                <span className="font-bold">Focus Area: </span> {interview.improvement}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}