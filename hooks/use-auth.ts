"use client"

import { useCallback, useEffect, useState } from "react"

import {
  getSession,
  login as authLogin,
  logout as authLogout,
  type AuthUser,
} from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(getSession())
    setLoading(false)
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const sessionUser = await authLogin(username, password)
    setUser(sessionUser)
    return sessionUser
  }, [])

  const logout = useCallback(() => {
    authLogout()
    setUser(null)
  }, [])

  return { user, loading, login, logout }
}
