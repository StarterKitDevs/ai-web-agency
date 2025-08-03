"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CreditCard, CheckCircle } from 'lucide-react'
import { showError, showSuccess } from '@/lib/toast'
import { cn } from '@/lib/utils'
import React from 'react'

const formSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  email: z.string().email('Valid email is required'),
  websiteType: z.enum(['landing', 'business', 'ecommerce', 'blog', 'portfolio', 'custom']),
  features: z.array(z.string()).min(1, 'Select at least one feature'),
  designStyle: z.enum(['modern', 'minimal', 'bold', 'corporate', 'creative', 'vintage']),
  budget: z.number().min(150).max(500)
})

type FormData = z.infer<typeof formSchema>

const websiteTypes = [
  { value: 'landing', label: 'Landing Page' },
  { value: 'business', label: 'Business Website' },
  { value: 'ecommerce', label: 'E-commerce Store' },
  { value: 'blog', label: 'Blog/Content Site' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'custom', label: 'Custom Solution' }
]

const features = [
  { id: 'responsive', label: 'Responsive Design' },
  { id: 'seo', label: 'SEO Optimization' },
  { id: 'analytics', label: 'Analytics Setup' },
  { id: 'contact', label: 'Contact Forms' },
  { id: 'blog', label: 'Blog System' },
  { id: 'ecommerce', label: 'E-commerce Features' },
  { id: 'cms', label: 'Content Management' },
  { id: 'social', label: 'Social Media Integration' }
]

const designStyles = [
  { value: 'modern', label: 'Modern & Clean' },
  { value: 'minimal', label: 'Minimalist' },
  { value: 'bold', label: 'Bold & Dynamic' },
  { value: 'corporate', label: 'Corporate & Professional' },
  { value: 'creative', label: 'Creative & Artistic' },
  { value: 'vintage', label: 'Vintage & Retro' }
]

export default function QuoteForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [estimatedPrice, setEstimatedPrice] = useState(0)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: 300,
      features: []
    }
  })

  const watchedFeatures = watch('features')
  const watchedBudget = watch('budget')

  // Calculate estimated price based on selections
  const calculatePrice = (features: string[], budget: number) => {
    let basePrice = 150
    let featureMultiplier = 1

    // Add cost for each feature
    features.forEach(feature => {
      switch (feature) {
        case 'responsive':
          basePrice += 25
          break
        case 'seo':
          basePrice += 30
          break
        case 'analytics':
          basePrice += 20
          break
        case 'contact':
          basePrice += 15
          break
        case 'blog':
          basePrice += 40
          break
        case 'ecommerce':
          basePrice += 80
          break
        case 'cms':
          basePrice += 50
          break
        case 'social':
          basePrice += 25
          break
      }
    })

    // Apply budget-based multiplier
    if (budget >= 400) featureMultiplier = 1.2
    else if (budget >= 300) featureMultiplier = 1.1
    else featureMultiplier = 1.0

    return Math.round(basePrice * featureMultiplier)
  }

  // Update price when selections change
  const updatePrice = () => {
    const price = calculatePrice(watchedFeatures, watchedBudget)
    setEstimatedPrice(price)
  }

  // Watch for changes and update price
  React.useEffect(() => {
    updatePrice()
  }, [watchedFeatures, watchedBudget])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    
    try {
      // Create project
      const projectResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_name: data.businessName,
          email: data.email,
          website_type: data.websiteType,
          features: data.features,
          design_style: data.designStyle,
          budget: data.budget,
          estimated_price: estimatedPrice
        })
      })

      if (!projectResponse.ok) {
        throw new Error('Failed to create project')
      }

      const project = await projectResponse.json()

      // Create payment intent
      const paymentResponse = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: project.id,
          amount: estimatedPrice * 100 // Convert to cents
        })
      })

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment intent')
      }

      const paymentData = await paymentResponse.json()

      // Simulate Stripe payment (in real app, this would use Stripe Elements)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate successful payment
      setPaymentSuccess(true)
      showSuccess('Payment Successful!', 'Your project has been created and is being processed.')
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)

    } catch (error) {
      console.error('Form submission error:', error)
      showError('Submission Failed', error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeatureToggle = (featureId: string) => {
    const currentFeatures = watchedFeatures || []
    const newFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter(f => f !== featureId)
      : [...currentFeatures, featureId]
    
    setValue('features', newFeatures)
  }

  if (paymentSuccess) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Your project has been created and is being processed. You'll be redirected to your dashboard shortly.
            </p>
            <div className="animate-pulse">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get Your Custom Quote</h2>
            <p className="text-lg text-muted-foreground">
              Tell us about your project and get an instant price estimate
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Business Name */}
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      {...register('businessName')}
                      placeholder="Enter your business name"
                    />
                    {errors.businessName && (
                      <p className="text-sm text-red-500 mt-1">{errors.businessName.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Website Type */}
                  <div>
                    <Label htmlFor="websiteType">Website Type</Label>
                    <Select onValueChange={(value) => setValue('websiteType', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select website type" />
                      </SelectTrigger>
                      <SelectContent>
                        {websiteTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.websiteType && (
                      <p className="text-sm text-red-500 mt-1">{errors.websiteType.message}</p>
                    )}
                  </div>

                  {/* Features */}
                  <div>
                    <Label>Features</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {features.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={feature.id}
                            checked={watchedFeatures?.includes(feature.id)}
                            onCheckedChange={() => handleFeatureToggle(feature.id)}
                          />
                          <Label htmlFor={feature.id} className="text-sm">
                            {feature.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.features && (
                      <p className="text-sm text-red-500 mt-1">{errors.features.message}</p>
                    )}
                  </div>

                  {/* Design Style */}
                  <div>
                    <Label htmlFor="designStyle">Design Style</Label>
                    <Select onValueChange={(value) => setValue('designStyle', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select design style" />
                      </SelectTrigger>
                      <SelectContent>
                        {designStyles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.designStyle && (
                      <p className="text-sm text-red-500 mt-1">{errors.designStyle.message}</p>
                    )}
                  </div>

                  {/* Budget Slider */}
                  <div>
                    <Label>Budget Range: ${watchedBudget}</Label>
                    <Slider
                      value={[watchedBudget]}
                      onValueChange={(value) => setValue('budget', value[0])}
                      max={500}
                      min={150}
                      step={50}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>$150</span>
                      <span>$500</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Get Quote & Pay
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Price Estimate */}
            <Card>
              <CardHeader>
                <CardTitle>Price Estimate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">
                      ${estimatedPrice}
                    </div>
                    <p className="text-muted-foreground">Estimated Total</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">What's Included:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Custom Design</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Responsive Development</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">SEO Optimization</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Hosting & Domain</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">1 Month Support</span>
                      </li>
                    </ul>
                  </div>

                  {watchedFeatures && watchedFeatures.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Selected Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {watchedFeatures.map((feature) => {
                          const featureInfo = features.find(f => f.id === feature)
                          return (
                            <Badge key={feature} variant="secondary">
                              {featureInfo?.label || feature}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>Pro Tip:</strong> Higher budgets allow for more advanced features and customizations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
} 