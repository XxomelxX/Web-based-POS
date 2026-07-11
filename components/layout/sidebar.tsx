"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LogOut } from "lucide-react"

import { StoreLogo } from "@/components/layout/store-logo"
import { LogoutModal } from "@/components/layout/logout-modal"
import { OfflineStatusBadge } from "@/components/offline/offline-status-badge"
import { buttonVariants } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { getRoleDisplay, getUserInitial } from "@/lib/auth"
import { getRoleConfig, type UserRole } from "@/lib/navigation"
import { cn } from "@/lib/utils"

type SidebarProps = {
  role: UserRole
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const { user } = useAuth()
  const config = getRoleConfig(role)

  const displayName = user?.name ?? config.userName
  const displayRole = user ? getRoleDisplay(user.role) : config.userRole
  const userInitial = user ? getUserInitial(user.name) : config.userInitial

  return (
    <>
      <aside className="flex h-full w-64 shrink-0 flex-col bg-white shadow-lg">
        <div className="border-b border-border px-6 py-6">
          <StoreLogo
            className="items-start gap-2"
            iconClassName="size-12 rounded-xl"
            nameClassName="text-left text-lg"
          />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {config.navItems.map(({ label, href, icon: Icon }) => {
            const dashboardHref =
              role === "admin" ? "/dashboard" : "/cashier/dashboard"
            const isActive =
              href === dashboardHref
                ? pathname === dashboardHref
                : pathname.startsWith(href)

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-input font-semibold text-brand-green-darker"
                    : "text-muted-foreground hover:bg-brand-input/60 hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border px-4 py-4">
          <div className="mb-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-brand-green text-sm font-semibold text-white">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  Welcome, {displayName}
                </p>
                <p className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {displayRole}
                </p>
              </div>
            </div>
            <OfflineStatusBadge />
          </div>
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className={cn(
              buttonVariants({ variant: "destructive" }),
              "h-9 w-full rounded-lg bg-red-500 text-white hover:bg-red-600"
            )}
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>

      <LogoutModal open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </>
  )
}
