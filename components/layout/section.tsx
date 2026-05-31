import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "none" | "sm" | "md" | "lg"
  background?: "default" | "muted" | "surface"
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = "md", background = "default", ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "w-full transition-colors duration-200",
          {
            // Spacing
            "py-8 md:py-12": spacing === "sm",
            "py-16 md:py-24": spacing === "md",
            "py-24 md:py-32": spacing === "lg",
            "py-0": spacing === "none",
            
            // Backgrounds
            "bg-background": background === "default",
            "bg-muted": background === "muted",
            "bg-surface": background === "surface",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Section.displayName = "Section"
