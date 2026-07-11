"use client"

import { DashboardHome } from "@/components/dashboard/dashboard-home"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardPage() {
  const { user } = useAuth()
  return <DashboardHome userName={user?.name ?? "Samuel"} />
}
