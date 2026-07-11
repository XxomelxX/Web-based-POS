import { Store } from "lucide-react"

import { cn } from "@/lib/utils"

type StoreLogoProps = {
  className?: string
  iconClassName?: string
  nameClassName?: string
  showName?: boolean
}

export function StoreLogo({
  className,
  iconClassName,
  nameClassName,
  showName = true,
}: StoreLogoProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className={cn(
          "flex size-16 items-center justify-center rounded-2xl bg-white shadow-md",
          iconClassName
        )}
      >
        <Store className="size-8 text-brand-teal" strokeWidth={1.5} />
      </div>
      {showName && (
        <p
          className={cn(
            "font-script text-center text-2xl leading-tight text-brand-teal",
            nameClassName
          )}
        >
          J & J Merchandise Store
        </p>
      )}
    </div>
  )
}
