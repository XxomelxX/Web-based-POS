"use client"

import { useState } from "react"
import { Shield, Store } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const defaultSettings = {
  storeName: "J & J Merchandise Store",
  currency: "PHP",
  address: "Datag Buagsong, Cordova, Cebu",
  taxRate: "12",
  lowStockThreshold: "10",
}

const selectClassName = cn(
  "flex h-10 w-full rounded-lg border border-transparent bg-brand-input px-3 text-sm text-foreground outline-none focus-visible:border-brand-green-dark focus-visible:ring-2 focus-visible:ring-brand-green/30"
)

type SettingsPageContentProps = {
  accountName: string
  accountRole: string
  readOnly?: boolean
}

export function SettingsPageContent({
  accountName,
  accountRole,
  readOnly = false,
}: SettingsPageContentProps) {
  const [settings, setSettings] = useState(defaultSettings)

  const handleReset = () => {
    setSettings(defaultSettings)
  }

  const updateField = (field: keyof typeof defaultSettings, value: string) => {
    setSettings((current) => ({ ...current, [field]: value }))
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <PageHeader
        title="Settings"
        subtitle={
          readOnly
            ? "View store information and your account"
            : "Configure your store and preferences"
        }
      />

      <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
        <section>
          <div className="mb-5 flex items-center gap-2">
            <Store className="size-5 text-brand-green-dark" />
            <h2 className="text-lg font-semibold text-foreground">Store Information</h2>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="store-name">Store name</Label>
                <Input
                  id="store-name"
                  value={settings.storeName}
                  onChange={(event) => updateField("storeName", event.target.value)}
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={settings.currency}
                  onChange={(event) => updateField("currency", event.target.value)}
                  className={selectClassName}
                  disabled={readOnly}
                >
                  <option value="PHP">PHP (₱)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(event) => updateField("address", event.target.value)}
                disabled={readOnly}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="tax-rate">Tax rate (%)</Label>
                <Input
                  id="tax-rate"
                  type="number"
                  min="0"
                  value={settings.taxRate}
                  onChange={(event) => updateField("taxRate", event.target.value)}
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="low-stock-threshold">Low-stock threshold</Label>
                <Input
                  id="low-stock-threshold"
                  type="number"
                  min="0"
                  value={settings.lowStockThreshold}
                  onChange={(event) =>
                    updateField("lowStockThreshold", event.target.value)
                  }
                  disabled={readOnly}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-xl bg-brand-input/60 p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="size-5 text-brand-green-dark" />
            <h2 className="text-lg font-semibold text-foreground">Account</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Signed in as</p>
              <p className="mt-1 font-medium text-foreground">{accountName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="mt-1 font-medium uppercase tracking-wide text-foreground">
                {accountRole}
              </p>
            </div>
          </div>
        </section>

        {!readOnly && (
          <div className="mt-8 flex justify-end gap-3 border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="h-10 rounded-xl px-5"
            >
              Reset
            </Button>
            <Button
              type="button"
              className="h-10 rounded-xl bg-slate-800 px-5 text-white hover:bg-slate-900"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
