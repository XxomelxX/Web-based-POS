"use client"

import { useMemo } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { useLiveQuery } from "@/hooks/use-live-query"

function formatPeso(amount: number) {
  return `₱${amount.toFixed(2)}`
}

export default function TransactionLogPage() {
  const transactions = useLiveQuery(() => db.transactions.toArray(), [], []) ?? []
  const gCashCount = useMemo(
    () => transactions.filter((tx) => tx.paymentMethod === "GCash").length,
    [transactions]
  )
  const revenue = useMemo(
    () => transactions.reduce((sum, tx) => sum + tx.total, 0),
    [transactions]
  )

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <PageHeader
        title="Transaction Log"
        subtitle="All completed sales with payment method and cashier details"
      />

      <section className="rounded-2xl bg-white p-6 shadow-md">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-brand-input/70 p-4">
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{transactions.length}</p>
          </div>
          <div className="rounded-2xl bg-brand-input/70 p-4">
            <p className="text-sm text-muted-foreground">Today's Revenue</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{formatPeso(revenue)}</p>
          </div>
          <div className="rounded-2xl bg-brand-input/70 p-4">
            <p className="text-sm text-muted-foreground">GCash Payments</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{gCashCount}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Order #</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Cashier</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Payment</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-muted/20">
                  <td className="px-4 py-4 font-medium text-foreground">#{tx.id}</td>
                  <td className="px-4 py-4 text-muted-foreground">{tx.date}</td>
                  <td className="px-4 py-4 text-foreground">{tx.cashier}</td>
                  <td className="px-4 py-4">
                    <Badge variant={tx.paymentMethod === "GCash" ? "active" : "default"}>
                      {tx.paymentMethod}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 font-semibold text-brand-green-darker">
                    {formatPeso(tx.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
