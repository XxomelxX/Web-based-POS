import { useEffect, useState } from "react"
import { liveQuery } from "dexie"

type Subscriber<T> = (value: T) => void

export function useLiveQuery<T>(query: () => Promise<T>, deps: unknown[] = [], initialValue?: T) {
  const [value, setValue] = useState<T | undefined>(initialValue)

  useEffect(() => {
    const subscription = liveQuery(query).subscribe({
      next: (result) => setValue(result),
      error: (error) => {
        console.error("Dexie liveQuery error:", error)
      },
    })

    return () => subscription.unsubscribe()
  }, deps)

  return value
}
