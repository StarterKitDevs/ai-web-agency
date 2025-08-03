import Header from '@/components/header'
import DashboardContent from '@/components/dashboard-content'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Project Dashboard</h1>
          <DashboardContent />
        </div>
      </main>
    </div>
  )
} 