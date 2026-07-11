"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { Sidebar } from "@/components/layout/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requiredRole="admin">
      <div className="flex min-h-full">
        <Sidebar role="admin" />
        <div className="flex min-h-full flex-1 flex-col bg-brand-green">{children}</div>
      </div>
    </AuthGuard>
  )
}
