"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Modal, ModalFooter } from "@/components/ui/modal"
import { cn } from "@/lib/utils"

export type UserFormData = {
  fullName: string
  username: string
  email: string
  password: string
  role: string
  status: string
}

type UserFormModalProps = {
  open: boolean
  onClose: () => void
  title: string
  confirmLabel: string
  mode: "create-cashier" | "edit"
  initialData?: UserFormData
  onSubmit: (data: UserFormData) => void
  isAdminAccount?: boolean
}

const defaultData: UserFormData = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  role: "Cashier",
  status: "Active",
}

const selectClassName = cn(
  "flex h-10 w-full rounded-lg border border-transparent bg-brand-input px-3 text-sm text-foreground outline-none focus-visible:border-brand-green-dark focus-visible:ring-2 focus-visible:ring-brand-green/30 disabled:cursor-not-allowed disabled:opacity-60"
)

export function UserFormModal({
  open,
  onClose,
  title,
  confirmLabel,
  mode,
  initialData,
  onSubmit,
  isAdminAccount = false,
}: UserFormModalProps) {
  const data = initialData ?? defaultData
  const roleLocked = mode === "create-cashier" || isAdminAccount

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onSubmit({
      fullName: formData.get("fullName") as string,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: roleLocked && mode === "create-cashier" ? "Cashier" : (formData.get("role") as string),
      status: formData.get("status") as string,
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <ModalFooter
          onCancel={onClose}
          onConfirm={() =>
            (
              document.getElementById("user-form") as HTMLFormElement | null
            )?.requestSubmit()
          }
          confirmLabel={confirmLabel}
        />
      }
    >
      {mode === "create-cashier" && (
        <p className="mb-4 text-sm text-muted-foreground">
          Create a Cashier account. Only the Admin can add staff accounts — cashiers
          cannot self-register.
        </p>
      )}

      <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            defaultValue={data.fullName}
            placeholder="Enter full name"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              defaultValue={data.username}
              placeholder="Enter username"
              required
              disabled={isAdminAccount}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={data.email}
              placeholder="Enter email"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password">
            {mode === "edit" ? "Password (leave blank to keep current)" : "Password"}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            defaultValue={data.password}
            placeholder="Enter password"
            required={mode === "create-cashier"}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              name="role"
              defaultValue={mode === "create-cashier" ? "Cashier" : data.role}
              className={selectClassName}
              disabled={roleLocked}
            >
              <option value="Cashier">Cashier</option>
              {!roleLocked && <option value="Admin">Admin</option>}
            </select>
            {roleLocked && (
              <p className="mt-1 text-xs text-muted-foreground">
                {mode === "create-cashier"
                  ? "New accounts are created as Cashier."
                  : "Admin role cannot be changed."}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              defaultValue={data.status}
              className={selectClassName}
              disabled={isAdminAccount}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  )
}
