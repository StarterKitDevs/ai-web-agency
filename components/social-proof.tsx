'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, TechStart',
    content: 'Got our website live in 15 minutes! The AI understood exactly what we needed and delivered a professional site that looks amazing.',
    rating: 5,
    avatar: 'SJ'
  },
  {
    name: 'Mike Chen',
    role: 'Founder, LocalBakery',
    content: 'Incredible service! Our bakery website was up and running before our coffee break. The design is perfect for our brand.',
    rating: 5,
    avatar: 'MC'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Marketing Director, GreenTech',
    content: 'Professional quality at startup speed. The AI built us a website that rivals agencies charging $10k+. Highly recommended!',
    rating: 5,
    avatar: 'ER'
  }
];

const stats = [
  { number: '200+', label: 'Websites Delivered' },
  { number: '13min', label: 'Average Delivery Time' },
  { number: '99.9%', label: 'Uptime SLA' },
  { number: '4.9/5', label: 'Customer Rating' }
];

export function SocialProof() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Stats */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Trusted by 200+ Businesses
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Proven Results, Happy Customers
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-2">
                  <Quote className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {testimonial.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Get Your Website?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join hundreds of satisfied customers who got their professional website in minutes, not weeks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="secondary" className="text-blue-900 bg-white">
                ⚡ 13-minute average delivery
              </Badge>
              <Badge variant="secondary" className="text-blue-900 bg-white">
                💰 90% cost savings vs agencies
              </Badge>
              <Badge variant="secondary" className="text-blue-900 bg-white">
                🎨 Professional design included
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 