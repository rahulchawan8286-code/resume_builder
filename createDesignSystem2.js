const fs = require('fs');
const path = require('path');

const dir = 'frontend/src/components/ui';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const files = {
  "Button.jsx": `
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90",
        destructive: "bg-red-500 text-gray-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-gray-50 dark:hover:bg-red-900/90",
        outline: "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
        ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
        link: "text-gray-900 underline-offset-4 hover:underline dark:text-gray-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, isLoading, ...props }, ref) => {
  const Comp = asChild ? Slot : motion.button
  const motionProps = asChild ? {} : { whileTap: { scale: 0.95 } }
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...motionProps}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {props.children}
    </Comp>
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
  `,
  "Input.jsx": `
import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300",
        error && "border-red-500 focus-visible:ring-red-500 dark:border-red-900",
        className
      )}
      ref={ref}
      aria-invalid={!!error}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
  `,
  "TextArea.jsx": `
import * as React from "react"
import { cn } from "../../lib/utils"

const TextArea = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300",
        error && "border-red-500 focus-visible:ring-red-500 dark:border-red-900",
        className
      )}
      ref={ref}
      aria-invalid={!!error}
      {...props}
    />
  )
})
TextArea.displayName = "TextArea"

export { TextArea }
  `,
  "Badge.jsx": `
import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:border-gray-800 dark:focus:ring-gray-300",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/80",
        secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
        destructive: "border-transparent bg-red-500 text-gray-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-gray-50 dark:hover:bg-red-900/80",
        outline: "text-gray-950 dark:text-gray-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
  `,
  "Progress.jsx": `
import * as React from "react"
import { cn } from "../../lib/utils"

const Progress = React.forwardRef(({ className, value = 0, indicatorColor, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800", className)}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 bg-gray-900 transition-all dark:bg-gray-50", indicatorColor)}
        style={{ transform: \`translateX(-\${100 - (value || 0)}%)\` }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }
  `,
  "CircularProgress.jsx": `
import React, { memo } from 'react';
import { motion } from 'framer-motion';

export const CircularProgress = memo(({ value = 0, size = 120, strokeWidth = 10, color = 'text-indigo-600' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-200 dark:text-gray-800"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-bold dark:text-white">{value}%</span>
      </div>
    </div>
  );
});
CircularProgress.displayName = "CircularProgress";
  `,
  "Card.jsx": `
import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-gray-500 dark:text-gray-400", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
  `,
  "StatCard.jsx": `
import React from 'react';
import { Card, CardContent } from './Card';
import { cn } from '../../lib/utils';

export function StatCard({ title, value, icon: Icon, trend, className }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h4 className="text-3xl font-bold mt-2 dark:text-white">{value}</h4>
          </div>
          {Icon && (
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Icon size={24} />
            </div>
          )}
        </div>
        {trend && (
          <div className={cn("mt-4 text-sm font-medium", trend.positive ? 'text-emerald-500' : 'text-red-500')}>
            {trend.positive ? '+' : '-'}{Math.abs(trend.value)}% from last week
          </div>
        )}
      </CardContent>
    </Card>
  );
}
  `,
  "Skeleton.jsx": `
import { cn } from "../../lib/utils"

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-100 dark:bg-gray-800", className)}
      {...props}
    />
  )
}

export { Skeleton }
  `,
  "Spinner.jsx": `
import { cn } from "../../lib/utils"
import { Loader2 } from "lucide-react"

function Spinner({ className, size = 24, ...props }) {
  return (
    <Loader2 
      size={size} 
      className={cn("animate-spin text-gray-500 dark:text-gray-400", className)} 
      {...props} 
    />
  )
}

export { Spinner }
  `
};

Object.entries(files).forEach(([file, content]) => {
  fs.writeFileSync(path.join(dir, file), content.trim());
});

console.log('Successfully generated Batch 2 components in frontend/src/components/ui');
