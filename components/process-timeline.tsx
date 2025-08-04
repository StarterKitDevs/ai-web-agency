'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Zap, Globe } from 'lucide-react';

const steps = [
  {
    icon: CheckCircle,
    title: '1. Project Brief',
    description: 'Tell us about your business, goals, and requirements',
    duration: '2-3 minutes',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20'
  },
  {
    icon: Clock,
    title: '2. AI Analysis',
    description: 'Our AI analyzes your needs and creates a custom plan',
    duration: '1-2 minutes',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20'
  },
  {
    icon: Zap,
    title: '3. Development',
    description: 'AI builds your website with modern technologies',
    duration: '8-10 minutes',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20'
  },
  {
    icon: Globe,
    title: '4. Live Deployment',
    description: 'Your website goes live with hosting and SSL',
    duration: '1-2 minutes',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/20'
  }
];

export function ProcessTimeline() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            From Idea to Live Website in Minutes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered process ensures your website is built quickly, professionally, and ready for business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${step.bgColor}`}>
                    <step.icon className={`h-6 w-6 ${step.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {step.duration}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
              
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border transform -translate-y-1/2" />
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-card border rounded-lg px-6 py-3">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span className="font-medium text-foreground">
              Total Time: 13 minutes average
            </span>
          </div>
        </div>
      </div>
    </section>
  );
} 