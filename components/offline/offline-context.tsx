"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  addQueueAction,
  getQueueCount,
  initOfflineDB,
  syncQueue,
} from "@/lib/offline"

type SyncState = "online" | "offline" | "syncing" | "synced" | "error"

type OfflineContextValue = {
  isOnline: boolean
  syncState: SyncState
  pendingCount: number
  syncError?: string
  enqueueOfflineAction: (type: string, payload: unknown) => Promise<void>
}

const OfflineContext = createContext<OfflineContextValue | undefined>(undefined)

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true
  )
  const [syncState, setSyncState] = useState<SyncState>(
    typeof window !== "undefined" && !navigator.onLine ? "offline" : "online"
  )
  const [pendingCount, setPendingCount] = useState(0)
  const [syncError, setSyncError] = useState<string | undefined>(undefined)

  const updatePendingCount = async () => {
    const count = await getQueueCount()
    setPendingCount(count)
    return count
  }

  const runSync = async () => {
    if (!isOnline) return
    setSyncState("syncing")
    try {
      await initOfflineDB()
      const { synced } = await syncQueue()
      const count = await updatePendingCount()
      if (count === 0) {
        setSyncState("synced")
        setTimeout(() => setSyncState("online"), 1200)
      } else {
        setSyncState("online")
      }
      setSyncError(undefined)
    } catch (error) {
      setSyncState("error")
      setSyncError(error instanceof Error ? error.message : String(error))
    }
  }

  useEffect(() => {
    void (async () => {
      await initOfflineDB()
      const count = await getQueueCount()
      setPendingCount(count)
      if (!navigator.onLine) {
        setIsOnline(false)
        setSyncState("offline")
      }
    })()

    const handleOnline = () => {
      setIsOnline(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setSyncState("offline")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!isOnline) return
    void runSync()
  }, [isOnline])

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (navigator.onLine) {
        void runSync()
      }
    }, 10000)

    return () => window.clearInterval(interval)
  }, [isOnline])

  const enqueueOfflineAction = async (type: string, payload: unknown) => {
    const action = {
      id:
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type,
      payload,
      timestamp: Date.now(),
      status: "pending" as const,
    }

    await addQueueAction(action)
    await updatePendingCount()
    if (navigator.onLine) {
      await runSync()
    }
  }

  const value = useMemo(
    () => ({ isOnline, syncState, pendingCount, syncError, enqueueOfflineAction }),
    [enqueueOfflineAction, isOnline, pendingCount, syncError, syncState]
  )

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>
}

export function useOffline() {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error("useOffline must be used within OfflineProvider")
  }
  return context
}
