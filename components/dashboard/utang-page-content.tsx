"use client"

import { useEffect, useMemo, useState } from "react"
import { Banknote, Plus, Search, Wallet } from "lucide-react"

import {
  createCustomer,
  createPaymentAllocation,
  createUtangEntry,
  createUtangEntryItem,
  getAllUtangEntryItems,
  getCustomers,
  getProducts,
  getUtangEntries,
  updateCustomer,
  updateProduct,
  updateUtangEntry,
} from "@/lib/data"
import type {
  Customer,
  Product,
  UtangEntry,
  UtangEntryItem,
} from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal, ModalFooter } from "@/components/ui/modal"
import { cn } from "@/lib/utils"

type AddUtangLineItem = {
  id: string
  productId?: number
  productName: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

type UtangPageContentProps = {
  isAdmin?: boolean
}

type PaymentAllocationMap = Record<number, number>

function formatPeso(amount: number) {
  return `₱${amount.toFixed(2)}`
}

export function UtangPageContent({ isAdmin = true }: UtangPageContentProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [utangEntries, setUtangEntries] = useState<UtangEntry[]>([])
  const [utangItems, setUtangItems] = useState<UtangEntryItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [addUtangOpen, setAddUtangOpen] = useState(false)
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false)
  const [detailsCustomerId, setDetailsCustomerId] = useState<number | null>(null)
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null)
  const [manualAllocations, setManualAllocations] = useState<PaymentAllocationMap>({})

  const [addUtangForm, setAddUtangForm] = useState({
    customerName: "",
    note: "",
    items: [] as AddUtangLineItem[],
  })

  const [recordPaymentForm, setRecordPaymentForm] = useState({
    customerName: "",
    amount: "",
    note: "",
  })

  const loadData = async () => {
    const [loadedCustomers, loadedProducts, loadedEntries, loadedItems] = await Promise.all([
      getCustomers(),
      getProducts(),
      getUtangEntries(),
      getAllUtangEntryItems(),
    ])

    setCustomers(loadedCustomers)
    setProducts(loadedProducts)
    setUtangEntries(loadedEntries)
    setUtangItems(loadedItems)
  }

  useEffect(() => {
    async function initData() {
      await loadData()
    }

    void initData()
  }, [])

  const customerMap = useMemo(
    () => new Map(customers.map((customer) => [customer.name.toLowerCase(), customer])),
    [customers]
  )

  const customerBalances = useMemo(
    () =>
      customers.map((customer) => ({
        id: customer.id!,
        name: customer.name,
        balance: customer.balance,
        status: customer.status,
      })),
    [customers]
  )

  const totalOutstanding = customerBalances.reduce((sum, entry) => sum + entry.balance, 0)
  const customersWithUtang = customerBalances.filter((entry) => entry.balance > 0).length

  const filteredBalances = useMemo(() => {
    if (!searchQuery.trim()) return customerBalances
    return customerBalances.filter((entry) =>
      entry.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [customerBalances, searchQuery])

  const customerOptions = customers.map((customer) => customer.name)

  const outstandingEntriesForSelectedCustomer = useMemo(() => {
    const customer = customerMap.get(recordPaymentForm.customerName.toLowerCase().trim())
    if (!customer) return []

    return utangEntries
      .filter(
        (entry) =>
          entry.customerId === customer.id &&
          entry.type === "Utang" &&
          entry.remainingBalance > 0
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [customerMap, recordPaymentForm.customerName, utangEntries])

  const selectedCustomerDetails = useMemo(
    () => customers.find((customer) => customer.id === detailsCustomerId) ?? null,
    [customers, detailsCustomerId]
  )

  const selectedEntry = useMemo(
    () => utangEntries.find((entry) => entry.id === selectedEntryId) ?? null,
    [utangEntries, selectedEntryId]
  )

  const selectedEntryItems = useMemo(() => {
    if (!selectedEntryId) return []
    return utangItems.filter((item) => item.utangEntryId === selectedEntryId)
  }, [utangItems, selectedEntryId])

  const stats = [
    {
      label: "Total outstanding utang",
      value: formatPeso(totalOutstanding),
      valueClassName: "text-orange-600",
    },
    {
      label: "Customers with utang",
      value: String(customersWithUtang),
      valueClassName: "text-foreground",
    },
    {
      label: "Total entries",
      value: String(utangEntries.length),
      valueClassName: "text-foreground",
    },
  ]

  const activityRows = useMemo(
    () =>
      utangEntries
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((entry) => ({
          id: entry.id!,
          customerId: entry.customerId,
          customerName: customers.find((c) => c.id === entry.customerId)?.name ?? "Unknown",
          date: entry.date,
          type: entry.type,
          note: entry.note,
          amount: entry.amount,
        })),
    [utangEntries, customers]
  )

  const addUtangTotal = useMemo(
    () => addUtangForm.items.reduce((sum, item) => sum + item.lineTotal, 0),
    [addUtangForm.items]
  )

  const defaultAllocations = useMemo(() => {
    const paymentAmount = Number(recordPaymentForm.amount) || 0

    return outstandingEntriesForSelectedCustomer
      .reduce(
        (acc, entry) => {
          const manualValue = manualAllocations[entry.id!] ?? undefined
          const amount = manualValue !== undefined
            ? Math.min(manualValue, entry.remainingBalance, acc.remaining)
            : Math.min(entry.remainingBalance, acc.remaining)

          return {
            remaining: acc.remaining - amount,
            allocations: [
              ...acc.allocations,
              {
                entryId: entry.id!,
                amount,
              },
            ],
          }
        },
        {
          remaining: paymentAmount,
          allocations: [] as Array<{ entryId: number; amount: number }>,
        }
      )
      .allocations
  }, [manualAllocations, outstandingEntriesForSelectedCustomer, recordPaymentForm.amount])

  const totalAllocated = useMemo(
    () => defaultAllocations.reduce((sum, allocation) => sum + allocation.amount, 0),
    [defaultAllocations]
  )

  const openAddUtang = () => {
    const defaultProduct = products[0]
    setAddUtangForm({
      customerName: "",
      note: "",
      items: [
        {
          id: `line-${Date.now()}`,
          productId: defaultProduct?.id,
          productName: defaultProduct?.name ?? "",
          quantity: 1,
          unitPrice: defaultProduct?.price ?? 0,
          lineTotal: defaultProduct?.price ?? 0,
        },
      ],
    })
    setAddUtangOpen(true)
  }

  const handleAddUtangItemChange = (
    itemId: string,
    changes: Partial<Omit<AddUtangLineItem, "id">>
  ) => {
    setAddUtangForm((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              ...changes,
              lineTotal:
                (changes.quantity ?? item.quantity) * (changes.unitPrice ?? item.unitPrice),
            }
          : item
      ),
    }))
  }

  const handleAddUtangSubmit = async () => {
    if (!addUtangForm.customerName.trim() || addUtangTotal <= 0) return

    const customerName = addUtangForm.customerName.trim()
    const existingCustomer = customerMap.get(customerName.toLowerCase())
    const customer = existingCustomer
      ? existingCustomer
      : await createCustomer({
          name: customerName,
          balance: addUtangTotal,
          status: "Unpaid",
        })

    if (existingCustomer && existingCustomer.id) {
      await updateCustomer(existingCustomer.id, {
        balance: existingCustomer.balance + addUtangTotal,
        status: "Unpaid",
      })
    }

    const now = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })

    const createdEntry = await createUtangEntry({
      customerId: customer.id!,
      type: "Utang",
      amount: addUtangTotal,
      amountPaid: 0,
      remainingBalance: addUtangTotal,
      date: now,
      note: addUtangForm.note,
      status: "Unpaid",
    })

    await Promise.all(
      addUtangForm.items
        .filter((item) => item.productId !== undefined)
        .map(async (item) => {
          await createUtangEntryItem({
            utangEntryId: createdEntry.id!,
            productId: item.productId!,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
          })

          const product = products.find((product) => product.id === item.productId)
          if (product?.id) {
            await updateProduct(product.id, {
              stock: Math.max(0, product.stock - item.quantity),
            })
          }
        })
    )

    await loadData()
    setAddUtangOpen(false)
  }

  const handleManualAllocationChange = (entryId: number, value: number) => {
    setManualAllocations((current) => ({
      ...current,
      [entryId]: Math.max(0, value),
    }))
  }

  const handleRecordPaymentSubmit = async () => {
    const paymentAmount = Number(recordPaymentForm.amount)
    if (paymentAmount <= 0) return
    const customerName = recordPaymentForm.customerName.trim()
    const customer = customerMap.get(customerName.toLowerCase())
    if (!customer) return

    const allocatedAmount = totalAllocated
    if (allocatedAmount <= 0) return

    const now = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })

    const paymentEntry = await createUtangEntry({
      customerId: customer.id!,
      type: "Payment",
      amount: allocatedAmount,
      amountPaid: allocatedAmount,
      remainingBalance: 0,
      date: now,
      note: recordPaymentForm.note,
      status: "Paid",
    })

    for (const allocation of defaultAllocations) {
      if (allocation.amount <= 0) continue
      const targetEntry = outstandingEntriesForSelectedCustomer.find(
        (entry) => entry.id === allocation.entryId
      )
      if (!targetEntry || targetEntry.id === undefined) continue

      const updatedAmountPaid = targetEntry.amountPaid + allocation.amount
      const updatedRemainingBalance = Math.max(0, targetEntry.remainingBalance - allocation.amount)

      await updateUtangEntry(targetEntry.id, {
        amountPaid: updatedAmountPaid,
        remainingBalance: updatedRemainingBalance,
        status: updatedRemainingBalance === 0 ? "Paid" : "Partially Paid",
      })

      await createPaymentAllocation({
        paymentId: paymentEntry.id!,
        utangEntryId: targetEntry.id,
        amount: allocation.amount,
      })
    }

    await updateCustomer(customer.id!, {
      balance: Math.max(0, customer.balance - allocatedAmount),
      status: customer.balance - allocatedAmount <= 0 ? "Paid" : "Partially Paid",
    })

    await loadData()
    setRecordPaymentOpen(false)
    setManualAllocations({})
  }

  return (
    <main className="min-h-full flex-1 overflow-y-auto bg-white p-6 lg:p-8">
      <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand-input text-brand-green-dark">
              <Wallet className="size-5" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Utang / Credit Tracking
            </h1>
          </div>
          <p className="mt-2 pl-[52px] text-sm text-muted-foreground sm:text-base">
            Track customer credit balances, itemized utang, and payments.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-2 rounded-xl border-border bg-white"
            onClick={() => {
              setRecordPaymentOpen(true)
              setRecordPaymentForm((current) => ({
                ...current,
                customerName: customers[0]?.name ?? "",
              }))
            }}
          >
            <Banknote className="size-4" />
            Record Payment
          </Button>
          <Button
            type="button"
            className="h-10 gap-2 rounded-xl bg-brand-green-darker text-white hover:bg-brand-green-dark"
            onClick={openAddUtang}
          >
            <Plus className="size-4" />
            Add Utang
          </Button>
        </div>
      </header>

      {!isAdmin && (
        <p className="mb-6 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          Cashier view: you can record utang and payments during sales. Editing or
          deleting historical entries is restricted to Admin.
        </p>
      )}

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, valueClassName }) => (
          <article
            key={label}
            className="rounded-xl border border-border bg-white p-5"
          >
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={cn("mt-2 text-2xl font-semibold", valueClassName)}>{value}</p>
          </article>
        ))}
      </section>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customer name..."
            className="border-border bg-white pl-10"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        <article className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">Customer balances</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
                  <th className="px-6 py-3 font-medium text-muted-foreground">Customer</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">Balance</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">Status</th>
                  {isAdmin && (
                    <th className="px-6 py-3 font-medium text-muted-foreground">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredBalances.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 4 : 3} className="px-6 py-12 text-center text-muted-foreground">
                      No customers yet.
                    </td>
                  </tr>
                ) : (
                  filteredBalances.map((entry) => (
                    <tr key={entry.id} className="border-b border-border last:border-0">
                      <td className="px-6 py-4 font-medium text-foreground">{entry.name}</td>
                      <td className="px-6 py-4 font-semibold text-orange-600">{formatPeso(entry.balance)}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            entry.status === "Unpaid"
                              ? "low-stock"
                              : entry.status === "Partially Paid"
                              ? "default"
                              : "active"
                          }
                        >
                          {entry.status}
                        </Badge>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => setDetailsCustomerId(entry.id)}
                          >
                            View Details
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">Recent activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
                  <th className="px-6 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">Customer</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">Type</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">Note</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">Amount</th>
                  {isAdmin && (
                    <th className="px-6 py-3 font-medium text-muted-foreground">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {activityRows.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center text-muted-foreground">
                      No entries.
                    </td>
                  </tr>
                ) : (
                  activityRows.map((entry) => (
                    <tr key={entry.id} className="border-b border-border last:border-0">
                      <td className="px-6 py-4 text-muted-foreground">{entry.date}</td>
                      <td className="px-6 py-4 text-foreground">{entry.customerName}</td>
                      <td className="px-6 py-4">
                        <Badge variant={entry.type === "Payment" ? "active" : "low-stock"}>
                          {entry.type === "Utang" ? "Utang Added" : "Payment Received"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{entry.note}</td>
                      <td
                        className={cn(
                          "px-6 py-4 font-semibold",
                          entry.type === "Payment" ? "text-brand-green-darker" : "text-orange-600"
                        )}
                      >
                        {formatPeso(entry.amount)}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => setSelectedEntryId(entry.id)}
                          >
                            View Items
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <Modal
        open={addUtangOpen}
        onClose={() => setAddUtangOpen(false)}
        title="Add Utang"
        footer={
          <ModalFooter
            onCancel={() => setAddUtangOpen(false)}
            onConfirm={handleAddUtangSubmit}
            confirmLabel="Add Utang"
          />
        }
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Customer Name</label>
            <div className="relative">
              <Input
                type="text"
                list="customer-list"
                value={addUtangForm.customerName}
                onChange={(event) =>
                  setAddUtangForm((current) => ({
                    ...current,
                    customerName: event.target.value,
                  }))
                }
                placeholder="e.g. Juan Dela Cruz"
              />
              <datalist id="customer-list">
                {customerOptions.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl bg-brand-input p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-foreground">Itemized products</p>
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-xl border-border"
                onClick={() =>
                  setAddUtangForm((current) => ({
                    ...current,
                    items: [
                      ...current.items,
                      {
                        id: `line-${Date.now()}`,
                        productId: undefined,
                        productName: "",
                        quantity: 1,
                        unitPrice: 0,
                        lineTotal: 0,
                      },
                    ],
                  }))
                }
              >
                + Add another item
              </Button>
            </div>

            {addUtangForm.items.map((item) => (
              <div key={item.id} className="grid gap-3 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-foreground">Product</label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground outline-none focus-visible:border-brand-green-dark focus-visible:ring-2 focus-visible:ring-brand-green/30"
                    value={item.productId ?? ""}
                    onChange={(event) => {
                      const productId = Number(event.target.value)
                      const product = products.find((product) => product.id === productId)
                      handleAddUtangItemChange(item.id, {
                        productId: product?.id,
                        productName: product?.name ?? "",
                        unitPrice: product?.price ?? item.unitPrice,
                      })
                    }}
                  >
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) =>
                      handleAddUtangItemChange(item.id, {
                        quantity: Number(event.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Unit Price</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(event) =>
                      handleAddUtangItemChange(item.id, {
                        unitPrice: Number(event.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Line Total</label>
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground">
                    <span>{formatPeso(item.lineTotal)}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        setAddUtangForm((current) => ({
                          ...current,
                          items: current.items.filter((line) => line.id !== item.id),
                        }))
                      }
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Note</label>
            <Input
              type="text"
              value={addUtangForm.note}
              onChange={(event) =>
                setAddUtangForm((current) => ({
                  ...current,
                  note: event.target.value,
                }))
              }
              placeholder="Optional note"
            />
          </div>

          <div className="rounded-2xl bg-brand-input/70 p-4 text-sm text-muted-foreground">
            <p>
              Total Amount: <span className="font-semibold text-foreground">{formatPeso(addUtangTotal)}</span>
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        open={recordPaymentOpen}
        onClose={() => setRecordPaymentOpen(false)}
        title="Record Payment"
        footer={
          <ModalFooter
            onCancel={() => setRecordPaymentOpen(false)}
            onConfirm={handleRecordPaymentSubmit}
            confirmLabel="Record Payment"
          />
        }
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Customer name</label>
            <div className="relative">
              <Input
                type="text"
                list="customer-list-payments"
                value={recordPaymentForm.customerName}
                onChange={(event) =>
                  setRecordPaymentForm((current) => ({
                    ...current,
                    customerName: event.target.value,
                  }))
                }
                placeholder="e.g. Aling Nena"
              />
              <datalist id="customer-list-payments">
                {customerOptions.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl bg-brand-input p-4">
            {outstandingEntriesForSelectedCustomer.length === 0 ? (
              <p>No outstanding entries found for this customer.</p>
            ) : (
              outstandingEntriesForSelectedCustomer.map((entry) => {
                const allocation = defaultAllocations.find((allocation) => allocation.entryId === entry.id)
                return (
                  <div key={entry.id} className="rounded-2xl border border-border bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{entry.date}</p>
                        <p className="text-sm text-muted-foreground">{entry.note}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Remaining</p>
                        <p className="font-semibold text-orange-600">{formatPeso(entry.remainingBalance)}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">Allocate amount</label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={allocation?.amount ?? 0}
                          onChange={(event) =>
                            handleManualAllocationChange(entry.id!, Number(event.target.value))
                          }
                        />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Auto-allocation</p>
                        <p className="font-semibold text-foreground">{formatPeso(allocation?.amount ?? 0)}</p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Amount (₱)</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={recordPaymentForm.amount}
              onChange={(event) =>
                setRecordPaymentForm((current) => ({
                  ...current,
                  amount: event.target.value,
                }))
              }
              placeholder="0.00"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Allocated: {formatPeso(totalAllocated)}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Note (optional)</label>
            <Input
              type="text"
              value={recordPaymentForm.note}
              onChange={(event) =>
                setRecordPaymentForm((current) => ({
                  ...current,
                  note: event.target.value,
                }))
              }
              placeholder="e.g. partial payment"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(detailsCustomerId)}
        onClose={() => setDetailsCustomerId(null)}
        title={
          selectedCustomerDetails
            ? `${selectedCustomerDetails.name} statement`
            : "Customer details"
        }
        footer={
          <ModalFooter
            onCancel={() => setDetailsCustomerId(null)}
            onConfirm={() => setDetailsCustomerId(null)}
            confirmLabel="Close"
          />
        }
      >
        {selectedCustomerDetails ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Running account for {selectedCustomerDetails.name}.
            </p>
            {utangEntries
              .filter((entry) => entry.customerId === selectedCustomerDetails.id)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-border bg-brand-input p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{entry.type}</p>
                      <p className="text-sm text-muted-foreground">{entry.date}</p>
                    </div>
                    <p className="font-semibold text-foreground">{formatPeso(entry.amount)}</p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{entry.note}</p>
                  <div className="mt-3 rounded-2xl bg-white p-3 text-sm">
                    <p className="font-medium text-foreground">Items</p>
                    {utangItems
                      .filter((item) => item.utangEntryId === entry.id)
                      .map((item) => (
                        <div key={item.id} className="mt-2 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} × {formatPeso(item.unitPrice)}
                            </p>
                          </div>
                          <p className="font-semibold text-foreground">{formatPeso(item.lineTotal)}</p>
                        </div>
                      ))}
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Paid</p>
                      <p className="font-semibold text-foreground">{formatPeso(entry.amountPaid)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                      <p className="font-semibold text-orange-600">{formatPeso(entry.remainingBalance)}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No customer selected.</p>
        )}
      </Modal>

      <Modal
        open={Boolean(selectedEntryId)}
        onClose={() => setSelectedEntryId(null)}
        title={selectedEntry ? `${selectedEntry.type} details` : "Entry details"}
        footer={
          <ModalFooter
            onCancel={() => setSelectedEntryId(null)}
            onConfirm={() => setSelectedEntryId(null)}
            confirmLabel="Close"
          />
        }
      >
        {selectedEntry ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{selectedEntry.note}</p>
            <div className="rounded-2xl bg-brand-input p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">{selectedEntry.type} amount</p>
              <p className="text-xl font-semibold text-foreground">{formatPeso(selectedEntry.amount)}</p>
              <p className="mt-2">Paid: {formatPeso(selectedEntry.amountPaid)}</p>
              <p>Remaining: {formatPeso(selectedEntry.remainingBalance)}</p>
            </div>
            <div className="space-y-2">
              {selectedEntryItems.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-foreground">{item.productName}</p>
                    <p className="font-semibold text-foreground">{formatPeso(item.lineTotal)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} × {formatPeso(item.unitPrice)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No entry selected.</p>
        )}
      </Modal>
    </main>
  )
}
