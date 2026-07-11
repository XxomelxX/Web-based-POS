"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"

export type OrderLineItem = {
  name: string
  unitPrice: number
  quantity: number
}

export type OrderDetail = {
  id: string
  datetime: string
  cashier: string
  items: OrderLineItem[]
  total: number
}

type OrderDetailModalProps = {
  order: OrderDetail | null
  onClose: () => void
}

function formatPeso(amount: number) {
  return `₱${amount.toFixed(2)}`
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  useEffect(() => {
    if (!order) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", handleEscape)
    }
  }, [order, onClose])

  if (!order) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-detail-title"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="order-detail-title" className="text-xl font-semibold text-foreground">
              Order #{order.id}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.datetime} · Cashier: {order.cashier}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-5" />
          </Button>
        </div>

        <ul className="mt-6 divide-y divide-border">
          {order.items.map((item) => (
            <li
              key={`${item.name}-${item.unitPrice}`}
              className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPeso(item.unitPrice)} x {item.quantity}
                </p>
              </div>
              <p className="shrink-0 font-medium text-foreground">
                {formatPeso(item.unitPrice * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-base font-bold text-foreground">Total</span>
          <span className="text-base font-bold text-brand-green-darker">
            {formatPeso(order.total)}
          </span>
        </div>
      </div>
    </div>
  )
}
