"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ModalWrapperProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactElement
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function ModalWrapper({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  className,
}: ModalWrapperProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent 
        className={cn(
          "bg-surface sm:max-w-md rounded-xl shadow-xl overflow-hidden",
          className
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-slate-500">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="py-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
