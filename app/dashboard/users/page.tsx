"use client"

import { useEffect, useState } from "react"

import { PageHeader } from "@/components/dashboard/page-header"
import { TableActions } from "@/components/dashboard/table-actions"
import {
  UserFormModal,
  type UserFormData,
} from "@/components/dashboard/user-form-modal"
import { Badge } from "@/components/ui/badge"
import { getUsers, createUser, updateUser } from "@/lib/data"
import type { User as StoredUser } from "@/lib/db"

type User = {
  id: number
  name: string
  initial: string
  username: string
  email: string
  role: "Admin" | "Cashier"
  status: string
  joined: string
}

function toStoredUser(user: StoredUser & { id: number }): User {
  return {
    id: user.id,
    name: user.name,
    initial: user.name.charAt(0).toUpperCase(),
    username: user.username,
    email: user.email,
    role: user.role === "admin" ? "Admin" : "Cashier",
    status: user.status,
    joined: user.joined,
  }
}

const initialUsers: User[] = [
  {
    id: 1,
    name: "Samuel Bioco",
    initial: "S",
    username: "admin",
    email: "admin@jjmerchandise.com",
    role: "Admin",
    status: "Active",
    joined: "Jan 12, 2025",
  },
  {
    id: 2,
    name: "Judy ann",
    initial: "J",
    username: "judy.ann",
    email: "judy.ann@jjstore.com",
    role: "Cashier",
    status: "Active",
    joined: "Feb 8, 2025",
  },
  {
    id: 3,
    name: "Maria Santos",
    initial: "M",
    username: "maria.santos",
    email: "maria.santos@jjstore.com",
    role: "Cashier",
    status: "Active",
    joined: "Mar 3, 2025",
  },
  {
    id: 4,
    name: "Belinda Bioco",
    initial: "B",
    username: "belinda.bioco",
    email: "belinda.bioco@jjstore.com",
    role: "Cashier",
    status: "Active",
    joined: "Apr 15, 2025",
  },
]

function toFormData(user: User): UserFormData {
  return {
    fullName: user.name,
    username: user.username,
    email: user.email,
    password: "",
    role: user.role,
    status: user.status,
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setEditModalOpen(true)
  }

  const closeEditModal = () => {
    setEditModalOpen(false)
    setEditingUser(null)
  }

  useEffect(() => {
    void (async () => {
      const storedUsers = await getUsers()
      const usersWithId = storedUsers.filter(
        (user): user is StoredUser & { id: number } => typeof user.id === "number"
      )

      setUsers(usersWithId.map(toStoredUser))
    })()
  }, [])

  const handleCreateUser = async (data: UserFormData) => {
    const newUser = await createUser({
      username: data.username,
      password: data.password || "cashier123",
      name: data.fullName,
      accountName: data.fullName,
      email: data.email,
      role: "cashier",
      status: data.status as "Active" | "Inactive",
      joined: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    })

    if (typeof newUser.id !== "number") return

    setUsers((current) => [
      ...current,
      {
        ...newUser,
        initial: newUser.name.charAt(0).toUpperCase(),
        role: "Cashier",
      },
    ])
    setAddModalOpen(false)
  }

  const handleEditUser = async (data: UserFormData) => {
    if (!editingUser || typeof editingUser.id !== "number") return

    await updateUser(editingUser.id, {
      username: data.username,
      name: data.fullName,
      accountName: data.fullName,
      email: data.email,
      status: data.status as "Active" | "Inactive",
    })

    setUsers((current) =>
      current.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              name: data.fullName,
              initial: data.fullName.charAt(0).toUpperCase(),
              username: data.username,
              email: data.email,
              role: user.role,
              status: data.status as "Active" | "Inactive",
            }
          : user
      )
    )
    closeEditModal()
  }

  const handleDeactivate = async (user: User) => {
    if (user.role === "Admin" || typeof user.id !== "number") return
    await updateUser(user.id, { status: "Inactive" })
    setUsers((current) =>
      current.map((entry) =>
        entry.id === user.id ? { ...entry, status: "Inactive" } : entry
      )
    )
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <PageHeader
          title="User Management"
          subtitle={`${users.length} users registered · Admin creates Cashier accounts`}
          actionLabel="Add User"
          actionClassName="bg-brand-green-darker hover:bg-brand-green-dark"
          onAction={() => setAddModalOpen(true)}
        />

        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
                  <th className="px-6 py-4 font-medium text-muted-foreground">User</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Email</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Role</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Joined</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-green text-sm font-semibold text-white">
                          {user.initial}
                        </div>
                        <span className="font-medium text-foreground">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant={user.role === "Admin" ? "admin" : "cashier"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.status === "Active" ? "active" : "default"}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{user.joined}</td>
                    <td className="px-6 py-4">
                      <TableActions
                        onEdit={() => openEditModal(user)}
                        onDelete={
                          user.role === "Cashier"
                            ? () => handleDeactivate(user)
                            : undefined
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <UserFormModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add new user"
        confirmLabel="Create user"
        mode="create-cashier"
        onSubmit={handleCreateUser}
      />

      {editingUser && (
        <UserFormModal
          key={editingUser.id}
          open={editModalOpen}
          onClose={closeEditModal}
          title="Edit user"
          confirmLabel="Save Changes"
          mode="edit"
          initialData={toFormData(editingUser)}
          onSubmit={handleEditUser}
          isAdminAccount={editingUser.role === "Admin"}
        />
      )}
    </>
  )
}
