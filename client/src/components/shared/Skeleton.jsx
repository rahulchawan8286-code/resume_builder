import { cn } from '@/lib/utils';

// Generic Skeleton block
export function Skeleton({ className, ...props }) {
  return (
    <div className={cn('shimmer rounded-md', className)} {...props} />
  );
}

// Card skeleton for resume cards
export function ResumeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border p-5 space-y-4 bg-card">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-28" />
      <div className="pt-2 space-y-2">
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-2 w-4/5" />
      </div>
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

// Stats card skeleton
export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border p-5 bg-card space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}
