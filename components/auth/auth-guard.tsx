"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/hooks/use-auth"
import { getDashboardPath } from "@/lib/auth"
import type { UserRole } from "@/lib/navigation"

type AuthGuardProps = {
  requiredRole: UserRole
  children: React.ReactNode
}

export function AuthGuard({ requiredRole, children }: AuthGuardProps) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace("/login")
      return
    }

    if (user.role !== requiredRole) {
      router.replace(getDashboardPath(user.role))
    }
  }, [user, loading, requiredRole, router])

  if (loading || !user || user.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}
