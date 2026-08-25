import { useEffect, useRef } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { useStore } from 'zustand';
import { formatDistanceToNow } from 'date-fns';
import { Save, Undo2, Redo2, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';

// onSave and resumeId are passed down from BuilderPage
export default function AutosaveBar({ onSave, resumeId }) {
  const { isSaving, lastSaved, resumeData, setSaveState } = useResumeStore();
  const { undo, redo, pastStates, futureStates } = useStore(useResumeStore.temporal);
  const saveTimer = useRef(null);

  // Auto-save: fires 3s after the last change
  useEffect(() => {
    if (!onSave || !resumeId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onSave(resumeData);
    }, 3000);
    return () => clearTimeout(saveTimer.current);
  }, [resumeData, onSave, resumeId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'Z')) { e.preventDefault(); redo(); }
      // Ctrl+S manual save
      if (e.ctrlKey && e.key === 's') { e.preventDefault(); handleManualSave(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [undo, redo]);

  const handleManualSave = async () => {
    if (isSaving || !onSave || !resumeId) return;
    onSave(resumeData);
  };

  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card/60 px-4 backdrop-blur-sm">
      {/* Save indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {isSaving ? (
          <>
            <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
            <span>Saving…</span>
          </>
        ) : lastSaved ? (
          <>
            <Cloud className="h-3.5 w-3.5 text-green-500" />
            <span>Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}</span>
          </>
        ) : (
          <>
            <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
            <span>Unsaved</span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={pastStates.length === 0}
          title="Undo (Ctrl+Z)"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          onClick={redo}
          disabled={futureStates.length === 0}
          title="Redo (Ctrl+Y)"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30"
        >
          <Redo2 className="h-4 w-4" />
        </button>
        <div className="mx-1 h-4 w-px bg-border" />
        <button
          onClick={handleManualSave}
          disabled={isSaving}
          title="Save (Ctrl+S)"
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          <Save className="h-3.5 w-3.5" />
          Save
        </button>
      </div>
    </div>
  );
}
