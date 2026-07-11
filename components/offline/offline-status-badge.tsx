"use client"

import { CircleDot } from "lucide-react"
import { useOffline } from "@/components/offline/offline-context"

const statusStyles: Record<string, string> = {
  online: "text-emerald-600",
  offline: "text-amber-500",
  syncing: "text-sky-600",
  synced: "text-emerald-600",
  error: "text-rose-600",
}

const statusLabels: Record<string, string> = {
  online: "Online",
  offline: "Offline",
  syncing: "Syncing...",
  synced: "Synced ✓",
  error: "Sync Error",
}

export function OfflineStatusBadge() {
  const { syncState, pendingCount, syncError } = useOffline()

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-[0.75rem] font-semibold text-foreground shadow-sm ring-1 ring-slate-200">
      <CircleDot className={statusStyles[syncState] + " size-3"} />
      <span>{statusLabels[syncState]}</span>
      {pendingCount > 0 && syncState !== "online" && (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-bold text-foreground">
          {pendingCount} pending
        </span>
      )}
      {syncError && <span className="text-rose-600">{syncError}</span>}
    </div>
  )
}
