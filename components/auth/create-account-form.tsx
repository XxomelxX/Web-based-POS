"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { AuthInput } from "@/components/auth/auth-input"
import { AuthPageLayout } from "@/components/auth/auth-page-layout"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const selectClassName = cn(
  "flex h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground outline-none focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-200"
)

export function CreateAccountForm() {
  const router = useRouter()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push("/create-account/success")
  }

  return (
    <AuthPageLayout>
      <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-foreground">Create Account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Admin/Owner registration for initial store setup. Cashier accounts are
          created by the Admin through User Management — not through this form.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="first-name">First Name</Label>
              <AuthInput id="first-name" name="firstName" required />
            </div>
            <div>
              <Label htmlFor="last-name">Last Name</Label>
              <AuthInput id="last-name" name="lastName" required />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="birthday">Birthday</Label>
              <AuthInput
                id="birthday"
                name="birthday"
                type="date"
                placeholder="Month/Day/Year"
                required
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <select id="gender" name="gender" className={selectClassName} required>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="contact">Mobile number or email</Label>
              <AuthInput
                id="contact"
                name="contact"
                type="text"
                autoComplete="email tel"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <AuthInput
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="h-11 w-full rounded-xl bg-violet-600 text-sm font-medium text-white transition-colors hover:bg-violet-700"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-brand-green-darker underline underline-offset-4 hover:text-brand-green-dark"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  )
}
