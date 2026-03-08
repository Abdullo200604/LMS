import { LMSDashboard } from "@/components/lms-dashboard"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <LMSDashboard />
    </ProtectedRoute>
  )
}
