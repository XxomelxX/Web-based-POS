"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Lock, User } from "lucide-react"

import { StoreLogo } from "@/components/layout/store-logo"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { getDashboardPath } from "@/lib/auth"
import { cn } from "@/lib/utils"

export function LoginPageContent() {
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    const user = await login(username, password)
    setLoading(false)

    if (!user) {
      setError("Invalid username or password, or account is inactive.")
      return
    }

    router.push(getDashboardPath(user.role))
  }

  return (
    <div className="flex min-h-full flex-col bg-brand-green lg:flex-row">
      <div className="flex flex-1 items-center justify-center px-8 py-12 lg:py-0">
        <StoreLogo
          className="max-w-xs"
          iconClassName="size-20 rounded-3xl"
          nameClassName="text-3xl sm:text-4xl"
        />
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-10 lg:justify-start lg:pr-16 lg:pl-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl sm:p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">Sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Access your inventory dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Username
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-green-dark" />
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  className="pl-10"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-green-dark" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-red-500" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-brand-green-darker text-base text-white hover:bg-brand-green-dark"
            >
              Sign in
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-red-500 hover:text-red-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Link
            href="/create-account"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "mt-6 h-11 w-full rounded-xl border-2 border-brand-green bg-white text-brand-green-darker hover:bg-brand-input"
            )}
          >
            Create Account
          </Link>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Create Account is for Admin/Owner store setup only. Cashier accounts are
            created by the Admin.
          </p>

          <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-center text-xs text-muted-foreground">
            Demo: Admin <span className="font-mono">admin</span> /{" "}
            <span className="font-mono">admin123</span> · Cashier{" "}
            <span className="font-mono">judy.ann</span> /{" "}
            <span className="font-mono">cashier123</span>
          </p>
        </div>
      </div>
    </div>
  )
}
