import Header from '@/components/header'
import Hero from '@/components/hero'
import QuoteForm from '@/components/quote-form'
import Footer from '@/components/footer'
import CopilotChat from '@/components/CopilotChat'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <QuoteForm />
      </main>
      <Footer />
      <CopilotChat />
    </div>
  )
} 