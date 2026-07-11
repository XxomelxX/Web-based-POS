import Link from "next/link"
import { Check } from "lucide-react"

type CreateAccountSuccessContentProps = {
  loginPath: string
}

export function CreateAccountSuccessContent({
  loginPath,
}: CreateAccountSuccessContentProps) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-white px-6 py-16">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-brand-green">
          <Check className="size-10 text-white" strokeWidth={3} />
        </div>

        <h1 className="text-2xl font-semibold text-foreground">Completed</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Success! Your account has been created!
        </p>

        <Link
          href={loginPath}
          className="mt-6 text-sm font-medium text-brand-green-darker underline underline-offset-4 hover:text-brand-green-dark"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
