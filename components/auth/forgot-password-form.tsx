import Link from "next/link"

import { AuthInput } from "@/components/auth/auth-input"
import { AuthPageLayout } from "@/components/auth/auth-page-layout"
import { Label } from "@/components/ui/label"

type ForgotPasswordFormProps = {
  loginPath: string
}

export function ForgotPasswordForm({ loginPath }: ForgotPasswordFormProps) {
  return (
    <AuthPageLayout>
      <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-foreground">Forgot Password?</h1>
        <div className="mt-4 border-b border-border" />

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Enter your email address below and we will send you instruction to reset
          your password.
        </p>

        <form className="mt-6 space-y-5">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <AuthInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <button
            type="submit"
            className="h-11 w-full rounded-xl bg-violet-600 text-sm font-medium text-white transition-colors hover:bg-violet-700"
          >
            Reset Password
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href={loginPath}
            className="font-medium text-violet-600 underline underline-offset-4 hover:text-violet-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  )
}
