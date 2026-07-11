import * as React from "react"

import { cn } from "@/lib/utils"

function AuthInput({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-200",
        className
      )}
      {...props}
    />
  )
}

export { AuthInput }
