import { redirect } from "next/navigation"

export default function CashierForgotPasswordRedirect() {
  redirect("/forgot-password")
}
