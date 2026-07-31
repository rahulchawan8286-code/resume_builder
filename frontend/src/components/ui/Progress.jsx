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
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }