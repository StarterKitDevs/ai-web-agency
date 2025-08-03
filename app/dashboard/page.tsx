'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import DashboardContent from '@/components/dashboard-content'
import { useAuth } from '@/lib/auth-context'
import { LoginModal } from '@/components/auth/login-modal'
import { useState } from 'react'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      setShowLoginModal(true)
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => {
            setShowLoginModal(false)
            router.push('/')
          }}
          mode="login"
          onSuccess={() => {
            setShowLoginModal(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Project Dashboard</h1>
            <div className="text-sm text-muted-foreground">
              Welcome back, {user.email}
            </div>
          </div>
          <DashboardContent />
        </div>
      </main>
    </div>
  )
} 