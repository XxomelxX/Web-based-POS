import {
  AlertTriangle,
  Banknote,
  Box,
  ShoppingCart,
} from "lucide-react"

import { cn } from "@/lib/utils"

const stats = [
  {
    label: "Today's Revenue",
    value: "₱268.00",
    icon: Banknote,
    iconClassName: "text-brand-green-dark bg-brand-input",
  },
  {
    label: "Transactions Today",
    value: "4",
    icon: ShoppingCart,
    iconClassName: "text-brand-green-dark bg-brand-input",
  },
  {
    label: "Top Selling",
    value: "Coca-Cola 500ml",
    icon: Box,
    iconClassName: "text-brand-green-dark bg-brand-input",
  },
  {
    label: "Low Stock Alerts",
    value: "2",
    icon: AlertTriangle,
    iconClassName: "text-red-500 bg-red-50",
    valueClassName: "text-red-500",
  },
]

const recentTransactions = [
  { id: "1001", customer: "Juan Dela Cruz", items: 2, time: "01:45 PM", amount: "₱62.00" },
  { id: "1002", customer: "Maria Santos", items: 3, time: "12:30 PM", amount: "₱145.00" },
  { id: "1003", customer: "Pedro Reyes", items: 1, time: "11:15 AM", amount: "₱28.00" },
  { id: "1004", customer: "Ana Garcia", items: 4, time: "10:00 AM", amount: "₱33.00" },
]

const lowStockItems = [
  { name: "Tide Powder 70g", sku: "4801234567895", quantity: 8 },
  { name: "Safeguard Soap 135g", sku: "4801234567896", quantity: 5 },
]

const stockLevels = [
  { product: "Coca-Cola 500ml", category: "Beverages", stock: 48 },
  { product: "Oreo Original 137g", category: "Snacks", stock: 18 },
  { product: "Sprite Lemon Lime 1.5L", category: "Beverages", stock: 14 },
  { product: "Alaska Evaporated Milk 370ml", category: "Dairy", stock: 15 },
]

const topSellingProducts = [
  { rank: 1, name: "Coca-Cola 500ml", sold: 18, price: "₱25.00" },
  { rank: 2, name: "Oreo Original 137g", sold: 14, price: "₱50.00" },
  { rank: 3, name: "Sprite Lemon Lime 500ml", sold: 12, price: "₱24.00" },
  { rank: 4, name: "Alaska Evaporated Milk 370ml", sold: 10, price: "₱38.00" },
]

type DashboardHomeProps = {
  userName: string
}

export function DashboardHome({ userName }: DashboardHomeProps) {
  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">
          Welcome back, {userName}
        </h1>
        <p className="mt-1 text-sm text-white/80 sm:text-base">
          Here&apos;s what&apos;s happening in your store today
        </p>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, iconClassName, valueClassName }) => (
          <article key={label} className="rounded-2xl bg-white p-5 shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className={cn("mt-2 text-2xl font-semibold text-foreground", valueClassName)}>
                  {value}
                </p>
              </div>
              <div className={cn("flex size-11 items-center justify-center rounded-xl", iconClassName)}>
                <Icon className="size-5" />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl bg-white p-6 shadow-md">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Top Selling Products</h2>
              <p className="mt-1 text-sm text-muted-foreground">Most popular products this week.</p>
            </div>
            <span className="rounded-full bg-brand-input px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-green-darker">
              Weekly
            </span>
          </div>
          <ul className="mt-5 space-y-4">
            {topSellingProducts.slice(0, 4).map((product) => (
              <li key={product.rank} className="flex items-center justify-between gap-4 rounded-2xl bg-brand-green/5 p-4">
                <div>
                  <p className="font-medium text-foreground">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.sold} sold</p>
                </div>
                <p className="font-semibold text-brand-green-darker">{product.price}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-foreground">Inventory Snapshot</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-brand-input/70 p-4">
              <p className="text-sm text-muted-foreground">Current stock items</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{stockLevels.length}</p>
            </div>
            <div className="rounded-2xl bg-brand-input/70 p-4">
              <p className="text-sm text-muted-foreground">Critical stock</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{lowStockItems.length}</p>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}
