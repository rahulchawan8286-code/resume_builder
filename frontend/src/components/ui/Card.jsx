import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ className, children, ...props }) {
  return (
    <div className={twMerge(clsx("bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 backdrop-blur-md bg-opacity-90 dark:bg-opacity-80 transition-all hover:shadow-md", className))} {...props}>
      {children}
    </div>
  );
}