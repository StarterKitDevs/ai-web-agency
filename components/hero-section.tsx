'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, Users, CheckCircle } from 'lucide-react';

interface HeroSectionProps {
  onGetQuote: () => void;
}

export function HeroSection({ onGetQuote }: HeroSectionProps) {
  return (
    <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              ⚡ AI-Powered Web Development
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            AI-Powered Websites Built in
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {' '}Minutes, Not Weeks
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Professional websites with payment → automated creation → live deployment. 
            Get your business online with enterprise-grade features in under an hour.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={onGetQuote}
              className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
            >
              Get Your Website Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-6 text-lg font-semibold"
            >
              View Examples
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 p-4 bg-card rounded-lg border">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">200+</div>
                <div className="text-sm text-muted-foreground">Sites Delivered</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 p-4 bg-card rounded-lg border">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">13 Min</div>
                <div className="text-sm text-muted-foreground">Average Delivery</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 p-4 bg-card rounded-lg border">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime SLA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 