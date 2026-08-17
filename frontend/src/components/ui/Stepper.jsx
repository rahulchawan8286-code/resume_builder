import { cn } from '../../lib/utils';
import React from 'react';
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