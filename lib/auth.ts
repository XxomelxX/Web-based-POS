import type { User } from "@/lib/db"
import type { UserRole } from "@/lib/navigation"
import { getUserByUsername } from "@/lib/data"

export type AuthUser = {
  id: number
  username: string
  name: string
  accountName: string
  email: string
  role: UserRole
  status: "Active" | "Inactive"
}

const SESSION_KEY = "jj-store-session"

export function getDashboardPath(role: UserRole) {
  return role === "admin" ? "/dashboard" : "/cashier/dashboard"
}

export async function login(username: string, password: string): Promise<AuthUser | null> {
  const normalized = username.trim().toLowerCase()
  const account = await getUserByUsername(normalized)
  if (
    !account ||
    account.password !== password ||
    account.status !== "Active" ||
    typeof account.id !== "number"
  ) {
    return null
  }

  const { password: _, ...user } = account
  const authUser: AuthUser = {
    id: account.id,
    username: user.username,
    name: user.name,
    accountName: user.accountName,
    email: user.email,
    role: user.role,
    status: user.status,
  }

  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(authUser))
  }
  return authUser
}

export function logout() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SESSION_KEY)
  }
}

export function getSession(): AuthUser | null {
  if (typeof window === "undefined") return null

  const raw = sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function getUserInitial(name: string) {
  return name.charAt(0).toUpperCase()
}

export function getRoleLabel(role: UserRole) {
  return role === "admin" ? "ADMIN" : "CASHIER"
}

export function getRoleDisplay(role: UserRole) {
  return role === "admin" ? "Admin" : "Cashier"
}
