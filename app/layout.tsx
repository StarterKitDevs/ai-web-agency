import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WebAI Studio - AI-Powered Websites Built in Minutes',
  description: 'Professional websites with payment → automated creation → live deployment. Get your business online with enterprise-grade features in under an hour.',
  keywords: 'AI website builder, automated web development, professional websites, fast website creation',
  authors: [{ name: 'WebAI Studio' }],
  openGraph: {
    title: 'WebAI Studio - AI-Powered Websites Built in Minutes',
    description: 'Professional websites with payment → automated creation → live deployment.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebAI Studio - AI-Powered Websites Built in Minutes',
    description: 'Professional websites with payment → automated creation → live deployment.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 