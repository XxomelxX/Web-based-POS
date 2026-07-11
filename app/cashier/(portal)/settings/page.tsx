"use client"

import { SettingsPageContent } from "@/components/dashboard/settings-page-content"
import { useAuth } from "@/hooks/use-auth"
import { getRoleLabel } from "@/lib/auth"

export default function CashierSettingsPage() {
  const { user } = useAuth()
  return (
    <SettingsPageContent
      accountName={user?.accountName ?? "Judy ann"}
      accountRole={user ? getRoleLabel(user.role) : "CASHIER"}
      readOnly
    />
  )
}
