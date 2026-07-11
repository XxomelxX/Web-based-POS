"use client"

import { useMemo, useState } from "react"
import {
  AlertTriangle,
  ArrowUp,
  Box,
  Plus,
  Search,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Modal, ModalFooter } from "@/components/ui/modal"
import { TableActions } from "@/components/dashboard/table-actions"
import { cn } from "@/lib/utils"

type LowStockItem = {
  product: string
  barcode: string
  category: string
  price: string
  stock: number
  status: "CRITICAL" | "WARNING"
}

const lowStockThreshold = 20

const initialLowStockItems: LowStockItem[] = [
  {
    product: "Tide Powder 70g",
    barcode: "4801234567895",
    category: "Household",
    price: "₱22.00",
    stock: 8,
    status: "CRITICAL",
  },
  {
    product: "Safeguard Soap 130g",
    barcode: "4801234567896",
    category: "Personal Care",
    price: "₱45.00",
    stock: 5,
    status: "CRITICAL",
  },
]

export default function LowStockPage() {
  const [items, setItems] = useState<LowStockItem[]>(initialLowStockItems)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(items[0]?.product ?? "")
  const [quantityToAdd, setQuantityToAdd] = useState("")
  const [costPerUnit, setCostPerUnit] = useState("")

  const selectedItem = useMemo(
    () => items.find((item) => item.product === selectedProduct) ?? items[0],
    [items, selectedProduct]
  )

  const currentStock = selectedItem?.stock ?? 0
  const addedStock = Number(quantityToAdd) || 0
  const newStock = currentStock + addedStock

  const restockableItems = useMemo(
    () => items.filter((item) => item.stock < lowStockThreshold),
    [items]
  )

  const stats = useMemo(() => {
    const criticalCount = restockableItems.filter((item) => item.stock < 10).length
    const warningCount = restockableItems.filter((item) => item.stock >= 10 && item.stock < lowStockThreshold).length

    return [
      {
        label: "Critical (<10)",
        value: String(criticalCount),
        icon: AlertTriangle,
        iconClassName: "text-red-500 bg-red-50",
        valueClassName: "text-red-500",
      },
      {
        label: "Warning (10-19)",
        value: String(warningCount),
        icon: Box,
        iconClassName: "text-foreground bg-muted",
        valueClassName: "text-foreground",
      },
      {
        label: "Total Restock Needed",
        value: String(restockableItems.length),
        icon: ArrowUp,
        iconClassName: "text-brand-green-dark bg-brand-input",
        valueClassName: "text-foreground",
      },
    ]
  }, [restockableItems])

  const openRestockModal = (product?: string) => {
    setSelectedProduct(product ?? restockableItems[0]?.product ?? "")
    setQuantityToAdd("")
    setCostPerUnit("")
    setModalOpen(true)
  }

  const handleAddStock = () => {
    const quantity = Number(quantityToAdd)
    if (!selectedItem || quantity <= 0) return

    setItems((current) =>
      current
        .map((item) =>
          item.product === selectedItem.product
            ? { ...item, stock: item.stock + quantity }
            : item
        )
        .filter((item) => item.stock < lowStockThreshold)
    )

    setModalOpen(false)
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/15 text-red-500">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">Low Stock Items</h1>
              <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
                {items.length}
              </span>
            </div>
            <p className="mt-1 text-sm text-white/80 sm:text-base">
              Products below 20 units that need restocking
            </p>
          </div>
        </div>

        <Button
          type="button"
          className="h-10 rounded-xl bg-brand-green-darker text-white hover:bg-brand-green-dark"
          onClick={() => openRestockModal()}
        >
          <Plus className="size-4" />
          Restock Product
        </Button>
      </header>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, iconClassName, valueClassName }) => (
          <article
            key={label}
            className="rounded-2xl bg-white p-5 shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p
                  className={cn(
                    "mt-2 text-2xl font-semibold",
                    valueClassName
                  )}
                >
                  {value}
                </p>
              </div>
              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl",
                  iconClassName
                )}
              >
                <Icon className="size-5" />
              </div>
            </div>
          </article>
        ))}
      </section>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search low stock items..." className="pl-10" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-6 py-4 font-medium text-muted-foreground">Product</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Category</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Price</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Current Stock</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {restockableItems.map((item) => (
                <tr key={item.barcode} className="hover:bg-muted/20">
                  <td className="px-6 py-4 font-medium text-foreground">{item.product}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.category}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{item.price}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-red-500 text-sm font-semibold text-white">
                      {item.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="critical" className="uppercase tracking-wide">
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        className="h-9 rounded-xl bg-brand-green-darker px-3 text-sm font-medium text-white hover:bg-brand-green-dark"
                        onClick={() => openRestockModal(item.product)}
                      >
                        <Plus className="size-4" />
                        Restock
                      </Button>
                      <TableActions onEdit={() => {}} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Restock Product"
        footer={
          <ModalFooter
            onCancel={() => setModalOpen(false)}
            onConfirm={handleAddStock}
            confirmLabel="Add Stock"
          />
        }
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Product Name</label>
            <div className="relative">
              <select
                className={cn(
                  "flex h-10 w-full rounded-lg border border-transparent bg-brand-input px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-brand-green-dark focus-visible:ring-2 focus-visible:ring-brand-green/30",
                  "appearance-none"
                )}
                value={selectedProduct}
                onChange={(event) => setSelectedProduct(event.target.value)}
              >
                {items.map((item) => (
                  <option key={item.barcode} value={item.product}>
                    {item.product}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Quantity to Add</label>
            <Input
              type="number"
              min="1"
              value={quantityToAdd}
              onChange={(event) => setQuantityToAdd(event.target.value)}
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Cost per Unit</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₱</span>
              <Input
                type="text"
                value={costPerUnit.replace(/^₱/, "")}
                onChange={(event) => setCostPerUnit(event.target.value)}
                className="pl-8"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-brand-input/70 p-4 text-sm text-muted-foreground">
            <p>
              Current Stock: <span className="font-semibold text-foreground">{currentStock}</span>{" "}
              → New Stock: <span className="font-semibold text-foreground">{newStock}</span>
            </p>
          </div>
        </div>
      </Modal>
    </main>
  )
}
