import type { Metadata } from "next"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { AdminHeader } from "./admin-header"
import { AdminRoleGuard } from "./admin-role-guard"

export const metadata: Metadata = {
  title: "Admin | AI Credits Platform",
  description: "Administration dashboard for AI Credits Trading Platform",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminRoleGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar className="hidden lg:flex" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AdminRoleGuard>
  )
}
