import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Check, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { codingService } from '../../api/codingService';
import { ErrorState } from '../../components/ui/ErrorState';
import { toast } from 'sonner';

export default function ProblemDetails() {
  const { id } = useParams();
  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchProblem = async () => {
      try {
        const data = await codingService.getProblemById(id);
        if (mounted) {
          setProblemData(data);
          setCode(data.problem.starterCode?.javascript || '');
        }
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || 'Failed to load problem');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProblem();
    return () => { mounted = false; };
  }, [id]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    if (problemData?.problem?.starterCode?.[lang]) {
      setCode(problemData.problem.starterCode[lang]);
    } else {
      setCode('');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await codingService.submitCode(id, language, code);
      toast.success('Code submitted successfully! Execution is currently unavailable.');
      // Refresh status
      const data = await codingService.getProblemById(id);
      setProblemData(data);
    } catch (err) {
      toast.error('Failed to submit code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[calc(100vh-4rem)]"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  if (error) return <div className="pt-8"><ErrorState message={error} onRetry={() => window.location.reload()} /></div>;

  const { problem, status } = problemData;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-4 -m-4 md:-m-8 p-4 md:p-8 bg-gray-50 dark:bg-gray-950">
      
      {/* Left Panel: Description */}
      <div className="w-full md:w-1/2 flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" size="sm" asChild className="p-0 hover:bg-transparent"><Link to="/coding"><ChevronLeft size={20} /> Back</Link></Button>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
            status === 'Pending' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-500'
          }`}>
            {status === 'Accepted' ? 'Solved' : status === 'Pending' ? 'Submitted (Execution unavailable)' : 'Unsolved'}
          </span>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex-1 overflow-y-auto shadow-sm">
          <h2 className="text-2xl font-bold dark:text-white mb-2">{problem.title}</h2>
          <div className="flex gap-4 mb-6 text-sm">
            <span className={`${problem.difficulty === 'Easy' ? 'text-emerald-500' : problem.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500'} font-medium`}>{problem.difficulty}</span>
          </div>
          
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="description">Description</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="space-y-6">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{problem.description}</div>
              
              {problem.testCases?.length > 0 && (
                <div className="space-y-4 mt-6">
                  <h4 className="font-semibold dark:text-white">Examples:</h4>
                  {problem.testCases.map((tc, idx) => (
                    <div key={idx} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
                      <p><strong>Input:</strong> {tc.input}</p>
                      <p><strong>Output:</strong> {tc.expectedOutput}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Panel: Code Editor Mock */}
      <div className="w-full md:w-1/2 flex flex-col gap-4 overflow-hidden">
        <div className="bg-gray-900 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl flex-1 flex flex-col shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <select className="bg-gray-700 text-white text-sm rounded-md px-2 py-1 outline-none" value={language} onChange={handleLanguageChange}>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          <div className="flex-1 p-0 overflow-hidden relative">
            <textarea 
              value={code} 
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm text-gray-300 bg-transparent resize-none outline-none"
              spellCheck="false"
            />
          </div>
          <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
            <div className="text-xs text-amber-400 flex items-center gap-1">
              <AlertCircle size={14} /> Note: Secure code execution is not yet available.
            </div>
            <div className="flex gap-2">
              <Button disabled={isSubmitting || !code.trim()} onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={16}/>} Submit Code
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}