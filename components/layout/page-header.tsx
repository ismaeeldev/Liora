import * as React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  align?: "left" | "center" | "right"
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, align = "left", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-2 md:gap-4",
          {
            "text-left": align === "left",
            "text-center items-center": align === "center",
            "text-right items-end": align === "right",
          },
          className
        )}
        {...props}
      >
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        {description && (
          <p className="text-base md:text-lg text-slate-600 max-w-[800px]">
            {description}
          </p>
        )}
        {children && <div className="mt-4 w-full">{children}</div>}
      </div>
    )
  }
)
PageHeader.displayName = "PageHeader"
