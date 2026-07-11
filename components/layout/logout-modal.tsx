"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

type LogoutModalProps = {
  open: boolean
  onClose: () => void
}

export function LogoutModal({ open, onClose }: LogoutModalProps) {
  const router = useRouter()
  const { logout } = useAuth()

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

  const handleLogout = () => {
    logout()
    onClose()
    router.push("/login")
  }

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
        aria-labelledby="logout-modal-title"
        className="relative z-10 w-full max-w-md rounded-2xl bg-brand-input p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-brand-green/20 pb-4">
          <h2 id="logout-modal-title" className="text-xl font-semibold text-foreground">
            Logout
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <p className="py-6 text-center text-foreground">
          Are you sure you want to logout?
        </p>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleLogout}
            className={cn(
              "h-10 flex-1 rounded-xl bg-violet-600 text-white hover:bg-violet-700"
            )}
          >
            Logout
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-10 flex-1 rounded-xl border-transparent bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
