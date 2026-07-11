"use client"

import { useState } from "react"
import {
  Coffee,
  Droplets,
  Flame,
  Milk,
  Search,
  Sparkles,
  UtensilsCrossed,
  Wheat,
  type LucideIcon,
} from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { TableActions } from "@/components/dashboard/table-actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal, ModalFooter } from "@/components/ui/modal"

type Category = {
  name: string
  icon: LucideIcon
  description: string
  products: number
}

const initialCategories: Category[] = [
  {
    name: "Beverages",
    icon: Coffee,
    description: "Soft drinks, juices, and bottled water",
    products: 12,
  },
  {
    name: "Noodles",
    icon: Wheat,
    description: "Instant noodles and pasta products",
    products: 8,
  },
  {
    name: "Snacks",
    icon: UtensilsCrossed,
    description: "Chips, biscuits, and packaged snacks",
    products: 15,
  },
  {
    name: "Dairy",
    icon: Milk,
    description: "Milk, cheese, and dairy products",
    products: 6,
  },
  {
    name: "Household",
    icon: Droplets,
    description: "Cleaning supplies and detergents",
    products: 10,
  },
  {
    name: "Personal Care",
    icon: Sparkles,
    description: "Soap, shampoo, and hygiene items",
    products: 9,
  },
  {
    name: "Condiment",
    icon: Flame,
    description: "Sauces, spices, and cooking essentials",
    products: 7,
  },
]

export default function CategoriesPage() {
  const [categories] = useState(initialCategories)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const handleAddCategory = () => {
    setAddModalOpen(false)
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <PageHeader
          title="Categories"
          subtitle={`${categories.length} categories · group your products`}
          actionLabel="Add Category"
          actionClassName="bg-violet-600 hover:bg-violet-700"
          onAction={() => setAddModalOpen(true)}
        />

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search categories" className="pl-10" />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
                  <th className="px-6 py-4 font-medium text-muted-foreground">Category</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Description</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Products</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <tr key={category.name} className="hover:bg-muted/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-input text-brand-green-dark">
                            <Icon className="size-4" />
                          </div>
                          <span className="font-medium text-foreground">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{category.description}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{category.products}</td>
                      <td className="px-6 py-4">
                        <TableActions />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="New Category"
        footer={
          <ModalFooter
            onCancel={() => setAddModalOpen(false)}
            onConfirm={() =>
              (
                document.getElementById("add-category-form") as HTMLFormElement | null
              )?.requestSubmit()
            }
            confirmLabel="Add"
          />
        }
      >
        <form
          id="add-category-form"
          onSubmit={(event) => {
            event.preventDefault()
            handleAddCategory()
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="category-name">Name</Label>
            <Input id="category-name" name="name" placeholder="Enter category name" required />
          </div>
          <div>
            <Label htmlFor="category-description">Description</Label>
            <Input
              id="category-description"
              name="description"
              placeholder="Enter category description"
              required
            />
          </div>
        </form>
      </Modal>
    </>
  )
}
