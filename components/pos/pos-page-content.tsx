"use client"

import { useMemo, useState, type KeyboardEvent } from "react"
import { Banknote, Check, Search, ShoppingCart, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal, ModalFooter } from "@/components/ui/modal"
import { useAuth } from "@/hooks/use-auth"
import { useOffline } from "@/components/offline/offline-context"
import { cn } from "@/lib/utils"

type PosProduct = {
  id: string
  name: string
  barcode: string
  price: number
  stock: number
  category: string
  packSize: string
  unit: string
}

type CartItem = {
  product: PosProduct
  quantity: number
}

type Order = {
  id: string
  date: string
  cashier: string
  paymentMethod: string
  reference?: string
  items: CartItem[]
  total: number
}

const categoryTabs = [
  "All",
  "Beverages",
  "Bread & Bakery",
  "Canned Goods",
  "Frozen Foods",
]

const posProducts: PosProduct[] = [
  {
    id: "1",
    name: "555 Sardines Hot Chili",
    barcode: "4800012345678",
    price: 26,
    stock: 20,
    category: "Canned Goods",
    packSize: "1 can = 155g",
    unit: "pcs",
  },
  {
    id: "2",
    name: "Alaska Evaporated Milk 370ml",
    barcode: "4800012345679",
    price: 38,
    stock: 15,
    category: "Frozen Foods",
    packSize: "1 can = 370ml",
    unit: "ml",
  },
  {
    id: "3",
    name: "Coca-Cola 500ml",
    barcode: "4800012345680",
    price: 25,
    stock: 30,
    category: "Beverages",
    packSize: "1 bottle = 500ml",
    unit: "ml",
  },
  {
    id: "4",
    name: "Colgate Total Active Fresh",
    barcode: "4800012345681",
    price: 99,
    stock: 8,
    category: "Bread & Bakery",
    packSize: "1 tube = 100g",
    unit: "g",
  },
  {
    id: "5",
    name: "Oreo Original 137g",
    barcode: "4800012345682",
    price: 50,
    stock: 18,
    category: "Bread & Bakery",
    packSize: "1 pack = 137g",
    unit: "g",
  },
  {
    id: "6",
    name: "Nova Country Cheddar 150g",
    barcode: "4800012345683",
    price: 35,
    stock: 6,
    category: "Bread & Bakery",
    packSize: "1 pack = 150g",
    unit: "g",
  },
  {
    id: "7",
    name: "Sprite Lemon Lime 500ml",
    barcode: "4800012345684",
    price: 24,
    stock: 22,
    category: "Beverages",
    packSize: "1 bottle = 500ml",
    unit: "ml",
  },
  {
    id: "8",
    name: "Pancit Canton Original",
    barcode: "4800012345685",
    price: 15,
    stock: 40,
    category: "Frozen Foods",
    packSize: "1 pack = 70g",
    unit: "g",
  },
  {
    id: "9",
    name: "Datu Puti Vinegar 350ml",
    barcode: "4800012345686",
    price: 18,
    stock: 25,
    category: "Canned Goods",
    packSize: "1 bottle = 350ml",
    unit: "ml",
  },
  {
    id: "10",
    name: "Head & Shoulders Cool Menthol",
    barcode: "4800012345687",
    price: 145,
    stock: 10,
    category: "Bread & Bakery",
    packSize: "1 bottle = 340ml",
    unit: "ml",
  },
  {
    id: "11",
    name: "Surf Excel Powder 45g",
    barcode: "4800012345688",
    price: 12,
    stock: 35,
    category: "Bread & Bakery",
    packSize: "1 sachet = 45g",
    unit: "g",
  },
  {
    id: "12",
    name: "Tropicana Light Orange 1L",
    barcode: "4800012345689",
    price: 72,
    stock: 12,
    category: "Beverages",
    packSize: "1 bottle = 1L",
    unit: "L",
  },
]

function formatPeso(amount: number) {
  return `₱${amount.toFixed(2)}`
}

type PosPageContentProps = {
  searchPlaceholder?: string
}

