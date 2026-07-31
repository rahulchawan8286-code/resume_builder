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