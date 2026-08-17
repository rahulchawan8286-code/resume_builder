import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { CircularProgress } from '../../components/ui/CircularProgress';
import { AIChatBubble } from '../../components/ui/AIChatBubble';
import { AlertTriangle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import { Button } from '../../components/ui/Button';
import { toast } from 'sonner';

export default function ATSReport() {
  const { id } = useParams();
  const { atsReport, fetchATSReport, analyzeATS, isLoading } = useResumeStore();
  const [targetRole, setTargetRole] = useState('Software Engineer');

  useEffect(() => {
    fetchATSReport(id);
  }, [id, fetchATSReport]);

  const handleAnalyze = async () => {
    try {
      await analyzeATS(id, targetRole);
      toast.success('ATS Analysis completed!');
    } catch (err) {
      toast.error('Failed to run ATS analysis.');
    }
  };

  if (!atsReport && !isLoading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild className="mb-4"><Link to={`/resume/builder/${id}`}><ArrowLeft className="mr-2" size={16}/> Back to Editor</Link></Button>
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <AlertTriangle size={48} className="text-amber-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No ATS Analysis Found</h3>
          <p className="text-gray-500 mb-6 max-w-sm">Run an AI-powered ATS scan to see how your resume performs against Applicant Tracking Systems.</p>
          <div className="flex gap-2">
            <input 
              value={targetRole} 
              onChange={e => setTargetRole(e.target.value)} 
              className="px-3 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Target Role (e.g. Software Engineer)"
            />
            <Button onClick={handleAnalyze} className="bg-indigo-600 hover:bg-indigo-700 text-white">Run Analysis</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <Button variant="ghost" asChild className="mb-4 -ml-4"><Link to={`/resume/builder/${id}`}><ArrowLeft className="mr-2" size={16}/> Back to Editor</Link></Button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">ATS Analysis Report</h1>
            <p className="text-gray-500 dark:text-gray-400">See how your resume parses in standard Applicant Tracking Systems.</p>
          </div>
          <div className="flex gap-2">
            <input 
              value={targetRole} 
              onChange={e => setTargetRole(e.target.value)} 
              className="px-3 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Target Role"
            />
            <Button onClick={handleAnalyze} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isLoading ? <Loader2 size={16} className="animate-spin mr-2"/> : null} Re-Analyze
            </Button>
          </div>
        </div>
      </div>

      {isLoading && !atsReport ? (
         <div className="flex justify-center items-center h-64 flex-col gap-4">
           <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
           <p className="text-sm text-gray-500 animate-pulse">Our AI is analyzing your resume...</p>
         </div>
      ) : atsReport ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 flex flex-col items-center justify-center py-8 relative overflow-hidden">
            <CircularProgress value={atsReport.score} size={160} color={atsReport.score > 75 ? "text-emerald-500" : atsReport.score > 50 ? "text-amber-500" : "text-red-500"} />
            <h2 className="mt-4 text-2xl font-bold dark:text-white">
              {atsReport.score > 75 ? 'Excellent Score' : atsReport.score > 50 ? 'Average Score' : 'Needs Work'}
            </h2>
            <p className="text-gray-500 text-sm text-center px-4 mt-2">Targeted for: <strong className="text-indigo-600">{atsReport.targetRole}</strong></p>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader><CardTitle>AI Feedback & Suggestions</CardTitle></CardHeader>
            <CardContent>
              <AIChatBubble isUser={false} message={atsReport.feedback} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-2 mb-2"><CheckCircle size={16}/> Keyword Matches</h4>
                  <ul className="list-disc pl-5 text-sm text-emerald-700 dark:text-emerald-300">
                    {atsReport.keywordMatches?.map((k, i) => <li key={i}>{k}</li>)}
                    {(!atsReport.keywordMatches || atsReport.keywordMatches.length === 0) && <li>No significant matches found.</li>}
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 dark:text-red-400 flex items-center gap-2 mb-2"><AlertTriangle size={16}/> Missing Keywords</h4>
                  <ul className="list-disc pl-5 text-sm text-red-700 dark:text-red-300">
                    {atsReport.missingKeywords?.map((k, i) => <li key={i}>{k}</li>)}
                    {(!atsReport.missingKeywords || atsReport.missingKeywords.length === 0) && <li>No critical keywords missing.</li>}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}