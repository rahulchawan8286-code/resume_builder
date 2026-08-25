import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ className, children, ...props }) {
  return (
    <div className={twMerge(clsx("bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 backdrop-blur-md bg-opacity-90 dark:bg-opacity-80 transition-all hover:shadow-md", className))} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={twMerge(clsx("flex flex-col space-y-1.5", className))} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={twMerge(clsx("font-semibold leading-none tracking-tight", className))} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={twMerge(clsx("text-sm text-gray-500 dark:text-gray-400", className))} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={twMerge(clsx("", className))} {...props} />;
}