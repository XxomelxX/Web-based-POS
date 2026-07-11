import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type TableActionsProps = {
  className?: string
  onEdit?: () => void
  onDelete?: () => void
}

export function TableActions({ className, onEdit, onDelete }: TableActionsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onEdit}
        className="text-muted-foreground hover:bg-brand-input hover:text-brand-green-darker"
        aria-label="Edit"
      >
        <Pencil className="size-4" />
      </Button>
      {onDelete && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onDelete}
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
          aria-label="Deactivate"
        >
          <Trash2 className="size-4" />
        </Button>
      )}
    </div>
  )
}
