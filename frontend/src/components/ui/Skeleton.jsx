import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Skeleton({ className, ...props }) {
  return (
    <div className={twMerge(clsx("animate-pulse rounded-md bg-gray-200 dark:bg-gray-800", className))} {...props} />
  );
}