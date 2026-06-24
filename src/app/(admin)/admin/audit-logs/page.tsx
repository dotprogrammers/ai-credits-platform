import { AuditLogTable } from "@/components/admin/audit-log-table"

export default function AdminAuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">
          View all platform activity and administrative actions
        </p>
      </div>
      <AuditLogTable />
    </div>
  )
}
