import { cn } from "@/lib/utils"

type AuthPageLayoutProps = {
  children: React.ReactNode
  className?: string
}

export function AuthPageLayout({ children, className }: AuthPageLayoutProps) {
  return (
    <div className="min-h-full bg-zinc-100 px-4 py-10 sm:px-6">
      <div className={cn("mx-auto w-full max-w-lg", className)}>{children}</div>
    </div>
  )
}
