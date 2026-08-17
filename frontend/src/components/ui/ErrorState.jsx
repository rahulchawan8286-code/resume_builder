import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

export function ErrorState({ title = "Something went wrong", message, onRetry, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center rounded-xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20", className)}>
      <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-red-900 dark:text-red-400">{title}</h3>
      {message && <p className="mt-1 text-sm text-red-700 dark:text-red-400/80 max-w-sm">{message}</p>}
      {onRetry && (
        <Button variant="destructive" className="mt-6 gap-2" onClick={onRetry}>
          <RefreshCcw size={16} /> Try Again
        </Button>
      )}
    </div>
  );
}