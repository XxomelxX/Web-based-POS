import Dexie, { type Table } from "dexie"
import { SEED_ACCOUNTS, SEED_CATEGORIES, SEED_PRODUCTS, SEED_SETTINGS } from "@/lib/seed-data"

type UserRole = "admin" | "cashier"

export interface User {
  id?: number
  username: string
  password: string
  name: string
  accountName: string
  email: string
  role: UserRole
  status: "Active" | "Inactive"
  joined: string
}

export interface Category {
  id?: number
  name: string
  description: string
}

export interface Product {
  id?: number
  name: string
  barcode: string
  category: string
  cost: number
  price: number
  stock: number
  packSize: string
  unit: string
  lowStock: boolean
}

export interface Transaction {
  id?: number
  date: string
  timestamp: number
  cashier: string
  paymentMethod: string
  reference?: string
  subtotal: number
  vat: number
  total: number
  tendered: number
  change: number
  status: "Complete" | "Pending"
}

export interface TransactionItem {
  id?: number
  transactionId: number
  productId: number
  productName: string
  price: number
  quantity: number
  lineTotal: number
}

export interface StockBatch {
  id?: number
  productId: number
  quantity: number
  cost: number
  date: string
}

export interface Customer {
  id?: number
  name: string
  balance: number
  status: "Unpaid" | "Partially Paid" | "Paid"
}

export interface UtangEntry {
  id?: number
  customerId: number
  type: "Utang" | "Payment"
  amount: number
  amountPaid: number
  remainingBalance: number
  date: string
  note: string
  status: "Unpaid" | "Partially Paid" | "Paid"
}

export interface UtangEntryItem {
  id?: number
  utangEntryId: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface PaymentAllocation {
  id?: number
  paymentId: number
  utangEntryId: number
  amount: number
}

export interface ExpenseEntry {
  id?: number
  type: string
  amount: number
  period: string
  date: string
  notes?: string
}

export interface SettingEntry {
  key: string
  value: string | number | boolean
}

class JJStoreDB extends Dexie {
  users!: Table<User, number>
  categories!: Table<Category, number>
  products!: Table<Product, number>
  transactions!: Table<Transaction, number>
  transactionItems!: Table<TransactionItem, number>
  stockBatches!: Table<StockBatch, number>
  customers!: Table<Customer, number>
  utangEntries!: Table<UtangEntry, number>
  utangEntryItems!: Table<UtangEntryItem, number>
  paymentAllocations!: Table<PaymentAllocation, number>
  expenses!: Table<ExpenseEntry, number>
  settings!: Table<SettingEntry, string>

  constructor() {
    super("jj-store-db")

    this.version(2).stores({
      users: "++id,username,role,status",
      categories: "++id,name",
      products: "++id,name,category,stock,lowStock",
      transactions: "++id,date,cashier,total",
      transactionItems: "++id,transactionId,productId",
      stockBatches: "++id,productId,date",
      customers: "++id,name,balance,status",
      utangEntries: "++id,customerId,type,date,status,remainingBalance",
      utangEntryItems: "++id,utangEntryId,productId",
      paymentAllocations: "++id,paymentId,utangEntryId",
      expenses: "++id,type,period,date",
      settings: "key",
    })

    this.on("populate", async () => {
      await this.users.bulkAdd(SEED_ACCOUNTS)
      await this.categories.bulkAdd(SEED_CATEGORIES)
      await this.products.bulkAdd(SEED_PRODUCTS)
      await this.settings.bulkAdd(SEED_SETTINGS)
    })
  }
}

export const db = new JJStoreDB()
