import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Sparkles, Loader2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { aiAPI } from '@/services/apiServices';
import toast from 'react-hot-toast';

const AI_ACTIONS = [
  { key: 'objective',  label: 'Generate Objective',  description: 'Write a compelling career objective', fn: (d) => aiAPI.generateObjective({ resumeData: d }) },
  { key: 'summary',   label: 'Improve Summary',      description: 'Enhance your profile summary',      fn: (d) => aiAPI.generateSummary({ resumeData: d }) },
  { key: 'ats',       label: 'ATS Analysis',         description: 'Score your resume for ATS systems',  fn: (d) => aiAPI.analyzeAts({ resumeData: d }) },
  { key: 'grammar',   label: 'Grammar Check',        description: 'Fix grammar and phrasing',           fn: (d) => aiAPI.grammarCheck({ resumeData: d }) },
];

export default function AIPanel() {
  const resumeData = useResumeStore((s) => s.resumeData);
  const updateObjective = useResumeStore((s) => s.updateObjective);
  const [loading, setLoading] = useState(null);
  const [result, setResult] = useState(null);

  const run = async (action) => {
    setLoading(action.key);
    setResult(null);
    try {
      const res = await action.fn(resumeData);
      const text = res.data?.data?.result || res.data?.data || '';
      setResult({ key: action.key, text });
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI request failed');
    } finally {
      setLoading(null);
    }
  };

  const applyResult = () => {
    if (result?.key === 'objective') {
      updateObjective(result.text);
      toast.success('Objective updated!');
    }
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> AI Assistant
        </h2>
        <p className="text-xs text-muted-foreground mt-1">Let AI help you craft a better resume.</p>
      </div>

      <div className="space-y-3">
        {AI_ACTIONS.map((action) => (
          <div key={action.key} className="rounded-xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => run(action)}
              disabled={loading === action.key}
              className="flex w-full items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors disabled:opacity-60"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-semibold">{action.label}</span>
                <span className="text-xs text-muted-foreground">{action.description}</span>
              </div>
              {loading === action.key
                ? <Loader2 className="h-4 w-4 animate-spin text-primary" />
                : <Sparkles className="h-4 w-4 text-muted-foreground" />
              }
            </button>
          </div>
        ))}
      </div>

      {/* AI Result output */}
      {result && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">AI Result</span>
            <button onClick={() => setResult(null)}><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap">{result.text}</p>
          <div className="flex gap-2">
            <button
              onClick={applyResult}
              className="flex-1 rounded-lg bg-primary py-2 text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              Apply to Resume
            </button>
            <button
              onClick={() => setResult(null)}
              className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold hover:bg-muted transition-colors"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