export function PosPageContent({
  searchPlaceholder = "Type product and press enter...",
}: PosPageContentProps) {
  const { user } = useAuth()
  const { enqueueOfflineAction } = useOffline()
  const cashierName = user?.name ?? "Cashier"
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "GCash">("Cash")
  const [amountTendered, setAmountTendered] = useState("")
  const [gcashReference, setGcashReference] = useState("")
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null)
  const [receiptOpen, setReceiptOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    return posProducts.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory
      const matchesSearch =
        searchQuery.trim() === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.barcode.includes(searchQuery)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const tendered = parseFloat(amountTendered) || 0
  const change = Math.max(tendered - cartTotal, 0)

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const addToCart = (product: PosProduct) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...current, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems((current) => current.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((current) =>
      current
        .map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return
    const trimmed = searchQuery.trim().toLowerCase()
    if (!trimmed) return

    const match = posProducts.find(
      (product) =>
        product.name.toLowerCase().includes(trimmed) ||
        product.barcode.includes(trimmed)
    )

    if (match) {
      addToCart(match)
      setSearchQuery("")
    }
  }

  const handleCompleteSale = () => {
    if (cartItems.length === 0) return
    if (paymentMethod === "Cash" && tendered < cartTotal) return
    if (paymentMethod === "GCash" && gcashReference.trim() === "") return

    const order: Order = {
      id: Math.floor(Math.random() * 9000 + 1000).toString(),
      date: new Date().toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      cashier: cashierName,
      paymentMethod,
      reference: paymentMethod === "GCash" ? gcashReference : undefined,
      items: cartItems,
      total: cartTotal,
    }

    setCompletedOrder(order)
    setReceiptOpen(true)
    setCartItems([])
    setAmountTendered("")
    setGcashReference("")

    void enqueueOfflineAction("transaction", {
      order,
      items: cartItems,
      paymentMethod,
      reference: order.reference,
    })
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
      <div className="flex flex-1 flex-col overflow-y-auto p-6 lg:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">Point of Sale</h1>
          <p className="mt-1 text-sm text-white/80">
            Manual product search and checkout for cashiers.
          </p>
        </header>

        <div className="relative mb-4">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="h-11 bg-white pl-10"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categoryTabs.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeCategory === category
                  ? "bg-brand-green-darker text-white shadow-sm"
                  : "bg-white/90 text-foreground hover:bg-white"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => addToCart(product)}
              className="rounded-2xl bg-white p-4 text-left shadow-md transition-shadow hover:shadow-lg"
            >
              <p className="font-medium text-foreground">{product.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {product.packSize} · {product.unit}
              </p>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-brand-green-darker">
                  {formatPeso(product.price)}
                </span>
                <span className="text-muted-foreground">{product.stock} stk</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <aside className="flex w-full shrink-0 flex-col border-t border-white/20 bg-brand-green p-6 lg:w-96 lg:border-t-0 lg:border-l lg:p-6">
        <div className="flex flex-1 flex-col rounded-2xl bg-white p-5 shadow-md">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Cart</h2>
              <p className="text-sm text-muted-foreground">
                {cartCount} item{cartCount !== 1 ? "s" : ""} in cart
              </p>
            </div>
            <span className="flex h-7 min-w-[28px] items-center justify-center rounded-full bg-brand-green-darker px-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
              {cartCount}
            </span>
          </div>

          <div className="min-h-[260px] overflow-y-auto rounded-3xl border border-border bg-brand-input/50 p-4">
            {cartItems.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
                <ShoppingCart className="size-12 text-muted-foreground" />
                <p className="font-medium text-foreground">No items in cart yet</p>
                <p>Type a product name or select a product card above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="rounded-2xl bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{item.product.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.quantity} × {formatPeso(item.product.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {formatPeso(item.product.price * item.quantity)}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-red-600"
                        >
                          <Trash2 className="size-3" /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="rounded-xl border border-border bg-muted px-3 py-1 text-sm"
                      >
                        −
                      </button>
                      <span className="min-w-[32px] text-center text-sm font-semibold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="rounded-xl border border-border bg-muted px-3 py-1 text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPeso(cartTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-base font-bold text-foreground">
              <span>TOTAL</span>
              <span>{formatPeso(cartTotal)}</span>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Payment Method</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {(["Cash", "GCash"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-sm font-medium transition",
                      paymentMethod === method
                        ? "border-brand-green-darker bg-brand-green-darker/10 text-brand-green-darker"
                        : "border-border bg-white text-foreground hover:border-brand-green"
                    )}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === "GCash" ? (
              <div>
                <label htmlFor="gcash-reference" className="mb-1.5 block text-sm font-medium text-foreground">
                  GCash Reference Number
                </label>
                <Input
                  id="gcash-reference"
                  placeholder="Enter transaction number"
                  className="pl-3"
                  value={gcashReference}
                  onChange={(event) => setGcashReference(event.target.value)}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="amount-tendered" className="mb-1.5 block text-sm font-medium text-foreground">
                  Amount Tendered
                </label>
                <div className="relative">
                  <Banknote className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-green-dark" />
                  <Input
                    id="amount-tendered"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-10"
                    value={amountTendered}
                    onChange={(event) => setAmountTendered(event.target.value)}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">Change</span>
                  <span className="font-semibold text-brand-green-dark">
                    {formatPeso(change)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-3">
            <Button
              type="button"
              className="h-11 w-full rounded-xl bg-brand-green-darker text-white hover:bg-brand-green-dark"
              onClick={handleCompleteSale}
            >
              <Check className="size-4" />
              Complete Sale
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-xl"
              onClick={handlePrintReceipt}
              disabled={!completedOrder}
            >
              Print Receipt
            </Button>
          </div>

        </div>
      </aside>

      <Modal
        open={receiptOpen && Boolean(completedOrder)}
        onClose={() => setReceiptOpen(false)}
        title="Sale Receipt"
        className="max-w-[360px]"
        footer={
          <ModalFooter
            onCancel={() => setReceiptOpen(false)}
            onConfirm={handlePrintReceipt}
            cancelLabel="× Close"
            confirmLabel="🖨 Print"
          />
        }
      >
        {completedOrder && (
          <div className="rounded-2xl bg-white p-3 text-[0.72rem] text-foreground">
            <div className="space-y-1 text-center font-mono">
              <p className="text-sm font-semibold">J & J Merchandise Store</p>
              <p className="text-[0.65rem] text-muted-foreground">Datag Buagsong, Cordova, Cebu</p>
              <p className="text-[0.65rem] text-muted-foreground">TIN: 000-123-456-000</p>
            </div>

            <div className="my-5 border-t border-dashed border-muted/60 pt-4"></div>

            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span>Receipt #</span>
                <span>{completedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Date</span>
                <span>{completedOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Cashier</span>
                <span>{completedOrder.cashier}</span>
              </div>
            </div>

            <div className="my-5 border-t border-dashed border-muted/60 pt-4"></div>

            <div className="space-y-4 font-mono text-sm">
              {completedOrder.items.map((item) => (
                <div key={item.product.id}>
                  <p className="font-medium text-foreground">{item.product.name}</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{item.quantity} x {formatPeso(item.product.price)}</span>
                    <span>{formatPeso(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-4 border-t border-dashed border-muted/60 pt-3"></div>

            <div className="space-y-2 font-mono text-[0.72rem]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPeso(completedOrder.total / 1.12)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (12%)</span>
                <span>{formatPeso(completedOrder.total - completedOrder.total / 1.12)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-foreground">
                <span>TOTAL</span>
                <span>{formatPeso(completedOrder.total)}</span>
              </div>
            </div>

            <div className="my-4 border-t border-dashed border-muted/60 pt-3"></div>

            <div className="space-y-2 font-mono text-[0.72rem]">
              <div className="flex justify-between">
                <span>Payment</span>
                <span>{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Tendered</span>
                <span>{paymentMethod === "Cash" ? formatPeso(tendered) : completedOrder.reference ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Change</span>
                <span>{paymentMethod === "Cash" ? formatPeso(change) : "—"}</span>
              </div>
            </div>

            <div className="mt-6 text-center font-mono text-sm text-muted-foreground">
              Thank you for shopping! Please come again.
            </div>
          </div>
        )}
      </Modal>
    </main>
  )
}
