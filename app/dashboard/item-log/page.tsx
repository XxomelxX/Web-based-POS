import { PageHeader } from "@/components/dashboard/page-header"
import { Badge } from "@/components/ui/badge"

type ItemLogEntry = {
  id: string
  date: string
  product: string
  action: string
  movement: "In" | "Out"
  quantity: number
  user: string
}

const itemLog: ItemLogEntry[] = [
  {
    id: "L001",
    date: "Jul 10, 2026",
    product: "Coca-Cola 500ml",
    action: "Sold",
    movement: "Out",
    quantity: 2,
    user: "Judy ann",
  },
  {
    id: "L002",
    date: "Jul 10, 2026",
    product: "Sprite Lemon Lime 500ml",
    action: "Restocked",
    movement: "In",
    quantity: 10,
    user: "Samuel",
  },
  {
    id: "L003",
    date: "Jul 10, 2026",
    product: "Oreo Original 137g",
    action: "Adjusted",
    movement: "In",
    quantity: 1,
    user: "Samuel",
  },
]

const lastInCount = itemLog.filter((entry) => entry.movement === "In").length
const lastOutCount = itemLog.filter((entry) => entry.movement === "Out").length

export default function ItemLogPage() {
  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <PageHeader
        title="Item Log"
        subtitle="Detailed product movement history for auditing"
      />

      <section className="rounded-2xl bg-white p-6 shadow-md">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-brand-input/70 p-4">
            <p className="text-sm text-muted-foreground">Total Movements</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{itemLog.length}</p>
          </div>
          <div className="rounded-2xl bg-brand-input/70 p-4">
            <p className="text-sm text-muted-foreground">Last In Entries</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{lastInCount}</p>
          </div>
          <div className="rounded-2xl bg-brand-input/70 p-4">
            <p className="text-sm text-muted-foreground">Last Out Entries</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{lastOutCount}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Direction</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Action</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Quantity</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Performed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {itemLog.map((entry) => (
                <tr key={entry.id} className="hover:bg-muted/20">
                  <td className="px-4 py-4 font-medium text-foreground">{entry.date}</td>
                  <td className="px-4 py-4 text-muted-foreground">{entry.product}</td>
                  <td className="px-4 py-4">
                    <Badge variant={entry.movement === "In" ? "active" : "low-stock"}>
                      {entry.movement}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={entry.action === "Sold" ? "low-stock" : "active"}>
                      {entry.action}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-foreground">{entry.quantity}</td>
                  <td className="px-4 py-4 text-foreground">{entry.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
