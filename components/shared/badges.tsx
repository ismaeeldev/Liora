import * as React from "react"
import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// ----------------------------------------------------------------------
// ListingTag (for "Verified", "Accepts Insurance", "Detox", etc.)
// ----------------------------------------------------------------------

export interface ListingTagProps extends BadgeProps {
  status?: "default" | "success" | "warning" | "destructive" | "outline"
}

export function ListingTag({
  className,
  status = "default",
  variant,
  ...props
}: ListingTagProps) {
  return (
    <Badge
      variant={variant || (status === "outline" ? "outline" : "default")}
      className={cn(
        "rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors",
        {
          "bg-success-bg text-success hover:bg-success-bg/80 border-transparent": status === "success",
          "bg-warning-bg text-warning hover:bg-warning-bg/80 border-transparent": status === "warning",
          "bg-destructive/10 text-destructive hover:bg-destructive/20 border-transparent": status === "destructive",
          "bg-primary/10 text-primary hover:bg-primary/20 border-transparent": status === "default",
        },
        className
      )}
      {...props}
    />
  )
}

// ----------------------------------------------------------------------
// FilterPill (for search filter bars, e.g. "Inpatient x")
// ----------------------------------------------------------------------

export interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  label: string
  onRemove?: () => void
}

export function FilterPill({
  className,
  active = false,
  label,
  onRemove,
  ...props
}: FilterPillProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        active
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          : "border-border bg-surface text-slate-700 hover:bg-muted hover:text-slate-900",
        className
      )}
      {...props}
    >
      {label}
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className={cn(
            "ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10",
            active ? "text-primary-foreground" : "text-slate-500 hover:text-slate-900"
          )}
        >
          &times;
        </span>
      )}
    </button>
  )
}
