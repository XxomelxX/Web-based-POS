import {
  AlertTriangle,
  ArrowLeftRight,
  BarChart3,
  Box,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Shapes,
  ShoppingBag,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"

export type UserRole = "admin" | "cashier"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "POS", href: "/dashboard/pos", icon: ShoppingCart },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Categories", href: "/dashboard/categories", icon: Shapes },
  { label: "Low Stock", href: "/dashboard/low-stock", icon: AlertTriangle },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Utang / Credit", href: "/dashboard/utang", icon: Wallet },
  { label: "Transaction Log", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { label: "Item Log", href: "/dashboard/item-log", icon: Box },
  { label: "Expenses", href: "/dashboard/expenses", icon: Wallet },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { label: "Users", href: "/dashboard/users", icon: Users },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

const cashierNavItems: NavItem[] = [
  { label: "Dashboard", href: "/cashier/dashboard", icon: LayoutDashboard },
  { label: "POS", href: "/cashier/pos", icon: ShoppingCart },
  { label: "Low Stock", href: "/cashier/low-stock", icon: AlertTriangle },
  { label: "Orders", href: "/cashier/orders", icon: ShoppingBag },
  { label: "Utang / Credit", href: "/cashier/utang", icon: Wallet },
  { label: "Settings", href: "/cashier/settings", icon: Settings },
]

export const roleConfig = {
  admin: {
    basePath: "/dashboard",
    loginPath: "/login",
    navItems: adminNavItems,
    userName: "Samuel",
    userInitial: "S",
    userRole: "Admin",
    accountName: "Samuel Bioco",
    accountRole: "ADMIN",
  },
  cashier: {
    basePath: "/cashier/dashboard",
    loginPath: "/login",
    navItems: cashierNavItems,
    userName: "Judy ann",
    userInitial: "J",
    userRole: "Cashier",
    accountName: "Judy ann",
    accountRole: "CASHIER",
  },
} as const

export function getNavItems(role: UserRole) {
  return roleConfig[role].navItems
}

export function getRoleConfig(role: UserRole) {
  return roleConfig[role]
}
