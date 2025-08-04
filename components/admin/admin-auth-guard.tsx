'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminAuthGuardProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

export function AdminAuthGuard({ isAuthenticated, children }: AdminAuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're definitely not authenticated
    if (isAuthenticated === false) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router]);

  // Show loading while checking authentication
  if (isAuthenticated === undefined || isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
} 