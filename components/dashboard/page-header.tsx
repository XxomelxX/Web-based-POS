"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: string
  subtitle: string
  actionLabel?: string
  actionClassName?: string
  onAction?: () => void
}

export function PageHeader({
  title,
  subtitle,
  actionLabel,
  actionClassName,
  onAction,
}: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-white/80 sm:text-base">{subtitle}</p>
      </div>
      {actionLabel && (
        <Button
          type="button"
          onClick={onAction}
          className={cn(
            "h-10 shrink-0 gap-2 rounded-xl px-4 text-white",
            actionClassName
          )}
        >
          <Plus className="size-4" />
          {actionLabel}
        </Button>
      )}
    </header>
  )
}
