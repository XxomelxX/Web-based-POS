import type { UserRole } from "@/lib/navigation"

/**
 * Default seed data for local development and capstone demos.
 *
 * Security notes (for capstone documentation):
 * - Passwords here are plain text for frontend-only demo auth only.
 * - In production, seed the Admin via a database migration and hash passwords
 *   with bcrypt (or Argon2) before storing — never store plain-text passwords.
 * - Change the default password after first login as a first-time setup step.
 * - Do not use weak passwords like `admin123` in deployed environments.
 */

export type SeedAccount = {
  id: number
  username: string
  password: string
  name: string
  accountName: string
  email: string
  role: UserRole
  status: "Active" | "Inactive"
  joined: string
}

export type SeedCategory = {
  id: number
  name: string
  description: string
}

export type SeedProduct = {
  id: number
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

export type SeedSetting = {
  key: string
  value: string | number | boolean
}

/** Seeded Admin/Owner — available on first run, not via public Create Account */
export const SEED_ADMIN: SeedAccount = {
  id: 1,
  username: "admin",
  password: "admin123",
  name: "Samuel",
  accountName: "Samuel Bioco",
  email: "admin@jjmerchandise.com",
  role: "admin",
  status: "Active",
  joined: "Jan 12, 2025",
}

/** Cashier accounts created by Admin through User Management */
export const SEED_CASHIERS: SeedAccount[] = [
  {
    id: 2,
    username: "judy.ann",
    password: "cashier123",
    name: "Judy ann",
    accountName: "Judy ann",
    email: "judy.ann@jjstore.com",
    role: "cashier",
    status: "Active",
    joined: "Feb 8, 2025",
  },
  {
    id: 3,
    username: "maria.santos",
    password: "cashier123",
    name: "Maria Santos",
    accountName: "Maria Santos",
    email: "maria.santos@jjstore.com",
    role: "cashier",
    status: "Active",
    joined: "Mar 3, 2025",
  },
  {
    id: 4,
    username: "belinda.bioco",
    password: "cashier123",
    name: "Belinda Bioco",
    accountName: "Belinda Bioco",
    email: "belinda.bioco@jjstore.com",
    role: "cashier",
    status: "Active",
    joined: "Apr 15, 2025",
  },
]

export const SEED_ACCOUNTS: SeedAccount[] = [SEED_ADMIN, ...SEED_CASHIERS]

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    id: 1,
    name: "Beverages",
    description: "Soft drinks, juices, and bottled water",
  },
  {
    id: 2,
    name: "Bread & Bakery",
    description: "Bread, pastries, and bakery items",
  },
  {
    id: 3,
    name: "Canned Goods",
    description: "Canned fish, vegetables, and sauces",
  },
  {
    id: 4,
    name: "Personal Care",
    description: "Hygiene and personal care items",
  },
]

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    id: 1,
    name: "555 Sardines Hot Chili",
    barcode: "4800012345678",
    category: "Canned Goods",
    cost: 18,
    price: 26,
    stock: 20,
    packSize: "1 can = 155g",
    unit: "pcs",
    lowStock: false,
  },
  {
    id: 2,
    name: "Alaska Evaporated Milk 370ml",
    barcode: "4800012345679",
    category: "Beverages",
    cost: 32,
    price: 38,
    stock: 15,
    packSize: "1 can = 370ml",
    unit: "ml",
    lowStock: false,
  },
  {
    id: 3,
    name: "Coca-Cola 500ml",
    barcode: "4800012345680",
    category: "Beverages",
    cost: 18,
    price: 25,
    stock: 30,
    packSize: "1 bottle = 500ml",
    unit: "ml",
    lowStock: false,
  },
  {
    id: 4,
    name: "Oreo Original 137g",
    barcode: "4800012345682",
    category: "Bread & Bakery",
    cost: 42,
    price: 50,
    stock: 18,
    packSize: "1 pack = 137g",
    unit: "g",
    lowStock: false,
  },
  {
    id: 5,
    name: "Colgate Total Active Fresh",
    barcode: "4800012345681",
    category: "Personal Care",
    cost: 85,
    price: 99,
    stock: 8,
    packSize: "1 tube = 100g",
    unit: "g",
    lowStock: true,
  },
]

export const SEED_SETTINGS: SeedSetting[] = [
  { key: "taxRate", value: 0.12 },
  { key: "lowStockThreshold", value: 20 },
  { key: "currency", value: "₱" },
]
