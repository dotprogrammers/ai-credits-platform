"use client"

import { useState } from "react"
import { UserTable, type User } from "@/components/admin/user-table"
import { UserDetailPanel } from "@/components/admin/user-detail-panel"

export default function AdminUsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage platform users, roles, and permissions
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UserTable onUserSelect={setSelectedUser} />
        </div>
        <div className="space-y-4">
          {selectedUser ? (
            <UserDetailPanel
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">
                Select a user to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
