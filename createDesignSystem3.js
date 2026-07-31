const fs = require('fs');
const path = require('path');

const dir = 'frontend/src/components/ui';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const files = {
  "SearchBar.jsx": `
import React, { forwardRef } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from './Input';

export const SearchBar = forwardRef(({ className, placeholder = "Search...", ...props }, ref) => {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        className="pl-9"
        {...props}
      />
    </div>
  );
});
SearchBar.displayName = "SearchBar";
  `,
  "EmptyState.jsx": `
import React from 'react';
import { cn } from '../../lib/utils';
import { Inbox } from 'lucide-react';

export function EmptyState({ title, description, icon: Icon = Inbox, action, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <Icon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
  `,
  "ErrorState.jsx": `
import React from 'react';
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
  `,
  "Alert.jsx": `
import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-gray-950 dark:border-gray-800 dark:[&>svg]:text-gray-50",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-950 dark:bg-gray-950 dark:text-gray-50",
        destructive:
          "border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500 dark:border-red-900/50 dark:text-red-900 dark:dark:border-red-900 dark:[&>svg]:text-red-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
  `,
  "AIChatBubble.jsx": `
import React from 'react';
import { Brain, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export function AIChatBubble({ message, isUser = false, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex w-full gap-4 p-4", isUser ? "flex-row-reverse" : "flex-row", className)}
    >
      <div className={cn(
        "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
        isUser ? "bg-white dark:bg-gray-800" : "bg-indigo-600 text-white"
      )}>
        {isUser ? <User size={16} /> : <Brain size={16} />}
      </div>
      <div className={cn(
        "flex-1 space-y-2 overflow-hidden px-4 py-3 text-sm shadow-sm",
        isUser 
          ? "rounded-2xl rounded-tr-sm bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100" 
          : "rounded-2xl rounded-tl-sm bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
      )}>
        {message}
      </div>
    </motion.div>
  );
}
  `,
  "Timeline.jsx": `
import React from 'react';
import { cn } from '../../lib/utils';

export function Timeline({ items, className }) {
  return (
    <div className={cn("space-y-4 border-l-2 border-gray-200 dark:border-gray-800 ml-3", className)}>
      {items.map((item, i) => (
        <div key={i} className="relative pl-6">
          <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white bg-indigo-500 dark:border-gray-950" />
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
  `,
  "Stepper.jsx": `
import React from 'react';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

export function Stepper({ steps, currentStep, className }) {
  return (
    <div className={cn("flex items-center w-full", className)}>
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;
        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center relative">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 font-semibold text-xs z-10 transition-colors",
                isCompleted ? "bg-indigo-600 border-indigo-600 text-white" : 
                isActive ? "border-indigo-600 text-indigo-600 bg-white dark:bg-gray-950" : 
                "border-gray-200 text-gray-400 dark:border-gray-800"
              )}>
                {isCompleted ? <Check size={14} /> : i + 1}
              </div>
              <span className={cn(
                "absolute top-10 text-xs font-medium whitespace-nowrap",
                (isActive || isCompleted) ? "text-gray-900 dark:text-white" : "text-gray-400"
              )}>
                {step.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2 transition-colors",
                isCompleted ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-800"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
  `,
  "DataTable.jsx": `
import React from 'react';
import { cn } from '../../lib/utils';

export function DataTable({ columns, data, className }) {
  return (
    <div className={cn("w-full overflow-auto rounded-md border border-gray-200 dark:border-gray-800", className)}>
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 font-medium border-b border-gray-200 dark:border-gray-800">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                No results found.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-gray-900 dark:text-gray-100">
                    {col.cell ? col.cell(row) : row[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
  `
};

Object.entries(files).forEach(([file, content]) => {
  fs.writeFileSync(path.join(dir, file), content.trim());
});

console.log('Successfully generated Batch 3 components in frontend/src/components/ui');
