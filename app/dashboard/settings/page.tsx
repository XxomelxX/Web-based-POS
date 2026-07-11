"use client"

import { SettingsPageContent } from "@/components/dashboard/settings-page-content"
import { useAuth } from "@/hooks/use-auth"
import { getRoleLabel } from "@/lib/auth"

export default function SettingsPage() {
  const { user } = useAuth()
  return (
    <SettingsPageContent
      accountName={user?.accountName ?? "Samuel Bioco"}
      accountRole={user ? getRoleLabel(user.role) : "ADMIN"}
    />
  )
}
