"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          "relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl",
          className
        )}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-xl font-semibold text-foreground">
            {title}
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-5" />
          </Button>
        </div>
        {children}
        {footer && (
          <div className="mt-6 flex justify-end gap-3 border-t border-border pt-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

type ModalFooterProps = {
  onCancel: () => void
  onConfirm: () => void
  cancelLabel?: string
  confirmLabel: string
  confirmClassName?: string
}

export function ModalFooter({
  onCancel,
  onConfirm,
  cancelLabel = "Cancel",
  confirmLabel,
  confirmClassName,
}: ModalFooterProps) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="h-10 rounded-xl px-5"
      >
        {cancelLabel}
      </Button>
      <Button
        type="button"
        onClick={onConfirm}
        className={cn(
          "h-10 rounded-xl bg-brand-green-darker px-5 text-white hover:bg-brand-green-dark",
          confirmClassName
        )}
      >
        {confirmLabel}
      </Button>
    </>
  )
}
