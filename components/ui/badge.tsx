import { cn } from "@/lib/utils"

type BadgeProps = {
  children: React.ReactNode
  variant?: "default" | "admin" | "cashier" | "active" | "low-stock" | "ok" | "critical"
  className?: string
}

const variantStyles = {
  default: "bg-muted text-muted-foreground",
  admin: "bg-amber-100 text-amber-800",
  cashier: "bg-gray-100 text-gray-600",
  active: "bg-green-100 text-green-700",
  "low-stock": "bg-orange-100 text-orange-700",
  ok: "bg-green-50 text-green-700",
  critical: "bg-red-50 text-red-600",
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
