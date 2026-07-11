"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { TableActions } from "@/components/dashboard/table-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal, ModalFooter } from "@/components/ui/modal"
import { cn } from "@/lib/utils"

type Product = {
  name: string
  barcode: string
  category: string
  cost: string
  price: string
  stock: number
  packSize: string
  unit: string
  lowStock: boolean
}

const initialProducts: Product[] = [
  {
    name: "555 Sardines in Tomato Sauce",
    barcode: "4800012345678",
    category: "Condiment",
    cost: "₱18.00",
    price: "₱22.00",
    stock: 24,
    packSize: "1 can = 155g",
    unit: "pcs",
    lowStock: false,
  },
  {
    name: "Alaska Evaporated Milk 370ml",
    barcode: "4800012345679",
    category: "Dairy",
    cost: "₱32.00",
    price: "₱38.00",
    stock: 15,
    packSize: "1 can = 370ml",
    unit: "ml",
    lowStock: false,
  },
  {
    name: "Coca-Cola 1.5L",
    barcode: "4800012345680",
    category: "Beverages",
    cost: "₱55.00",
    price: "₱65.00",
    stock: 20,
    packSize: "1 bottle = 1.5L",
    unit: "L",
    lowStock: false,
  },
  {
    name: "Colgate Total Active Fresh",
    barcode: "4800012345681",
    category: "Personal Care",
    cost: "₱85.00",
    price: "₱99.00",
    stock: 8,
    packSize: "1 tube = 100g",
    unit: "g",
    lowStock: true,
  },
  {
    name: "Oreo Original 137g",
    barcode: "4800012345682",
    category: "Snacks",
    cost: "₱42.00",
    price: "₱50.00",
    stock: 18,
    packSize: "1 pack = 137g",
    unit: "g",
    lowStock: false,
  },
  {
    name: "Nova Country Cheddar 150g",
    barcode: "4800012345683",
    category: "Snacks",
    cost: "₱28.00",
    price: "₱35.00",
    stock: 6,
    packSize: "1 pack = 150g",
    unit: "g",
    lowStock: true,
  },
  {
    name: "Sprite Lemon Lime 1.5L",
    barcode: "4800012345684",
    category: "Beverages",
    cost: "₱52.00",
    price: "₱62.00",
    stock: 14,
    packSize: "1 bottle = 1.5L",
    unit: "L",
    lowStock: false,
  },
]

const categoryOptions = [
  "Beverages",
  "Snacks",
  "Dairy",
  "Personal Care",
  "Condiment",
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [modalOpen, setModalOpen] = useState(false)
  const [formValues, setFormValues] = useState({
    name: "",
    category: categoryOptions[0],
    price: "",
    stock: "",
  })

  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }))
  }

  const handleAddProduct = () => {
    const stockValue = Number(formValues.stock)
    if (!formValues.name.trim() || !formValues.price.trim() || Number.isNaN(stockValue)) {
      return
    }

    const newProduct: Product = {
      name: formValues.name.trim(),
      barcode: "",
      category: formValues.category,
      cost: "",
      price: formValues.price.startsWith("₱") ? formValues.price : `₱${formValues.price}`,
      stock: stockValue,
      packSize: "",
      unit: "",
      lowStock: stockValue < 20,
    }

    setProducts((current) => [newProduct, ...current])
    setModalOpen(false)
    setFormValues({
      name: "",
      category: categoryOptions[0],
      price: "",
      stock: "",
    })
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <PageHeader
        title="Products"
        subtitle={`${products.length} products in inventory`}
        actionLabel="+ Add Product"
        actionClassName="bg-brand-green-darker hover:bg-brand-green-dark"
        onAction={() => setModalOpen(true)}
      />

      <div className="mb-6 rounded-2xl bg-white p-4 shadow-md">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or barcode"
              className="pl-10"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              className={cn(
                "flex h-10 min-w-[160px] rounded-lg border border-transparent bg-brand-input px-3 text-sm text-foreground outline-none focus-visible:border-brand-green-dark focus-visible:ring-2 focus-visible:ring-brand-green/30"
              )}
              defaultValue="All Categories"
            >
              <option value="All Categories">All Categories</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Button
              type="button"
              className="h-10 rounded-lg bg-brand-green-darker text-white hover:bg-brand-green-dark"
            >
              Filter
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-6 py-4 font-medium text-muted-foreground">Product Name</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Category</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Price</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Stock</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={`${product.name}-${product.category}`} className="hover:bg-muted/20">
                  <td className="px-6 py-4 font-medium text-foreground">{product.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{product.price}</td>
                  <td className="px-6 py-4">
                    {product.lowStock ? (
                      <Badge variant="low-stock">Low {product.stock}</Badge>
                    ) : (
                      <span className="text-foreground">{product.stock}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <TableActions onEdit={() => {}} />
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
        title="Add Product"
        footer={
          <ModalFooter
            onCancel={() => setModalOpen(false)}
            onConfirm={handleAddProduct}
            confirmLabel="Add Product"
          />
        }
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Product Name</label>
            <Input
              type="text"
              value={formValues.name}
              onChange={(event) => handleInputChange("name", event.target.value)}
              placeholder="Coca-Cola 500ml"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Category</label>
            <select
              className={cn(
                "flex h-10 w-full rounded-lg border border-transparent bg-brand-input px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-brand-green-dark focus-visible:ring-2 focus-visible:ring-brand-green/30",
                "appearance-none"
              )}
              value={formValues.category}
              onChange={(event) => handleInputChange("category", event.target.value)}
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Price</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₱</span>
              <Input
                type="text"
                value={formValues.price.replace(/^₱/, "")}
                onChange={(event) => handleInputChange("price", event.target.value)}
                className="pl-8"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Stock</label>
            <Input
              type="number"
              min="0"
              value={formValues.stock}
              onChange={(event) => handleInputChange("stock", event.target.value)}
              placeholder="Enter stock quantity"
            />
          </div>
        </div>
      </Modal>
    </main>
  )
}
