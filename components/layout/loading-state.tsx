import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
  fullScreen?: boolean
}

export function LoadingState({
  className,
  text = "Loading...",
  fullScreen = false,
  ...props
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 text-muted-foreground",
        {
          "min-h-[60vh] w-full": !fullScreen,
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm": fullScreen,
        },
        className
      )}
      {...props}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {text && <p className="text-sm font-medium animate-pulse">{text}</p>}
    </div>
  )
}
