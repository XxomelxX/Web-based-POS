"use client"

import { useMemo, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { TableActions } from "@/components/dashboard/table-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal, ModalFooter } from "@/components/ui/modal"
import { cn } from "@/lib/utils"

type ExpenseEntry = {
  id: string
  type: string
  amount: string
  period: string
  notes?: string
  date: string
}

const initialExpenses: ExpenseEntry[] = [
  {
    id: "E001",
    type: "Electricity Bill",
    amount: "₱4,250.00",
    date: "Jul 01, 2026",
    period: "July 2026",
    notes: "Freezer and lighting",
  },
  {
    id: "E002",
    type: "Water Bill",
    amount: "₱980.00",
    date: "Jul 03, 2026",
    period: "July 2026",
    notes: "Store wash area",
  },
  {
    id: "E003",
    type: "Store Rent",
    amount: "₱3,000.00",
    date: "Jul 07, 2026",
    period: "July 2026",
    notes: "June store rental",
  },
]

const periodOptions = ["June 2026", "July 2026", "August 2026"]
const typeOptions = ["Electricity", "Water", "Rent", "Maintenance", "Other"]

function parsePeso(value: string) {
  return Number(value.replace(/[^0-9.-]+/g, ""))
}

function formatPeso(value: number) {
  return `₱${value.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(initialExpenses)
  const [modalOpen, setModalOpen] = useState(false)
  const [formValues, setFormValues] = useState({
    type: "Electricity",
    amount: "",
    period: "July 2026",
    notes: "",
  })

  const totalThisMonth = useMemo(() => {
    const total = expenses
      .filter((expense) => expense.period === "July 2026")
      .reduce((sum, expense) => sum + parsePeso(expense.amount), 0)
    return formatPeso(total)
  }, [expenses])

  const totalThisYear = useMemo(() => {
    const total = expenses.reduce((sum, expense) => sum + parsePeso(expense.amount), 0)
    return formatPeso(total)
  }, [expenses])

  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }))
  }

  const handleAddExpense = () => {
    if (!formValues.amount.trim()) {
      return
    }

    const newExpense: ExpenseEntry = {
      id: `E${String(expenses.length + 1).padStart(3, "0")}`,
      type: `${formValues.type} ${formValues.type !== "Other" ? "Bill" : ""}`.trim(),
      amount: formValues.amount.startsWith("₱") ? formValues.amount : `₱${formValues.amount}`,
      period: formValues.period,
      notes: formValues.notes || "",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    }

    setExpenses((current) => [newExpense, ...current])
    setModalOpen(false)
    setFormValues({ type: "Electricity", amount: "", period: "July 2026", notes: "" })
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <PageHeader
        title="Expenses"
        subtitle="Track your store's overhead and recurring costs"
        actionLabel="+ Add Expense"
        actionClassName="bg-brand-green-darker hover:bg-brand-green-dark"
        onAction={() => setModalOpen(true)}
      />

      <section className="rounded-2xl bg-white p-6 shadow-md">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-brand-input/70 p-4">
            <p className="text-sm text-muted-foreground">Total Expenses This Month</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{totalThisMonth}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-brand-input/70 p-4">
            <p className="text-sm text-muted-foreground">Total Expenses This Year</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{totalThisYear}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-brand-input/70 p-4">
            <p className="text-sm text-muted-foreground">Recorded Entries</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{expenses.length}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Expense Type</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Period</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Notes</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Date Added</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-muted/20">
                  <td className="px-4 py-4 font-medium text-foreground">{expense.type}</td>
                  <td className="px-4 py-4 text-foreground">{expense.amount}</td>
                  <td className="px-4 py-4 text-muted-foreground">{expense.period}</td>
                  <td className="px-4 py-4 text-muted-foreground">{expense.notes || "—"}</td>
                  <td className="px-4 py-4 text-muted-foreground">{expense.date}</td>
                  <td className="px-4 py-4">
                    <TableActions onEdit={() => {}} onDelete={() => {}} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Expense"
        footer={
          <ModalFooter
            onCancel={() => setModalOpen(false)}
            onConfirm={handleAddExpense}
            confirmLabel="Add Expense"
          />
        }
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Expense Type</label>
            <select
              className={cn(
                "flex h-10 w-full rounded-lg border border-transparent bg-brand-input px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-brand-green-dark focus-visible:ring-2 focus-visible:ring-brand-green/30",
                "appearance-none"
              )}
              value={formValues.type}
              onChange={(event) => handleInputChange("type", event.target.value)}
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Amount</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₱</span>
              <Input
                type="text"
                value={formValues.amount.replace(/^₱/, "")}
                onChange={(event) => handleInputChange("amount", event.target.value)}
                className="pl-8"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Period</label>
            <select
              className={cn(
                "flex h-10 w-full rounded-lg border border-transparent bg-brand-input px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-brand-green-dark focus-visible:ring-2 focus-visible:ring-brand-green/30",
                "appearance-none"
              )}
              value={formValues.period}
              onChange={(event) => handleInputChange("period", event.target.value)}
            >
              {periodOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Notes</label>
            <textarea
              value={formValues.notes}
              onChange={(event) => handleInputChange("notes", event.target.value)}
              className="min-h-[120px] w-full rounded-lg border border-transparent bg-brand-input px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-brand-green-dark focus-visible:ring-2 focus-visible:ring-brand-green/30"
              placeholder="Refrigerator + lighting for the month"
            />
          </div>
        </div>
      </Modal>
    </main>
  )
}
