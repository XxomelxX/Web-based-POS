"use client"

import { useState } from "react"
import {
  ArrowLeftRight,
  Banknote,
  Box,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/dashboard/page-header"
import { Badge } from "@/components/ui/badge"

const stats = [
  { label: "Total Revenue", value: "₱268.00", icon: Banknote },
  { label: "Transactions", value: "4", icon: ArrowLeftRight },
  { label: "Items Sold", value: "4", icon: Box },
]

const timePeriods = ["Weekly", "Monthly"] as const

const topSellingProducts = [
  { rank: 1, name: "Nescafe 3in1 Original", sold: 5, price: "₱50.00" },
  { rank: 2, name: "Lucky Me Pancit Canton", sold: 5, price: "₱60.00" },
  { rank: 3, name: "Piattos Cheese 40g", sold: 5, price: "₱84.00" },
  { rank: 4, name: "Coca-Cola 500ml", sold: 5, price: "₱50.00" },
  { rank: 5, name: "Magic Sarap 8g", sold: 5, price: "₱12.00" },
]

const recentSales = [
  { id: "1001", cashier: "Maria Santos", total: "₱62.00" },
  { id: "1002", cashier: "Samuel Bioco", total: "₱145.00" },
  { id: "1003", cashier: "Maria Santos", total: "₱28.00" },
  { id: "1004", cashier: "Samuel Bioco", total: "₱33.00" },
]

const stockLevels = [
  { product: "Coca-Cola 500ml", category: "Beverages", stock: 48, status: "OK" as const },
  { product: "Lucky Me Pancit Canton", category: "Noodles", stock: 120, status: "OK" as const },
  { product: "Skyflakes Crackers", category: "Snacks", stock: 80, status: "OK" as const },
  { product: "Bear Brand Milk 33g", category: "Dairy", stock: 65, status: "OK" as const },
  { product: "Nescafe 3in1 Original", category: "Beverages", stock: 200, status: "OK" as const },
  { product: "Tide Powder 70g", category: "Household", stock: 8, status: "Critical" as const },
  { product: "Safeguard Soap 130g", category: "Personal Care", stock: 5, status: "Critical" as const },
]

export default function ReportsPage() {
  const [period, setPeriod] = useState<(typeof timePeriods)[number]>("Weekly")

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <PageHeader
        title="Reports"
        subtitle="Sales performance and inventory insights"
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Viewing reports for {period.toLowerCase()} data.</p>
        <div className="flex items-center gap-2 rounded-2xl bg-brand-input/80 p-2">
          {timePeriods.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPeriod(option)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition",
                period === option
                  ? "bg-brand-green-darker text-white"
                  : "text-foreground hover:bg-white/80"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <article
            key={label}
            className="rounded-2xl bg-white p-5 shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand-input text-brand-green-dark">
                <Icon className="size-5" />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mb-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Revenue Over Time</h2>
              <p className="text-sm text-muted-foreground">Weekly and monthly revenue trend</p>
            </div>
            <div className="rounded-full bg-brand-input/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-green-darker">
              {period}
            </div>
          </div>
          <div className="space-y-3">
            {([120, 180, 220, 170, 240, 200, 260] as const).map((value, index) => (
              <div key={index} className="flex items-end gap-3">
                <span className="min-w-[28px] text-xs text-muted-foreground">{`D${index + 1}`}</span>
                <div className="h-10 grow rounded-full bg-brand-input/70">
                  <div className="h-full rounded-full bg-brand-green" style={{ width: `${Math.min(value, 260) / 2.6}%` }} />
                </div>
                <span className="min-w-[36px] text-right text-sm font-semibold text-foreground">{`₱${value}`}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-foreground">Sales by Category</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-3xl bg-brand-input/70 p-6">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white">
                <div className="absolute inset-8 rounded-full bg-brand-green/90" />
                <div className="absolute inset-14 rounded-full bg-brand-green/20" />
                <span className="relative text-sm font-semibold text-foreground">Sales</span>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { category: "Beverages", amount: "₱560" },
                { category: "Snacks", amount: "₱420" },
                { category: "Household", amount: "₱310" },
              ].map((item) => (
                <div key={item.category} className="flex items-center justify-between rounded-2xl bg-brand-input/70 p-4">
                  <p className="text-sm text-foreground">{item.category}</p>
                  <p className="text-sm font-semibold text-foreground">{item.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <article className="rounded-2xl bg-white p-6 shadow-md">
        <h2 className="text-lg font-semibold text-foreground">Stock Levels</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-2 py-3 font-medium text-muted-foreground">Product</th>
                <th className="px-2 py-3 font-medium text-muted-foreground">Category</th>
                <th className="px-2 py-3 font-medium text-muted-foreground">Stock</th>
                <th className="px-2 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stockLevels.map((item) => (
                <tr key={item.product} className="hover:bg-muted/20">
                  <td className="px-2 py-3 font-medium text-foreground">{item.product}</td>
                  <td className="px-2 py-3 text-muted-foreground">{item.category}</td>
                  <td className="px-2 py-3 text-foreground">{item.stock}</td>
                  <td className="px-2 py-3">
                    <Badge variant={item.status === "Critical" ? "critical" : "ok"}>
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </main>
  )
}
