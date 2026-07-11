"use client"

import { useState } from "react"
import { Banknote, Package, ShoppingBag, Search } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import {
  OrderDetailModal,
  type OrderDetail,
} from "@/components/dashboard/order-detail-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const stats = [
  { label: "Total Orders", value: "4", icon: ShoppingBag },
  { label: "Items Sold", value: "17", icon: Package },
  { label: "Revenue", value: "₱268.00", icon: Banknote },
]

const orders = [
  {
    id: "2922",
    datetime: "4/22/2026, 11:21:09 AM",
    cashier: "Maria Santos",
    items: 2,
    total: "₱16.00",
    detail: {
      id: "2922",
      datetime: "4/22/2026, 11:21:09 AM",
      cashier: "Maria Santos",
      items: [
        { name: "Nescafe 3in1 Original", unitPrice: 10, quantity: 1 },
        { name: "Magic Sarap 8g", unitPrice: 6, quantity: 1 },
      ],
      total: 16,
    },
  },
  {
    id: "2921",
    datetime: "Jul 11, 2026 · 12:30 PM",
    cashier: "Samuel Bioco",
    items: 5,
    total: "₱145.00",
    detail: {
      id: "2921",
      datetime: "Jul 11, 2026 · 12:30 PM",
      cashier: "Samuel Bioco",
      items: [{ name: "Coca-Cola 500ml", unitPrice: 25, quantity: 5 }],
      total: 125,
    },
  },
  {
    id: "2920",
    datetime: "Jul 11, 2026 · 11:15 AM",
    cashier: "Maria Santos",
    items: 3,
    total: "₱28.00",
    detail: {
      id: "2920",
      datetime: "Jul 11, 2026 · 11:15 AM",
      cashier: "Maria Santos",
      items: [{ name: "Oreo Original 137g", unitPrice: 28, quantity: 1 }],
      total: 28,
    },
  },
  {
    id: "2919",
    datetime: "Jul 11, 2026 · 10:00 AM",
    cashier: "Samuel Bioco",
    items: 7,
    total: "₱33.00",
    detail: {
      id: "2919",
      datetime: "Jul 11, 2026 · 10:00 AM",
      cashier: "Samuel Bioco",
      items: [{ name: "Pancit Canton Original", unitPrice: 15, quantity: 2 }],
      total: 30,
    },
  },
]

export function OrdersPageContent() {
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)

  return (
    <>
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <PageHeader title="Orders" subtitle="All sales transactions" />

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <article key={label} className="rounded-2xl bg-white p-5 shadow-md">
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

        <div className="mb-6 rounded-2xl bg-white p-4 shadow-md">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by ID, cashier or item" className="pl-10" />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <label htmlFor="from-date" className="shrink-0 text-sm text-muted-foreground">
                  From
                </label>
                <Input id="from-date" type="date" className="w-full sm:w-auto" />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="to-date" className="shrink-0 text-sm text-muted-foreground">
                  To
                </label>
                <Input id="to-date" type="date" className="w-full sm:w-auto" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
                  <th className="px-6 py-4 font-medium text-muted-foreground">Order#</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Date/time</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Cashier</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Items</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Total</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4 font-medium text-foreground">#{order.id}</td>
                    <td className="px-6 py-4 text-muted-foreground">{order.datetime}</td>
                    <td className="px-6 py-4 text-foreground">{order.cashier}</td>
                    <td className="px-6 py-4 text-muted-foreground">{order.items}</td>
                    <td className="px-6 py-4 font-semibold text-brand-green-darker">
                      {order.total}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => setSelectedOrder(order.detail)}
                        >
                          View
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className={cn(
                            "rounded-lg bg-brand-green text-white hover:bg-brand-green-dark"
                          )}
                        >
                          Complete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  )
}
