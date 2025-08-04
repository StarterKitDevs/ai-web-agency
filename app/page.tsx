'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import QuoteForm from '@/components/quote-form';
import { ProcessTimeline } from '@/components/process-timeline';
import { SocialProof } from '@/components/social-proof';
import { ChatBot } from '@/components/chat-bot';

export default function Home() {
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection onGetQuote={() => setShowQuoteForm(true)} />
        {showQuoteForm && <QuoteForm />}
        <ProcessTimeline />
        <SocialProof />
      </main>
      <ChatBot />
    </div>
  );
} 