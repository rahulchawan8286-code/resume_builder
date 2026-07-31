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