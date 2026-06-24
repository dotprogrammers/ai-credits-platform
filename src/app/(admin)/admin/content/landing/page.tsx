import { LandingEditor } from "@/components/admin/landing-editor"

export default function AdminLandingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Landing Page</h1>
        <p className="text-sm text-muted-foreground">
          Edit the public-facing landing page sections
        </p>
      </div>
      <LandingEditor />
    </div>
  )
}
