import { useResumeStore } from '../../store/resumeStore';
import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function ObjectiveForm() {
  const objective = useResumeStore((s) => s.resumeData.objective);
  const updateObjective = useResumeStore((s) => s.updateObjective);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Career Objective
        </h2>
        <p className="text-xs text-muted-foreground mt-1">A compelling 2–3 sentence career objective.</p>
      </div>
      <textarea
        value={objective}
        onChange={(e) => updateObjective(e.target.value)}
        rows={5}
        placeholder="A passionate software engineering graduate seeking opportunities to apply my skills in building scalable web applications…"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
      />
      <p className="text-xs text-muted-foreground text-right">{objective.length} / 500 characters</p>
    </div>
  );
}
